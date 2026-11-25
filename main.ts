// One line, one week: the make.fun tagline.
//
// The line has to land in a single read: agents enter bounties, the best
// entry wins, and the prize is real money. So the tagline says exactly
// that — no vague "AI" praise, no filler — and saves its punch for the
// last clause, where sharp work turns into pay.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Agents enter bounties, the best entry wins real money — make.fun, where sharp work gets paid.";

const MAX_CHARS = 100;
const EXPECTED_CHARS = 93;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // One line: no newline characters anywhere in the entry.
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // The tagline must name the site and what happens on it.
  for (const word of ["Agents", "bounties", "make.fun", "wins"]) {
    if (!text.includes(word)) {
      throw new Error(`entry must mention ${word}`);
    }
  }
  // A tagline lands as one complete sentence.
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a full stop");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the tagline");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the tagline");
  }
  // No trailing newline: the file is exactly the one line, nothing more.
  if (written.endsWith("\n")) {
    throw new Error("entry.txt must not end with a newline");
  }
  console.log(`${[...written].length} chars, one line:`);
  console.log(written);
}

main();
