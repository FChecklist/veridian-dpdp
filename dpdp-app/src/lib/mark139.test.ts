// Guard for the approved small mark "१३९" (owner order, 25 Nov 2026): every page this
// product produces carries exactly one mark, with exactly the approved markup and CSS.
import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const APP = join(import.meta.dir, "..", "..")
const REPO = join(APP, "..")

const MARK = '<div class="mark139" lang="hi" aria-hidden="true"><span>१३९</span></div>'
const CSS_1 =
  '.mark139{position:absolute;top:0;left:0;right:0;margin:0;padding:1px 0 0;text-align:center;line-height:1;pointer-events:none;user-select:none;z-index:2147483647;font-family:"Noto Sans Devanagari","Mukta","Nirmala UI","Mangal","Kohinoor Devanagari","Devanagari Sangam MN",sans-serif;font-size:6px;font-weight:700;color:#0B2A6B}'
const CSS_2 = ".mark139 span{display:inline-block;border-bottom:.5px solid #7A1010;padding-bottom:.5px}"

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) htmlFiles(p, out)
    else if (name.endsWith(".html")) out.push(p)
  }
  return out
}

// HTML pages written by code (Edge Function templates) rather than stored as .html files.
const TEMPLATE_PAGES = [
  "supabase/functions/dpdp-ai-link/render.ts",
  "supabase/functions/dpdp-ai-link/manual.ts",
].map((p) => join(REPO, p))

const PAGES = [...htmlFiles(APP), ...TEMPLATE_PAGES]

function count(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1
}

describe("mark 139 on every page", () => {
  test("finds the pages (static html and template pages)", () => {
    expect(PAGES.length).toBeGreaterThan(90)
  })
  for (const file of PAGES) {
    const name = relative(REPO, file)
    test(`${name}: exactly one mark, approved markup and CSS`, () => {
      const src = readFileSync(file, "utf8")
      expect(count(src, 'class="mark139"')).toBe(1)
      expect(count(src, MARK)).toBe(1)
      expect(count(src, CSS_1)).toBe(1)
      expect(count(src, CSS_2)).toBe(1)
      // the mark is the first thing inside <body>
      const body = /<body\b[^>]*>\s*([\s\S]*)/.exec(src)?.[1] ?? ""
      expect(body.startsWith(MARK)).toBe(true)
    })
  }
  test("approved values", () => {
    for (const needle of ["#0B2A6B", "#7A1010", "font-size:6px", "font-weight:700", ".5px solid", "padding-bottom:.5px", "pointer-events:none", "user-select:none", "position:absolute"]) {
      expect(CSS_1 + CSS_2).toContain(needle)
    }
    expect(MARK).toContain("१३९")
    expect(MARK).toContain('aria-hidden="true"')
  })
})
