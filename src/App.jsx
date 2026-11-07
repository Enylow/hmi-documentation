import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Layout, Menu, Button, Input, Drawer, Tag, Typography, Breadcrumb, Empty, theme, Tooltip, Space } from 'antd';
import { BookOutlined, GithubOutlined, MenuOutlined, SearchOutlined, SunOutlined, MoonOutlined, ArrowLeftOutlined, ArrowRightOutlined, CodeOutlined, FileMarkdownOutlined, LinkOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { docs, pages, orderedDocs, groups, getHeadings, parseRoute, pathToHash, resolveDocsLink } from './docs.js';

const { Header, Content, Sider } = Layout;
const { Text, Title } = Typography;
const REPOLINK = 'https://github.com/Enylow/hmi-documentation';

function useRoute() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const update = () => setRoute(parseRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const navigate = useCallback((path, heading = null) => {
    const url = pathToHash(path) + (heading ? '?heading=' + encodeURIComponent(heading) : '');
    if (window.location.hash === url) { setRoute({ path, heading }); document.getElementById(heading)?.scrollIntoView({ behavior: 'smooth' }); }
    else window.location.hash = url;
  }, []);
  return [route, navigate];
}

function WikiMarkdown({ doc, navigate }) {
  const components = useMemo(() => ({
    a: ({ href, children, ...props }) => {
      const local = resolveDocsLink(doc.path, href);
      if (local) return <a href={pathToHash(local.path) + (local.heading ? '?heading=' + encodeURIComponent(local.heading) : '')} onClick={event => { event.preventDefault(); navigate(local.path, local.heading); }} {...props}>{children}</a>;
      return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} {...props}>{children}</a>;
    },
    img: ({ src = '', alt = '' }) => <span className="image-placeholder" role="img" aria-label={alt}><span className="image-placeholder-label">Screenshot placeholder</span><span>{alt || src}</span></span>,
    table: ({ children }) => <div className="table-scroller"><table>{children}</table></div>,
  }), [doc.path, navigate]);
  if (doc.kind === 'lua') return <div className="source-example"><p>This is an editable Lua example. Register it in your resource pack using <code>Loader:load</code>.</p><pre><code className="language-lua">{doc.source}</code></pre></div>;
  if (doc.kind === 'text') return <pre className="source-example">{doc.source}</pre>;
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeHighlight]} components={components}>{doc.source}</ReactMarkdown>;
}

function searchDocs(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const terms = q.split(/\s+/).filter(Boolean);
  return docs.map(doc => {
    const title = doc.title.toLowerCase(), text = doc.source.toLowerCase(), name = doc.path.toLowerCase();
    if (!terms.every(term => title.includes(term) || text.includes(term) || name.includes(term))) return null;
    const score = terms.reduce((sum,term) => sum + (title.includes(term) ? 5 : 0) + (name.includes(term) ? 3 : 0) + (text.includes(term) ? 1 : 0), 0);
    return { ...doc, score };
  }).filter(Boolean).sort((a,b) => b.score - a.score);
}

