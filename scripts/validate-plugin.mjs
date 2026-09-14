#!/usr/bin/env node
/**
 * Structural validation for the marketplace and the plugin it ships.
 *
 * Deliberately dependency-free so CI needs no install step: a validator that is slow to
 * run is a validator people skip.
 *
 * Checks the things that fail silently at install or trigger time — a name that does not
 * match its directory, a missing frontmatter field, a version that disagrees between the
 * plugin manifest and the marketplace entry — rather than anything about content quality,
 * which is what evals/ is for.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const AGENT_COLORS = new Set(["blue", "cyan", "green", "yellow", "magenta", "red"]);
const AGENT_MODELS = new Set(["inherit", "sonnet", "opus", "haiku"]);
const MAX_SKILL_WORDS = 3000;

const errors = [];
const warnings = [];
const passes = [];

const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const pass = (m) => passes.push(m);

/** Frontmatter is delimited by --- lines; return the raw block or null. */
function frontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  return end === -1 ? null : text.slice(4, end);
}

/** Top-level scalar lookup. Good enough here: we never nest in this frontmatter. */
function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : null;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    fail(`${path}: invalid JSON — ${err.message}`);
    return null;
  }
}

// --- marketplace -----------------------------------------------------------
const marketplacePath = join(ROOT, ".claude-plugin", "marketplace.json");
if (!existsSync(marketplacePath)) {
  fail("missing .claude-plugin/marketplace.json");
}
const marketplace = existsSync(marketplacePath) ? readJson(marketplacePath) : null;

if (marketplace) {
  for (const key of ["name", "owner", "plugins"]) {
    if (!(key in marketplace)) fail(`marketplace.json: missing required field "${key}"`);
  }
  if (marketplace.name && !KEBAB.test(marketplace.name)) {
    fail(`marketplace.json: name "${marketplace.name}" is not kebab-case`);
  }
  if (marketplace.owner && !marketplace.owner.name) {
    fail("marketplace.json: owner.name is required");
  }
  if (Array.isArray(marketplace.plugins)) {
    pass(`marketplace "${marketplace.name}" lists ${marketplace.plugins.length} plugin(s)`);
  }
}

// --- each plugin -----------------------------------------------------------
for (const entry of marketplace?.plugins ?? []) {
  if (!entry.name || !entry.source) {
    fail(`marketplace.json: plugin entry needs both "name" and "source"`);
    continue;
  }
  // Only local-path sources are resolvable from here; a github source is someone
  // else's repo to validate.
  if (typeof entry.source !== "string") {
    warn(`${entry.name}: non-local source, skipping structural checks`);
    continue;
  }

  const dir = join(ROOT, entry.source);
  if (!existsSync(dir)) {
    fail(`${entry.name}: source path ${entry.source} does not exist`);
    continue;
  }

  const manifestPath = join(dir, ".claude-plugin", "plugin.json");
  if (!existsSync(manifestPath)) {
    fail(`${entry.name}: missing .claude-plugin/plugin.json`);
    continue;
  }
  const manifest = readJson(manifestPath);
  if (!manifest) continue;

  if (!manifest.name) fail(`${entry.name}: plugin.json has no name`);
  else if (!KEBAB.test(manifest.name)) fail(`${entry.name}: plugin name is not kebab-case`);
  else if (manifest.name !== entry.name) {
    fail(`${entry.name}: plugin.json name "${manifest.name}" disagrees with marketplace entry`);
  }

  // Drift between these two is the classic confusing-install bug: the marketplace
  // advertises one version and the installed plugin reports another.
  if (entry.version && manifest.version && entry.version !== manifest.version) {
    fail(
      `${entry.name}: version mismatch — marketplace ${entry.version} vs plugin.json ${manifest.version}`,
    );
  } else if (manifest.version) {
    pass(`${entry.name} v${manifest.version}`);
  }

  // --- skills
  const skillsDir = join(dir, "skills");
  if (existsSync(skillsDir)) {
    for (const name of readdirSync(skillsDir)) {
      const skillDir = join(skillsDir, name);
      if (!statSync(skillDir).isDirectory()) continue;
      const skillFile = join(skillDir, "SKILL.md");
      if (!existsSync(skillFile)) {
        fail(`skill ${name}: no SKILL.md`);
        continue;
      }
      const text = readFileSync(skillFile, "utf8");
      const fm = frontmatter(text);
      if (!fm) {
        fail(`skill ${name}: no YAML frontmatter`);
        continue;
      }
      const skillName = field(fm, "name");
      if (skillName !== name) {
        fail(`skill ${name}: frontmatter name "${skillName}" does not match directory`);
      }
      // The description is the entire trigger mechanism. A skill with none never fires.
      if (!/^description:/m.test(fm)) fail(`skill ${name}: no description`);

      const words = text.split(/\s+/).filter(Boolean).length;
      if (words > MAX_SKILL_WORDS) {
        warn(`skill ${name}: ${words} words, over the ${MAX_SKILL_WORDS} guideline — move detail to references/`);
      } else {
        pass(`skill ${name} (${words}w)`);
      }
    }
  }

  // --- agents
  const agentsDir = join(dir, "agents");
  if (existsSync(agentsDir)) {
    for (const file of readdirSync(agentsDir).filter((f) => f.endsWith(".md"))) {
      const stem = file.replace(/\.md$/, "");
      const fm = frontmatter(readFileSync(join(agentsDir, file), "utf8"));
      if (!fm) {
        fail(`agent ${stem}: no YAML frontmatter`);
        continue;
      }
      if (field(fm, "name") !== stem) fail(`agent ${stem}: frontmatter name does not match filename`);
      if (!/^description:/m.test(fm)) fail(`agent ${stem}: no description`);
      if (!KEBAB.test(stem) || stem.length < 3 || stem.length > 50) {
        fail(`agent ${stem}: name must be kebab-case, 3–50 chars`);
      }

      const model = field(fm, "model");
      const color = field(fm, "color");
      if (!model) fail(`agent ${stem}: missing model`);
      else if (!AGENT_MODELS.has(model)) fail(`agent ${stem}: invalid model "${model}"`);
      if (!color) fail(`agent ${stem}: missing color`);
      else if (!AGENT_COLORS.has(color)) fail(`agent ${stem}: invalid color "${color}"`);

      // Examples are what teach the router when to reach for this agent.
      if (!fm.includes("<example>")) warn(`agent ${stem}: description has no <example> block`);

      if (model && color) pass(`agent ${stem} (${model}/${color})`);
    }
  }
}

// --- report ----------------------------------------------------------------
for (const p of passes) console.log(`  ok    ${p}`);
for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  FAIL  ${e}`);

console.log(
  `\n${passes.length} passed, ${warnings.length} warning(s), ${errors.length} error(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
