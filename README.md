# Hold My Items — Documentation

Complete documentation for creating **Hold My Items** Minecraft resource-pack animations with Lua, the keyframe editor, Blueprints, and procedural animation.

## Read the wiki

- **[Documentation home](docs/README.md)** — all pages linked by topic.
- [Getting started](docs/guides/01_GETTING_STARTED.md)
- [Resource packs & `loader.lua`](docs/guides/02_RESOURCE_PACKS_AND_LOADER.md)
- [Update loop & variables](docs/guides/03_UPDATE_LOOP_AND_STATE.md)
- [Lua API index](docs/reference/API_INDEX.md)
- [Animation editor](docs/editor/01_ANIMATION_EDITOR.md)
- [Blueprint editor](docs/editor/03_BLUEPRINT_EDITOR.md)
- [Physics, smoothing and tips](docs/guides/07_TIPS_AND_TRICKS.md)
- [Example scripts](docs/examples/README.md)

All 37 original Markdown pages and five `.lua` examples are preserved under [`docs/`](docs/). Links work on GitHub directly **and** in the documentation website. Screenshot placeholders have been kept so contributors can add real editor screenshots.

## Run the Vite + Ant Design website

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production bundle:

```bash
npm run build
npm run preview
```

The website offers a searchable sidebar, Markdown rendering with Lua highlighting, nested navigation, a page table of contents, cross-page links, dark mode, mobile navigation, and previous/next page controls.

## GitHub Pages

An Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys the site when changes reach `main`. In your repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The expected URL is **https://enylow.github.io/hmi-documentation/** after the first successful deployment.

### Editing content

Edit individual files under [`docs/`](docs/). No JavaScript changes are needed: Vite automatically imports `.md` and `.lua` files from that directory. When adding a document, use one of the existing category folders (`guides/`, `bindings/`, `editor/`, `reference/`, `examples/`); it will appear in the sidebar automatically.

## Documentation status

These pages describe the provided `HoldMyItems_Generic_Block_IK_Find_Source.zip` source revision. They are a source review rather than a fully compiled/in-game-validated spec. Check the [source notes](docs/reference/SOURCE_NOTES.md) for known limitations.
