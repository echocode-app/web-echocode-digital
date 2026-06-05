const ECHO_TRACKING_SCRIPT = `
(function(){
  var KEYS = ['gclid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  function safeDecode(v) {
    try { return decodeURIComponent(v); } catch (_) { return v; }
  }
  var params = new URLSearchParams(location.search);
  KEYS.forEach(function(k){
    var v = params.get(k);
    if (v) document.cookie = k + '=' + encodeURIComponent(v) + ';path=/;max-age=7776000;SameSite=Lax';
  });
  window.echoTracking = function(){
    var out = {};
    var ck = Object.fromEntries(document.cookie.split('; ').filter(Boolean).map(function(c){
      var i = c.indexOf('=');
      return i === -1 ? [c, ''] : [c.slice(0, i), safeDecode(c.slice(i + 1))];
    }));
    KEYS.forEach(function(k){ if (ck[k]) out[k] = ck[k]; });
    return out;
  };
})();
`;

export default function EchoTrackingScript() {
  return (
    <script id="echo-marketing-tracking" dangerouslySetInnerHTML={{ __html: ECHO_TRACKING_SCRIPT }} />
  );
}
