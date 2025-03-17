/* @exclude */
/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2023 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
(/* @endexclude */
{
  contextNormalizer: {
/* @ifdef isLit */
    "/src/my-app.js": "@/src/my-app.js",
    "/src/my-app.js,*": "@/src/my-app.js",
/* @endif */

/* @ifdef isReact */
    "/src/App.js": "@/src/App.js",
    "/src/App.js,*": "@/src/App.js",
    "/src/App.css.js": "@/src/App.css.js",
/* @endif */
  },
  acl: {
/* @ifdef isLit */
    customElements: {
      define: {
        "@/src/my-app.js": 'r-x',
      },
    },
    "./src/my-app.js": {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--RW',
      },
      [S_DEFAULT]: 'r-xRW',
      MyApp: {
        [S_OBJECT]: {
          [S_DEFAULT]: 'r-xRW',
          "@/src/my-app.js": 'rwxRW',
        },
        [S_DEFAULT]: {
          [S_DEFAULT]: 'rwxRW', // TODO: Loose ACL
        },
      },
    },
/* @endif */

/* @ifdef isReact */
    fetch: {
      //[S_DEFAULT]: 'r-x',
      [S_PARAM]: {
        "@/src/App.js": "r-x",
        resource: {
          "@/src/App.js": "^(https://[^/]*)?/assets/[^/.]*[.]svg$",
          //"@/src/App.js": (resource, options) => { resource = resource instanceof Request ? resource.url : resource.toString(); return /^(https:\/\/[^/]*)?\/assets\/[^/.]*[.]svg$/.test(resource); },
        },
      },
    },
/* @endif */
  },
}/* @exclude */)/* @endexclude */