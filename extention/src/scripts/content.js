(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // PRESERVED: Fuzzy search engine (keep exactly as-is)
  // ═══════════════════════════════════════════════════════════════

  function K(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e;
  }
  var q = {},
    L = {},
    D;
  function $() {
    return (
      D ||
      ((D = 1),
      (function (e) {
        e.__esModule = !0;
        e.default = a;
        var n = /[\u0300-\u036f]/g,
          o = /ł/g,
          r = /ñ/g;
        function a(t) {
          return t.toLowerCase().normalize('NFD').replace(n, '').replace(o, 'l').replace(r, 'n').trim();
        }
      })(L)),
      L
    );
  }
  var M = {},
    U;
  function V() {
    if (U) return M;
    U = 1;
    M.__esModule = !0;
    M.aggressiveFuzzyMatch = b;
    M.createFuzzySearchImpl = N;
    M.experimentalSmartFuzzyMatch = E;
    M.fuzzyMatchImpl = A;
    var e = n($());
    function n(s) {
      return s && s.__esModule ? s : { default: s };
    }
    var o = Number.MAX_SAFE_INTEGER,
      r = function (i, p) {
        return i.score - p.score;
      },
      a = function (i, p) {
        return i[0] - p[0];
      },
      t = new Set('  \xA0[]()-–—\'"\u201C\u201D'.split(''));
    function l(s) {
      return t.has(s);
    }
    function g(s, i, p, x, u, v, f) {
      if (s === x) return [0, [[0, s.length - 1]]];
      var c = x.length,
        d = i.length,
        m = u.length;
      if (i === u) return [0.1, [[0, d - 1]]];
      if (i.startsWith(u)) return [0.5, [[0, m - 1]]];
      var T = s.indexOf(x);
      if (T > -1 && l(s[T - 1])) return [0.9, [[T, T + c - 1]]];
      var y = i.indexOf(u);
      if (y > -1 && l(i[y - 1])) return [1, [[y, y + c - 1]]];
      var R = v.length;
      if (R > 1 && v.every(function (S) { return p.has(S); })) {
        var C = 1.5 + R * 0.2;
        return [
          C,
          v
            .map(function (S) {
              var z = i.indexOf(S);
              return [z, z + S.length - 1];
            })
            .sort(a),
        ];
      }
      return y > -1 ? [2, [[y, y + c - 1]]] : f === 'aggressive' ? b(i, u) : f === 'smart' ? E(i, u) : null;
    }
    function b(s, i) {
      for (var p = s.length, x = i.length, u = 0, v = i[u], f = [], c = -1, d = -2, m = 0; m < p; m += 1)
        if (s[m] === v) {
          if (m !== d + 1 && (c >= 0 && f.push([c, d]), (c = m)), (d = m), (u += 1), u === x)
            return f.push([c, d]), w(f, s);
          v = i[u];
        }
      return null;
    }
    function E(s, i) {
      for (var p = s.length, x = [], u = 0, v = i[u], f = -1, c = -2; ; ) {
        var d = s.indexOf(v, c + 1);
        if (d === -1) break;
        if (d === 0 || l(s[d - 1])) f = d;
        else {
          var m = i.length - u,
            T = s.length - d,
            y = Math.min(3, m, T),
            R = i.slice(u, u + y);
          if (s.slice(d, d + y) === R) f = d;
          else {
            c += 1;
            continue;
          }
        }
        for (c = f; c < p && s[c] === v; c += 1) u += 1, (v = i[u]);
        if ((c -= 1, x.push([f, c]), u === i.length)) return w(x, s);
      }
      return null;
    }
    function w(s, i) {
      var p = 2;
      return (
        s.forEach(function (x) {
          var u = x[0],
            v = x[1],
            f = v - u + 1,
            c = u === 0 || i[u] === ' ' || i[u - 1] === ' ',
            d = v === i.length - 1 || i[v] === ' ' || i[v + 1] === ' ',
            m = c && d;
          m ? (p += 0.2) : c ? (p += 0.4) : f >= 3 ? (p += 0.8) : (p += 1.6);
        }),
        [p, s]
      );
    }
    function A(s, i) {
      var p = (0, e.default)(i),
        x = p.split(' '),
        u = (0, e.default)(s),
        v = new Set(u.split(' ')),
        f = g(s, u, v, i, p, x, 'smart');
      return f ? { item: s, score: f[0], matches: [f[1]] } : null;
    }
    function N(s, i) {
      var p = i.strategy,
        x = p === void 0 ? 'aggressive' : p,
        u = i.getText,
        v = s.map(function (f) {
          var c;
          if (u) c = u(f);
          else {
            var d = i.key ? f[i.key] : f;
            c = [d];
          }
          var m = c.map(function (T) {
            var y = T || '',
              R = (0, e.default)(y),
              C = new Set(R.split(' '));
            return [y, R, C];
          });
          return [f, m];
        });
      return function (f) {
        var c = [],
          d = (0, e.default)(f),
          m = d.split(' ');
        return d.length
          ? (v.forEach(function (T) {
              for (var y = T[0], R = T[1], C = o, S = [], z = 0, oe = R.length; z < oe; z += 1) {
                var P = R[z],
                  se = P[0],
                  le = P[1],
                  ue = P[2],
                  I = g(se, le, ue, f, d, m, x);
                I ? ((C = Math.min(C, I[0])), S.push(I[1])) : S.push(null);
              }
              C < o && c.push({ item: y, score: C, matches: S });
            }),
            c.sort(r),
            c)
          : [];
      };
    }
    return M;
  }
  var X;
  function Y() {
    return (
      X ||
      ((X = 1),
      (function (e) {
        e.__esModule = !0;
        e.default = r;
        e.fuzzyMatch = a;
        var n = o($());
        e.normalizeText = n.default;
        function o(t) {
          return t && t.__esModule ? t : { default: t };
        }
        function r(t, l) {
          return l === void 0 && (l = {}), V().createFuzzySearchImpl(t, l);
        }
        function a(t, l) {
          return V().fuzzyMatchImpl(t, l);
        }
      })(q)),
      q
    );
  }
  var j = Y();
  const createFuzzySearch = K(j);

  // ═══════════════════════════════════════════════════════════════
  // SEARCH SINGLETON — cache quran.json + index on first call
  // ═══════════════════════════════════════════════════════════════

  let _searcherPromise = null;

  function getSearcher() {
    if (_searcherPromise) return _searcherPromise;

    _searcherPromise = (async () => {
      const candidates = ['quran.json', 'public/quran.json'];
      for (const path of candidates) {
        try {
          const url = chrome.runtime.getURL(path);
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          return createFuzzySearch(data, {
            getText: (a) => [a.textNoTashkeel, a.textMinTashkeel, a.textTashkeel, a.surah],
          });
        } catch {
          /* try next path */
        }
      }
      console.error('[Kamil] Could not load quran.json from any candidate path', candidates);
      return null;
    })();

    return _searcherPromise;
  }

  async function searchQuran(query) {
    const searcher = await getSearcher();
    if (!searcher) return [];
    return searcher(query).slice(0, 5);
  }

  // Warm cache immediately (non-blocking)
  getSearcher();

  // ═══════════════════════════════════════════════════════════════
  // DEBOUNCE
  // ═══════════════════════════════════════════════════════════════

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // TEXT AREA STRATEGIES
  // ═══════════════════════════════════════════════════════════════

  // ── Base ──
  class TextAreaStrategy {
    canHandle(el) {
      return false;
    }
    getText(el) {
      return '';
    }
    getCaretOffset(el) {
      return 0;
    }
    insertAtTrigger(el, triggerOffset, insertText) {}
  }

  // ── NativeInputStrategy (textarea / input) ──
  class NativeInputStrategy extends TextAreaStrategy {
    canHandle(el) {
      return (
        el.tagName === 'TEXTAREA' ||
        (el.tagName === 'INPUT' &&
          ['text', 'search', 'email', 'url', 'tel', 'password', ''].includes((el.type || '').toLowerCase()))
      );
    }

    getText(el) {
      return el.value ?? '';
    }

    getCaretOffset(el) {
      return el.selectionStart ?? el.value.length;
    }

    insertAtTrigger(el, triggerOffset, insertText) {
      const val = el.value;
      let end = val.indexOf(' ', triggerOffset);
      if (end === -1) end = val.length;

      const before = val.slice(0, triggerOffset);
      const after = val.slice(end);
      const next = before + insertText + after;

      const nativeSetter =
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ??
        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;

      if (nativeSetter) {
        nativeSetter.call(el, next);
      } else {
        el.value = next;
      }

      const cursor = (before + insertText).length;
      el.setSelectionRange(cursor, cursor);

      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  // ── ReactControlledStrategy ──
  class ReactControlledStrategy extends TextAreaStrategy {
    #isReactElement(el) {
      return Object.keys(el).some(
        (k) => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'),
      );
    }

    canHandle(el) {
      return (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') && this.#isReactElement(el);
    }

    getText(el) {
      return el.value ?? '';
    }

    getCaretOffset(el) {
      return el.selectionStart ?? el.value.length;
    }

    insertAtTrigger(el, triggerOffset, insertText) {
      const val = el.value;
      let end = val.indexOf(' ', triggerOffset);
      if (end === -1) end = val.length;

      const next = val.slice(0, triggerOffset) + insertText + val.slice(end);

      const proto =
        el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (nativeSetter) {
        nativeSetter.call(el, next);
      } else {
        el.value = next;
      }

      el.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          cancelable: true,
          composed: true,
          inputType: 'insertText',
          data: insertText,
        }),
      );

      const cursor = triggerOffset + insertText.length;
      el.setSelectionRange(cursor, cursor);
    }
  }

  // ── ContentEditableStrategy ──
  class ContentEditableStrategy extends TextAreaStrategy {
    canHandle(el) {
      const ce = el.getAttribute('contenteditable');
      return (
        ce === 'true' ||
        ce === '' ||
        el.getAttribute('role') === 'textbox' ||
        el.classList.contains('ProseMirror') ||
        el.classList.contains('ql-editor') ||
        el.classList.contains('public-DraftEditor-content') ||
        el.classList.contains('cm-content') ||
        el.classList.contains('ck-content')
      );
    }

    getText(el) {
      return el.innerText ?? el.textContent ?? '';
    }

    #mapOffset(root, targetOffset) {
      let walked = 0;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
            if (node.tagName === 'BR') return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          },
        },
      );
      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const len = node.textContent.length;
          if (walked + len >= targetOffset) {
            return { node, offset: targetOffset - walked };
          }
          walked += len;
        } else if (node.tagName === 'BR') {
          walked += 1;
        }
        node = walker.nextNode();
      }
      return null;
    }

    getCaretOffset(el) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return 0;
      const range = sel.getRangeAt(0).cloneRange();
      range.selectNodeContents(el);
      range.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset);
      return range.toString().length;
    }

    insertAtTrigger(el, triggerOffset, insertText) {
      const flat = this.getText(el);
      let endOffset = flat.indexOf(' ', triggerOffset);
      if (endOffset === -1) endOffset = flat.length;

      const startPos = this.#mapOffset(el, triggerOffset);
      const endPos = this.#mapOffset(el, endOffset);
      if (!startPos || !endPos) {
        el.focus();
        document.execCommand?.('selectAll');
        return;
      }

      const range = document.createRange();
      range.setStart(startPos.node, startPos.offset);
      range.setEnd(endPos.node, endPos.offset);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      const inserted = document.execCommand?.('insertText', false, insertText);
      if (!inserted) {
        range.deleteContents();
        const textNode = document.createTextNode(insertText);
        range.insertNode(textNode);
        const newRange = document.createRange();
        newRange.setStart(textNode, textNode.length);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  // ── FrameEditorStrategy (TinyMCE, CKEditor 4 iframes) ──
  class FrameEditorStrategy extends TextAreaStrategy {
    canHandle(el) {
      if (el.id === 'tinymce' && el.ownerDocument !== document) return true;
      if (
        el.tagName === 'BODY' &&
        el.getAttribute('contenteditable') === 'true' &&
        el.ownerDocument !== document
      )
        return true;
      return false;
    }

    getText(el) {
      return el.innerText ?? '';
    }

    getCaretOffset(el) {
      const sel = el.ownerDocument.getSelection();
      if (!sel || sel.rangeCount === 0) return 0;
      const range = sel.getRangeAt(0).cloneRange();
      range.selectNodeContents(el);
      range.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset);
      return range.toString().length;
    }

    insertAtTrigger(el, triggerOffset, insertText) {
      const iframeWin = el.ownerDocument.defaultView;
      if (iframeWin?.tinymce) {
        const ed = iframeWin.tinymce.activeEditor;
        if (ed) {
          ed.insertContent(insertText);
          return;
        }
      }
      const ces = new ContentEditableStrategy();
      ces.insertAtTrigger(el, triggerOffset, insertText);
    }
  }

  // ── ShadowDOMStrategy (utility for discovering editables in shadow roots) ──
  const ShadowDOMStrategy = {
    collectEditables(root) {
      const results = [];
      const SELECTOR = getEditableSelector();
      root.querySelectorAll(SELECTOR).forEach((el) => results.push(el));
      root.querySelectorAll('*').forEach((el) => {
        if (el.shadowRoot) {
          ShadowDOMStrategy.collectEditables(el.shadowRoot).forEach((inner) => results.push(inner));
        }
      });
      return results;
    },
  };

  // ── Strategy Registry ──
  const STRATEGIES = [
    new ReactControlledStrategy(),
    new FrameEditorStrategy(),
    new ContentEditableStrategy(),
    new NativeInputStrategy(),
  ];

  function resolveStrategy(el) {
    return STRATEGIES.find((s) => s.canHandle(el)) ?? new NativeInputStrategy();
  }

  // ═══════════════════════════════════════════════════════════════
  // CARET POSITION
  // ═══════════════════════════════════════════════════════════════

  function getTextareaCaretCoords(el) {
    const pos = el.selectionEnd ?? el.value.length;
    const cs = getComputedStyle(el);
    const isInput = el.tagName === 'INPUT';

    const mirror = document.createElement('div');
    const s = mirror.style;

    const textProps = [
      'direction', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch',
      'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
      'textAlign', 'textTransform', 'textIndent', 'textDecoration',
      'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize',
    ];
    textProps.forEach((p) => { s[p] = cs[p]; });

    s.paddingTop = cs.paddingTop;
    s.paddingRight = cs.paddingRight;
    s.paddingBottom = cs.paddingBottom;
    s.paddingLeft = cs.paddingLeft;

    s.boxSizing = 'border-box';
    s.width = el.clientWidth + 'px';
    s.height = el.clientHeight + 'px';

    s.position = 'absolute';
    s.top = '0';
    s.left = '0';
    s.visibility = 'hidden';
    s.overflow = 'hidden';
    s.whiteSpace = 'pre-wrap';
    if (!isInput) s.wordWrap = 'break-word';

    document.body.appendChild(mirror);
    mirror.textContent = el.value.substring(0, pos);

    const caret = document.createElement('span');
    caret.textContent = el.value.substring(pos) || '.';
    mirror.appendChild(caret);

    const mirrorRect = mirror.getBoundingClientRect();
    const caretRect = caret.getBoundingClientRect();
    document.body.removeChild(mirror);

    const borderLeft = parseInt(cs.borderLeftWidth) || 0;
    const borderTop = parseInt(cs.borderTopWidth) || 0;
    const lineHeight = parseInt(cs.lineHeight) || 16;
    const taRect = el.getBoundingClientRect();

    return {
      x: taRect.left + borderLeft + (caretRect.left - mirrorRect.left) - el.scrollLeft,
      y: taRect.top + borderTop + (caretRect.top - mirrorRect.top) - el.scrollTop + lineHeight,
    };
  }

  function getCaretCoords(el) {
    try {
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        return getTextareaCaretCoords(el);
      }

      const sel = (el.ownerDocument ?? document).getSelection();
      if (!sel || sel.rangeCount === 0) throw new Error('no selection');

      const range = sel.getRangeAt(0).cloneRange();
      range.collapse(true);
      let rect = range.getBoundingClientRect();

      if (!rect || (rect.width === 0 && rect.height === 0)) {
        const sentinel = document.createElement('span');
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.style.cssText = 'display:inline-block;width:0;height:1em;';
        sentinel.textContent = '\u200B';
        range.insertNode(sentinel);
        rect = sentinel.getBoundingClientRect();
        sentinel.parentNode?.removeChild(sentinel);
        sel.removeAllRanges();
        sel.addRange(range);
      }

      return { x: rect.left, y: rect.bottom };
    } catch {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.bottom };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // DROPDOWN UI (mounted in Shadow Root)
  // ═══════════════════════════════════════════════════════════════

  function createDropdown() {
    const host = document.createElement('div');
    host.id = 'kamil-host';
    host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

      :host { all: initial; }

      #kamil-quran-results {
        position: absolute;
        top: 0; left: 0;
        background: rgba(255,255,255,0.97);
        border: 1px solid #e6e8ec;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.1);
        max-width: 420px;
        min-width: 320px;
        max-height: 320px;
        overflow-y: auto;
        direction: rtl;
        text-align: right;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        line-height: 1.5;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 150ms ease, transform 150ms ease;
        pointer-events: none;
        color: #111827;
      }
      #kamil-quran-results.kamil-visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      #kamil-quran-results::-webkit-scrollbar { width: 4px; }
      #kamil-quran-results::-webkit-scrollbar-thumb { background:#cfd6de; border-radius:2px; }

      .kamil-result-item {
        padding: 12px 14px;
        cursor: pointer;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.12s, box-shadow 0.12s;
      }
      .kamil-result-item:last-child { border-bottom: none; }
      .kamil-result-item:hover,
      .kamil-result-item.kamil-selected {
        background-color: #f3f4f6;
        box-shadow: inset -3px 0 0 #6366f1;
      }
      .kamil-result-info {
        font-size: 11px;
        color: #6b7280;
        margin-bottom: 5px;
        direction: ltr;
        text-align: left;
      }
      .kamil-result-text {
        font-family: 'Amiri', serif;
        font-size: 18px;
        line-height: 1.8;
        color: #0f172a;
      }
      .kamil-no-results {
        padding: 20px;
        text-align: center;
        color: #6b7280;
        direction: rtl;
      }
    `;
    shadow.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'kamil-quran-results';
    shadow.appendChild(panel);

    return { host, shadow, panel };
  }

  const { host: dropdownHost, shadow: dropdownShadow, panel: dropdown } = createDropdown();
  let selectedIndex = -1;

  function positionDropdown(el) {
    const PAD = 8;
    dropdown.style.visibility = 'hidden';

    const { x, y } = getCaretCoords(el);
    const dw = dropdown.offsetWidth;
    const dh = dropdown.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = x;
    let top = y + 4;

    const dir = getComputedStyle(el).direction;
    if (dir === 'rtl') {
      left = x - dw;
    }

    if (left + dw > vw - PAD) left = vw - dw - PAD;
    if (left < PAD) left = PAD;
    if (top + dh > vh - PAD) top = y - dh - 4;
    if (top < PAD) top = PAD;

    dropdownHost.style.left = `${Math.round(left)}px`;
    dropdownHost.style.top = `${Math.round(top)}px`;
    dropdown.style.visibility = 'visible';
  }

  function buildResultItem(result, index) {
    const item = document.createElement('div');
    item.className = 'kamil-result-item';
    item.dataset.index = index;

    const info = document.createElement('div');
    info.className = 'kamil-result-info';
    info.textContent = `${result.item.surah} : ${result.item.aya}`;

    const text = document.createElement('div');
    text.className = 'kamil-result-text';
    text.textContent = result.item.textTashkeel;

    item.appendChild(info);
    item.appendChild(text);
    return item;
  }

  function updateSelection(items, newIndex) {
    items.forEach((item, i) => {
      item.classList.toggle('kamil-selected', i === newIndex);
      if (i === newIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
    selectedIndex = newIndex;
  }

  function openDropdown() {
    dropdown.classList.add('kamil-visible');
  }

  function closeDropdown() {
    dropdown.classList.remove('kamil-visible');
    selectedIndex = -1;
  }

  // ═══════════════════════════════════════════════════════════════
  // KEYBOARD NAVIGATION
  // ═══════════════════════════════════════════════════════════════

  function handleKeydown(e) {
    if (!kamilEnabled) return;

    const items = dropdown.querySelectorAll('.kamil-result-item');
    if (!items.length && e.key !== 'Escape') return;

    const isVisible = dropdown.classList.contains('kamil-visible');
    if (!isVisible) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        updateSelection(items, Math.min(selectedIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        updateSelection(items, Math.max(selectedIndex - 1, 0));
        break;
      case 'Enter':
      case 'Tab':
        if (selectedIndex >= 0) {
          e.preventDefault();
          items[selectedIndex]?.click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER RESULTS (safe DOM construction, no innerHTML)
  // ═══════════════════════════════════════════════════════════════

  let activeElement = null;
  let lastTriggerOffset = -1;

  function renderResults(results, el, triggerOffset) {
    dropdown.innerHTML = '';
    selectedIndex = -1;

    if (results.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'kamil-no-results';
      empty.textContent = '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C';
      dropdown.appendChild(empty);
      return;
    }

    results.forEach((result, i) => {
      const item = buildResultItem(result, i);
      item.addEventListener('click', () => {
        const strategy = resolveStrategy(el);
        const formatted = `\uFEFD${result.item.textNoTashkeel}\uFEFE (\u0633\u0648\u0631\u0629 ${result.item.surah}: ${result.item.aya})`;
        strategy.insertAtTrigger(el, triggerOffset, formatted);
        closeDropdown();
        el.focus();
      });
      item.addEventListener('mouseenter', () => {
        updateSelection(dropdown.querySelectorAll('.kamil-result-item'), i);
      });
      dropdown.appendChild(item);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN INPUT HANDLER
  // ═══════════════════════════════════════════════════════════════

  async function handleInput(e) {
    if (!kamilEnabled) return;

    const el = e.target;
    activeElement = el;
    const strategy = resolveStrategy(el);
    const text = strategy.getText(el);

    const slashIdx = (() => {
      for (let i = text.length - 1; i >= 0; i--) {
        if (text[i] === '/') {
          if (i === 0 || /\s/.test(text[i - 1])) return i;
        }
      }
      return -1;
    })();

    if (slashIdx === -1) {
      closeDropdown();
      return;
    }

    const query = text.slice(slashIdx + 1);

    if (query.length === 0) {
      closeDropdown();
      return;
    }

    lastTriggerOffset = slashIdx;

    const results = await searchQuran(query);
    renderResults(results, el, slashIdx);
    positionDropdown(el);
    openDropdown();
  }

  const debouncedHandleInput = debounce(handleInput, 220);

  // ═══════════════════════════════════════════════════════════════
  // CLICK / SCROLL / RESIZE — dismiss or reposition the dropdown
  // ═══════════════════════════════════════════════════════════════

  let _kamilClicked = false;

  document.addEventListener(
    'mousedown',
    (e) => {
      _kamilClicked = true;
      const host = document.getElementById('kamil-host');
      if (host) {
        const path = e.composedPath();
        if (!path.includes(host)) {
          closeDropdown();
        }
      }
    },
    true,
  );

  window.addEventListener('scroll', () => {
    if (activeElement && dropdown.classList.contains('kamil-visible')) {
      positionDropdown(activeElement);
    }
  }, true);

  window.addEventListener('resize', () => {
    if (activeElement && dropdown.classList.contains('kamil-visible')) {
      positionDropdown(activeElement);
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // EDITABLE SELECTOR & LAZY ATTACHMENT VIA FOCUSIN
  // ═══════════════════════════════════════════════════════════════

  function getEditableSelector() {
    return [
      'textarea',
      'input[type="text"]',
      'input[type="search"]',
      'input[type="email"]',
      'input[type="url"]',
      'input[type="tel"]',
      'input[type="password"]',
      'input:not([type])',
      '[contenteditable="true"]',
      '[contenteditable=""]',
      '[role="textbox"]',
      '[role="combobox"]',
      '[role="spinbutton"]',
      '[aria-multiline="true"]',
      '.ProseMirror',
      '.ql-editor',
      '.public-DraftEditor-content',
      '.DraftEditor-editorContainer',
      '.notranslate[contenteditable]',
      '.msg-form__contenteditable',
      '#prompt-textarea',
      '.cm-content',
      '.CodeMirror-code',
      '.monaco-editor .inputarea',
      '.ace_text-input',
      '.ck-content',
      '.ck.ck-editor__editable',
      '#tinymce',
      '[placeholder="Type \'/\' for commands"]',
      '.notion-page-content [contenteditable]',
      '.ql-editor[data-slate-editor]',
      '[data-slate-editor="true"]',
      '[data-testid="tweetTextarea_0"]',
      '[data-testid="tweetTextarea_0_label"]',
      '.msg-form__contenteditable',
      '.comments-comment-box__text-editor',
      'div[aria-label][contenteditable="true"]',
    ].join(',');
  }

  function attachToElement(el) {
    if (!el || el.dataset.kamilAttached) return;
    if (!el.matches(getEditableSelector())) return;

    el.dataset.kamilAttached = 'true';
    el.addEventListener('input', debouncedHandleInput);
    el.addEventListener('keydown', handleKeydown);
  }

  document.addEventListener(
    'focusin',
    (e) => {
      if (!kamilEnabled) return;
      const el = e.target;
      attachToElement(el);
      activeElement = el;
    },
    true,
  );

  document.addEventListener(
    'focusin',
    () => {
      if (!kamilEnabled) return;
      ShadowDOMStrategy.collectEditables(document).forEach(attachToElement);
    },
    true,
  );

  // ═══════════════════════════════════════════════════════════════
  // MUTATION OBSERVER (for SPA route changes & dynamic DOM)
  // ═══════════════════════════════════════════════════════════════

  const debouncedAttachAll = debounce(() => {
    const all = ShadowDOMStrategy.collectEditables(document);
    all.forEach(attachToElement);
  }, 150);

  const domObserver = new MutationObserver(debouncedAttachAll);
  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['contenteditable', 'role', 'class', 'data-slate-editor'],
  });

  // ═══════════════════════════════════════════════════════════════
  // CHROME MESSAGE LISTENER
  // ═══════════════════════════════════════════════════════════════

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'PRELOAD') getSearcher();
    if (msg.type === 'ENABLED_CHANGED') {
      kamilEnabled = msg.enabled;
      if (!kamilEnabled) closeDropdown();
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════

  let kamilEnabled = true;

  try {
    chrome.storage.sync.get({ kamilEnabled: true }, (prefs) => {
      kamilEnabled = prefs.kamilEnabled !== false;
    });
  } catch {
    kamilEnabled = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debouncedAttachAll);
  } else {
    debouncedAttachAll();
  }

  console.log('[Kamil] Quran extension active \u2713');
})();