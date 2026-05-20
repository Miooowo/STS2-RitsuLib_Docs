// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { localeRedirectScript } from './scripts/locale-redirect-snippet.mjs';

// GitHub Pages 项目页：https://miooowo.github.io/STS2-RitsuLib_Docs/
const site = 'https://miooowo.github.io';
const base = '/STS2-RitsuLib_Docs';

/** @param {string} zh @param {string} en */
const lb = (zh, en) => ({ label: zh, translations: { en } });
/** @param {string} zh @param {string} en */
const group = (zh, en) => ({ label: zh, translations: { en } });

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'STS2 RitsuLib',
			description:
				'STS2 Mod 开发框架 RitsuLib 文档（简体中文默认，English in /en/） | STS2 RitsuLib modding framework docs (default zh-CN, English under /en/).',
			defaultLocale: 'root',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/Miooowo/STS2-RitsuLib_Docs',
				},
			],
			// 静态 Pages：按 cookie / 浏览器语言在 zh 与 /en/ 全站路径间跳转（locale-redirect-snippet.mjs）
			head: [
				{
					tag: 'script',
					attrs: {},
					content: localeRedirectScript(base),
				},
			],
			sidebar: [
				{
					...group('总览', 'Overview'),
					items: [{ ...lb('首页', 'Home'), link: '/' }],
				},
				{
					...group('入门与架构', 'Intro & architecture'),
					items: [
						{ ...lb('快速入门', 'Getting started'), slug: 'getting-started' },
						{ ...lb('框架设计', 'Framework design'), slug: 'framework-design' },
						{ ...lb('术语表', 'Terminology'), slug: 'terminology' },
						{ ...lb('诊断与兼容层', 'Diagnostics & compatibility'), slug: 'diagnostics-and-compatibility' },
					],
				},
				{
					...group('内容与注册', 'Content & registration'),
					items: [
						{ ...lb('内容包与注册器', 'Content packs & registries'), slug: 'content-packs-and-registries' },
						{ ...lb('内容注册规则', 'Content authoring rules'), slug: 'content-authoring-toolkit' },
						{ ...lb('角色与解锁模板', 'Character & unlock scaffolding'), slug: 'character-and-unlock-scaffolding' },
						{ ...lb('时间线与解锁', 'Timeline & unlocks'), slug: 'timeline-and-unlocks' },
						{ ...lb('自定义事件', 'Custom events'), slug: 'custom-events' },
					],
				},
				{
					...group('卡牌与展示', 'Cards & presentation'),
					items: [
						{ ...lb('卡牌动态变量', 'Card dynamic variables'), slug: 'card-dynamic-var-toolkit' },
						{ ...lb('LocString 占位符解析', 'LocString placeholders'), slug: 'loc-string-placeholder-resolution' },
						{ ...lb('本地化与关键词', 'Localization & keywords'), slug: 'localization-and-keywords' },
					],
				},
				{
					...group('运行时与扩展', 'Runtime & extensions'),
					items: [
						{ ...lb('生命周期事件', 'Lifecycle events'), slug: 'lifecycle-events' },
						{ ...lb('持久化设计', 'Persistence'), slug: 'persistence-guide' },
						{ ...lb('补丁系统', 'Patching'), slug: 'patching-guide' },
						{ ...lb('Mod 设置界面', 'Mod settings UI'), slug: 'mod-settings' },
						{ ...lb('Shell 主题', 'Shell theme'), slug: 'shell-theme' },
						{ ...lb('遥测后端', 'Telemetry backend'), slug: 'telemetry-backend' },
					],
				},
				{
					...group('资源与场景', 'Assets & scenes'),
					items: [
						{ ...lb('资源配置与回退规则', 'Asset profiles & fallbacks'), slug: 'asset-profiles-and-fallbacks' },
						{ ...lb('生物视觉与动画', 'Creature visuals & animation'), slug: 'creature-visuals-and-animation' },
						{ ...lb('Godot 场景编写说明', 'Godot scene authoring'), slug: 'godot-scene-authoring' },
						{ ...lb('FMOD 与音频', 'FMOD & audio'), slug: 'fmod-and-audio' },
					],
				},
			],
			lastUpdated: true,
		}),
	],
});
