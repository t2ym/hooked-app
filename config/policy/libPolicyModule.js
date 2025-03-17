/* @exclude */
/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2023 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
(/* @endexclude */
{
  contextNormalizer: {
/* @ifdef isLit */
    "tslib": "@tslib",
    "tslib,*": "@tslib",

    "@lit/reactive-element/decorators/custom-element.js,*": "@lit/reactive-element",
    "@lit/reactive-element/reactive-element.js": "@lit/reactive-element",
    "@lit/reactive-element/reactive-element.js,*": "@lit/reactive-element",
    "lit-html": "@lit-html",
    "lit-html,*": "@lit-html",
    "lit-html/*": "@lit-html",
    "lit-element/": "@lit-element",
    "lit-element/,*": "@lit-element",
    "lit-element/lib/*": "@lit-element",
    "lit-element/*": "@lit-element",
    
    "@material/web/ripple/internal/ripple.js,Ripple,getNormalizedPointerEventCoords": "@getNormalizedPointerEventCoords",
/* @endif */

/* @ifdef isReact */
    "react": "@react",
    "react,*": "@react",
    "react/esm/react-jsx-runtime.production.min.js": "@react",
    "react/esm/react-jsx-runtime.production.min.js,*": "@react",
    "react-dom/esm/react-dom.production.min.js": "@react-dom",
    "react-dom/esm/react-dom.production.min.js,*": "@react-dom",
/* @endif */
  },
  acl: {
/* @ifdef isLit */
    "@getNormalizedPointerEventCoords": "r--", // TODO: potential security hole; hooking has to be enhanced to properly handle const { globalProperty } = window
    customElements: {
      define: {
        "@lit/reactive-element": 'r-x',
      },
      polyfillWrapFlushCallback: {
        "@lit-html": "r--",
      },
    },
    litHtmlVersions: {
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
        "@lit-html": 'rw-',
      },
      [S_DEFAULT]: 'r--',
      "@lit-html": 'rwx',
    },
    litElementVersions: {
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
        "@lit-element": 'rw-',
      },
      [S_DEFAULT]: 'r--',
      "@lit-element": 'rwx',
    },
    reactiveElementVersions: {
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
        "@lit/reactive-element": 'rwx',
      },
      [S_DEFAULT]: 'r--',
      "@lit/reactive-element": 'rwx',
    },
    "@lit/reactive-element/": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "lit-element/lit-element.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/focus/internal/focus-ring.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/focus/md-focus-ring.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/ripple/internal/ripple.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/ripple/ripple.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/button/internal/button.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/button/outlined-button.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/button/internal/outlined-button.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/button/internal/shared-styles.css.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/button/internal/outlined-styles.css.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/focus/internal/focus-ring-styles.css.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "@material/web/ripple/internal/ripple-styles.css.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
/* @endif */

/* @ifdef isReact */
    Object: {
      [S_PROTOTYPE]: {
        $hasOwnProperty$: {
          '@react': 'r--',
          '@react-dom': 'r--',
        },
      },
    },
    document: {
      '@react-dom': 'rwx',
      createElement: {
        [S_PARAM]: {
          '@react-dom': 'r-x',
        },
      },
    },
    "react": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "react/esm/react-jsx-runtime.production.min.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
    "react-dom/esm/react-dom.production.min.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'rwxRW', // TODO: too loose
    },
/* @endif */
  },
}/* @exclude */)/* @endexclude */