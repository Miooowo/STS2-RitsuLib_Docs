/**
 * 从 BAKAOLC/STS2-RitsuLib main 的 docs/pages/guide 拉取 Valaxy 双语 Markdown，
 * 拆成 Docs/zh、Docs/en 下的 PascalCase.md（供 sync-docs 使用）。
 *
 * 不引入上游 docs/ Valaxy 站点目录。
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const UPSTREAM_REF = process.env.UPSTREAM_REF || 'upstream/main';
const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const zhDir = path.join(repoRoot, 'Docs', 'zh');
const enDir = path.join(repoRoot, 'Docs', 'en');

const GUIDE_TREE_PATH = 'docs/pages/guide';

function kebabToPascal(kebab) {
	return kebab
		.split('-')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join('');
}

function stripFrontmatter(raw) {
	const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
	if (!m) return { body: raw, titles: {} };
	const fm = m[0].slice(4, -4);
	const body = raw.slice(m[0].length);
	const titles = {};
	const en = fm.match(/^\s+en:\s*(.+)$/m);
	const zh = fm.match(/^\s+zh-CN:\s*(.+)$/m);
	if (en) titles.en = en[1].trim();
	if (zh) titles.zh = zh[1].trim();
	const single = fm.match(/^title:\s*(.+)$/m);
	if (single && !titles.en && !titles.zh) titles.en = titles.zh = single[1].trim();
	return { body, titles };
}

/** @param {string} body @param {'en' | 'zh'} locale */
function extractLocaleContent(body, locale) {
	const tag = locale === 'zh' ? 'zh-CN' : 'en';
	const other = locale === 'zh' ? 'en' : 'zh-CN';
	const chunks = [];
	const lines = body.split('\n');
	let i = 0;

	while (i < lines.length) {
		const head = lines[i].match(/^(##+)\s+(.+?)\{lang="(en|zh-CN)"\}\s*$/);
		if (head) {
			if (head[3] === tag) chunks.push(`${head[1]} ${head[2].trim()}`);
			i++;
			continue;
		}
		const fence = lines[i].trim();
		if (fence === `::: ${tag}`) {
			i++;
			const block = [];
			while (i < lines.length && lines[i].trim() !== ':::') {
				block.push(lines[i]);
				i++;
			}
			if (i < lines.length && lines[i].trim() === ':::') i++;
			const text = block.join('\n').trim();
			if (text) chunks.push(text);
			continue;
		}
		if (fence === `::: ${other}`) {
			i++;
			while (i < lines.length && lines[i].trim() !== ':::') i++;
			if (i < lines.length) i++;
			continue;
		}
		i++;
	}

	return chunks.join('\n\n').trim();
}

function convertGuideLinks(md) {
	return md.replace(/\]\(\/guide\/([a-z0-9-]+)\/?\)/g, (_, slug) => {
		return `](${kebabToPascal(slug)}.md)`;
	});
}

function toDoc(title, body) {
	const cleaned = convertGuideLinks(body);
	return `# ${title}\n\n${cleaned}\n`;
}

function listUpstreamGuideFiles() {
	const out = execFileSync(
		'git',
		['ls-tree', '-r', '--name-only', UPSTREAM_REF, GUIDE_TREE_PATH],
		{ cwd: repoRoot, encoding: 'utf8' },
	);
	return out
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.endsWith('.md'))
		.map((line) => path.basename(line))
		.sort((a, b) => {
			if (a === 'index.md') return -1;
			if (b === 'index.md') return 1;
			return a.localeCompare(b);
		});
}

/** @returns {Set<string>} */
async function readSidebarSlugs() {
	const cfgPath = path.join(repoRoot, 'website', 'astro.config.mjs');
	const cfg = await fs.readFile(cfgPath, 'utf8');
	const slugs = new Set();
	for (const m of cfg.matchAll(/\bslug:\s*'([^']+)'/g)) {
		slugs.add(m[1]);
	}
	return slugs;
}

function readGuideFile(name) {
	const gitPath = `docs/pages/guide/${name}`;
	try {
		return execFileSync('git', ['show', `${UPSTREAM_REF}:${gitPath}`], {
			cwd: repoRoot,
			encoding: 'utf8',
			maxBuffer: 20 * 1024 * 1024,
		});
	} catch (err) {
		throw new Error(
			`Cannot read ${UPSTREAM_REF}:${gitPath}. Run: git fetch upstream main --depth 1`,
			{ cause: err },
		);
	}
}

await fs.mkdir(zhDir, { recursive: true });
await fs.mkdir(enDir, { recursive: true });

const GUIDE_FILES = listUpstreamGuideFiles();
if (GUIDE_FILES.length === 0) {
	throw new Error(`No .md files under ${UPSTREAM_REF}:${GUIDE_TREE_PATH}`);
}

const slugToPascal = new Map();
for (const file of GUIDE_FILES) {
	const stem = path.basename(file, '.md');
	slugToPascal.set(stem, kebabToPascal(stem));
}

const sidebarSlugs = await readSidebarSlugs();
const missingFromSidebar = [];

let count = 0;
for (const file of GUIDE_FILES) {
	const stem = path.basename(file, '.md');
	const pascal = slugToPascal.get(stem);
	const raw = readGuideFile(file);
	const { body, titles } = stripFrontmatter(raw);
	const enBody = extractLocaleContent(body, 'en');
	const zhBody = extractLocaleContent(body, 'zh');

	const enTitle = titles.en || pascal;
	const zhTitle = titles.zh || enTitle;

	if (enBody) {
		await fs.writeFile(path.join(enDir, `${pascal}.md`), toDoc(enTitle, enBody), 'utf8');
	}
	if (zhBody) {
		let zhOut = toDoc(zhTitle, zhBody);
		if (stem === 'index') {
			zhOut +=
				'\n本站点文档源文件位于仓库 [`Docs/zh`](https://github.com/Miooowo/STS2-RitsuLib/tree/docs/Docs/zh)。' +
				'上游参考：[BAKAOLC/STS2-RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide)。\n';
		}
		await fs.writeFile(path.join(zhDir, `${pascal}.md`), zhOut, 'utf8');
	}
	if (enBody && stem === 'index') {
		let enPath = path.join(enDir, `${pascal}.md`);
		let enOut = await fs.readFile(enPath, 'utf8');
		enOut +=
			'\nSources: [`Docs/en`](https://github.com/Miooowo/STS2-RitsuLib/tree/docs/Docs/en). ' +
			'Upstream: [BAKAOLC/STS2-RitsuLib](https://github.com/BAKAOLC/STS2-RitsuLib/tree/main/docs/pages/guide).\n';
		await fs.writeFile(enPath, enOut, 'utf8');
	}
	const slug = stem === 'index' ? 'index' : stem;
	if (slug !== 'index' && !sidebarSlugs.has(slug)) {
		missingFromSidebar.push(slug);
	}
	count++;
	console.log(`  ${file} → ${pascal}.md (zh: ${zhBody ? 'yes' : 'no'}, en: ${enBody ? 'yes' : 'no'})`);
}

console.log(`Imported ${count} guide pages from upstream → ${zhDir} & ${enDir}`);
if (missingFromSidebar.length > 0) {
	console.warn(
		'\nWarning: upstream pages not in website/astro.config.mjs sidebar (add slug + translations):',
	);
	for (const slug of missingFromSidebar) console.warn(`  - ${slug}`);
}
