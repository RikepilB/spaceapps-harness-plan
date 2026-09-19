#!/usr/bin/env node
/**
 * Link checker for the dataset catalogue and the docs.
 *
 * Dependency-free for the same reason validate-plugin.mjs is: CI that needs an install
 * step is CI people disable when it gets slow.
 *
 * The distinction that matters here is dead vs. defended. A 404 is a real defect and
 * costs someone an hour at 02:00 on the Saturday. A 403 from a government host with bot
 * protection is that host refusing a datacentre IP, not a broken link, and failing the
 * build on it trains everyone to ignore the build. So only unresolvable hosts and hard
 * 404/410s fail; everything else is reported and moves on.
 *
 *   node scripts/check-links.mjs           check every markdown file
 *   node scripts/check-links.mjs --quiet   only print problems
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const QUIET = process.argv.includes("--quiet");
const TIMEOUT_MS = 20_000;
const CONCURRENCY = 8;

// Hosts that answer a browser but refuse a datacentre IP. Checked, reported, never fatal.
const DEFENDED = [
  "croplands.org",
  "daymet.ornl.gov",
  "gbank.gsj.jp",
  "nassgeo.csiss.gmu.edu",
  "satelite.cptec.inpe.br",
  "taskbook.nasaprs.com",
  "www.dgi.inpe.br",
  "www2.inpe.br",
];

// Not a browsable page: an OPeNDAP endpoint, a query stub, a placeholder key.
const SKIP = [
  /api_key=YOUR_KEY/,
  /opendap\.nccs\.nasa\.gov\/dods\//,
  /gibs\.earthdata\.nasa\.gov\/wmts\//,
];

const files = execFileSync("git", ["ls-files", "*.md", "*.yaml", "*.json"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

/** url -> Set of files it appears in, so a failure names somewhere to go and fix it. */
const found = new Map();
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const raw of text.match(/https?:\/\/[^\s)\]>"'`]+/g) ?? []) {
    const url = raw.replace(/[.,;:]+$/, "");
    if (SKIP.some((re) => re.test(url))) continue;
    if (!found.has(url)) found.set(url, new Set());
    found.get(url).add(file);
  }
}

const urls = [...found.keys()].sort();
if (!QUIET) console.log(`checking ${urls.length} unique URLs from ${files.length} files\n`);

async function probe(url) {
  const opts = {
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    // Some hosts 403 an unrecognised agent outright. Identify honestly; do not disguise.
    headers: { "user-agent": "spaceapps-harness-linkcheck/1.0 (+https://github.com/RikepilB/spaceapps-harness-plan)" },
  };
  try {
    // HEAD first: most of these are large landing pages and we only want the status.
    let res = await fetch(url, { ...opts, method: "HEAD" });
    // Plenty of servers simply do not implement HEAD. Retry those with GET.
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      res = await fetch(url, { ...opts, method: "GET" });
    }
    return { status: res.status };
  } catch (err) {
    return { status: 0, error: err.name === "TimeoutError" ? "timeout" : err.message };
  }
}

const dead = [];
const defended = [];
const flaky = [];

let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const { status, error } = await probe(url);
    const where = [...found.get(url)].join(", ");
    const host = new URL(url).hostname;

    if (status >= 200 && status < 400) {
      if (!QUIET) console.log(`  ok    ${status}  ${url}`);
    } else if (status === 404 || status === 410) {
      dead.push({ url, status, where });
      console.error(`  DEAD  ${status}  ${url}\n              in ${where}`);
    } else if (DEFENDED.includes(host) || status === 403 || status === 429) {
      defended.push({ url, status });
      if (!QUIET) console.warn(`  bot   ${status || error}  ${url}`);
    } else {
      flaky.push({ url, status, error });
      console.warn(`  ??    ${status || error}  ${url}\n              in ${where}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(
  `\n${urls.length - dead.length - defended.length - flaky.length} ok, ` +
    `${defended.length} bot-protected, ${flaky.length} unverified, ${dead.length} dead`,
);

if (dead.length) {
  console.error(`\n${dead.length} dead link(s). Fix the catalogue entry or remove it.`);
  process.exit(1);
}
