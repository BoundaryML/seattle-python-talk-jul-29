import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import baml from "../lib/syntax/baml.js";

test("the outline is split into 24 MDX slides", async () => {
  const files = (await readdir(new URL("../slides/", import.meta.url))).filter((file) => file.endsWith(".mdx"));
  assert.equal(files.length, 24);

  const registry = await readFile(new URL("../slides/index.ts", import.meta.url), "utf8");
  for (const file of files) {
    assert.match(registry, new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("BAML, Python, and Rust grammars produce highlighted tokens", () => {
  hljs.registerLanguage("baml", baml);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("rust", rust);

  assert.match(hljs.highlight("function respond(message: string) -> string throws never", { language: "baml" }).value, /hljs-keyword/);
  assert.match(hljs.highlight("Box<SlackMessage | DiscordMessage>[] | map<string, EmailMessage | LinkedInDm | TwitterDm>", { language: "baml" }).value, /<span class="hljs-type">SlackMessage<\/span>/);
  assert.match(hljs.highlight("def respond(message: str) -> str:", { language: "python" }).value, /hljs-keyword/);
  assert.match(hljs.highlight("fn respond(message: &str) -> String", { language: "rust" }).value, /hljs-keyword/);
});
