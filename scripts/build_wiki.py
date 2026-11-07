#!/usr/bin/env python3
"""Build native GitHub Wiki pages from the Markdown documentation under docs/."""
from pathlib import Path
import posixpath
import re
import shutil
import sys

source = Path(sys.argv[1] if len(sys.argv) > 1 else "docs")
dest = Path(sys.argv[2] if len(sys.argv) > 2 else "wiki-output")
if not (source / "README.md").is_file():
    raise SystemExit("Documentation README.md missing")
if dest.exists():
    shutil.rmtree(dest)
dest.mkdir(parents=True)
pages = {
    p.relative_to(source).as_posix(): p.read_text(encoding="utf-8")
    for p in source.rglob("*")
    if p.is_file() and p.suffix in (".md", ".lua")
}

def name(path):
    if path == "README.md":
        return "Home"
    group, basename = path.split("/", 1)
    if path == "examples/README.md":
        return "Lua-Examples"
    if path.endswith(".lua"):
        return "Example-" + basename[:-4].replace("_", "-")
    basename = re.sub(r"^\d+_", "", basename[:-3]).replace("_", "-").title()
    return {"guides": "Guide-", "editor": "Editor-", "bindings": "Lua-",
            "reference": "Reference-", "examples": "Example-"}[group] + basename

names = {p: name(p) for p in pages}
if len(set(names.values())) != len(names):
    raise SystemExit("Wiki page name collision")
pattern = re.compile(r"(?<!!)\[([^\]]+)\]\(([^)]+)\)")
missing = []
converted = 0
for path, content in pages.items():
    if path.endswith(".lua"):
        title = " ".join(word.capitalize() for word in Path(path).stem.split("_"))
        content = (
            "# Example: " + title + "\n\n"
            "[Lua examples](Lua-Examples) · [Getting started](Guide-Getting-Started)\n\n"
            "Copy this Lua example into a resource pack and register it with the loader.\n\n"
            + chr(96)*3 + "lua\n" + content.rstrip() + "\n" + chr(96)*3 + "\n"
        )
    else:
        def translate(match):
            global converted
            caption, href = match.groups()
            if href.startswith(("https://", "http://", "mailto:", "#", "data:")):
                return match.group(0)
            url, sep, anchor = href.partition("#")
            original = posixpath.normpath(posixpath.join(
                posixpath.dirname(path), url.split("?", 1)[0]))
            if original not in names:
                missing.append((path, href))
                return match.group(0)
            converted += 1
            return "[" + caption + "](" + names[original] + (
                "#" + anchor if sep else "") + ")"
        content = pattern.sub(translate, content)
    (dest / (names[path] + ".md")).write_text(content.rstrip() + "\n", encoding="utf-8")

groups = [
 ("Getting started", [
  ("Home","README.md"),
  ("First resource pack","guides/01_GETTING_STARTED.md"),
  ("Resource packs & loader.lua","guides/02_RESOURCE_PACKS_AND_LOADER.md"),
  ("Update loop & state","guides/03_UPDATE_LOOP_AND_STATE.md"),
  ("Script stages","guides/04_SCRIPT_STAGES.md"),
  ("Lua fundamentals","guides/05_LUA_FUNDAMENTALS.md"),
  ("Matrices & coordinates","guides/06_MATRICES_AND_COORDINATES.md")]),
 ("Animation & Blueprints", [
  ("Animation Editor","editor/01_ANIMATION_EDITOR.md"),
  ("Keyframes & Model Parts","editor/02_KEYFRAMES_AND_MODEL_PARTS.md"),
  ("Blueprint Editor","editor/03_BLUEPRINT_EDITOR.md"),
  ("Blueprint export","editor/04_BLUEPRINT_EXPORT.md"),
  ("Events & projects","editor/05_EVENTS_AND_PROJECT_FILES.md")]),
 ("Lua API", [
  ("Complete API index","reference/API_INDEX.md"),
  ("Runtime globals","reference/RUNTIME_AVAILABILITY.md")
 ] + [(p.split("/")[-1][:-3].replace("_", " ").title(), p)
      for p in sorted(names) if p.startswith("bindings/")]),
 ("Recipes & examples", [
  ("Tips and tricks","guides/07_TIPS_AND_TRICKS.md"),
  ("Troubleshooting","guides/08_TROUBLESHOOTING.md"),
  ("Lua examples","examples/README.md"),
  ("Source notes","reference/SOURCE_NOTES.md")])
]
sidebar = ["# Hold My Items", ""]
for group, links in groups:
    sidebar += ["### " + group, ""]
    sidebar += ["- [" + text + "](" + names[path] + ")" for text, path in links]
    sidebar.append("")
(dest / "_Sidebar.md").write_text("\n".join(sidebar).rstrip() + "\n", encoding="utf-8")
(dest / "_Footer.md").write_text(
    "[Home](Home) · [API index](Reference-Api-Index) · "
    "[Animation Editor](Editor-Animation-Editor) · "
    "[Blueprints](Editor-Blueprint-Editor) · "
    "[Tips and tricks](Guide-Tips-And-Tricks)\n\n"
    "Hold My Items — resource-pack & Lua authoring documentation.\n",
    encoding="utf-8")

all_pages = {f.stem for f in dest.glob("*.md")}
links = 0
for f in dest.glob("*.md"):
    for _, href in pattern.findall(f.read_text(encoding="utf-8")):
        if href.startswith(("https://","http://","mailto:","#","data:")):
            continue
        links += 1
        if href.partition("#")[0] not in all_pages:
            missing.append((f.name, href))
if missing:
    raise SystemExit("Broken wiki links: " + repr(missing))
print(f"Generated {len(all_pages)} wiki pages; {converted} converted links; "
      f"{links} internal wiki links verified.")