export default function App() {
  const [route, navigate] = useRoute();
  const [isDark, setDark] = useState(() => { try { return localStorage.getItem('hmi-theme') !== 'light'; } catch { return true; } });
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [activeHeading, setActiveHeading] = useState('');
  const doc = pages.get(route.path) || pages.get('README.md');
  const headlines = useMemo(() => doc.kind === 'markdown' ? getHeadings(doc.source) : [], [doc]);
  const filtered = useMemo(() => searchDocs(search), [search]);
  const index = orderedDocs.findIndex(item => item.path === doc.path);
  useEffect(() => { try { localStorage.setItem('hmi-theme', isDark ? 'dark' : 'light'); } catch {} }, [isDark]);
  useEffect(() => {
    setMobile(false); setActiveHeading(route.heading || '');
    if (route.heading) requestAnimationFrame(() => setTimeout(() => document.getElementById(route.heading)?.scrollIntoView(), 30));
    else document.querySelector('.page-scroll')?.scrollTo({ top: 0 });
  }, [route.path, route.heading]);
  useEffect(() => {
    if (!headlines.length || typeof IntersectionObserver === 'undefined') return;
    const root = document.querySelector('.page-scroll');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveHeading(entry.target.id);
    }, { root, rootMargin: '-8% 0px -75% 0px' });
    headlines.forEach(h => { const el = document.getElementById(h.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [doc, headlines]);
  const choose = path => { navigate(path); setSearch(''); };
  const nav = <div className="nav-panel">
    <div className="nav-search"><Input allowClear prefix={<SearchOutlined />} placeholder="Search every page…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search documentation" /></div>
    {filtered ? <div className="search-results"><Text className="search-label">{filtered.length} result{filtered.length === 1 ? '' : 's'}</Text>{filtered.length ? filtered.map(p => <button type="button" key={p.path} className={'search-hit ' + (p.path === doc.path ? 'selected' : '')} onClick={() => choose(p.path)}><span>{p.title}</span><small>{p.path}</small></button>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No matching pages" />}</div> : <>
      <button type="button" className={'home-entry ' + (doc.path === 'README.md' ? 'selected' : '')} onClick={() => choose('README.md')}><BookOutlined /> <span>Overview</span></button>
      {groups.map(g => <div className="nav-section" key={g.key}><div className="nav-section-title">{g.label} <span>{g.docs.length}</span></div>{g.docs.map(p => <button key={p.path} type="button" title={p.title} onClick={() => choose(p.path)} className={'nav-entry ' + (p.path === doc.path ? 'selected' : '')}>{p.kind === 'lua' ? <CodeOutlined /> : <FileMarkdownOutlined />}<span>{p.title}</span></button>)}</div>)}
    </>}
    <div className="nav-bottom"><a href={REPOLINK + '/tree/main/docs'} target="_blank" rel="noreferrer"><GithubOutlined /> Browse Markdown on GitHub</a></div>
  </div>;
  return <ConfigProvider theme={{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { colorPrimary: '#62b7d6', borderRadius: 9, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif' } }}>
    <Layout className={'site-root ' + (isDark ? 'dark' : 'light')}>
      <Header className="topbar"><div className="brand"><Button className="mobile-toggle" type="text" icon={<MenuOutlined />} onClick={() => setMobile(true)} aria-label="Open documentation navigation"/><a href="#/README.md" onClick={e => { e.preventDefault(); choose('README.md'); }} className="brand-symbol">H<span>MI</span></a><div className="brand-text"><strong>Hold My Items</strong><small>Documentation</small></div><Tag bordered={false} className="version-tag">26.2</Tag></div><Space size={8}>
        <Tooltip title="Toggle light and dark mode"><Button type="text" aria-label="Toggle light and dark mode" icon={isDark ? <SunOutlined /> : <MoonOutlined />} onClick={() => setDark(d => !d)}/></Tooltip>
        <Tooltip title="GitHub repository"><Button type="text" icon={<GithubOutlined />} href={REPOLINK} target="_blank" aria-label="Open GitHub repository" /></Tooltip>
      </Space></Header>
      <Layout className="inner-layout"><Sider width={278} theme={isDark ? 'dark' : 'light'} className="desktop-nav">{nav}</Sider><Drawer title="Documentation" placement="left" width={290} open={mobile} onClose={() => setMobile(false)} styles={{ body: { padding: 0 } }}>{nav}</Drawer>
        <Content className="page-scroll"><div className="content-grid"><article className="article">
          <div className="breadcrumb-line"><Breadcrumb items={[{title:<a href="#/README.md" onClick={e=>{e.preventDefault();choose('README.md')}}>Docs</a>}, ...(doc.path === 'README.md' ? [] : [{title:doc.group},{title:doc.title}])]} /></div>
          {doc.path === 'README.md' && <div className="hero"><div className="hero-label"><BookOutlined /> RESOURCE PACK & LUA WIKI</div><h1>Make every item<br/><span>move your way.</span></h1><p>Everything you need to build procedural first-person animations, Lua scripts, keyframe clips and Blueprints for Hold My Items.</p><div className="hero-actions"><Button type="primary" size="large" onClick={() => choose('guides/01_GETTING_STARTED.md')}>Get started <ArrowRightOutlined /></Button><Button size="large" onClick={() => choose('reference/API_INDEX.md')}>Explore API</Button></div><div className="hero-stats"><span><strong>37</strong> pages</span><span><strong>5</strong> Lua examples</span><span><strong>4</strong> scripting stages</span></div></div>}
          <div className="article-content"><div className="article-top-meta"><span>{doc.kind === 'lua' ? 'LUA EXAMPLE' : doc.kind === 'markdown' ? 'DOCUMENTATION' : 'REFERENCE NOTE'}</span><a href={REPOLINK + '/blob/main/docs/' + doc.path} target="_blank" rel="noreferrer">Edit on GitHub <LinkOutlined /></a></div><div className="markdown-body"><WikiMarkdown doc={doc} navigate={navigate} /></div></div>
          <div className="page-pager"><div>{index > 0 && <button type="button" onClick={() => choose(orderedDocs[index-1].path)}><ArrowLeftOutlined /><span><small>Previous</small>{orderedDocs[index-1].title}</span></button>}</div><div>{index < orderedDocs.length-1 && <button type="button" className="next" onClick={() => choose(orderedDocs[index+1].path)}><span><small>Next</small>{orderedDocs[index+1].title}</span><ArrowRightOutlined /></button>}</div></div>
          <footer className="footer-note">Source-based documentation · Minecraft 26.2 · <a href={REPOLINK} target="_blank" rel="noreferrer">Contribute on GitHub</a></footer>
        </article><aside className="toc"><div className="toc-heading">ON THIS PAGE</div>{headlines.length ? headlines.map(h => <button type="button" key={h.id} className={'toc-item l' + h.level + (h.id === activeHeading ? ' active' : '')} onClick={() => navigate(doc.path,h.id)}>{h.title}</button>) : <p className="toc-empty">Lua source example</p>}<div className="toc-contribute"><BookOutlined /> <span>See an error? <a href={REPOLINK + '/issues'} target="_blank" rel="noreferrer">Open an issue</a>.</span></div></aside></div></Content>
      </Layout>
    </Layout>
  </ConfigProvider>;
}
