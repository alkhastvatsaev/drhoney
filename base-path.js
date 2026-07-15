/**
 * GitHub Pages project site needs /drhoney/ base path.
 * On Vercel root domain, leave base empty.
 */
(function () {
  var host = location.hostname;
  if (host.endsWith("github.io")) {
    var parts = location.pathname.split("/").filter(Boolean);
    var base = parts.length ? "/" + parts[0] + "/" : "/";
    var el = document.createElement("base");
    el.href = base;
    document.head.insertBefore(el, document.head.firstChild);
  }
})();
