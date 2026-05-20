/**
 * 路径映射逻辑单元测试（与 locale-redirect-snippet 内联脚本一致）
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
	const s = p.slice(PC.length);
	return PC + '/en' + s + '/';
}
function enToZh(p) {
	if (p === PC + '/en') return PC + '/';
	const s = p.slice(PC.length + 3);
	if (!s) return PC + '/';
	return PC + s + '/';
}

test('zh home → en home', () => {
	assert.equal(zhToEn(pathNorm(`${PC}/`)), `${PC}/en/`);
});

test('zh inner page → en inner page', () => {
	const zh = pathNorm(`${PC}/getting-started/`);
	assert.equal(zhToEn(zh), `${PC}/en/getting-started/`);
});

test('en inner page → zh inner page', () => {
	const en = pathNorm(`${PC}/en/getting-started/`);
	assert.equal(enToZh(en), `${PC}/getting-started/`);
});

test('refresh: en cookie on zh URL should target en path', () => {
	const p = pathNorm(`${PC}/getting-started/`);
	assert.ok(isZhPath(p));
	assert.equal(zhToEn(p), `${PC}/en/getting-started/`);
});
