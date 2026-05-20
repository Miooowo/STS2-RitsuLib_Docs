/**
 * 内联到 Starlight head 的客户端脚本（静态 Pages 无中间件）。
 * 按 cookie / 浏览器语言在 zh 与 /en/ 路径间跳转，覆盖所有文档页。
 *
 * @param {string} base Astro `base`，如 `/STS2-RitsuLib_Docs`
 */
export function localeRedirectScript(base) {
	const basePath = base.replace(/\/$/, '');
	return `(() => {
	var PC = ${JSON.stringify(basePath)};
	var CP = PC + '/';
	var CK = 'ritsulib-locale';

	function pathNorm() {
		var p = location.pathname;
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
		var s = p.slice(PC.length);
		return PC + '/en' + s + '/';
	}
	function enToZh(p) {
		if (p === PC + '/en') return PC + '/';
		var s = p.slice(PC.length + 3);
		if (!s) return PC + '/';
		return PC + s + '/';
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

	var p = pathNorm();
	if (!isZhPath(p) && !isEnPath(p)) return;

	var pref = getCookie(CK);
	if (pref !== 'en' && pref !== 'zh') pref = prefersEn() ? 'en' : 'zh';

	if (pref === 'en' && isZhPath(p)) {
		location.replace(zhToEn(p));
		return;
	}
	if (pref === 'zh' && isEnPath(p)) {
		location.replace(enToZh(p));
		return;
	}

	if (isEnPath(p)) setCookie(CK, 'en');
	else if (isZhPath(p)) setCookie(CK, 'zh');

	document.addEventListener(
		'click',
		function (e) {
			var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
			if (!a) return;
			var href = a.getAttribute('href');
			if (!href || href.charAt(0) === '#') return;
			var url;
			try {
				url = new URL(href, location.origin);
			} catch (_) {
				return;
			}
			if (url.origin !== location.origin) return;
			var ap = url.pathname;
			if (ap.endsWith('/index.html')) ap = ap.slice(0, -11);
			if (ap.length > 1 && ap.endsWith('/')) ap = ap.slice(0, -1);
			if (isEnPath(ap)) setCookie(CK, 'en');
			else if (isZhPath(ap)) setCookie(CK, 'zh');
		},
		true,
	);
})();`;
}
