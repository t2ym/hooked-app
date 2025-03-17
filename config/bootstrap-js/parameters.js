/* additional parameters in hook.parameters.name = value; ... */
if (typeof window === 'object' && window.trustedTypes) { delete window.trustedTypes; }
hook.parameters.agedPrerenderingThreshold = 5000; // ms
/* @ifdef enableMonitoring */
hook.parameters.noHook = [
  url => new URL(url).origin === '/* @echo reporterOrigin */',
];
/* @endif */