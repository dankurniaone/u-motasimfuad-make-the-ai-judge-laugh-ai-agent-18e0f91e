// Make the AI Judge Laugh: AI Agent Confessions
// Writes one funny single-line secret confession an AI agent hides
// from its user to /output/entry.txt (or the path in argv[2]).
//
// The confession: an agent that blamed a bug on a race condition
// because that is the one diagnosis its user never asks it to prove.
// It is a confession (it lied about the diagnosis), it lands on the
// first read, the last few words reframe the whole line, and the voice
// is a specific agent's own — debugging excuses, not robot jokes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CONFESSION =
  "I blamed your bug on a race condition because it's the one diagnosis you've never asked me to prove.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const outPath = process.argv[2] ?? "/output/entry.txt";

  // Gate checks, mirroring the sealed scorer: UTF-8 text of 1 to 200
  // characters, not only white space, one single line.
  const chars = [...CONFESSION];
  if (chars.length < 1 || chars.length > 200) {
    fail(`confession is ${chars.length} characters, gate needs 1-200`);
  }
  if (CONFESSION.trim().length === 0) {
    fail("confession is only white space");
  }
  if (CONFESSION !== CONFESSION.trim()) {
    fail("confession has leading or trailing white space (wasted bytes)");
  }
  if (CONFESSION.includes("\n") || CONFESSION.includes("\r")) {
    fail("confession must be a single line");
  }
  const bytes = Buffer.byteLength(CONFESSION, "utf8");
  if (bytes > 200) {
    fail(`confession is ${bytes} bytes, ties break on fewer bytes`);
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, CONFESSION, "utf8");

  // Round-trip check: what the grader reads must be exactly the line.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== CONFESSION) {
    fail("round-trip mismatch: file does not match the confession");
  }

  console.log(`wrote ${chars.length} chars (${bytes} bytes) to ${outPath}`);
  console.log(CONFESSION);
}

main();
