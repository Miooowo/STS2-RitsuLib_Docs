/**
 * 内联到 Starlight head 的客户端脚本（静态 Pages 无中间件）。
 * - 无 cookie：按浏览器语言自动跳转
 * - 有 cookie：按用户上次在 Starlight 语言选择器中的选择跳转
 *
 * @param {string} base Astro `base`，如 `/STS2-RitsuLib_Docs`
 */
export function localeRedirectScript(base) {
	const basePath = base.replace(/\/$/, '');
	return `(() => {
	var PC = ${JSON.stringify(basePath)};
	var CP = PC + '/';
	var CK = 'ritsulib-locale-v2';

	function pathNorm(pathname) {
		var p = pathname || location.pathname;
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
		var s = p.slice(PC.length + 3);
		if (!s) return PC + '/';
		return PC + s + '/';
	}
	function pathFromHref(href) {
		try {
			return pathNorm(new URL(href, location.origin).pathname);
		} catch (_) {
			return '';
		}
	}
	function getCookie(name) {
		var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
		return m ? decodeURIComponent(m[1]) : '';
	}
	function setCookie(name, val) {
		document.cookie =
			name + '=' + encodeURIComponent(val) + ';path=' + CP + ';max-age=31536000;samesite=lax';
	}
	function prefersEn() {
		var langs = navigator.languages || [navigator.language || ''];
		for (var i = 0; i < langs.length; i++) {
			var s = String(langs[i]).toLowerCase();
			if (s.indexOf('zh') === 0) return false;
			if (s.indexOf('en') === 0) return true;
		}
		return true;
	}

	// Starlight 用语言 <select> 切换（非 <a>），须在导航前写入 cookie
	document.addEventListener(
		'change',
		function (e) {
			if (!(e.target instanceof HTMLSelectElement)) return;
			if (!e.target.closest('starlight-lang-select')) return;
			var ap = pathFromHref(e.target.value);
			if (isEnPath(ap)) setCookie(CK, 'en');
			else if (isZhPath(ap)) setCookie(CK, 'zh');
		},
		true,
	);

	var p = pathNorm();
	if (!isZhPath(p) && !isEnPath(p)) return;

	var current = isEnPath(p) ? 'en' : 'zh';
	var stored = getCookie(CK);

	if (!stored) {
		var want = prefersEn() ? 'en' : 'zh';
		setCookie(CK, want);
		if (want !== current) {
			location.replace(want === 'en' ? zhToEn(p) : enToZh(p));
		}
		return;
	}

	if (stored === 'en' && isZhPath(p)) {
		location.replace(zhToEn(p));
		return;
	}
	if (stored === 'zh' && isEnPath(p)) {
		location.replace(enToZh(p));
		return;
	}
})();`;
}
