/* @exclude */
/*
@license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
Copyright (c) 2017, 2018, 2019, 2020 Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
(/* @endexclude */
{
  contextNormalizer: {
    'https://thin-hook.localhost.localdomain/automation.json,*': '@cache_automation',
  },
  acl: {
    // blacklist objects/classes
    caches: '---',
    __hook__: '---', // TODO: ineffective
    __unexpected_access_to_hook_callback_function__: '---',
    __unexpected_access_to_hook_with_object__: '---',
    __unexpected_access_to_hook_alias_object__: '---',
    hook: '---',
    $hook$: '---',
    top: 'r--',
    parent: 'r--',
    frames: 'r--',
    globalThis: 'r--',
    content: 'r--',
    self: 'r--',
    _global: 'r--',
    [mainGlobalObjectName]: { // overwrite self: in worker threads
      [S_CHAIN]: () => acl,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
      },
      [S_DEFAULT]: Policy.globalAcl(),
      [S_ALL]: '---',
    },
    Window: {
      [S_CHAIN]: () => acl.EventTarget, // EventTarget is a prototype of Window
      [S_DEFAULT]: 'r--',
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: '---',
        [S_INSTANCE]: {
          [S_CHAIN]: () => acl,
        },
      },
    },
    Reflect: {
      [S_OBJECT]: 'r--',
      [S_DEFAULT]: 'r-x',
    },
    Object: {
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      $__proto__$: 'r--',
      $prototype$: 'r--',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: '---',
/* @ifdef unchainAcl */
        $toString$: {
          [S_DEFAULT]: '---',
        },
        $hasOwnProperty$: {
          [S_DEFAULT]: '---',
        },
/* @endif */
        [S_INSTANCE]: {
          $__proto__$: 'rwx',
          $constructor$: 'rwxRW',
          $__defineGetter__$: '-wxRW',
          $__defineSetter__$: '-wxRW',
          $__lookupGetter__$: '-wxRW',
          $__lookupSetter__$: '-wxRW',
          $hasOwnProperty$: {
            [S_DEFAULT]: '-wxRW',
          },
          $isPrototypeOf$: {
            [S_DEFAULT]: '-wxRW',
          },
          $propertyIsEnumerable$: {
            [S_DEFAULT]: '-wxRW',
          },
          $toLocaleString$: 'rwxRW',
          $toString$: 'rwxRW',
          $valueOf$: {
            [S_DEFAULT]: '-wxRW',
          },
        },
      },
    },
    String: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          [Symbol.iterator]: { // acl for a symbol property
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    Number: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
        },
      },
    },
    BigInt: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          $valueOf$: {
            [S_DEFAULT]: '--x',
          },
        },
      },
    },
    Boolean: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          $valueOf$: {
            [S_DEFAULT]: '--x',
          },
        },
      },
    },
    Symbol: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          description: {
            [S_DEFAULT]: 'r--',
          },
          [Symbol.toPrimitive]: { // acl for a symbol property
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    Proxy: {
      [S_OBJECT]: {
        [S_DEFAULT]: Policy.setAlias(false),
      },
      revocable: {
        [S_DEFAULT]: Policy.setAlias(true),
      },
      [S_DEFAULT]: '---',
    },
    import: {
      [S_OBJECT]: {
        [S_DEFAULT]: '--x',
      },
      [S_DEFAULT]: '---',
      invalidImportUrl: '---',
      meta: {
        [S_PARAM]: {
        },
        [S_DEFAULT]: function importMetaAcl(normalizedThisArg,
                                            normalizedArgs /* ['property', args], ['property', value], etc. */,
                                            aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                            hookArgs /* [f, thisArg, args, context, newTarget] */,
                                            applyAcl /* for recursive application of ACL */) {
          let opType = aclArgs[4];
          const _acl = acl.import.meta[S_PARAM] || {};
          if ((_acl[aclArgs[5]] || _acl[S_DEFAULT] || '---')[opTypeMap[opType]] === opType) {
            if (opType === 'r') {
              Policy.trackClass('import.meta', hookArgs[0]()); // TODO: this tracking may be inefficient
              return true;
            }
          }
          return false;
        },
        url: {
          [S_DEFAULT]: '---',
        },
      },
    },
    'import.meta': {
      [S_CHAIN]: () => acl.import.meta,
    },
    require: {
      [S_OBJECT]: {
        [S_DEFAULT]: function requireAcl(normalizedThisArg,
                                        normalizedArgs /* ['require', './module.js'] */,
                                        aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                        hookArgs /* [f, thisArg, args, context, newTarget] */,
                                        applyAcl /* for recursive application of ACL */) {
          let opType = aclArgs[4];
          if (opType === 'x') {
            //console.log('requireAcl: ' + hookArgs[3] + ': require(' + (normalizedArgs[1] ? '\'' + normalizedArgs[1].toString() + '\'' : normalizedArgs[1]) + ') resolved = ' + normalizedArgs[2].toString());
            // recursively apply ACL for the target module for reading
            return applyAcl(normalizedArgs[2], true, true, S_UNSPECIFIED, 'r', hookArgs[3], normalizedThisArg, normalizedArgs, hookArgs);
          }
          else {
            //console.log('requireAcl: ' + hookArgs[3] + ': opType = ' + opType + ' for require');
            return 'r-x'[opTypeMap[opType]] === opType; // equivalent to 'r-x' acl
          }
        },
      },
      [S_DEFAULT]: '---',
      invalidRequireName: '---',
    },
    navigator: {
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
      },
      [S_DEFAULT]: 'r--',
      [S_ALL]: '---',
      serviceWorker: '---',
      usb: '---',
      geolocation: '---',
    },
    location: {
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
      },
      [S_DEFAULT]: 'r--',
      [S_ALL]: '---',
      reload: {
        [S_DEFAULT]: '---',
      },
      $__proto__$: '---',
      href: {
        [S_DEFAULT]: 'r--',
      }
    },
    history: {
      [S_OBJECT]: 'r--',
      [S_DEFAULT]: 'rwx',
      [S_ALL]: '---',
      replaceState: {
        [S_DEFAULT]: '---',
      },
      pushState: {
        [S_DEFAULT]: '---',
      }
    },
    Worker: {
      [S_OBJECT]: {
        [S_PARAM]: {
        },
        [S_DEFAULT]: function _WorkerAcl(normalizedThisArg,
                                         normalizedArgs /* ['property', args], ['property', value], etc. */,
                                         aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                         hookArgs /* [f, thisArg, args, context, newTarget] */,
                                         applyAcl /* for recursive application of ACL */) {
          let opType = aclArgs[4];
          const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
          const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
          if (_acl[opTypeMap[opType]] === opType) {
            if (opType === 'x') {
              let url = new URL(normalizedArgs[0], hook.parameters.baseURI);
              if (url.protocol === 'blob:' || url.protocol === 'data:') {
                return false;
              }
              if (!url.pathname.match(/\.m?js$/)) {
                return false;
              }
            }
            return true;
          }
          else {
            return false;
          }
        },
      },
      [S_DEFAULT]: '---',
      [S_ALL]: '---',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: '---',
        [S_ALL]: '---',
        [S_INSTANCE]: {
        },
      },
    },
    SharedWorker: {
      [S_OBJECT]: {
        [S_PARAM]: {
        },
        [S_DEFAULT]: function _WorkerAcl(normalizedThisArg,
                                         normalizedArgs /* ['property', args], ['property', value], etc. */,
                                         aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                         hookArgs /* [f, thisArg, args, context, newTarget] */,
                                         applyAcl /* for recursive application of ACL */) {
          let opType = aclArgs[4];
          const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
          const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
          if (_acl[opTypeMap[opType]] === opType) {
            if (opType === 'x') {
              let url = new URL(normalizedArgs[0], hook.parameters.baseURI);
              if (url.protocol === 'blob:' || url.protocol === 'data:') {
                return false;
              }
              if (!url.pathname.match(/\.m?js$/)) {
                return false;
              }
            }
            return true;
          }
          else {
            return false;
          }
        },
      },
      [S_DEFAULT]: '---',
      [S_ALL]: '---',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: '---',
        [S_ALL]: '---',
        [S_INSTANCE]: {
        },
      },
    },
    Error: {
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_ALL]: 'r--',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: 'rwx',
        [S_ALL]: '---',
        $constructor$: {
          [S_DEFAULT]: 'r-x',
        },
      }
    },
    [S_CHAIN]: () => acl.EventTarget[S_PROTOTYPE][S_INSTANCE], // self instanceof EventTarget;
    // Thus, acl for window.addEventListener should reside at acl.EventTarget[S_PROTOTYPE][S_INSTANCE].addEventListener
    EventTarget: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE][S_INSTANCE],
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_ALL]: '---',
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'r-x',
        },
      },
    },
    Node: {
      [S_CHAIN]: () => acl.EventTarget,
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r-x',
      [S_ALL]: '---',
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          [S_ALL]: '---',
        },
      },
    },
    Text: {
      [S_DEFAULT]: 'r-x',
      [S_CHAIN]: () => acl.Node,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx', // TODO: Loose ACL
        },
      },
    },
    TreeWalker: {
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_DEFAULT]: 'rwx', // TODO: Loose ACL
        },
      },
    },
    Element: {
      [S_DEFAULT]: 'r-x',
      [S_CHAIN]: () => acl.Node,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          // Note: This ACL may significantly degrade performance
          innerHTML: function innerHtmlAcl(normalizedThisArg,
                                          normalizedArgs /* ['property', args], ['property', value], etc. */,
                                          aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                          hookArgs /* [f, thisArg, args, context, newTarget] */,
                                          applyAcl /* for recursive application of ACL */) {
            let opType = aclArgs[4];
            let result = 'rw-'[opTypeMap[opType]] === opType;
            if (result) {
              if (opType === 'w') {
                //console.log('set innerHTML: context = ' + hookArgs[3]);
                let stream = new HTMLParser.WritableStream({
                  onopentag(name, attributes) {
                    //console.log('set innerHTML: tagName = ' + name);
                    // TODO: Apply ACL for attributes as well with normalization of attributes to properties (mostly identical)
                    result = result && applyAcl('document', true, true, 'createElement', 'x', hookArgs[3], document, ['createElement', [name.toLowerCase()]], hookArgs);
                  },
                });
                stream.write(normalizedArgs[1]);
                stream.end();
              }
            }
            return result;
          },
        },
      },
    },
    HTMLElement: {
      [S_DEFAULT]: 'r-x',
      [S_CHAIN]: () => acl.Element,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r-x',
      },
      $prototype$: {
        [S_DEFAULT]: 'r--',
      },
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_ALL]: '---',
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
        },
      },
    },
    HTMLVideoElement: {
      [S_CHAIN]: () => acl.HTMLMediaElement,
    },
    HTMLUnknownElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLUListElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTrackElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTitleElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTimeElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTextAreaElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTemplateElement: {
      [S_OBJECT]: 'r-x',
      [S_DEFAULT]: 'r--',
      [S_ALL]: 'r--',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: 'rwx',
        [S_ALL]: '---',
        $__proto__$: {
          [S_DEFAULT]: 'r--',
        },
      },
    },
    HTMLTableSectionElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTableRowElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTableElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTableColElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTableCellElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLTableCaptionElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLStyleElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLSpanElement: {
      [S_CHAIN]: () => acl.HTMLElement,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
        },
      },
    },
    HTMLSourceElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLSlotElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLShadowElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLSelectElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLScriptElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLQuoteElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLProgressElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLPreElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLPictureElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLParamElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLParagraphElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLOutputElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLOptionElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLOptGroupElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLObjectElement: {
      [S_CHAIN]: () => acl.HTMLElement,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: '---',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: '---',
        },
      },
    },
    HTMLOListElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLModElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMeterElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMetaElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMenuElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMediaElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMarqueeElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLMapElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLLinkElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLLegendElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLLabelElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLLIElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLInputElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLImageElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLIFrameElement: {
      [S_CHAIN]: () => acl.HTMLElement,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          addEventListener: {
            [S_PARAM]: {
            },
            [S_DEFAULT]: function _iframeAddEventListenerAcl(normalizedThisArg,
                                                             normalizedArgs /* ['property', args], ['property', value], etc. */,
                                                             aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                                             hookArgs /* [f, thisArg, args, context, newTarget] */,
                                                             applyAcl /* for recursive application of ACL */) {
              let opType = aclArgs[4];
              const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
              const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
              if (_acl[opTypeMap[opType]] === opType) {
                if (opType === 'x') {
                  if (normalizedArgs[1] && normalizedArgs[1][0] === 'load') {
                    if (!normalizedThisArg.src) {
                      normalizedThisArg.src = emptyDocumentURL;
                    }
                    if (hookArgs[0] === '()' || hookArgs[0] === '#()') {
                      if (hookArgs[1] === normalizedThisArg && hookArgs[2][1][0] === 'load') {
                        let onloadAttribute = normalizedThisArg.getAttribute('onload');
                        if (onloadAttribute && 
                            (onloadAttribute.startsWith('event.target.contentDocument.write(') ||
                            onloadAttribute.startsWith('let iframe = this; fetch(new Request('))) {
                          hookArgs[2][1][0] = 'srcdoc-load';
                        }
                        if (hook.parameters.scriptHashes && normalizedThisArg.src.startsWith(hook.parameters.emptyDocumentUrl.href)) {
                          hookArgs[2][1][0] = 'srcdoc-load';
                        }
                      }
                    }
                  }
                }
                return true;
              }
              else {
                return false;
              }
            },
          },
          onload: {
            [S_PARAM]: {
            },
            [S_DEFAULT]: function _iframeOnloadAcl(normalizedThisArg,
                                                   normalizedArgs /* ['property', args], ['property', value], etc. */,
                                                   aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                                   hookArgs /* [f, thisArg, args, context, newTarget] */,
                                                   applyAcl /* for recursive application of ACL */) {
              let opType = aclArgs[4];
              const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
              const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
              if (_acl[opTypeMap[opType]] === opType) {
                if (opType === 'w') {
                  if (hookArgs[1] === normalizedThisArg && hookArgs[2][0] === normalizedArgs[0]) {
                    let onloadAttribute = normalizedThisArg.getAttribute('onload');
                    if (onloadAttribute && 
                        (onloadAttribute.startsWith('event.target.contentDocument.write(') ||
                        onloadAttribute.startsWith('let iframe = this; fetch(new Request('))) {
                      hookArgs[2][0] = '_onload'; // dummy to avoid overriding the existing onload event converted from srcdoc
                      normalizedThisArg.addEventListener('srcdoc-load', hookArgs[2][1]); // Redirect to srcdoc-load
                    }
                  }
                }
                return true;
              }
              else {
                return false;
              }
            },
          },
          contentDocument: {
            [S_PARAM]: {
            },
            [S_DEFAULT]: function _iframeContentDocumentAcl(normalizedThisArg,
                                                            normalizedArgs /* ['property', args], ['property', value], etc. */,
                                                            aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                                            hookArgs /* [f, thisArg, args, context, newTarget] */,
                                                            applyAcl /* for recursive application of ACL */) {
              let opType = aclArgs[4];
              const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
              const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
              if (_acl[opTypeMap[opType]] === opType) {
                if (!normalizedThisArg.getAttribute('src') || !normalizedThisArg.src) {
                  return false; // reject on empty src
                }
                if (this.contentWindow && !this.contentWindow.__hook__) {
                  return false; // reject on missing hook infrastructure
                }
                if (opType === 'r') {
                  let contentWindow = normalizedThisArg.contentWindow;
                  otherWindowObjects.set(contentWindow.Object, contentWindow);
                  otherWindowObjectsStatus.set = true;
                }
                return true;
              }
              else {
                return false;
              }
            },
          },
          contentWindow: {
            [S_PARAM]: {
            },
            [S_DEFAULT]: function _iframeContentWindowAcl(normalizedThisArg,
                                                          normalizedArgs /* ['property', args], ['property', value], etc. */,
                                                          aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                                          hookArgs /* [f, thisArg, args, context, newTarget] */,
                                                          applyAcl /* for recursive application of ACL */) {
              let opType = aclArgs[4];
              const contexts = acl.Worker[S_OBJECT][S_PARAM] || {};
              const _acl = contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---';
              if (_acl[opTypeMap[opType]] === opType) {
                if (!normalizedThisArg.getAttribute('src') || !normalizedThisArg.src) {
                  return false; // reject on empty src
                }
                if (this.contentWindow && !this.contentWindow.__hook__) {
                  return false; // reject on missing hook infrastructure
                }
                if (opType === 'r') {
                  let contentWindow = normalizedThisArg[normalizedArgs[0]]
                  otherWindowObjects.set(contentWindow.Object, contentWindow);
                  otherWindowObjectsStatus.set = true;
                }
                return true;
              }
              else {
                return false;
              }
            },
          },
        },
      },
    },
    HTMLHtmlElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLHeadingElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLHeadElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLHRElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLFrameSetElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLFrameElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLFormElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLFontElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLFieldSetElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLEmbedElement: {
      [S_CHAIN]: () => acl.HTMLElement,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: '---',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: '---',
        },
      },
    },
    HTMLDivElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDirectoryElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDialogElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDetailsElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDataListElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDataElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLDListElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLContentElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLCanvasElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLButtonElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLBodyElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLBaseElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLBRElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLAudioElement: {
      [S_CHAIN]: () => acl.HTMLMediaElement,
    },
    HTMLAreaElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    HTMLAnchorElement: {
      [S_CHAIN]: () => acl.HTMLElement,
    },
    Array: {
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_DEFAULT]: 'rwxRW',
        },
      },
    },
    Function: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE][S_INSTANCE], // Function is an instance of Function itself
      [S_OBJECT]: {
        [S_DEFAULT]: 'r-x',
      },
      [S_DEFAULT]: 'r-x',
      $__proto__$: 'r--',
      $prototype$: 'r--',
      $constructor$: 'r-x',
      [S_PROTOTYPE] : {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: Policy.defaultAcl(),
          //[S_ALL]: 'r--',
          $__proto__$: 'rw-',
          $prototype$: 'rw-',
          $constructor$: 'r-x',
          apply: 'r-x',
          call: 'r-x',
          bind: 'r-x',
        },
      },
    },
    onload: {
      [S_DEFAULT]: 'r-x',
    },
    Event: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE][S_INSTANCE],
      [S_DEFAULT]: 'r-x',
      [S_OBJECT]: {
        [S_DEFAULT]: 'r-x',
      },
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          $__proto__$: {
            [S_DEFAULT]: 'rw-', // TODO: Loose ACL
          },
        },
      },
    },
    UIEvent: {
      [S_CHAIN]: () => acl.Event,
    },
    CustomEvent: {
      [S_CHAIN]: () => acl.Event,
      [S_DEFAULT]: 'r-x',
      [S_OBJECT]: {
        [S_DEFAULT]: 'r-x',
      },
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        $__proto__$: {
          [S_DEFAULT]: 'r--',
        },
        __patchProto: {
          [S_DEFAULT]: 'r--',
        },
      },
    },
    FocusEvent: {
      [S_CHAIN]: () => acl.UIEvent,
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        $__proto__$: {
          [S_DEFAULT]: 'r-x',
        },
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          composed: {
            [S_DEFAULT]: 'r--',
          },
          currentTarget: {
            [S_DEFAULT]: 'r--',
          },
          eventPhase: {
            [S_DEFAULT]: 'r--',
          },
        },
      },
    },
    MouseEvent: {
      [S_CHAIN]: () => acl.UIEvent,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          $__proto__$: {
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    WheelEvent: {
      [S_CHAIN]: () => acl.MouseEvent,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          $__proto__$: {
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    AnimationEvent: {
      [S_CHAIN]: () => acl.Event,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          $__proto__$: {
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    KeyboardEvent: {
      [S_CHAIN]: () => acl.UIEvent,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          $__proto__$: {
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    DocumentFragment: {
      [S_CHAIN]: () => acl.Node,
      [S_DEFAULT]: 'r-x',
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        $__proto__$: {
          [S_DEFAULT]: 'r--',
        },
        querySelector: {
          [S_DEFAULT]: '--x',
        },
        querySelectorAll: {
          [S_DEFAULT]: '--x',
        },
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'rwx',
          $__proto__$: {
            [S_DEFAULT]: 'r-x',
          },
        },
      },
    },
    Date: {
      [S_DEFAULT]: 'r-x',
      now: {
        [S_DEFAULT]: 'r-x',
      },
    },
    Math: {
      [S_DEFAULT]: 'r-x',
      PI: {
        [S_DEFAULT]: 'r--',
      },
    },
    Crypto: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE][S_INSTANCE],
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        getRandomValues: '---',
        subtle: '---',
        [S_INSTANCE]: {
          getRandomValues: '--x',
          subtle: {
            [S_CHAIN]: () => acl.SubtleCrypto[S_PROTOTYPE][S_INSTANCE],
          },
        },
      },
    },
    crypto: {
      [S_CHAIN]: () => acl.Crypto[S_PROTOTYPE][S_INSTANCE],
    },
    SubtleCrypto: {
      [S_CHAIN]: () => acl.Function[S_PROTOTYPE][S_INSTANCE],
      [S_PROTOTYPE]: {
        [S_CHAIN]: () => acl.Object[S_PROTOTYPE],
        [S_DEFAULT]: '---',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'r-x',
        },
      },
    },
    Document: {
      [S_CHAIN]: () => acl.Node,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_DEFAULT]: 'r-x',
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
          [S_DEFAULT]: 'r-x',
        },
      },
    },
    HTMLDocument: {
      [S_CHAIN]: () => acl.Document,
      [S_PROTOTYPE]: {
        [S_CHAIN]: S_CHAIN,
        [S_INSTANCE]: {
          [S_CHAIN]: S_CHAIN,
        },
      },
    },
    document: {
      [S_CHAIN]: () => acl.HTMLDocument[S_PROTOTYPE][S_INSTANCE],
      [S_OBJECT]: 'r--',
      [S_DEFAULT]: 'r-x',
      write: {
        [S_DEFAULT]: '---',
      },
      createElement: {
        [S_PARAM]: {
          [S_DEFAULT]: '--x',
        },
        [S_DEFAULT]: function createElementAcl(normalizedThisArg,
                                              normalizedArgs /* ['property', args], ['property', value], etc. */,
                                              aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                              hookArgs /* [f, thisArg, args, context, newTarget] */,
                                              applyAcl /* for recursive application of ACL */) {
          let opType = aclArgs[4];
          const contexts = acl.document.createElement[S_PARAM] || {};
          let result = (contexts[aclArgs[5]] || contexts[S_DEFAULT] || '---')[opTypeMap[opType]] === opType;
          if (result) {
            if (opType === 'x') {
              //console.log('document.createElement: tagName = ' + normalizedArgs[1][0] + ' context = ' + hookArgs[3]);
              // This ACL can be forwarded to its corresponding HTMLElement subclass ACL or a custom element ACL like the following
              let tag = normalizedArgs[1][0].toLowerCase();
              let name;
              if (tagToElementClass.hasOwnProperty(tag)) {
                name = tagToElementClass[tag];
              }
              if (!name) {
                if (tag.indexOf('-') < 0) {
                  // Supplement missing tag in the table for the next lookup
                  name = tagToElementClass[tag] = document.createElement(tag).constructor.name;
                  console.log('createElementAcl: Supplement the missing tag "' + tag + '" with "' + tagToElementClass[tag] + '" in tagToElementClass table');
                }
                else {
                  // Custom Elements with hyphen(s) in the name
                  // Note: Use the custom element name itself as its virtual object name in ACL here for now.
                  //       The name can be customized such as 'CustomElement:tag-name' to avoid name conflicts in ACL.
                  // Note: The custom element may not be defined yet.
                  name = tag;
                }
              }
              // Apply ACL for the element class
              result = applyAcl(name, true, true, S_UNSPECIFIED, 'x', hookArgs[3], HTMLElement /* TODO: More appropriate normalizedThisArg */, [], hookArgs);
            }
          }
          return result;
        },
      },
      createElementNS: '---',
    },
    // Custom Elements
    customElements: {
      [S_CHAIN]: () => acl.Object[S_PROTOTYPE][S_INSTANCE],
      [S_OBJECT]: {
        [S_DEFAULT]: 'r--',
      },
      [S_DEFAULT]: '---',
      define: {
        [S_DEFAULT]: '---',
      },
      get: {
        [S_DEFAULT]: '--x',
      },
      whenDefined: {
        [S_DEFAULT]: '--x',
      },
      polyfillWrapFlushCallback: {
        [S_DEFAULT]: '---',
      },
    },
    fetch: {
      [S_CHAIN]: () => acl.Object[S_PROTOTYPE][S_INSTANCE],
      [S_PARAM]: {
        [S_DEFAULT]: '---',
        '@cache_automation': 'r-x',
        resource: {
          [S_DEFAULT]: (resource, options) => false,
          '@cache_automation': '/about-blank-redirector[.](html|js)([?]no-hook=true)?$',
        },
      },
      [S_DEFAULT]: function fetchAcl(normalizedThisArg,
                                     normalizedArgs /* ['property', args], ['property', value], etc. */,
                                     aclArgs /* [name, isStatic, isObject, property, opType, context] */,
                                     hookArgs /* [f, thisArg, args, context, newTarget] */,
                                     applyAcl /* for recursive application of ACL */) {
        let opType = aclArgs[4];
        const params = acl.fetch[S_PARAM] || { resource: {} };
        let result = (params[aclArgs[5]] || params[S_DEFAULT] || '---')[opTypeMap[opType]] === opType;
        if (result) {
          if (opType === 'x') {
            const resourceParams = params.resource || { [S_DEFAULT]: () => false };
            const resourceAcl = resourceParams[aclArgs[5]] || resourceParams[S_DEFAULT] || (() => false);
            const resource = normalizedArgs[0];
            switch (typeof resourceAcl) {
            case 'function':
              return resourceAcl(resource, normalizedArgs[1]);
            case 'string': // regular expression
              return (new RegExp(resourceAcl)).test(resource instanceof Request ? resource.url : resource.toString());
            default:
              console.error(`acl.fetch: cannot handle parameter.resource`, resourceAcl);
              return false;
            }
          }
        }
        return result;
      }
    },
    // default for module namespace objects
    [S_MODULE]: {
      [S_TYPE]: S_NAMESPACE,
      [S_OBJECT]: {
        [S_DEFAULT]: 'r-xRW',
      },
      [S_DEFAULT]: { // default for module exports
        [S_OBJECT]: {
          [S_DEFAULT]: 'r-xRW',
        },
        [S_DEFAULT]: Policy.globalAcl(),//'rwx', // TODO: Policy.moduleAcl() required?
        /*
        [S_PROTOTYPE]: {
          [S_DEFAULT]: 'r-x',
          [S_INSTANCE]: {
            [S_DEFAULT]: 'rwxRW',
          },
        },
        */
      },
    },
    // default for global objects
    [S_GLOBAL]: {
      [S_DEFAULT]: Policy.globalAcl(),
      [S_ALL]: 'r--',
      $__proto__$: 'r--',
      $prototype$: 'r--',
      $constructor$: 'r-x',
      [S_PROTOTYPE]: {
        [S_OBJECT]: 'r--',
        [S_DEFAULT]: Policy.globalAcl(), // TODO: Use S_INSTANCE policy
        [S_ALL]: 'r--',
        $__proto__$: 'r--',
        $prototype$: 'r--',
        $constructor$: 'r-x',
      },
    },
    // default for non-global objects
    [S_DEFAULT]: {
      // primitives
      //  string, boolean, number, undefined, null
      // orphaned objects
      //  Module
      //  plain and extended orphaned objects
      // object[undefined] property access
      [S_DEFAULT]: Policy.defaultAcl(),
      [S_PROTOTYPE]: {
        // prototype objects
        [S_DEFAULT]: Policy.defaultAcl(),
        [S_INSTANCE]: {
          // instances
          [S_CHAIN]: () => acl.Object[S_PROTOTYPE][S_INSTANCE],
          [S_DEFAULT]: Policy.defaultAcl(),
        },
      },
    },
  },
}/* @exclude */)/* @endexclude */