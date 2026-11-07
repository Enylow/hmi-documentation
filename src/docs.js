import GithubSlugger from 'github-slugger';

// Keep the actual documentation in docs/ so GitHub also renders it as a wiki.
const markdown = import.meta.glob('../docs/**/*.md', { query: '?raw', import: 'default', eager: true });
const lua = import.meta.glob('../docs/**/*.lua', { query: '?raw', import: 'default', eager: true });
const audit = import.meta.glob('../docs/**/*.txt', { query: '?raw', import: 'default', eager: true });

const GROUPS = [
  { key: 'guides', label: 'Getting started' },
  { key: 'editor', label: 'Editors & Blueprints' },
  { key: 'bindings', label: 'Lua bindings' },
  { key: 'reference', label: 'Reference' },
  { key: 'examples', label: 'Examples' },
];

function titleFor(path, source) {
  if (path === 'README.md') return 'Documentation home';
  const title = source.match(/^#\s+(.+)$/m)?.[1];
  return title ? title.replace(/[`*]/g, '').replace(/\s+—\s+.*/, '') : path.split('/').pop().replace(/^(\d+_)/, '').replace(/\.(md|lua|txt)$/, '').replace(/_/g, ' ');
}

export const docs = Object.entries({ ...markdown, ...lua, ...audit })
  .map(([fullPath, source]) => {
    const path = fullPath.replace(/^\.\.\/docs\//, '');
    return { path, source, title: titleFor(path, source), kind: path.endsWith('.md') ? 'markdown' : path.endsWith('.lua') ? 'lua' : 'text', group: path.split('/')[0] };
  })
  .sort((a,b) => a.path.localeCompare(b.path));

export const pages = new Map(docs.map(doc => [doc.path, doc]));
export const orderedDocs = [pages.get('README.md'), ...GROUPS.flatMap(group => docs.filter(doc => doc.group === group.key))].filter(Boolean);
export const groups = GROUPS.map(g => ({ ...g, docs: docs.filter(doc => doc.group === g.key) }));

export function getHeadings(source) {
  const slugger = new GithubSlugger();
  return [...source.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)]
    .map(([, hashes, raw]) => {
      const title = raw.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[`*_~]/g,'').trim();
      return { level: hashes.length, title, id: slugger.slug(title) };
    });
}

export function pathToHash(path) { return '#/' + path; }
export function parseRoute() {
  let hash = window.location.hash.replace(/^#\/?/, '');
  const queryAt = hash.indexOf('?');
  const extra = queryAt < 0 ? '' : hash.slice(queryAt + 1);
  if (queryAt >= 0) hash = hash.slice(0, queryAt);
  const raw = decodeURIComponent(hash);
  const path = pages.has(raw) ? raw : pages.has(raw + '.md') ? raw + '.md' : 'README.md';
  const heading = new URLSearchParams(extra).get('heading');
  return { path, heading };
}

export function resolveDocsLink(current, href) {
  if (!href || /^(https?:|mailto:|data:)/i.test(href)) return null;
  if (href.startsWith('#')) return { path: current, heading: decodeURIComponent(href.slice(1)) };
  const [route, fragment] = href.split('#', 2);
  const [raw, query] = route.split('?', 2);
  const bits = [...current.split('/').slice(0,-1)];
  for (const segment of decodeURIComponent(raw).split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') bits.pop(); else bits.push(segment);
  }
  const target = bits.join('/');
  return pages.has(target) ? { path: target, heading: fragment ? decodeURIComponent(fragment) : null } : null;
}
