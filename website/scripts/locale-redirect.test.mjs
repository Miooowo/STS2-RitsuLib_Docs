/**
 * 路径映射与策略单元测试（与 locale-redirect-snippet 一致）
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const PC = '/STS2-RitsuLib_Docs';

function pathNorm(p) {
	if (p.endsWith('/index.html')) p = p.slice(0, -11);
	if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
	return p;
}
function isEnPath(p) {
	return p === PC + '/en' || p.startsWith(PC + '/en/');
}
function isZhPath(p) {
	return p === PC || (p.startsWith(PC + '/') && !isEnPath(p));
}
function zhToEn(p) {
	if (p === PC) return PC + '/en/';
	return PC + '/en' + p.slice(PC.length) + '/';
}
function enToZh(p) {
	if (p === PC + '/en') return PC + '/';
	const s = p.slice(PC.length + 3);
	if (!s) return PC + '/';
	return PC + s + '/';
}

test('zh inner → en inner', () => {
	const zh = pathNorm(`${PC}/getting-started/`);
	assert.equal(zhToEn(zh), `${PC}/en/getting-started/`);
});

test('en inner → zh inner', () => {
	const en = pathNorm(`${PC}/en/getting-started/`);
	assert.equal(enToZh(en), `${PC}/getting-started/`);
});

test('starlight lang select value maps to en path', () => {
	const ap = pathNorm('/STS2-RitsuLib_Docs/en/getting-started/');
	assert.ok(isEnPath(ap));
});

test('first visit: en preference on zh URL targets en', () => {
	const p = pathNorm(`${PC}/`);
	assert.ok(isZhPath(p));
	assert.equal(zhToEn(p), `${PC}/en/`);
});
