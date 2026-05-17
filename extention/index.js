(function () {
  const s = document.createElement("link").relList;
  if (s && s.supports && s.supports("modulepreload")) return;
  for (const E of document.querySelectorAll('link[rel="modulepreload"]')) r(E);
  new MutationObserver((E) => {
    for (const _ of E)
      if (_.type === "childList")
        for (const Y of _.addedNodes)
          Y.tagName === "LINK" && Y.rel === "modulepreload" && r(Y);
  }).observe(document, { childList: !0, subtree: !0 });
  function y(E) {
    const _ = {};
    return (
      E.integrity && (_.integrity = E.integrity),
      E.referrerPolicy && (_.referrerPolicy = E.referrerPolicy),
      E.crossOrigin === "use-credentials"
        ? (_.credentials = "include")
        : E.crossOrigin === "anonymous"
          ? (_.credentials = "omit")
          : (_.credentials = "same-origin"),
      _
    );
  }
  function r(E) {
    if (E.ep) return;
    E.ep = !0;
    const _ = y(E);
    fetch(E.href, _);
  }
})();
var uf = { exports: {} },
  Su = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var oh;
function uy() {
  if (oh) return Su;
  oh = 1;
  var i = Symbol.for("react.transitional.element"),
    s = Symbol.for("react.fragment");
  function y(r, E, _) {
    var Y = null;
    if (
      (_ !== void 0 && (Y = "" + _),
      E.key !== void 0 && (Y = "" + E.key),
      "key" in E)
    ) {
      _ = {};
      for (var D in E) D !== "key" && (_[D] = E[D]);
    } else _ = E;
    return (
      (E = _.ref),
      { $$typeof: i, type: r, key: Y, ref: E !== void 0 ? E : null, props: _ }
    );
  }
  return ((Su.Fragment = s), (Su.jsx = y), (Su.jsxs = y), Su);
}
var hh;
function ny() {
  return (hh || ((hh = 1), (uf.exports = uy())), uf.exports);
}
var L = ny(),
  nf = { exports: {} },
  V = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var dh;
function iy() {
  if (dh) return V;
  dh = 1;
  var i = Symbol.for("react.transitional.element"),
    s = Symbol.for("react.portal"),
    y = Symbol.for("react.fragment"),
    r = Symbol.for("react.strict_mode"),
    E = Symbol.for("react.profiler"),
    _ = Symbol.for("react.consumer"),
    Y = Symbol.for("react.context"),
    D = Symbol.for("react.forward_ref"),
    U = Symbol.for("react.suspense"),
    A = Symbol.for("react.memo"),
    R = Symbol.for("react.lazy"),
    F = Symbol.iterator;
  function w(h) {
    return h === null || typeof h != "object"
      ? null
      : ((h = (F && h[F]) || h["@@iterator"]),
        typeof h == "function" ? h : null);
  }
  var dt = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    et = Object.assign,
    I = {};
  function st(h, z, q) {
    ((this.props = h),
      (this.context = z),
      (this.refs = I),
      (this.updater = q || dt));
  }
  ((st.prototype.isReactComponent = {}),
    (st.prototype.setState = function (h, z) {
      if (typeof h != "object" && typeof h != "function" && h != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, h, z, "setState");
    }),
    (st.prototype.forceUpdate = function (h) {
      this.updater.enqueueForceUpdate(this, h, "forceUpdate");
    }));
  function zt() {}
  zt.prototype = st.prototype;
  function Nt(h, z, q) {
    ((this.props = h),
      (this.context = z),
      (this.refs = I),
      (this.updater = q || dt));
  }
  var gt = (Nt.prototype = new zt());
  ((gt.constructor = Nt), et(gt, st.prototype), (gt.isPureReactComponent = !0));
  var Ct = Array.isArray,
    k = { H: null, A: null, T: null, S: null, V: null },
    Qt = Object.prototype.hasOwnProperty;
  function Wt(h, z, q, N, Q, tt) {
    return (
      (q = tt.ref),
      { $$typeof: i, type: h, key: z, ref: q !== void 0 ? q : null, props: tt }
    );
  }
  function $t(h, z) {
    return Wt(h.type, z, void 0, void 0, void 0, h.props);
  }
  function pl(h) {
    return typeof h == "object" && h !== null && h.$$typeof === i;
  }
  function Ce(h) {
    var z = { "=": "=0", ":": "=2" };
    return (
      "$" +
      h.replace(/[=:]/g, function (q) {
        return z[q];
      })
    );
  }
  var _l = /\/+/g;
  function jt(h, z) {
    return typeof h == "object" && h !== null && h.key != null
      ? Ce("" + h.key)
      : z.toString(36);
  }
  function ve() {}
  function me(h) {
    switch (h.status) {
      case "fulfilled":
        return h.value;
      case "rejected":
        throw h.reason;
      default:
        switch (
          (typeof h.status == "string"
            ? h.then(ve, ve)
            : ((h.status = "pending"),
              h.then(
                function (z) {
                  h.status === "pending" &&
                    ((h.status = "fulfilled"), (h.value = z));
                },
                function (z) {
                  h.status === "pending" &&
                    ((h.status = "rejected"), (h.reason = z));
                },
              )),
          h.status)
        ) {
          case "fulfilled":
            return h.value;
          case "rejected":
            throw h.reason;
        }
    }
    throw h;
  }
  function Bt(h, z, q, N, Q) {
    var tt = typeof h;
    (tt === "undefined" || tt === "boolean") && (h = null);
    var Z = !1;
    if (h === null) Z = !0;
    else
      switch (tt) {
        case "bigint":
        case "string":
        case "number":
          Z = !0;
          break;
        case "object":
          switch (h.$$typeof) {
            case i:
            case s:
              Z = !0;
              break;
            case R:
              return ((Z = h._init), Bt(Z(h._payload), z, q, N, Q));
          }
      }
    if (Z)
      return (
        (Q = Q(h)),
        (Z = N === "" ? "." + jt(h, 0) : N),
        Ct(Q)
          ? ((q = ""),
            Z != null && (q = Z.replace(_l, "$&/") + "/"),
            Bt(Q, z, q, "", function (Ll) {
              return Ll;
            }))
          : Q != null &&
            (pl(Q) &&
              (Q = $t(
                Q,
                q +
                  (Q.key == null || (h && h.key === Q.key)
                    ? ""
                    : ("" + Q.key).replace(_l, "$&/") + "/") +
                  Z,
              )),
            z.push(Q)),
        1
      );
    Z = 0;
    var Ft = N === "" ? "." : N + ":";
    if (Ct(h))
      for (var yt = 0; yt < h.length; yt++)
        ((N = h[yt]), (tt = Ft + jt(N, yt)), (Z += Bt(N, z, q, tt, Q)));
    else if (((yt = w(h)), typeof yt == "function"))
      for (h = yt.call(h), yt = 0; !(N = h.next()).done; )
        ((N = N.value), (tt = Ft + jt(N, yt++)), (Z += Bt(N, z, q, tt, Q)));
    else if (tt === "object") {
      if (typeof h.then == "function") return Bt(me(h), z, q, N, Q);
      throw (
        (z = String(h)),
        Error(
          "Objects are not valid as a React child (found: " +
            (z === "[object Object]"
              ? "object with keys {" + Object.keys(h).join(", ") + "}"
              : z) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return Z;
  }
  function T(h, z, q) {
    if (h == null) return h;
    var N = [],
      Q = 0;
    return (
      Bt(h, N, "", "", function (tt) {
        return z.call(q, tt, Q++);
      }),
      N
    );
  }
  function x(h) {
    if (h._status === -1) {
      var z = h._result;
      ((z = z()),
        z.then(
          function (q) {
            (h._status === 0 || h._status === -1) &&
              ((h._status = 1), (h._result = q));
          },
          function (q) {
            (h._status === 0 || h._status === -1) &&
              ((h._status = 2), (h._result = q));
          },
        ),
        h._status === -1 && ((h._status = 0), (h._result = z)));
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var G =
    typeof reportError == "function"
      ? reportError
      : function (h) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var z = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof h == "object" &&
                h !== null &&
                typeof h.message == "string"
                  ? String(h.message)
                  : String(h),
              error: h,
            });
            if (!window.dispatchEvent(z)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", h);
            return;
          }
          console.error(h);
        };
  function rt() {}
  return (
    (V.Children = {
      map: T,
      forEach: function (h, z, q) {
        T(
          h,
          function () {
            z.apply(this, arguments);
          },
          q,
        );
      },
      count: function (h) {
        var z = 0;
        return (
          T(h, function () {
            z++;
          }),
          z
        );
      },
      toArray: function (h) {
        return (
          T(h, function (z) {
            return z;
          }) || []
        );
      },
      only: function (h) {
        if (!pl(h))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return h;
      },
    }),
    (V.Component = st),
    (V.Fragment = y),
    (V.Profiler = E),
    (V.PureComponent = Nt),
    (V.StrictMode = r),
    (V.Suspense = U),
    (V.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = k),
    (V.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (h) {
        return k.H.useMemoCache(h);
      },
    }),
    (V.cache = function (h) {
      return function () {
        return h.apply(null, arguments);
      };
    }),
    (V.cloneElement = function (h, z, q) {
      if (h == null)
        throw Error(
          "The argument must be a React element, but you passed " + h + ".",
        );
      var N = et({}, h.props),
        Q = h.key,
        tt = void 0;
      if (z != null)
        for (Z in (z.ref !== void 0 && (tt = void 0),
        z.key !== void 0 && (Q = "" + z.key),
        z))
          !Qt.call(z, Z) ||
            Z === "key" ||
            Z === "__self" ||
            Z === "__source" ||
            (Z === "ref" && z.ref === void 0) ||
            (N[Z] = z[Z]);
      var Z = arguments.length - 2;
      if (Z === 1) N.children = q;
      else if (1 < Z) {
        for (var Ft = Array(Z), yt = 0; yt < Z; yt++)
          Ft[yt] = arguments[yt + 2];
        N.children = Ft;
      }
      return Wt(h.type, Q, void 0, void 0, tt, N);
    }),
    (V.createContext = function (h) {
      return (
        (h = {
          $$typeof: Y,
          _currentValue: h,
          _currentValue2: h,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (h.Provider = h),
        (h.Consumer = { $$typeof: _, _context: h }),
        h
      );
    }),
    (V.createElement = function (h, z, q) {
      var N,
        Q = {},
        tt = null;
      if (z != null)
        for (N in (z.key !== void 0 && (tt = "" + z.key), z))
          Qt.call(z, N) &&
            N !== "key" &&
            N !== "__self" &&
            N !== "__source" &&
            (Q[N] = z[N]);
      var Z = arguments.length - 2;
      if (Z === 1) Q.children = q;
      else if (1 < Z) {
        for (var Ft = Array(Z), yt = 0; yt < Z; yt++)
          Ft[yt] = arguments[yt + 2];
        Q.children = Ft;
      }
      if (h && h.defaultProps)
        for (N in ((Z = h.defaultProps), Z)) Q[N] === void 0 && (Q[N] = Z[N]);
      return Wt(h, tt, void 0, void 0, null, Q);
    }),
    (V.createRef = function () {
      return { current: null };
    }),
    (V.forwardRef = function (h) {
      return { $$typeof: D, render: h };
    }),
    (V.isValidElement = pl),
    (V.lazy = function (h) {
      return { $$typeof: R, _payload: { _status: -1, _result: h }, _init: x };
    }),
    (V.memo = function (h, z) {
      return { $$typeof: A, type: h, compare: z === void 0 ? null : z };
    }),
    (V.startTransition = function (h) {
      var z = k.T,
        q = {};
      k.T = q;
      try {
        var N = h(),
          Q = k.S;
        (Q !== null && Q(q, N),
          typeof N == "object" &&
            N !== null &&
            typeof N.then == "function" &&
            N.then(rt, G));
      } catch (tt) {
        G(tt);
      } finally {
        k.T = z;
      }
    }),
    (V.unstable_useCacheRefresh = function () {
      return k.H.useCacheRefresh();
    }),
    (V.use = function (h) {
      return k.H.use(h);
    }),
    (V.useActionState = function (h, z, q) {
      return k.H.useActionState(h, z, q);
    }),
    (V.useCallback = function (h, z) {
      return k.H.useCallback(h, z);
    }),
    (V.useContext = function (h) {
      return k.H.useContext(h);
    }),
    (V.useDebugValue = function () {}),
    (V.useDeferredValue = function (h, z) {
      return k.H.useDeferredValue(h, z);
    }),
    (V.useEffect = function (h, z, q) {
      var N = k.H;
      if (typeof q == "function")
        throw Error(
          "useEffect CRUD overload is not enabled in this build of React.",
        );
      return N.useEffect(h, z);
    }),
    (V.useId = function () {
      return k.H.useId();
    }),
    (V.useImperativeHandle = function (h, z, q) {
      return k.H.useImperativeHandle(h, z, q);
    }),
    (V.useInsertionEffect = function (h, z) {
      return k.H.useInsertionEffect(h, z);
    }),
    (V.useLayoutEffect = function (h, z) {
      return k.H.useLayoutEffect(h, z);
    }),
    (V.useMemo = function (h, z) {
      return k.H.useMemo(h, z);
    }),
    (V.useOptimistic = function (h, z) {
      return k.H.useOptimistic(h, z);
    }),
    (V.useReducer = function (h, z, q) {
      return k.H.useReducer(h, z, q);
    }),
    (V.useRef = function (h) {
      return k.H.useRef(h);
    }),
    (V.useState = function (h) {
      return k.H.useState(h);
    }),
    (V.useSyncExternalStore = function (h, z, q) {
      return k.H.useSyncExternalStore(h, z, q);
    }),
    (V.useTransition = function () {
      return k.H.useTransition();
    }),
    (V.version = "19.1.1"),
    V
  );
}
var yh;
function vf() {
  return (yh || ((yh = 1), (nf.exports = iy())), nf.exports);
}
var Dl = vf(),
  cf = { exports: {} },
  bu = {},
  ff = { exports: {} },
  sf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var vh;
function cy() {
  return (
    vh ||
      ((vh = 1),
      (function (i) {
        function s(T, x) {
          var G = T.length;
          T.push(x);
          t: for (; 0 < G; ) {
            var rt = (G - 1) >>> 1,
              h = T[rt];
            if (0 < E(h, x)) ((T[rt] = x), (T[G] = h), (G = rt));
            else break t;
          }
        }
        function y(T) {
          return T.length === 0 ? null : T[0];
        }
        function r(T) {
          if (T.length === 0) return null;
          var x = T[0],
            G = T.pop();
          if (G !== x) {
            T[0] = G;
            t: for (var rt = 0, h = T.length, z = h >>> 1; rt < z; ) {
              var q = 2 * (rt + 1) - 1,
                N = T[q],
                Q = q + 1,
                tt = T[Q];
              if (0 > E(N, G))
                Q < h && 0 > E(tt, N)
                  ? ((T[rt] = tt), (T[Q] = G), (rt = Q))
                  : ((T[rt] = N), (T[q] = G), (rt = q));
              else if (Q < h && 0 > E(tt, G))
                ((T[rt] = tt), (T[Q] = G), (rt = Q));
              else break t;
            }
          }
          return x;
        }
        function E(T, x) {
          var G = T.sortIndex - x.sortIndex;
          return G !== 0 ? G : T.id - x.id;
        }
        if (
          ((i.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var _ = performance;
          i.unstable_now = function () {
            return _.now();
          };
        } else {
          var Y = Date,
            D = Y.now();
          i.unstable_now = function () {
            return Y.now() - D;
          };
        }
        var U = [],
          A = [],
          R = 1,
          F = null,
          w = 3,
          dt = !1,
          et = !1,
          I = !1,
          st = !1,
          zt = typeof setTimeout == "function" ? setTimeout : null,
          Nt = typeof clearTimeout == "function" ? clearTimeout : null,
          gt = typeof setImmediate < "u" ? setImmediate : null;
        function Ct(T) {
          for (var x = y(A); x !== null; ) {
            if (x.callback === null) r(A);
            else if (x.startTime <= T)
              (r(A), (x.sortIndex = x.expirationTime), s(U, x));
            else break;
            x = y(A);
          }
        }
        function k(T) {
          if (((I = !1), Ct(T), !et))
            if (y(U) !== null) ((et = !0), Qt || ((Qt = !0), jt()));
            else {
              var x = y(A);
              x !== null && Bt(k, x.startTime - T);
            }
        }
        var Qt = !1,
          Wt = -1,
          $t = 5,
          pl = -1;
        function Ce() {
          return st ? !0 : !(i.unstable_now() - pl < $t);
        }
        function _l() {
          if (((st = !1), Qt)) {
            var T = i.unstable_now();
            pl = T;
            var x = !0;
            try {
              t: {
                ((et = !1), I && ((I = !1), Nt(Wt), (Wt = -1)), (dt = !0));
                var G = w;
                try {
                  l: {
                    for (
                      Ct(T), F = y(U);
                      F !== null && !(F.expirationTime > T && Ce());
                    ) {
                      var rt = F.callback;
                      if (typeof rt == "function") {
                        ((F.callback = null), (w = F.priorityLevel));
                        var h = rt(F.expirationTime <= T);
                        if (((T = i.unstable_now()), typeof h == "function")) {
                          ((F.callback = h), Ct(T), (x = !0));
                          break l;
                        }
                        (F === y(U) && r(U), Ct(T));
                      } else r(U);
                      F = y(U);
                    }
                    if (F !== null) x = !0;
                    else {
                      var z = y(A);
                      (z !== null && Bt(k, z.startTime - T), (x = !1));
                    }
                  }
                  break t;
                } finally {
                  ((F = null), (w = G), (dt = !1));
                }
                x = void 0;
              }
            } finally {
              x ? jt() : (Qt = !1);
            }
          }
        }
        var jt;
        if (typeof gt == "function")
          jt = function () {
            gt(_l);
          };
        else if (typeof MessageChannel < "u") {
          var ve = new MessageChannel(),
            me = ve.port2;
          ((ve.port1.onmessage = _l),
            (jt = function () {
              me.postMessage(null);
            }));
        } else
          jt = function () {
            zt(_l, 0);
          };
        function Bt(T, x) {
          Wt = zt(function () {
            T(i.unstable_now());
          }, x);
        }
        ((i.unstable_IdlePriority = 5),
          (i.unstable_ImmediatePriority = 1),
          (i.unstable_LowPriority = 4),
          (i.unstable_NormalPriority = 3),
          (i.unstable_Profiling = null),
          (i.unstable_UserBlockingPriority = 2),
          (i.unstable_cancelCallback = function (T) {
            T.callback = null;
          }),
          (i.unstable_forceFrameRate = function (T) {
            0 > T || 125 < T
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : ($t = 0 < T ? Math.floor(1e3 / T) : 5);
          }),
          (i.unstable_getCurrentPriorityLevel = function () {
            return w;
          }),
          (i.unstable_next = function (T) {
            switch (w) {
              case 1:
              case 2:
              case 3:
                var x = 3;
                break;
              default:
                x = w;
            }
            var G = w;
            w = x;
            try {
              return T();
            } finally {
              w = G;
            }
          }),
          (i.unstable_requestPaint = function () {
            st = !0;
          }),
          (i.unstable_runWithPriority = function (T, x) {
            switch (T) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                T = 3;
            }
            var G = w;
            w = T;
            try {
              return x();
            } finally {
              w = G;
            }
          }),
          (i.unstable_scheduleCallback = function (T, x, G) {
            var rt = i.unstable_now();
            switch (
              (typeof G == "object" && G !== null
                ? ((G = G.delay),
                  (G = typeof G == "number" && 0 < G ? rt + G : rt))
                : (G = rt),
              T)
            ) {
              case 1:
                var h = -1;
                break;
              case 2:
                h = 250;
                break;
              case 5:
                h = 1073741823;
                break;
              case 4:
                h = 1e4;
                break;
              default:
                h = 5e3;
            }
            return (
              (h = G + h),
              (T = {
                id: R++,
                callback: x,
                priorityLevel: T,
                startTime: G,
                expirationTime: h,
                sortIndex: -1,
              }),
              G > rt
                ? ((T.sortIndex = G),
                  s(A, T),
                  y(U) === null &&
                    T === y(A) &&
                    (I ? (Nt(Wt), (Wt = -1)) : (I = !0), Bt(k, G - rt)))
                : ((T.sortIndex = h),
                  s(U, T),
                  et || dt || ((et = !0), Qt || ((Qt = !0), jt()))),
              T
            );
          }),
          (i.unstable_shouldYield = Ce),
          (i.unstable_wrapCallback = function (T) {
            var x = w;
            return function () {
              var G = w;
              w = x;
              try {
                return T.apply(this, arguments);
              } finally {
                w = G;
              }
            };
          }));
      })(sf)),
    sf
  );
}
var mh;
function fy() {
  return (mh || ((mh = 1), (ff.exports = cy())), ff.exports);
}
var rf = { exports: {} },
  Xt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var gh;
function sy() {
  if (gh) return Xt;
  gh = 1;
  var i = vf();
  function s(U) {
    var A = "https://react.dev/errors/" + U;
    if (1 < arguments.length) {
      A += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var R = 2; R < arguments.length; R++)
        A += "&args[]=" + encodeURIComponent(arguments[R]);
    }
    return (
      "Minified React error #" +
      U +
      "; visit " +
      A +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function y() {}
  var r = {
      d: {
        f: y,
        r: function () {
          throw Error(s(522));
        },
        D: y,
        C: y,
        L: y,
        m: y,
        X: y,
        S: y,
        M: y,
      },
      p: 0,
      findDOMNode: null,
    },
    E = Symbol.for("react.portal");
  function _(U, A, R) {
    var F =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: E,
      key: F == null ? null : "" + F,
      children: U,
      containerInfo: A,
      implementation: R,
    };
  }
  var Y = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function D(U, A) {
    if (U === "font") return "";
    if (typeof A == "string") return A === "use-credentials" ? A : "";
  }
  return (
    (Xt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (Xt.createPortal = function (U, A) {
      var R =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!A || (A.nodeType !== 1 && A.nodeType !== 9 && A.nodeType !== 11))
        throw Error(s(299));
      return _(U, A, null, R);
    }),
    (Xt.flushSync = function (U) {
      var A = Y.T,
        R = r.p;
      try {
        if (((Y.T = null), (r.p = 2), U)) return U();
      } finally {
        ((Y.T = A), (r.p = R), r.d.f());
      }
    }),
    (Xt.preconnect = function (U, A) {
      typeof U == "string" &&
        (A
          ? ((A = A.crossOrigin),
            (A =
              typeof A == "string"
                ? A === "use-credentials"
                  ? A
                  : ""
                : void 0))
          : (A = null),
        r.d.C(U, A));
    }),
    (Xt.prefetchDNS = function (U) {
      typeof U == "string" && r.d.D(U);
    }),
    (Xt.preinit = function (U, A) {
      if (typeof U == "string" && A && typeof A.as == "string") {
        var R = A.as,
          F = D(R, A.crossOrigin),
          w = typeof A.integrity == "string" ? A.integrity : void 0,
          dt = typeof A.fetchPriority == "string" ? A.fetchPriority : void 0;
        R === "style"
          ? r.d.S(U, typeof A.precedence == "string" ? A.precedence : void 0, {
              crossOrigin: F,
              integrity: w,
              fetchPriority: dt,
            })
          : R === "script" &&
            r.d.X(U, {
              crossOrigin: F,
              integrity: w,
              fetchPriority: dt,
              nonce: typeof A.nonce == "string" ? A.nonce : void 0,
            });
      }
    }),
    (Xt.preinitModule = function (U, A) {
      if (typeof U == "string")
        if (typeof A == "object" && A !== null) {
          if (A.as == null || A.as === "script") {
            var R = D(A.as, A.crossOrigin);
            r.d.M(U, {
              crossOrigin: R,
              integrity: typeof A.integrity == "string" ? A.integrity : void 0,
              nonce: typeof A.nonce == "string" ? A.nonce : void 0,
            });
          }
        } else A == null && r.d.M(U);
    }),
    (Xt.preload = function (U, A) {
      if (
        typeof U == "string" &&
        typeof A == "object" &&
        A !== null &&
        typeof A.as == "string"
      ) {
        var R = A.as,
          F = D(R, A.crossOrigin);
        r.d.L(U, R, {
          crossOrigin: F,
          integrity: typeof A.integrity == "string" ? A.integrity : void 0,
          nonce: typeof A.nonce == "string" ? A.nonce : void 0,
          type: typeof A.type == "string" ? A.type : void 0,
          fetchPriority:
            typeof A.fetchPriority == "string" ? A.fetchPriority : void 0,
          referrerPolicy:
            typeof A.referrerPolicy == "string" ? A.referrerPolicy : void 0,
          imageSrcSet:
            typeof A.imageSrcSet == "string" ? A.imageSrcSet : void 0,
          imageSizes: typeof A.imageSizes == "string" ? A.imageSizes : void 0,
          media: typeof A.media == "string" ? A.media : void 0,
        });
      }
    }),
    (Xt.preloadModule = function (U, A) {
      if (typeof U == "string")
        if (A) {
          var R = D(A.as, A.crossOrigin);
          r.d.m(U, {
            as: typeof A.as == "string" && A.as !== "script" ? A.as : void 0,
            crossOrigin: R,
            integrity: typeof A.integrity == "string" ? A.integrity : void 0,
          });
        } else r.d.m(U);
    }),
    (Xt.requestFormReset = function (U) {
      r.d.r(U);
    }),
    (Xt.unstable_batchedUpdates = function (U, A) {
      return U(A);
    }),
    (Xt.useFormState = function (U, A, R) {
      return Y.H.useFormState(U, A, R);
    }),
    (Xt.useFormStatus = function () {
      return Y.H.useHostTransitionStatus();
    }),
    (Xt.version = "19.1.1"),
    Xt
  );
}
var Sh;
function ry() {
  if (Sh) return rf.exports;
  Sh = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return (i(), (rf.exports = sy()), rf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var bh;
function oy() {
  if (bh) return bu;
  bh = 1;
  var i = fy(),
    s = vf(),
    y = ry();
  function r(t) {
    var l = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      l += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        l += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      l +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function E(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function _(t) {
    var l = t,
      e = t;
    if (t.alternate) for (; l.return; ) l = l.return;
    else {
      t = l;
      do ((l = t), (l.flags & 4098) !== 0 && (e = l.return), (t = l.return));
      while (t);
    }
    return l.tag === 3 ? e : null;
  }
  function Y(t) {
    if (t.tag === 13) {
      var l = t.memoizedState;
      if (
        (l === null && ((t = t.alternate), t !== null && (l = t.memoizedState)),
        l !== null)
      )
        return l.dehydrated;
    }
    return null;
  }
  function D(t) {
    if (_(t) !== t) throw Error(r(188));
  }
  function U(t) {
    var l = t.alternate;
    if (!l) {
      if (((l = _(t)), l === null)) throw Error(r(188));
      return l !== t ? null : t;
    }
    for (var e = t, a = l; ; ) {
      var u = e.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (((a = u.return), a !== null)) {
          e = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === e) return (D(u), t);
          if (n === a) return (D(u), l);
          n = n.sibling;
        }
        throw Error(r(188));
      }
      if (e.return !== a.return) ((e = u), (a = n));
      else {
        for (var c = !1, f = u.child; f; ) {
          if (f === e) {
            ((c = !0), (e = u), (a = n));
            break;
          }
          if (f === a) {
            ((c = !0), (a = u), (e = n));
            break;
          }
          f = f.sibling;
        }
        if (!c) {
          for (f = n.child; f; ) {
            if (f === e) {
              ((c = !0), (e = n), (a = u));
              break;
            }
            if (f === a) {
              ((c = !0), (a = n), (e = u));
              break;
            }
            f = f.sibling;
          }
          if (!c) throw Error(r(189));
        }
      }
      if (e.alternate !== a) throw Error(r(190));
    }
    if (e.tag !== 3) throw Error(r(188));
    return e.stateNode.current === e ? t : l;
  }
  function A(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((l = A(t)), l !== null)) return l;
      t = t.sibling;
    }
    return null;
  }
  var R = Object.assign,
    F = Symbol.for("react.element"),
    w = Symbol.for("react.transitional.element"),
    dt = Symbol.for("react.portal"),
    et = Symbol.for("react.fragment"),
    I = Symbol.for("react.strict_mode"),
    st = Symbol.for("react.profiler"),
    zt = Symbol.for("react.provider"),
    Nt = Symbol.for("react.consumer"),
    gt = Symbol.for("react.context"),
    Ct = Symbol.for("react.forward_ref"),
    k = Symbol.for("react.suspense"),
    Qt = Symbol.for("react.suspense_list"),
    Wt = Symbol.for("react.memo"),
    $t = Symbol.for("react.lazy"),
    pl = Symbol.for("react.activity"),
    Ce = Symbol.for("react.memo_cache_sentinel"),
    _l = Symbol.iterator;
  function jt(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (_l && t[_l]) || t["@@iterator"]),
        typeof t == "function" ? t : null);
  }
  var ve = Symbol.for("react.client.reference");
  function me(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === ve ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case et:
        return "Fragment";
      case st:
        return "Profiler";
      case I:
        return "StrictMode";
      case k:
        return "Suspense";
      case Qt:
        return "SuspenseList";
      case pl:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case dt:
          return "Portal";
        case gt:
          return (t.displayName || "Context") + ".Provider";
        case Nt:
          return (t._context.displayName || "Context") + ".Consumer";
        case Ct:
          var l = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = l.displayName || l.name || ""),
              (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case Wt:
          return (
            (l = t.displayName || null),
            l !== null ? l : me(t.type) || "Memo"
          );
        case $t:
          ((l = t._payload), (t = t._init));
          try {
            return me(t(l));
          } catch {}
      }
    return null;
  }
  var Bt = Array.isArray,
    T = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    x = y.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    G = { pending: !1, data: null, method: null, action: null },
    rt = [],
    h = -1;
  function z(t) {
    return { current: t };
  }
  function q(t) {
    0 > h || ((t.current = rt[h]), (rt[h] = null), h--);
  }
  function N(t, l) {
    (h++, (rt[h] = t.current), (t.current = l));
  }
  var Q = z(null),
    tt = z(null),
    Z = z(null),
    Ft = z(null);
  function yt(t, l) {
    switch ((N(Z, l), N(tt, t), N(Q, null), l.nodeType)) {
      case 9:
      case 11:
        t = (t = l.documentElement) && (t = t.namespaceURI) ? Yo(t) : 0;
        break;
      default:
        if (((t = l.tagName), (l = l.namespaceURI)))
          ((l = Yo(l)), (t = Go(l, t)));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    (q(Q), N(Q, t));
  }
  function Ll() {
    (q(Q), q(tt), q(Z));
  }
  function Vn(t) {
    t.memoizedState !== null && N(Ft, t);
    var l = Q.current,
      e = Go(l, t.type);
    l !== e && (N(tt, t), N(Q, e));
  }
  function Eu(t) {
    (tt.current === t && (q(Q), q(tt)),
      Ft.current === t && (q(Ft), (du._currentValue = G)));
  }
  var Ln = Object.prototype.hasOwnProperty,
    Kn = i.unstable_scheduleCallback,
    wn = i.unstable_cancelCallback,
    Qh = i.unstable_shouldYield,
    jh = i.unstable_requestPaint,
    Tl = i.unstable_now,
    Bh = i.unstable_getCurrentPriorityLevel,
    Sf = i.unstable_ImmediatePriority,
    bf = i.unstable_UserBlockingPriority,
    Au = i.unstable_NormalPriority,
    Yh = i.unstable_LowPriority,
    pf = i.unstable_IdlePriority,
    Gh = i.log,
    Xh = i.unstable_setDisableYieldValue,
    Ta = null,
    Pt = null;
  function Kl(t) {
    if (
      (typeof Gh == "function" && Xh(t),
      Pt && typeof Pt.setStrictMode == "function")
    )
      try {
        Pt.setStrictMode(Ta, t);
      } catch {}
  }
  var It = Math.clz32 ? Math.clz32 : Lh,
    Zh = Math.log,
    Vh = Math.LN2;
  function Lh(t) {
    return ((t >>>= 0), t === 0 ? 32 : (31 - ((Zh(t) / Vh) | 0)) | 0);
  }
  var Ou = 256,
    Mu = 4194304;
  function ge(t) {
    var l = t & 42;
    if (l !== 0) return l;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 4194048;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function zu(t, l, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      n = t.suspendedLanes,
      c = t.pingedLanes;
    t = t.warmLanes;
    var f = a & 134217727;
    return (
      f !== 0
        ? ((a = f & ~n),
          a !== 0
            ? (u = ge(a))
            : ((c &= f),
              c !== 0
                ? (u = ge(c))
                : e || ((e = f & ~t), e !== 0 && (u = ge(e)))))
        : ((f = a & ~n),
          f !== 0
            ? (u = ge(f))
            : c !== 0
              ? (u = ge(c))
              : e || ((e = a & ~t), e !== 0 && (u = ge(e)))),
      u === 0
        ? 0
        : l !== 0 &&
            l !== u &&
            (l & n) === 0 &&
            ((n = u & -u),
            (e = l & -l),
            n >= e || (n === 32 && (e & 4194048) !== 0))
          ? l
          : u
    );
  }
  function Ea(t, l) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & l) === 0;
  }
  function Kh(t, l) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return l + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Tf() {
    var t = Ou;
    return ((Ou <<= 1), (Ou & 4194048) === 0 && (Ou = 256), t);
  }
  function Ef() {
    var t = Mu;
    return ((Mu <<= 1), (Mu & 62914560) === 0 && (Mu = 4194304), t);
  }
  function Jn(t) {
    for (var l = [], e = 0; 31 > e; e++) l.push(t);
    return l;
  }
  function Aa(t, l) {
    ((t.pendingLanes |= l),
      l !== 268435456 &&
        ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0)));
  }
  function wh(t, l, e, a, u, n) {
    var c = t.pendingLanes;
    ((t.pendingLanes = e),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= e),
      (t.entangledLanes &= e),
      (t.errorRecoveryDisabledLanes &= e),
      (t.shellSuspendCounter = 0));
    var f = t.entanglements,
      o = t.expirationTimes,
      g = t.hiddenUpdates;
    for (e = c & ~e; 0 < e; ) {
      var p = 31 - It(e),
        M = 1 << p;
      ((f[p] = 0), (o[p] = -1));
      var S = g[p];
      if (S !== null)
        for (g[p] = null, p = 0; p < S.length; p++) {
          var b = S[p];
          b !== null && (b.lane &= -536870913);
        }
      e &= ~M;
    }
    (a !== 0 && Af(t, a, 0),
      n !== 0 && u === 0 && t.tag !== 0 && (t.suspendedLanes |= n & ~(c & ~l)));
  }
  function Af(t, l, e) {
    ((t.pendingLanes |= l), (t.suspendedLanes &= ~l));
    var a = 31 - It(l);
    ((t.entangledLanes |= l),
      (t.entanglements[a] = t.entanglements[a] | 1073741824 | (e & 4194090)));
  }
  function Of(t, l) {
    var e = (t.entangledLanes |= l);
    for (t = t.entanglements; e; ) {
      var a = 31 - It(e),
        u = 1 << a;
      ((u & l) | (t[a] & l) && (t[a] |= l), (e &= ~u));
    }
  }
  function kn(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Wn(t) {
    return (
      (t &= -t),
      2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function Mf() {
    var t = x.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : nh(t.type));
  }
  function Jh(t, l) {
    var e = x.p;
    try {
      return ((x.p = t), l());
    } finally {
      x.p = e;
    }
  }
  var wl = Math.random().toString(36).slice(2),
    Yt = "__reactFiber$" + wl,
    Lt = "__reactProps$" + wl,
    Qe = "__reactContainer$" + wl,
    $n = "__reactEvents$" + wl,
    kh = "__reactListeners$" + wl,
    Wh = "__reactHandles$" + wl,
    zf = "__reactResources$" + wl,
    Oa = "__reactMarker$" + wl;
  function Fn(t) {
    (delete t[Yt], delete t[Lt], delete t[$n], delete t[kh], delete t[Wh]);
  }
  function je(t) {
    var l = t[Yt];
    if (l) return l;
    for (var e = t.parentNode; e; ) {
      if ((l = e[Qe] || e[Yt])) {
        if (
          ((e = l.alternate),
          l.child !== null || (e !== null && e.child !== null))
        )
          for (t = Lo(t); t !== null; ) {
            if ((e = t[Yt])) return e;
            t = Lo(t);
          }
        return l;
      }
      ((t = e), (e = t.parentNode));
    }
    return null;
  }
  function Be(t) {
    if ((t = t[Yt] || t[Qe])) {
      var l = t.tag;
      if (l === 5 || l === 6 || l === 13 || l === 26 || l === 27 || l === 3)
        return t;
    }
    return null;
  }
  function Ma(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t.stateNode;
    throw Error(r(33));
  }
  function Ye(t) {
    var l = t[zf];
    return (
      l ||
        (l = t[zf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      l
    );
  }
  function Dt(t) {
    t[Oa] = !0;
  }
  var Df = new Set(),
    _f = {};
  function Se(t, l) {
    (Ge(t, l), Ge(t + "Capture", l));
  }
  function Ge(t, l) {
    for (_f[t] = l, t = 0; t < l.length; t++) Df.add(l[t]);
  }
  var $h = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    Uf = {},
    Rf = {};
  function Fh(t) {
    return Ln.call(Rf, t)
      ? !0
      : Ln.call(Uf, t)
        ? !1
        : $h.test(t)
          ? (Rf[t] = !0)
          : ((Uf[t] = !0), !1);
  }
  function Du(t, l, e) {
    if (Fh(l))
      if (e === null) t.removeAttribute(l);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(l);
            return;
          case "boolean":
            var a = l.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(l);
              return;
            }
        }
        t.setAttribute(l, "" + e);
      }
  }
  function _u(t, l, e) {
    if (e === null) t.removeAttribute(l);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttribute(l, "" + e);
    }
  }
  function Ul(t, l, e, a) {
    if (a === null) t.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttributeNS(l, e, "" + a);
    }
  }
  var Pn, Nf;
  function Xe(t) {
    if (Pn === void 0)
      try {
        throw Error();
      } catch (e) {
        var l = e.stack.trim().match(/\n( *(at )?)/);
        ((Pn = (l && l[1]) || ""),
          (Nf =
            -1 <
            e.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < e.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      Pn +
      t +
      Nf
    );
  }
  var In = !1;
  function ti(t, l) {
    if (!t || In) return "";
    In = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (l) {
              var M = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(M.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(M, []);
                } catch (b) {
                  var S = b;
                }
                Reflect.construct(t, [], M);
              } else {
                try {
                  M.call();
                } catch (b) {
                  S = b;
                }
                t.call(M.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (b) {
                S = b;
              }
              (M = t()) &&
                typeof M.catch == "function" &&
                M.catch(function () {});
            }
          } catch (b) {
            if (b && S && typeof b.stack == "string") return [b.stack, S.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name",
      );
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var n = a.DetermineComponentFrameRoot(),
        c = n[0],
        f = n[1];
      if (c && f) {
        var o = c.split(`
`),
          g = f.split(`
`);
        for (
          u = a = 0;
          a < o.length && !o[a].includes("DetermineComponentFrameRoot");
        )
          a++;
        for (; u < g.length && !g[u].includes("DetermineComponentFrameRoot"); )
          u++;
        if (a === o.length || u === g.length)
          for (
            a = o.length - 1, u = g.length - 1;
            1 <= a && 0 <= u && o[a] !== g[u];
          )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (o[a] !== g[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || o[a] !== g[u])) {
                  var p =
                    `
` + o[a].replace(" at new ", " at ");
                  return (
                    t.displayName &&
                      p.includes("<anonymous>") &&
                      (p = p.replace("<anonymous>", t.displayName)),
                    p
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((In = !1), (Error.prepareStackTrace = e));
    }
    return (e = t ? t.displayName || t.name : "") ? Xe(e) : "";
  }
  function Ph(t) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return Xe(t.type);
      case 16:
        return Xe("Lazy");
      case 13:
        return Xe("Suspense");
      case 19:
        return Xe("SuspenseList");
      case 0:
      case 15:
        return ti(t.type, !1);
      case 11:
        return ti(t.type.render, !1);
      case 1:
        return ti(t.type, !0);
      case 31:
        return Xe("Activity");
      default:
        return "";
    }
  }
  function xf(t) {
    try {
      var l = "";
      do ((l += Ph(t)), (t = t.return));
      while (t);
      return l;
    } catch (e) {
      return (
        `
Error generating stack: ` +
        e.message +
        `
` +
        e.stack
      );
    }
  }
  function cl(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function qf(t) {
    var l = t.type;
    return (
      (t = t.nodeName) &&
      t.toLowerCase() === "input" &&
      (l === "checkbox" || l === "radio")
    );
  }
  function Ih(t) {
    var l = qf(t) ? "checked" : "value",
      e = Object.getOwnPropertyDescriptor(t.constructor.prototype, l),
      a = "" + t[l];
    if (
      !t.hasOwnProperty(l) &&
      typeof e < "u" &&
      typeof e.get == "function" &&
      typeof e.set == "function"
    ) {
      var u = e.get,
        n = e.set;
      return (
        Object.defineProperty(t, l, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (c) {
            ((a = "" + c), n.call(this, c));
          },
        }),
        Object.defineProperty(t, l, { enumerable: e.enumerable }),
        {
          getValue: function () {
            return a;
          },
          setValue: function (c) {
            a = "" + c;
          },
          stopTracking: function () {
            ((t._valueTracker = null), delete t[l]);
          },
        }
      );
    }
  }
  function Uu(t) {
    t._valueTracker || (t._valueTracker = Ih(t));
  }
  function Hf(t) {
    if (!t) return !1;
    var l = t._valueTracker;
    if (!l) return !0;
    var e = l.getValue(),
      a = "";
    return (
      t && (a = qf(t) ? (t.checked ? "true" : "false") : t.value),
      (t = a),
      t !== e ? (l.setValue(t), !0) : !1
    );
  }
  function Ru(t) {
    if (
      ((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")
    )
      return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var td = /[\n"\\]/g;
  function fl(t) {
    return t.replace(td, function (l) {
      return "\\" + l.charCodeAt(0).toString(16) + " ";
    });
  }
  function li(t, l, e, a, u, n, c, f) {
    ((t.name = ""),
      c != null &&
      typeof c != "function" &&
      typeof c != "symbol" &&
      typeof c != "boolean"
        ? (t.type = c)
        : t.removeAttribute("type"),
      l != null
        ? c === "number"
          ? ((l === 0 && t.value === "") || t.value != l) &&
            (t.value = "" + cl(l))
          : t.value !== "" + cl(l) && (t.value = "" + cl(l))
        : (c !== "submit" && c !== "reset") || t.removeAttribute("value"),
      l != null
        ? ei(t, c, cl(l))
        : e != null
          ? ei(t, c, cl(e))
          : a != null && t.removeAttribute("value"),
      u == null && n != null && (t.defaultChecked = !!n),
      u != null &&
        (t.checked = u && typeof u != "function" && typeof u != "symbol"),
      f != null &&
      typeof f != "function" &&
      typeof f != "symbol" &&
      typeof f != "boolean"
        ? (t.name = "" + cl(f))
        : t.removeAttribute("name"));
  }
  function Cf(t, l, e, a, u, n, c, f) {
    if (
      (n != null &&
        typeof n != "function" &&
        typeof n != "symbol" &&
        typeof n != "boolean" &&
        (t.type = n),
      l != null || e != null)
    ) {
      if (!((n !== "submit" && n !== "reset") || l != null)) return;
      ((e = e != null ? "" + cl(e) : ""),
        (l = l != null ? "" + cl(l) : e),
        f || l === t.value || (t.value = l),
        (t.defaultValue = l));
    }
    ((a = a ?? u),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (t.checked = f ? t.checked : !!a),
      (t.defaultChecked = !!a),
      c != null &&
        typeof c != "function" &&
        typeof c != "symbol" &&
        typeof c != "boolean" &&
        (t.name = c));
  }
  function ei(t, l, e) {
    (l === "number" && Ru(t.ownerDocument) === t) ||
      t.defaultValue === "" + e ||
      (t.defaultValue = "" + e);
  }
  function Ze(t, l, e, a) {
    if (((t = t.options), l)) {
      l = {};
      for (var u = 0; u < e.length; u++) l["$" + e[u]] = !0;
      for (e = 0; e < t.length; e++)
        ((u = l.hasOwnProperty("$" + t[e].value)),
          t[e].selected !== u && (t[e].selected = u),
          u && a && (t[e].defaultSelected = !0));
    } else {
      for (e = "" + cl(e), l = null, u = 0; u < t.length; u++) {
        if (t[u].value === e) {
          ((t[u].selected = !0), a && (t[u].defaultSelected = !0));
          return;
        }
        l !== null || t[u].disabled || (l = t[u]);
      }
      l !== null && (l.selected = !0);
    }
  }
  function Qf(t, l, e) {
    if (
      l != null &&
      ((l = "" + cl(l)), l !== t.value && (t.value = l), e == null)
    ) {
      t.defaultValue !== l && (t.defaultValue = l);
      return;
    }
    t.defaultValue = e != null ? "" + cl(e) : "";
  }
  function jf(t, l, e, a) {
    if (l == null) {
      if (a != null) {
        if (e != null) throw Error(r(92));
        if (Bt(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        e = a;
      }
      (e == null && (e = ""), (l = e));
    }
    ((e = cl(l)),
      (t.defaultValue = e),
      (a = t.textContent),
      a === e && a !== "" && a !== null && (t.value = a));
  }
  function Ve(t, l) {
    if (l) {
      var e = t.firstChild;
      if (e && e === t.lastChild && e.nodeType === 3) {
        e.nodeValue = l;
        return;
      }
    }
    t.textContent = l;
  }
  var ld = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function Bf(t, l, e) {
    var a = l.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === ""
      ? a
        ? t.setProperty(l, "")
        : l === "float"
          ? (t.cssFloat = "")
          : (t[l] = "")
      : a
        ? t.setProperty(l, e)
        : typeof e != "number" || e === 0 || ld.has(l)
          ? l === "float"
            ? (t.cssFloat = e)
            : (t[l] = ("" + e).trim())
          : (t[l] = e + "px");
  }
  function Yf(t, l, e) {
    if (l != null && typeof l != "object") throw Error(r(62));
    if (((t = t.style), e != null)) {
      for (var a in e)
        !e.hasOwnProperty(a) ||
          (l != null && l.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0
            ? t.setProperty(a, "")
            : a === "float"
              ? (t.cssFloat = "")
              : (t[a] = ""));
      for (var u in l)
        ((a = l[u]), l.hasOwnProperty(u) && e[u] !== a && Bf(t, u, a));
    } else for (var n in l) l.hasOwnProperty(n) && Bf(t, n, l[n]);
  }
  function ai(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ed = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    ad =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Nu(t) {
    return ad.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  var ui = null;
  function ni(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Le = null,
    Ke = null;
  function Gf(t) {
    var l = Be(t);
    if (l && (t = l.stateNode)) {
      var e = t[Lt] || null;
      t: switch (((t = l.stateNode), l.type)) {
        case "input":
          if (
            (li(
              t,
              e.value,
              e.defaultValue,
              e.defaultValue,
              e.checked,
              e.defaultChecked,
              e.type,
              e.name,
            ),
            (l = e.name),
            e.type === "radio" && l != null)
          ) {
            for (e = t; e.parentNode; ) e = e.parentNode;
            for (
              e = e.querySelectorAll(
                'input[name="' + fl("" + l) + '"][type="radio"]',
              ),
                l = 0;
              l < e.length;
              l++
            ) {
              var a = e[l];
              if (a !== t && a.form === t.form) {
                var u = a[Lt] || null;
                if (!u) throw Error(r(90));
                li(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name,
                );
              }
            }
            for (l = 0; l < e.length; l++)
              ((a = e[l]), a.form === t.form && Hf(a));
          }
          break t;
        case "textarea":
          Qf(t, e.value, e.defaultValue);
          break t;
        case "select":
          ((l = e.value), l != null && Ze(t, !!e.multiple, l, !1));
      }
    }
  }
  var ii = !1;
  function Xf(t, l, e) {
    if (ii) return t(l, e);
    ii = !0;
    try {
      var a = t(l);
      return a;
    } finally {
      if (
        ((ii = !1),
        (Le !== null || Ke !== null) &&
          (gn(), Le && ((l = Le), (t = Ke), (Ke = Le = null), Gf(l), t)))
      )
        for (l = 0; l < t.length; l++) Gf(t[l]);
    }
  }
  function za(t, l) {
    var e = t.stateNode;
    if (e === null) return null;
    var a = e[Lt] || null;
    if (a === null) return null;
    e = a[l];
    t: switch (l) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((a = !a.disabled) ||
          ((t = t.type),
          (a = !(
            t === "button" ||
            t === "input" ||
            t === "select" ||
            t === "textarea"
          ))),
          (t = !a));
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (e && typeof e != "function") throw Error(r(231, l, typeof e));
    return e;
  }
  var Rl = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    ci = !1;
  if (Rl)
    try {
      var Da = {};
      (Object.defineProperty(Da, "passive", {
        get: function () {
          ci = !0;
        },
      }),
        window.addEventListener("test", Da, Da),
        window.removeEventListener("test", Da, Da));
    } catch {
      ci = !1;
    }
  var Jl = null,
    fi = null,
    xu = null;
  function Zf() {
    if (xu) return xu;
    var t,
      l = fi,
      e = l.length,
      a,
      u = "value" in Jl ? Jl.value : Jl.textContent,
      n = u.length;
    for (t = 0; t < e && l[t] === u[t]; t++);
    var c = e - t;
    for (a = 1; a <= c && l[e - a] === u[n - a]; a++);
    return (xu = u.slice(t, 1 < a ? 1 - a : void 0));
  }
  function qu(t) {
    var l = t.keyCode;
    return (
      "charCode" in t
        ? ((t = t.charCode), t === 0 && l === 13 && (t = 13))
        : (t = l),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function Hu() {
    return !0;
  }
  function Vf() {
    return !1;
  }
  function Kt(t) {
    function l(e, a, u, n, c) {
      ((this._reactName = e),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = c),
        (this.currentTarget = null));
      for (var f in t)
        t.hasOwnProperty(f) && ((e = t[f]), (this[f] = e ? e(n) : n[f]));
      return (
        (this.isDefaultPrevented = (
          n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
        )
          ? Hu
          : Vf),
        (this.isPropagationStopped = Vf),
        this
      );
    }
    return (
      R(l.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : typeof e.returnValue != "unknown" && (e.returnValue = !1),
            (this.isDefaultPrevented = Hu));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0),
            (this.isPropagationStopped = Hu));
        },
        persist: function () {},
        isPersistent: Hu,
      }),
      l
    );
  }
  var be = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Cu = Kt(be),
    _a = R({}, be, { view: 0, detail: 0 }),
    ud = Kt(_a),
    si,
    ri,
    Ua,
    Qu = R({}, _a, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: hi,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== Ua &&
              (Ua && t.type === "mousemove"
                ? ((si = t.screenX - Ua.screenX), (ri = t.screenY - Ua.screenY))
                : (ri = si = 0),
              (Ua = t)),
            si);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : ri;
      },
    }),
    Lf = Kt(Qu),
    nd = R({}, Qu, { dataTransfer: 0 }),
    id = Kt(nd),
    cd = R({}, _a, { relatedTarget: 0 }),
    oi = Kt(cd),
    fd = R({}, be, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    sd = Kt(fd),
    rd = R({}, be, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    od = Kt(rd),
    hd = R({}, be, { data: 0 }),
    Kf = Kt(hd),
    dd = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    yd = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    vd = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function md(t) {
    var l = this.nativeEvent;
    return l.getModifierState
      ? l.getModifierState(t)
      : (t = vd[t])
        ? !!l[t]
        : !1;
  }
  function hi() {
    return md;
  }
  var gd = R({}, _a, {
      key: function (t) {
        if (t.key) {
          var l = dd[t.key] || t.key;
          if (l !== "Unidentified") return l;
        }
        return t.type === "keypress"
          ? ((t = qu(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
            ? yd[t.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: hi,
      charCode: function (t) {
        return t.type === "keypress" ? qu(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress"
          ? qu(t)
          : t.type === "keydown" || t.type === "keyup"
            ? t.keyCode
            : 0;
      },
    }),
    Sd = Kt(gd),
    bd = R({}, Qu, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    wf = Kt(bd),
    pd = R({}, _a, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: hi,
    }),
    Td = Kt(pd),
    Ed = R({}, be, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Ad = Kt(Ed),
    Od = R({}, Qu, {
      deltaX: function (t) {
        return "deltaX" in t
          ? t.deltaX
          : "wheelDeltaX" in t
            ? -t.wheelDeltaX
            : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t
          ? t.deltaY
          : "wheelDeltaY" in t
            ? -t.wheelDeltaY
            : "wheelDelta" in t
              ? -t.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Md = Kt(Od),
    zd = R({}, be, { newState: 0, oldState: 0 }),
    Dd = Kt(zd),
    _d = [9, 13, 27, 32],
    di = Rl && "CompositionEvent" in window,
    Ra = null;
  Rl && "documentMode" in document && (Ra = document.documentMode);
  var Ud = Rl && "TextEvent" in window && !Ra,
    Jf = Rl && (!di || (Ra && 8 < Ra && 11 >= Ra)),
    kf = " ",
    Wf = !1;
  function $f(t, l) {
    switch (t) {
      case "keyup":
        return _d.indexOf(l.keyCode) !== -1;
      case "keydown":
        return l.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ff(t) {
    return (
      (t = t.detail),
      typeof t == "object" && "data" in t ? t.data : null
    );
  }
  var we = !1;
  function Rd(t, l) {
    switch (t) {
      case "compositionend":
        return Ff(l);
      case "keypress":
        return l.which !== 32 ? null : ((Wf = !0), kf);
      case "textInput":
        return ((t = l.data), t === kf && Wf ? null : t);
      default:
        return null;
    }
  }
  function Nd(t, l) {
    if (we)
      return t === "compositionend" || (!di && $f(t, l))
        ? ((t = Zf()), (xu = fi = Jl = null), (we = !1), t)
        : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(l.ctrlKey || l.altKey || l.metaKey) || (l.ctrlKey && l.altKey)) {
          if (l.char && 1 < l.char.length) return l.char;
          if (l.which) return String.fromCharCode(l.which);
        }
        return null;
      case "compositionend":
        return Jf && l.locale !== "ko" ? null : l.data;
      default:
        return null;
    }
  }
  var xd = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Pf(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return l === "input" ? !!xd[t.type] : l === "textarea";
  }
  function If(t, l, e, a) {
    (Le ? (Ke ? Ke.push(a) : (Ke = [a])) : (Le = a),
      (l = An(l, "onChange")),
      0 < l.length &&
        ((e = new Cu("onChange", "change", null, e, a)),
        t.push({ event: e, listeners: l })));
  }
  var Na = null,
    xa = null;
  function qd(t) {
    Ho(t, 0);
  }
  function ju(t) {
    var l = Ma(t);
    if (Hf(l)) return t;
  }
  function ts(t, l) {
    if (t === "change") return l;
  }
  var ls = !1;
  if (Rl) {
    var yi;
    if (Rl) {
      var vi = "oninput" in document;
      if (!vi) {
        var es = document.createElement("div");
        (es.setAttribute("oninput", "return;"),
          (vi = typeof es.oninput == "function"));
      }
      yi = vi;
    } else yi = !1;
    ls = yi && (!document.documentMode || 9 < document.documentMode);
  }
  function as() {
    Na && (Na.detachEvent("onpropertychange", us), (xa = Na = null));
  }
  function us(t) {
    if (t.propertyName === "value" && ju(xa)) {
      var l = [];
      (If(l, xa, t, ni(t)), Xf(qd, l));
    }
  }
  function Hd(t, l, e) {
    t === "focusin"
      ? (as(), (Na = l), (xa = e), Na.attachEvent("onpropertychange", us))
      : t === "focusout" && as();
  }
  function Cd(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return ju(xa);
  }
  function Qd(t, l) {
    if (t === "click") return ju(l);
  }
  function jd(t, l) {
    if (t === "input" || t === "change") return ju(l);
  }
  function Bd(t, l) {
    return (t === l && (t !== 0 || 1 / t === 1 / l)) || (t !== t && l !== l);
  }
  var tl = typeof Object.is == "function" ? Object.is : Bd;
  function qa(t, l) {
    if (tl(t, l)) return !0;
    if (
      typeof t != "object" ||
      t === null ||
      typeof l != "object" ||
      l === null
    )
      return !1;
    var e = Object.keys(t),
      a = Object.keys(l);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!Ln.call(l, u) || !tl(t[u], l[u])) return !1;
    }
    return !0;
  }
  function ns(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function is(t, l) {
    var e = ns(t);
    t = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (((a = t + e.textContent.length), t <= l && a >= l))
          return { node: e, offset: l - t };
        t = a;
      }
      t: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break t;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = ns(e);
    }
  }
  function cs(t, l) {
    return t && l
      ? t === l
        ? !0
        : t && t.nodeType === 3
          ? !1
          : l && l.nodeType === 3
            ? cs(t, l.parentNode)
            : "contains" in t
              ? t.contains(l)
              : t.compareDocumentPosition
                ? !!(t.compareDocumentPosition(l) & 16)
                : !1
      : !1;
  }
  function fs(t) {
    t =
      t != null &&
      t.ownerDocument != null &&
      t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var l = Ru(t.document); l instanceof t.HTMLIFrameElement; ) {
      try {
        var e = typeof l.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) t = l.contentWindow;
      else break;
      l = Ru(t.document);
    }
    return l;
  }
  function mi(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      l &&
      ((l === "input" &&
        (t.type === "text" ||
          t.type === "search" ||
          t.type === "tel" ||
          t.type === "url" ||
          t.type === "password")) ||
        l === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var Yd = Rl && "documentMode" in document && 11 >= document.documentMode,
    Je = null,
    gi = null,
    Ha = null,
    Si = !1;
  function ss(t, l, e) {
    var a =
      e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Si ||
      Je == null ||
      Je !== Ru(a) ||
      ((a = Je),
      "selectionStart" in a && mi(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = (
            (a.ownerDocument && a.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Ha && qa(Ha, a)) ||
        ((Ha = a),
        (a = An(gi, "onSelect")),
        0 < a.length &&
          ((l = new Cu("onSelect", "select", null, l, e)),
          t.push({ event: l, listeners: a }),
          (l.target = Je))));
  }
  function pe(t, l) {
    var e = {};
    return (
      (e[t.toLowerCase()] = l.toLowerCase()),
      (e["Webkit" + t] = "webkit" + l),
      (e["Moz" + t] = "moz" + l),
      e
    );
  }
  var ke = {
      animationend: pe("Animation", "AnimationEnd"),
      animationiteration: pe("Animation", "AnimationIteration"),
      animationstart: pe("Animation", "AnimationStart"),
      transitionrun: pe("Transition", "TransitionRun"),
      transitionstart: pe("Transition", "TransitionStart"),
      transitioncancel: pe("Transition", "TransitionCancel"),
      transitionend: pe("Transition", "TransitionEnd"),
    },
    bi = {},
    rs = {};
  Rl &&
    ((rs = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete ke.animationend.animation,
      delete ke.animationiteration.animation,
      delete ke.animationstart.animation),
    "TransitionEvent" in window || delete ke.transitionend.transition);
  function Te(t) {
    if (bi[t]) return bi[t];
    if (!ke[t]) return t;
    var l = ke[t],
      e;
    for (e in l) if (l.hasOwnProperty(e) && e in rs) return (bi[t] = l[e]);
    return t;
  }
  var os = Te("animationend"),
    hs = Te("animationiteration"),
    ds = Te("animationstart"),
    Gd = Te("transitionrun"),
    Xd = Te("transitionstart"),
    Zd = Te("transitioncancel"),
    ys = Te("transitionend"),
    vs = new Map(),
    pi =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  pi.push("scrollEnd");
  function ml(t, l) {
    (vs.set(t, l), Se(l, [t]));
  }
  var ms = new WeakMap();
  function sl(t, l) {
    if (typeof t == "object" && t !== null) {
      var e = ms.get(t);
      return e !== void 0
        ? e
        : ((l = { value: t, source: l, stack: xf(l) }), ms.set(t, l), l);
    }
    return { value: t, source: l, stack: xf(l) };
  }
  var rl = [],
    We = 0,
    Ti = 0;
  function Bu() {
    for (var t = We, l = (Ti = We = 0); l < t; ) {
      var e = rl[l];
      rl[l++] = null;
      var a = rl[l];
      rl[l++] = null;
      var u = rl[l];
      rl[l++] = null;
      var n = rl[l];
      if (((rl[l++] = null), a !== null && u !== null)) {
        var c = a.pending;
        (c === null ? (u.next = u) : ((u.next = c.next), (c.next = u)),
          (a.pending = u));
      }
      n !== 0 && gs(e, u, n);
    }
  }
  function Yu(t, l, e, a) {
    ((rl[We++] = t),
      (rl[We++] = l),
      (rl[We++] = e),
      (rl[We++] = a),
      (Ti |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a));
  }
  function Ei(t, l, e, a) {
    return (Yu(t, l, e, a), Gu(t));
  }
  function $e(t, l) {
    return (Yu(t, null, null, l), Gu(t));
  }
  function gs(t, l, e) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = t.return; n !== null; )
      ((n.childLanes |= e),
        (a = n.alternate),
        a !== null && (a.childLanes |= e),
        n.tag === 22 &&
          ((t = n.stateNode), t === null || t._visibility & 1 || (u = !0)),
        (t = n),
        (n = n.return));
    return t.tag === 3
      ? ((n = t.stateNode),
        u &&
          l !== null &&
          ((u = 31 - It(e)),
          (t = n.hiddenUpdates),
          (a = t[u]),
          a === null ? (t[u] = [l]) : a.push(l),
          (l.lane = e | 536870912)),
        n)
      : null;
  }
  function Gu(t) {
    if (50 < nu) throw ((nu = 0), (_c = null), Error(r(185)));
    for (var l = t.return; l !== null; ) ((t = l), (l = t.return));
    return t.tag === 3 ? t.stateNode : null;
  }
  var Fe = {};
  function Vd(t, l, e, a) {
    ((this.tag = t),
      (this.key = e),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = l),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ll(t, l, e, a) {
    return new Vd(t, l, e, a);
  }
  function Ai(t) {
    return ((t = t.prototype), !(!t || !t.isReactComponent));
  }
  function Nl(t, l) {
    var e = t.alternate;
    return (
      e === null
        ? ((e = ll(t.tag, l, t.key, t.mode)),
          (e.elementType = t.elementType),
          (e.type = t.type),
          (e.stateNode = t.stateNode),
          (e.alternate = t),
          (t.alternate = e))
        : ((e.pendingProps = l),
          (e.type = t.type),
          (e.flags = 0),
          (e.subtreeFlags = 0),
          (e.deletions = null)),
      (e.flags = t.flags & 65011712),
      (e.childLanes = t.childLanes),
      (e.lanes = t.lanes),
      (e.child = t.child),
      (e.memoizedProps = t.memoizedProps),
      (e.memoizedState = t.memoizedState),
      (e.updateQueue = t.updateQueue),
      (l = t.dependencies),
      (e.dependencies =
        l === null ? null : { lanes: l.lanes, firstContext: l.firstContext }),
      (e.sibling = t.sibling),
      (e.index = t.index),
      (e.ref = t.ref),
      (e.refCleanup = t.refCleanup),
      e
    );
  }
  function Ss(t, l) {
    t.flags &= 65011714;
    var e = t.alternate;
    return (
      e === null
        ? ((t.childLanes = 0),
          (t.lanes = l),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = e.childLanes),
          (t.lanes = e.lanes),
          (t.child = e.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = e.memoizedProps),
          (t.memoizedState = e.memoizedState),
          (t.updateQueue = e.updateQueue),
          (t.type = e.type),
          (l = e.dependencies),
          (t.dependencies =
            l === null
              ? null
              : { lanes: l.lanes, firstContext: l.firstContext })),
      t
    );
  }
  function Xu(t, l, e, a, u, n) {
    var c = 0;
    if (((a = t), typeof t == "function")) Ai(t) && (c = 1);
    else if (typeof t == "string")
      c = K0(t, e, Q.current)
        ? 26
        : t === "html" || t === "head" || t === "body"
          ? 27
          : 5;
    else
      t: switch (t) {
        case pl:
          return (
            (t = ll(31, e, l, u)),
            (t.elementType = pl),
            (t.lanes = n),
            t
          );
        case et:
          return Ee(e.children, u, n, l);
        case I:
          ((c = 8), (u |= 24));
          break;
        case st:
          return (
            (t = ll(12, e, l, u | 2)),
            (t.elementType = st),
            (t.lanes = n),
            t
          );
        case k:
          return ((t = ll(13, e, l, u)), (t.elementType = k), (t.lanes = n), t);
        case Qt:
          return (
            (t = ll(19, e, l, u)),
            (t.elementType = Qt),
            (t.lanes = n),
            t
          );
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case zt:
              case gt:
                c = 10;
                break t;
              case Nt:
                c = 9;
                break t;
              case Ct:
                c = 11;
                break t;
              case Wt:
                c = 14;
                break t;
              case $t:
                ((c = 16), (a = null));
                break t;
            }
          ((c = 29),
            (e = Error(r(130, t === null ? "null" : typeof t, ""))),
            (a = null));
      }
    return (
      (l = ll(c, e, l, u)),
      (l.elementType = t),
      (l.type = a),
      (l.lanes = n),
      l
    );
  }
  function Ee(t, l, e, a) {
    return ((t = ll(7, t, a, l)), (t.lanes = e), t);
  }
  function Oi(t, l, e) {
    return ((t = ll(6, t, null, l)), (t.lanes = e), t);
  }
  function Mi(t, l, e) {
    return (
      (l = ll(4, t.children !== null ? t.children : [], t.key, l)),
      (l.lanes = e),
      (l.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      l
    );
  }
  var Pe = [],
    Ie = 0,
    Zu = null,
    Vu = 0,
    ol = [],
    hl = 0,
    Ae = null,
    xl = 1,
    ql = "";
  function Oe(t, l) {
    ((Pe[Ie++] = Vu), (Pe[Ie++] = Zu), (Zu = t), (Vu = l));
  }
  function bs(t, l, e) {
    ((ol[hl++] = xl), (ol[hl++] = ql), (ol[hl++] = Ae), (Ae = t));
    var a = xl;
    t = ql;
    var u = 32 - It(a) - 1;
    ((a &= ~(1 << u)), (e += 1));
    var n = 32 - It(l) + u;
    if (30 < n) {
      var c = u - (u % 5);
      ((n = (a & ((1 << c) - 1)).toString(32)),
        (a >>= c),
        (u -= c),
        (xl = (1 << (32 - It(l) + u)) | (e << u) | a),
        (ql = n + t));
    } else ((xl = (1 << n) | (e << u) | a), (ql = t));
  }
  function zi(t) {
    t.return !== null && (Oe(t, 1), bs(t, 1, 0));
  }
  function Di(t) {
    for (; t === Zu; )
      ((Zu = Pe[--Ie]), (Pe[Ie] = null), (Vu = Pe[--Ie]), (Pe[Ie] = null));
    for (; t === Ae; )
      ((Ae = ol[--hl]),
        (ol[hl] = null),
        (ql = ol[--hl]),
        (ol[hl] = null),
        (xl = ol[--hl]),
        (ol[hl] = null));
  }
  var Zt = null,
    St = null,
    at = !1,
    Me = null,
    El = !1,
    _i = Error(r(519));
  function ze(t) {
    var l = Error(r(418, ""));
    throw (ja(sl(l, t)), _i);
  }
  function ps(t) {
    var l = t.stateNode,
      e = t.type,
      a = t.memoizedProps;
    switch (((l[Yt] = t), (l[Lt] = a), e)) {
      case "dialog":
        ($("cancel", l), $("close", l));
        break;
      case "iframe":
      case "object":
      case "embed":
        $("load", l);
        break;
      case "video":
      case "audio":
        for (e = 0; e < cu.length; e++) $(cu[e], l);
        break;
      case "source":
        $("error", l);
        break;
      case "img":
      case "image":
      case "link":
        ($("error", l), $("load", l));
        break;
      case "details":
        $("toggle", l);
        break;
      case "input":
        ($("invalid", l),
          Cf(
            l,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            !0,
          ),
          Uu(l));
        break;
      case "select":
        $("invalid", l);
        break;
      case "textarea":
        ($("invalid", l), jf(l, a.value, a.defaultValue, a.children), Uu(l));
    }
    ((e = a.children),
      (typeof e != "string" && typeof e != "number" && typeof e != "bigint") ||
      l.textContent === "" + e ||
      a.suppressHydrationWarning === !0 ||
      Bo(l.textContent, e)
        ? (a.popover != null && ($("beforetoggle", l), $("toggle", l)),
          a.onScroll != null && $("scroll", l),
          a.onScrollEnd != null && $("scrollend", l),
          a.onClick != null && (l.onclick = On),
          (l = !0))
        : (l = !1),
      l || ze(t));
  }
  function Ts(t) {
    for (Zt = t.return; Zt; )
      switch (Zt.tag) {
        case 5:
        case 13:
          El = !1;
          return;
        case 27:
        case 3:
          El = !0;
          return;
        default:
          Zt = Zt.return;
      }
  }
  function Ca(t) {
    if (t !== Zt) return !1;
    if (!at) return (Ts(t), (at = !0), !1);
    var l = t.tag,
      e;
    if (
      ((e = l !== 3 && l !== 27) &&
        ((e = l === 5) &&
          ((e = t.type),
          (e =
            !(e !== "form" && e !== "button") || Lc(t.type, t.memoizedProps))),
        (e = !e)),
      e && St && ze(t),
      Ts(t),
      l === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(r(317));
      t: {
        for (t = t.nextSibling, l = 0; t; ) {
          if (t.nodeType === 8)
            if (((e = t.data), e === "/$")) {
              if (l === 0) {
                St = Sl(t.nextSibling);
                break t;
              }
              l--;
            } else (e !== "$" && e !== "$!" && e !== "$?") || l++;
          t = t.nextSibling;
        }
        St = null;
      }
    } else
      l === 27
        ? ((l = St), se(t.type) ? ((t = kc), (kc = null), (St = t)) : (St = l))
        : (St = Zt ? Sl(t.stateNode.nextSibling) : null);
    return !0;
  }
  function Qa() {
    ((St = Zt = null), (at = !1));
  }
  function Es() {
    var t = Me;
    return (
      t !== null &&
        (kt === null ? (kt = t) : kt.push.apply(kt, t), (Me = null)),
      t
    );
  }
  function ja(t) {
    Me === null ? (Me = [t]) : Me.push(t);
  }
  var Ui = z(null),
    De = null,
    Hl = null;
  function kl(t, l, e) {
    (N(Ui, l._currentValue), (l._currentValue = e));
  }
  function Cl(t) {
    ((t._currentValue = Ui.current), q(Ui));
  }
  function Ri(t, l, e) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & l) !== l
          ? ((t.childLanes |= l), a !== null && (a.childLanes |= l))
          : a !== null && (a.childLanes & l) !== l && (a.childLanes |= l),
        t === e)
      )
        break;
      t = t.return;
    }
  }
  function Ni(t, l, e, a) {
    var u = t.child;
    for (u !== null && (u.return = t); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var c = u.child;
        n = n.firstContext;
        t: for (; n !== null; ) {
          var f = n;
          n = u;
          for (var o = 0; o < l.length; o++)
            if (f.context === l[o]) {
              ((n.lanes |= e),
                (f = n.alternate),
                f !== null && (f.lanes |= e),
                Ri(n.return, e, t),
                a || (c = null));
              break t;
            }
          n = f.next;
        }
      } else if (u.tag === 18) {
        if (((c = u.return), c === null)) throw Error(r(341));
        ((c.lanes |= e),
          (n = c.alternate),
          n !== null && (n.lanes |= e),
          Ri(c, e, t),
          (c = null));
      } else c = u.child;
      if (c !== null) c.return = u;
      else
        for (c = u; c !== null; ) {
          if (c === t) {
            c = null;
            break;
          }
          if (((u = c.sibling), u !== null)) {
            ((u.return = c.return), (c = u));
            break;
          }
          c = c.return;
        }
      u = c;
    }
  }
  function Ba(t, l, e, a) {
    t = null;
    for (var u = l, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var c = u.alternate;
        if (c === null) throw Error(r(387));
        if (((c = c.memoizedProps), c !== null)) {
          var f = u.type;
          tl(u.pendingProps.value, c.value) ||
            (t !== null ? t.push(f) : (t = [f]));
        }
      } else if (u === Ft.current) {
        if (((c = u.alternate), c === null)) throw Error(r(387));
        c.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
          (t !== null ? t.push(du) : (t = [du]));
      }
      u = u.return;
    }
    (t !== null && Ni(l, t, e, a), (l.flags |= 262144));
  }
  function Lu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!tl(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function _e(t) {
    ((De = t),
      (Hl = null),
      (t = t.dependencies),
      t !== null && (t.firstContext = null));
  }
  function Gt(t) {
    return As(De, t);
  }
  function Ku(t, l) {
    return (De === null && _e(t), As(t, l));
  }
  function As(t, l) {
    var e = l._currentValue;
    if (((l = { context: l, memoizedValue: e, next: null }), Hl === null)) {
      if (t === null) throw Error(r(308));
      ((Hl = l),
        (t.dependencies = { lanes: 0, firstContext: l }),
        (t.flags |= 524288));
    } else Hl = Hl.next = l;
    return e;
  }
  var Ld =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              l = (this.signal = {
                aborted: !1,
                addEventListener: function (e, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              ((l.aborted = !0),
                t.forEach(function (e) {
                  return e();
                }));
            };
          },
    Kd = i.unstable_scheduleCallback,
    wd = i.unstable_NormalPriority,
    Ot = {
      $$typeof: gt,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function xi() {
    return { controller: new Ld(), data: new Map(), refCount: 0 };
  }
  function Ya(t) {
    (t.refCount--,
      t.refCount === 0 &&
        Kd(wd, function () {
          t.controller.abort();
        }));
  }
  var Ga = null,
    qi = 0,
    ta = 0,
    la = null;
  function Jd(t, l) {
    if (Ga === null) {
      var e = (Ga = []);
      ((qi = 0),
        (ta = Cc()),
        (la = {
          status: "pending",
          value: void 0,
          then: function (a) {
            e.push(a);
          },
        }));
    }
    return (qi++, l.then(Os, Os), l);
  }
  function Os() {
    if (--qi === 0 && Ga !== null) {
      la !== null && (la.status = "fulfilled");
      var t = Ga;
      ((Ga = null), (ta = 0), (la = null));
      for (var l = 0; l < t.length; l++) (0, t[l])();
    }
  }
  function kd(t, l) {
    var e = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (u) {
          e.push(u);
        },
      };
    return (
      t.then(
        function () {
          ((a.status = "fulfilled"), (a.value = l));
          for (var u = 0; u < e.length; u++) (0, e[u])(l);
        },
        function (u) {
          for (a.status = "rejected", a.reason = u, u = 0; u < e.length; u++)
            (0, e[u])(void 0);
        },
      ),
      a
    );
  }
  var Ms = T.S;
  T.S = function (t, l) {
    (typeof l == "object" &&
      l !== null &&
      typeof l.then == "function" &&
      Jd(t, l),
      Ms !== null && Ms(t, l));
  };
  var Ue = z(null);
  function Hi() {
    var t = Ue.current;
    return t !== null ? t : ht.pooledCache;
  }
  function wu(t, l) {
    l === null ? N(Ue, Ue.current) : N(Ue, l.pool);
  }
  function zs() {
    var t = Hi();
    return t === null ? null : { parent: Ot._currentValue, pool: t };
  }
  var Xa = Error(r(460)),
    Ds = Error(r(474)),
    Ju = Error(r(542)),
    Ci = { then: function () {} };
  function _s(t) {
    return ((t = t.status), t === "fulfilled" || t === "rejected");
  }
  function ku() {}
  function Us(t, l, e) {
    switch (
      ((e = t[e]),
      e === void 0 ? t.push(l) : e !== l && (l.then(ku, ku), (l = e)),
      l.status)
    ) {
      case "fulfilled":
        return l.value;
      case "rejected":
        throw ((t = l.reason), Ns(t), t);
      default:
        if (typeof l.status == "string") l.then(ku, ku);
        else {
          if (((t = ht), t !== null && 100 < t.shellSuspendCounter))
            throw Error(r(482));
          ((t = l),
            (t.status = "pending"),
            t.then(
              function (a) {
                if (l.status === "pending") {
                  var u = l;
                  ((u.status = "fulfilled"), (u.value = a));
                }
              },
              function (a) {
                if (l.status === "pending") {
                  var u = l;
                  ((u.status = "rejected"), (u.reason = a));
                }
              },
            ));
        }
        switch (l.status) {
          case "fulfilled":
            return l.value;
          case "rejected":
            throw ((t = l.reason), Ns(t), t);
        }
        throw ((Za = l), Xa);
    }
  }
  var Za = null;
  function Rs() {
    if (Za === null) throw Error(r(459));
    var t = Za;
    return ((Za = null), t);
  }
  function Ns(t) {
    if (t === Xa || t === Ju) throw Error(r(483));
  }
  var Wl = !1;
  function Qi(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function ji(t, l) {
    ((t = t.updateQueue),
      l.updateQueue === t &&
        (l.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        }));
  }
  function $l(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Fl(t, l, e) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (ut & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (l.next = l) : ((l.next = u.next), (u.next = l)),
        (a.pending = l),
        (l = Gu(t)),
        gs(t, null, e),
        l
      );
    }
    return (Yu(t, a, l, e), Gu(t));
  }
  function Va(t, l, e) {
    if (
      ((l = l.updateQueue), l !== null && ((l = l.shared), (e & 4194048) !== 0))
    ) {
      var a = l.lanes;
      ((a &= t.pendingLanes), (e |= a), (l.lanes = e), Of(t, e));
    }
  }
  function Bi(t, l) {
    var e = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), e === a)) {
      var u = null,
        n = null;
      if (((e = e.firstBaseUpdate), e !== null)) {
        do {
          var c = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null,
          };
          (n === null ? (u = n = c) : (n = n.next = c), (e = e.next));
        } while (e !== null);
        n === null ? (u = n = l) : (n = n.next = l);
      } else u = n = l;
      ((e = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = e));
      return;
    }
    ((t = e.lastBaseUpdate),
      t === null ? (e.firstBaseUpdate = l) : (t.next = l),
      (e.lastBaseUpdate = l));
  }
  var Yi = !1;
  function La() {
    if (Yi) {
      var t = la;
      if (t !== null) throw t;
    }
  }
  function Ka(t, l, e, a) {
    Yi = !1;
    var u = t.updateQueue;
    Wl = !1;
    var n = u.firstBaseUpdate,
      c = u.lastBaseUpdate,
      f = u.shared.pending;
    if (f !== null) {
      u.shared.pending = null;
      var o = f,
        g = o.next;
      ((o.next = null), c === null ? (n = g) : (c.next = g), (c = o));
      var p = t.alternate;
      p !== null &&
        ((p = p.updateQueue),
        (f = p.lastBaseUpdate),
        f !== c &&
          (f === null ? (p.firstBaseUpdate = g) : (f.next = g),
          (p.lastBaseUpdate = o)));
    }
    if (n !== null) {
      var M = u.baseState;
      ((c = 0), (p = g = o = null), (f = n));
      do {
        var S = f.lane & -536870913,
          b = S !== f.lane;
        if (b ? (P & S) === S : (a & S) === S) {
          (S !== 0 && S === ta && (Yi = !0),
            p !== null &&
              (p = p.next =
                {
                  lane: 0,
                  tag: f.tag,
                  payload: f.payload,
                  callback: null,
                  next: null,
                }));
          t: {
            var X = t,
              j = f;
            S = l;
            var ft = e;
            switch (j.tag) {
              case 1:
                if (((X = j.payload), typeof X == "function")) {
                  M = X.call(ft, M, S);
                  break t;
                }
                M = X;
                break t;
              case 3:
                X.flags = (X.flags & -65537) | 128;
              case 0:
                if (
                  ((X = j.payload),
                  (S = typeof X == "function" ? X.call(ft, M, S) : X),
                  S == null)
                )
                  break t;
                M = R({}, M, S);
                break t;
              case 2:
                Wl = !0;
            }
          }
          ((S = f.callback),
            S !== null &&
              ((t.flags |= 64),
              b && (t.flags |= 8192),
              (b = u.callbacks),
              b === null ? (u.callbacks = [S]) : b.push(S)));
        } else
          ((b = {
            lane: S,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null,
          }),
            p === null ? ((g = p = b), (o = M)) : (p = p.next = b),
            (c |= S));
        if (((f = f.next), f === null)) {
          if (((f = u.shared.pending), f === null)) break;
          ((b = f),
            (f = b.next),
            (b.next = null),
            (u.lastBaseUpdate = b),
            (u.shared.pending = null));
        }
      } while (!0);
      (p === null && (o = M),
        (u.baseState = o),
        (u.firstBaseUpdate = g),
        (u.lastBaseUpdate = p),
        n === null && (u.shared.lanes = 0),
        (ne |= c),
        (t.lanes = c),
        (t.memoizedState = M));
    }
  }
  function xs(t, l) {
    if (typeof t != "function") throw Error(r(191, t));
    t.call(l);
  }
  function qs(t, l) {
    var e = t.callbacks;
    if (e !== null)
      for (t.callbacks = null, t = 0; t < e.length; t++) xs(e[t], l);
  }
  var ea = z(null),
    Wu = z(0);
  function Hs(t, l) {
    ((t = Zl), N(Wu, t), N(ea, l), (Zl = t | l.baseLanes));
  }
  function Gi() {
    (N(Wu, Zl), N(ea, ea.current));
  }
  function Xi() {
    ((Zl = Wu.current), q(ea), q(Wu));
  }
  var Pl = 0,
    K = null,
    it = null,
    Et = null,
    $u = !1,
    aa = !1,
    Re = !1,
    Fu = 0,
    wa = 0,
    ua = null,
    Wd = 0;
  function pt() {
    throw Error(r(321));
  }
  function Zi(t, l) {
    if (l === null) return !1;
    for (var e = 0; e < l.length && e < t.length; e++)
      if (!tl(t[e], l[e])) return !1;
    return !0;
  }
  function Vi(t, l, e, a, u, n) {
    return (
      (Pl = n),
      (K = l),
      (l.memoizedState = null),
      (l.updateQueue = null),
      (l.lanes = 0),
      (T.H = t === null || t.memoizedState === null ? gr : Sr),
      (Re = !1),
      (n = e(a, u)),
      (Re = !1),
      aa && (n = Qs(l, e, a, u)),
      Cs(t),
      n
    );
  }
  function Cs(t) {
    T.H = an;
    var l = it !== null && it.next !== null;
    if (((Pl = 0), (Et = it = K = null), ($u = !1), (wa = 0), (ua = null), l))
      throw Error(r(300));
    t === null ||
      _t ||
      ((t = t.dependencies), t !== null && Lu(t) && (_t = !0));
  }
  function Qs(t, l, e, a) {
    K = t;
    var u = 0;
    do {
      if ((aa && (ua = null), (wa = 0), (aa = !1), 25 <= u))
        throw Error(r(301));
      if (((u += 1), (Et = it = null), t.updateQueue != null)) {
        var n = t.updateQueue;
        ((n.lastEffect = null),
          (n.events = null),
          (n.stores = null),
          n.memoCache != null && (n.memoCache.index = 0));
      }
      ((T.H = e0), (n = l(e, a)));
    } while (aa);
    return n;
  }
  function $d() {
    var t = T.H,
      l = t.useState()[0];
    return (
      (l = typeof l.then == "function" ? Ja(l) : l),
      (t = t.useState()[0]),
      (it !== null ? it.memoizedState : null) !== t && (K.flags |= 1024),
      l
    );
  }
  function Li() {
    var t = Fu !== 0;
    return ((Fu = 0), t);
  }
  function Ki(t, l, e) {
    ((l.updateQueue = t.updateQueue), (l.flags &= -2053), (t.lanes &= ~e));
  }
  function wi(t) {
    if ($u) {
      for (t = t.memoizedState; t !== null; ) {
        var l = t.queue;
        (l !== null && (l.pending = null), (t = t.next));
      }
      $u = !1;
    }
    ((Pl = 0), (Et = it = K = null), (aa = !1), (wa = Fu = 0), (ua = null));
  }
  function wt() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Et === null ? (K.memoizedState = Et = t) : (Et = Et.next = t), Et);
  }
  function At() {
    if (it === null) {
      var t = K.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = it.next;
    var l = Et === null ? K.memoizedState : Et.next;
    if (l !== null) ((Et = l), (it = t));
    else {
      if (t === null)
        throw K.alternate === null ? Error(r(467)) : Error(r(310));
      ((it = t),
        (t = {
          memoizedState: it.memoizedState,
          baseState: it.baseState,
          baseQueue: it.baseQueue,
          queue: it.queue,
          next: null,
        }),
        Et === null ? (K.memoizedState = Et = t) : (Et = Et.next = t));
    }
    return Et;
  }
  function Ji() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ja(t) {
    var l = wa;
    return (
      (wa += 1),
      ua === null && (ua = []),
      (t = Us(ua, t, l)),
      (l = K),
      (Et === null ? l.memoizedState : Et.next) === null &&
        ((l = l.alternate),
        (T.H = l === null || l.memoizedState === null ? gr : Sr)),
      t
    );
  }
  function Pu(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Ja(t);
      if (t.$$typeof === gt) return Gt(t);
    }
    throw Error(r(438, String(t)));
  }
  function ki(t) {
    var l = null,
      e = K.updateQueue;
    if ((e !== null && (l = e.memoCache), l == null)) {
      var a = K.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (l = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (l == null && (l = { data: [], index: 0 }),
      e === null && ((e = Ji()), (K.updateQueue = e)),
      (e.memoCache = l),
      (e = l.data[l.index]),
      e === void 0)
    )
      for (e = l.data[l.index] = Array(t), a = 0; a < t; a++) e[a] = Ce;
    return (l.index++, e);
  }
  function Ql(t, l) {
    return typeof l == "function" ? l(t) : l;
  }
  function Iu(t) {
    var l = At();
    return Wi(l, it, t);
  }
  function Wi(t, l, e) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var u = t.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var c = u.next;
        ((u.next = n.next), (n.next = c));
      }
      ((l.baseQueue = u = n), (a.pending = null));
    }
    if (((n = t.baseState), u === null)) t.memoizedState = n;
    else {
      l = u.next;
      var f = (c = null),
        o = null,
        g = l,
        p = !1;
      do {
        var M = g.lane & -536870913;
        if (M !== g.lane ? (P & M) === M : (Pl & M) === M) {
          var S = g.revertLane;
          if (S === 0)
            (o !== null &&
              (o = o.next =
                {
                  lane: 0,
                  revertLane: 0,
                  action: g.action,
                  hasEagerState: g.hasEagerState,
                  eagerState: g.eagerState,
                  next: null,
                }),
              M === ta && (p = !0));
          else if ((Pl & S) === S) {
            ((g = g.next), S === ta && (p = !0));
            continue;
          } else
            ((M = {
              lane: 0,
              revertLane: g.revertLane,
              action: g.action,
              hasEagerState: g.hasEagerState,
              eagerState: g.eagerState,
              next: null,
            }),
              o === null ? ((f = o = M), (c = n)) : (o = o.next = M),
              (K.lanes |= S),
              (ne |= S));
          ((M = g.action),
            Re && e(n, M),
            (n = g.hasEagerState ? g.eagerState : e(n, M)));
        } else
          ((S = {
            lane: M,
            revertLane: g.revertLane,
            action: g.action,
            hasEagerState: g.hasEagerState,
            eagerState: g.eagerState,
            next: null,
          }),
            o === null ? ((f = o = S), (c = n)) : (o = o.next = S),
            (K.lanes |= M),
            (ne |= M));
        g = g.next;
      } while (g !== null && g !== l);
      if (
        (o === null ? (c = n) : (o.next = f),
        !tl(n, t.memoizedState) && ((_t = !0), p && ((e = la), e !== null)))
      )
        throw e;
      ((t.memoizedState = n),
        (t.baseState = c),
        (t.baseQueue = o),
        (a.lastRenderedState = n));
    }
    return (u === null && (a.lanes = 0), [t.memoizedState, a.dispatch]);
  }
  function $i(t) {
    var l = At(),
      e = l.queue;
    if (e === null) throw Error(r(311));
    e.lastRenderedReducer = t;
    var a = e.dispatch,
      u = e.pending,
      n = l.memoizedState;
    if (u !== null) {
      e.pending = null;
      var c = (u = u.next);
      do ((n = t(n, c.action)), (c = c.next));
      while (c !== u);
      (tl(n, l.memoizedState) || (_t = !0),
        (l.memoizedState = n),
        l.baseQueue === null && (l.baseState = n),
        (e.lastRenderedState = n));
    }
    return [n, a];
  }
  function js(t, l, e) {
    var a = K,
      u = At(),
      n = at;
    if (n) {
      if (e === void 0) throw Error(r(407));
      e = e();
    } else e = l();
    var c = !tl((it || u).memoizedState, e);
    (c && ((u.memoizedState = e), (_t = !0)), (u = u.queue));
    var f = Gs.bind(null, a, u, t);
    if (
      (ka(2048, 8, f, [t]),
      u.getSnapshot !== l || c || (Et !== null && Et.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        na(9, tn(), Ys.bind(null, a, u, e, l), null),
        ht === null)
      )
        throw Error(r(349));
      n || (Pl & 124) !== 0 || Bs(a, l, e);
    }
    return e;
  }
  function Bs(t, l, e) {
    ((t.flags |= 16384),
      (t = { getSnapshot: l, value: e }),
      (l = K.updateQueue),
      l === null
        ? ((l = Ji()), (K.updateQueue = l), (l.stores = [t]))
        : ((e = l.stores), e === null ? (l.stores = [t]) : e.push(t)));
  }
  function Ys(t, l, e, a) {
    ((l.value = e), (l.getSnapshot = a), Xs(l) && Zs(t));
  }
  function Gs(t, l, e) {
    return e(function () {
      Xs(l) && Zs(t);
    });
  }
  function Xs(t) {
    var l = t.getSnapshot;
    t = t.value;
    try {
      var e = l();
      return !tl(t, e);
    } catch {
      return !0;
    }
  }
  function Zs(t) {
    var l = $e(t, 2);
    l !== null && il(l, t, 2);
  }
  function Fi(t) {
    var l = wt();
    if (typeof t == "function") {
      var e = t;
      if (((t = e()), Re)) {
        Kl(!0);
        try {
          e();
        } finally {
          Kl(!1);
        }
      }
    }
    return (
      (l.memoizedState = l.baseState = t),
      (l.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ql,
        lastRenderedState: t,
      }),
      l
    );
  }
  function Vs(t, l, e, a) {
    return ((t.baseState = e), Wi(t, it, typeof a == "function" ? a : Ql));
  }
  function Fd(t, l, e, a, u) {
    if (en(t)) throw Error(r(485));
    if (((t = l.action), t !== null)) {
      var n = {
        payload: u,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (c) {
          n.listeners.push(c);
        },
      };
      (T.T !== null ? e(!0) : (n.isTransition = !1),
        a(n),
        (e = l.pending),
        e === null
          ? ((n.next = l.pending = n), Ls(l, n))
          : ((n.next = e.next), (l.pending = e.next = n)));
    }
  }
  function Ls(t, l) {
    var e = l.action,
      a = l.payload,
      u = t.state;
    if (l.isTransition) {
      var n = T.T,
        c = {};
      T.T = c;
      try {
        var f = e(u, a),
          o = T.S;
        (o !== null && o(c, f), Ks(t, l, f));
      } catch (g) {
        Pi(t, l, g);
      } finally {
        T.T = n;
      }
    } else
      try {
        ((n = e(u, a)), Ks(t, l, n));
      } catch (g) {
        Pi(t, l, g);
      }
  }
  function Ks(t, l, e) {
    e !== null && typeof e == "object" && typeof e.then == "function"
      ? e.then(
          function (a) {
            ws(t, l, a);
          },
          function (a) {
            return Pi(t, l, a);
          },
        )
      : ws(t, l, e);
  }
  function ws(t, l, e) {
    ((l.status = "fulfilled"),
      (l.value = e),
      Js(l),
      (t.state = e),
      (l = t.pending),
      l !== null &&
        ((e = l.next),
        e === l ? (t.pending = null) : ((e = e.next), (l.next = e), Ls(t, e))));
  }
  function Pi(t, l, e) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do ((l.status = "rejected"), (l.reason = e), Js(l), (l = l.next));
      while (l !== a);
    }
    t.action = null;
  }
  function Js(t) {
    t = t.listeners;
    for (var l = 0; l < t.length; l++) (0, t[l])();
  }
  function ks(t, l) {
    return l;
  }
  function Ws(t, l) {
    if (at) {
      var e = ht.formState;
      if (e !== null) {
        t: {
          var a = K;
          if (at) {
            if (St) {
              l: {
                for (var u = St, n = El; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break l;
                  }
                  if (((u = Sl(u.nextSibling)), u === null)) {
                    u = null;
                    break l;
                  }
                }
                ((n = u.data), (u = n === "F!" || n === "F" ? u : null));
              }
              if (u) {
                ((St = Sl(u.nextSibling)), (a = u.data === "F!"));
                break t;
              }
            }
            ze(a);
          }
          a = !1;
        }
        a && (l = e[0]);
      }
    }
    return (
      (e = wt()),
      (e.memoizedState = e.baseState = l),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ks,
        lastRenderedState: l,
      }),
      (e.queue = a),
      (e = yr.bind(null, K, a)),
      (a.dispatch = e),
      (a = Fi(!1)),
      (n = ac.bind(null, K, !1, a.queue)),
      (a = wt()),
      (u = { state: l, dispatch: null, action: t, pending: null }),
      (a.queue = u),
      (e = Fd.bind(null, K, u, n, e)),
      (u.dispatch = e),
      (a.memoizedState = t),
      [l, e, !1]
    );
  }
  function $s(t) {
    var l = At();
    return Fs(l, it, t);
  }
  function Fs(t, l, e) {
    if (
      ((l = Wi(t, l, ks)[0]),
      (t = Iu(Ql)[0]),
      typeof l == "object" && l !== null && typeof l.then == "function")
    )
      try {
        var a = Ja(l);
      } catch (c) {
        throw c === Xa ? Ju : c;
      }
    else a = l;
    l = At();
    var u = l.queue,
      n = u.dispatch;
    return (
      e !== l.memoizedState &&
        ((K.flags |= 2048), na(9, tn(), Pd.bind(null, u, e), null)),
      [a, n, t]
    );
  }
  function Pd(t, l) {
    t.action = l;
  }
  function Ps(t) {
    var l = At(),
      e = it;
    if (e !== null) return Fs(l, e, t);
    (At(), (l = l.memoizedState), (e = At()));
    var a = e.queue.dispatch;
    return ((e.memoizedState = t), [l, a, !1]);
  }
  function na(t, l, e, a) {
    return (
      (t = { tag: t, create: e, deps: a, inst: l, next: null }),
      (l = K.updateQueue),
      l === null && ((l = Ji()), (K.updateQueue = l)),
      (e = l.lastEffect),
      e === null
        ? (l.lastEffect = t.next = t)
        : ((a = e.next), (e.next = t), (t.next = a), (l.lastEffect = t)),
      t
    );
  }
  function tn() {
    return { destroy: void 0, resource: void 0 };
  }
  function Is() {
    return At().memoizedState;
  }
  function ln(t, l, e, a) {
    var u = wt();
    ((a = a === void 0 ? null : a),
      (K.flags |= t),
      (u.memoizedState = na(1 | l, tn(), e, a)));
  }
  function ka(t, l, e, a) {
    var u = At();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    it !== null && a !== null && Zi(a, it.memoizedState.deps)
      ? (u.memoizedState = na(l, n, e, a))
      : ((K.flags |= t), (u.memoizedState = na(1 | l, n, e, a)));
  }
  function tr(t, l) {
    ln(8390656, 8, t, l);
  }
  function lr(t, l) {
    ka(2048, 8, t, l);
  }
  function er(t, l) {
    return ka(4, 2, t, l);
  }
  function ar(t, l) {
    return ka(4, 4, t, l);
  }
  function ur(t, l) {
    if (typeof l == "function") {
      t = t();
      var e = l(t);
      return function () {
        typeof e == "function" ? e() : l(null);
      };
    }
    if (l != null)
      return (
        (t = t()),
        (l.current = t),
        function () {
          l.current = null;
        }
      );
  }
  function nr(t, l, e) {
    ((e = e != null ? e.concat([t]) : null), ka(4, 4, ur.bind(null, l, t), e));
  }
  function Ii() {}
  function ir(t, l) {
    var e = At();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    return l !== null && Zi(l, a[1]) ? a[0] : ((e.memoizedState = [t, l]), t);
  }
  function cr(t, l) {
    var e = At();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    if (l !== null && Zi(l, a[1])) return a[0];
    if (((a = t()), Re)) {
      Kl(!0);
      try {
        t();
      } finally {
        Kl(!1);
      }
    }
    return ((e.memoizedState = [a, l]), a);
  }
  function tc(t, l, e) {
    return e === void 0 || (Pl & 1073741824) !== 0
      ? (t.memoizedState = l)
      : ((t.memoizedState = e), (t = ro()), (K.lanes |= t), (ne |= t), e);
  }
  function fr(t, l, e, a) {
    return tl(e, l)
      ? e
      : ea.current !== null
        ? ((t = tc(t, e, a)), tl(t, l) || (_t = !0), t)
        : (Pl & 42) === 0
          ? ((_t = !0), (t.memoizedState = e))
          : ((t = ro()), (K.lanes |= t), (ne |= t), l);
  }
  function sr(t, l, e, a, u) {
    var n = x.p;
    x.p = n !== 0 && 8 > n ? n : 8;
    var c = T.T,
      f = {};
    ((T.T = f), ac(t, !1, l, e));
    try {
      var o = u(),
        g = T.S;
      if (
        (g !== null && g(f, o),
        o !== null && typeof o == "object" && typeof o.then == "function")
      ) {
        var p = kd(o, a);
        Wa(t, l, p, nl(t));
      } else Wa(t, l, a, nl(t));
    } catch (M) {
      Wa(t, l, { then: function () {}, status: "rejected", reason: M }, nl());
    } finally {
      ((x.p = n), (T.T = c));
    }
  }
  function Id() {}
  function lc(t, l, e, a) {
    if (t.tag !== 5) throw Error(r(476));
    var u = rr(t).queue;
    sr(
      t,
      u,
      l,
      G,
      e === null
        ? Id
        : function () {
            return (or(t), e(a));
          },
    );
  }
  function rr(t) {
    var l = t.memoizedState;
    if (l !== null) return l;
    l = {
      memoizedState: G,
      baseState: G,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ql,
        lastRenderedState: G,
      },
      next: null,
    };
    var e = {};
    return (
      (l.next = {
        memoizedState: e,
        baseState: e,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Ql,
          lastRenderedState: e,
        },
        next: null,
      }),
      (t.memoizedState = l),
      (t = t.alternate),
      t !== null && (t.memoizedState = l),
      l
    );
  }
  function or(t) {
    var l = rr(t).next.queue;
    Wa(t, l, {}, nl());
  }
  function ec() {
    return Gt(du);
  }
  function hr() {
    return At().memoizedState;
  }
  function dr() {
    return At().memoizedState;
  }
  function t0(t) {
    for (var l = t.return; l !== null; ) {
      switch (l.tag) {
        case 24:
        case 3:
          var e = nl();
          t = $l(e);
          var a = Fl(l, t, e);
          (a !== null && (il(a, l, e), Va(a, l, e)),
            (l = { cache: xi() }),
            (t.payload = l));
          return;
      }
      l = l.return;
    }
  }
  function l0(t, l, e) {
    var a = nl();
    ((e = {
      lane: a,
      revertLane: 0,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      en(t)
        ? vr(l, e)
        : ((e = Ei(t, l, e, a)), e !== null && (il(e, t, a), mr(e, l, a))));
  }
  function yr(t, l, e) {
    var a = nl();
    Wa(t, l, e, a);
  }
  function Wa(t, l, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (en(t)) vr(l, u);
    else {
      var n = t.alternate;
      if (
        t.lanes === 0 &&
        (n === null || n.lanes === 0) &&
        ((n = l.lastRenderedReducer), n !== null)
      )
        try {
          var c = l.lastRenderedState,
            f = n(c, e);
          if (((u.hasEagerState = !0), (u.eagerState = f), tl(f, c)))
            return (Yu(t, l, u, 0), ht === null && Bu(), !1);
        } catch {
        } finally {
        }
      if (((e = Ei(t, l, u, a)), e !== null))
        return (il(e, t, a), mr(e, l, a), !0);
    }
    return !1;
  }
  function ac(t, l, e, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Cc(),
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      en(t))
    ) {
      if (l) throw Error(r(479));
    } else ((l = Ei(t, e, a, 2)), l !== null && il(l, t, 2));
  }
  function en(t) {
    var l = t.alternate;
    return t === K || (l !== null && l === K);
  }
  function vr(t, l) {
    aa = $u = !0;
    var e = t.pending;
    (e === null ? (l.next = l) : ((l.next = e.next), (e.next = l)),
      (t.pending = l));
  }
  function mr(t, l, e) {
    if ((e & 4194048) !== 0) {
      var a = l.lanes;
      ((a &= t.pendingLanes), (e |= a), (l.lanes = e), Of(t, e));
    }
  }
  var an = {
      readContext: Gt,
      use: Pu,
      useCallback: pt,
      useContext: pt,
      useEffect: pt,
      useImperativeHandle: pt,
      useLayoutEffect: pt,
      useInsertionEffect: pt,
      useMemo: pt,
      useReducer: pt,
      useRef: pt,
      useState: pt,
      useDebugValue: pt,
      useDeferredValue: pt,
      useTransition: pt,
      useSyncExternalStore: pt,
      useId: pt,
      useHostTransitionStatus: pt,
      useFormState: pt,
      useActionState: pt,
      useOptimistic: pt,
      useMemoCache: pt,
      useCacheRefresh: pt,
    },
    gr = {
      readContext: Gt,
      use: Pu,
      useCallback: function (t, l) {
        return ((wt().memoizedState = [t, l === void 0 ? null : l]), t);
      },
      useContext: Gt,
      useEffect: tr,
      useImperativeHandle: function (t, l, e) {
        ((e = e != null ? e.concat([t]) : null),
          ln(4194308, 4, ur.bind(null, l, t), e));
      },
      useLayoutEffect: function (t, l) {
        return ln(4194308, 4, t, l);
      },
      useInsertionEffect: function (t, l) {
        ln(4, 2, t, l);
      },
      useMemo: function (t, l) {
        var e = wt();
        l = l === void 0 ? null : l;
        var a = t();
        if (Re) {
          Kl(!0);
          try {
            t();
          } finally {
            Kl(!1);
          }
        }
        return ((e.memoizedState = [a, l]), a);
      },
      useReducer: function (t, l, e) {
        var a = wt();
        if (e !== void 0) {
          var u = e(l);
          if (Re) {
            Kl(!0);
            try {
              e(l);
            } finally {
              Kl(!1);
            }
          }
        } else u = l;
        return (
          (a.memoizedState = a.baseState = u),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: u,
          }),
          (a.queue = t),
          (t = t.dispatch = l0.bind(null, K, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var l = wt();
        return ((t = { current: t }), (l.memoizedState = t));
      },
      useState: function (t) {
        t = Fi(t);
        var l = t.queue,
          e = yr.bind(null, K, l);
        return ((l.dispatch = e), [t.memoizedState, e]);
      },
      useDebugValue: Ii,
      useDeferredValue: function (t, l) {
        var e = wt();
        return tc(e, t, l);
      },
      useTransition: function () {
        var t = Fi(!1);
        return (
          (t = sr.bind(null, K, t.queue, !0, !1)),
          (wt().memoizedState = t),
          [!1, t]
        );
      },
      useSyncExternalStore: function (t, l, e) {
        var a = K,
          u = wt();
        if (at) {
          if (e === void 0) throw Error(r(407));
          e = e();
        } else {
          if (((e = l()), ht === null)) throw Error(r(349));
          (P & 124) !== 0 || Bs(a, l, e);
        }
        u.memoizedState = e;
        var n = { value: e, getSnapshot: l };
        return (
          (u.queue = n),
          tr(Gs.bind(null, a, n, t), [t]),
          (a.flags |= 2048),
          na(9, tn(), Ys.bind(null, a, n, e, l), null),
          e
        );
      },
      useId: function () {
        var t = wt(),
          l = ht.identifierPrefix;
        if (at) {
          var e = ql,
            a = xl;
          ((e = (a & ~(1 << (32 - It(a) - 1))).toString(32) + e),
            (l = "«" + l + "R" + e),
            (e = Fu++),
            0 < e && (l += "H" + e.toString(32)),
            (l += "»"));
        } else ((e = Wd++), (l = "«" + l + "r" + e.toString(32) + "»"));
        return (t.memoizedState = l);
      },
      useHostTransitionStatus: ec,
      useFormState: Ws,
      useActionState: Ws,
      useOptimistic: function (t) {
        var l = wt();
        l.memoizedState = l.baseState = t;
        var e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (l.queue = e),
          (l = ac.bind(null, K, !0, e)),
          (e.dispatch = l),
          [t, l]
        );
      },
      useMemoCache: ki,
      useCacheRefresh: function () {
        return (wt().memoizedState = t0.bind(null, K));
      },
    },
    Sr = {
      readContext: Gt,
      use: Pu,
      useCallback: ir,
      useContext: Gt,
      useEffect: lr,
      useImperativeHandle: nr,
      useInsertionEffect: er,
      useLayoutEffect: ar,
      useMemo: cr,
      useReducer: Iu,
      useRef: Is,
      useState: function () {
        return Iu(Ql);
      },
      useDebugValue: Ii,
      useDeferredValue: function (t, l) {
        var e = At();
        return fr(e, it.memoizedState, t, l);
      },
      useTransition: function () {
        var t = Iu(Ql)[0],
          l = At().memoizedState;
        return [typeof t == "boolean" ? t : Ja(t), l];
      },
      useSyncExternalStore: js,
      useId: hr,
      useHostTransitionStatus: ec,
      useFormState: $s,
      useActionState: $s,
      useOptimistic: function (t, l) {
        var e = At();
        return Vs(e, it, t, l);
      },
      useMemoCache: ki,
      useCacheRefresh: dr,
    },
    e0 = {
      readContext: Gt,
      use: Pu,
      useCallback: ir,
      useContext: Gt,
      useEffect: lr,
      useImperativeHandle: nr,
      useInsertionEffect: er,
      useLayoutEffect: ar,
      useMemo: cr,
      useReducer: $i,
      useRef: Is,
      useState: function () {
        return $i(Ql);
      },
      useDebugValue: Ii,
      useDeferredValue: function (t, l) {
        var e = At();
        return it === null ? tc(e, t, l) : fr(e, it.memoizedState, t, l);
      },
      useTransition: function () {
        var t = $i(Ql)[0],
          l = At().memoizedState;
        return [typeof t == "boolean" ? t : Ja(t), l];
      },
      useSyncExternalStore: js,
      useId: hr,
      useHostTransitionStatus: ec,
      useFormState: Ps,
      useActionState: Ps,
      useOptimistic: function (t, l) {
        var e = At();
        return it !== null
          ? Vs(e, it, t, l)
          : ((e.baseState = t), [t, e.queue.dispatch]);
      },
      useMemoCache: ki,
      useCacheRefresh: dr,
    },
    ia = null,
    $a = 0;
  function un(t) {
    var l = $a;
    return (($a += 1), ia === null && (ia = []), Us(ia, t, l));
  }
  function Fa(t, l) {
    ((l = l.props.ref), (t.ref = l !== void 0 ? l : null));
  }
  function nn(t, l) {
    throw l.$$typeof === F
      ? Error(r(525))
      : ((t = Object.prototype.toString.call(l)),
        Error(
          r(
            31,
            t === "[object Object]"
              ? "object with keys {" + Object.keys(l).join(", ") + "}"
              : t,
          ),
        ));
  }
  function br(t) {
    var l = t._init;
    return l(t._payload);
  }
  function pr(t) {
    function l(v, d) {
      if (t) {
        var m = v.deletions;
        m === null ? ((v.deletions = [d]), (v.flags |= 16)) : m.push(d);
      }
    }
    function e(v, d) {
      if (!t) return null;
      for (; d !== null; ) (l(v, d), (d = d.sibling));
      return null;
    }
    function a(v) {
      for (var d = new Map(); v !== null; )
        (v.key !== null ? d.set(v.key, v) : d.set(v.index, v), (v = v.sibling));
      return d;
    }
    function u(v, d) {
      return ((v = Nl(v, d)), (v.index = 0), (v.sibling = null), v);
    }
    function n(v, d, m) {
      return (
        (v.index = m),
        t
          ? ((m = v.alternate),
            m !== null
              ? ((m = m.index), m < d ? ((v.flags |= 67108866), d) : m)
              : ((v.flags |= 67108866), d))
          : ((v.flags |= 1048576), d)
      );
    }
    function c(v) {
      return (t && v.alternate === null && (v.flags |= 67108866), v);
    }
    function f(v, d, m, O) {
      return d === null || d.tag !== 6
        ? ((d = Oi(m, v.mode, O)), (d.return = v), d)
        : ((d = u(d, m)), (d.return = v), d);
    }
    function o(v, d, m, O) {
      var H = m.type;
      return H === et
        ? p(v, d, m.props.children, O, m.key)
        : d !== null &&
            (d.elementType === H ||
              (typeof H == "object" &&
                H !== null &&
                H.$$typeof === $t &&
                br(H) === d.type))
          ? ((d = u(d, m.props)), Fa(d, m), (d.return = v), d)
          : ((d = Xu(m.type, m.key, m.props, null, v.mode, O)),
            Fa(d, m),
            (d.return = v),
            d);
    }
    function g(v, d, m, O) {
      return d === null ||
        d.tag !== 4 ||
        d.stateNode.containerInfo !== m.containerInfo ||
        d.stateNode.implementation !== m.implementation
        ? ((d = Mi(m, v.mode, O)), (d.return = v), d)
        : ((d = u(d, m.children || [])), (d.return = v), d);
    }
    function p(v, d, m, O, H) {
      return d === null || d.tag !== 7
        ? ((d = Ee(m, v.mode, O, H)), (d.return = v), d)
        : ((d = u(d, m)), (d.return = v), d);
    }
    function M(v, d, m) {
      if (
        (typeof d == "string" && d !== "") ||
        typeof d == "number" ||
        typeof d == "bigint"
      )
        return ((d = Oi("" + d, v.mode, m)), (d.return = v), d);
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case w:
            return (
              (m = Xu(d.type, d.key, d.props, null, v.mode, m)),
              Fa(m, d),
              (m.return = v),
              m
            );
          case dt:
            return ((d = Mi(d, v.mode, m)), (d.return = v), d);
          case $t:
            var O = d._init;
            return ((d = O(d._payload)), M(v, d, m));
        }
        if (Bt(d) || jt(d))
          return ((d = Ee(d, v.mode, m, null)), (d.return = v), d);
        if (typeof d.then == "function") return M(v, un(d), m);
        if (d.$$typeof === gt) return M(v, Ku(v, d), m);
        nn(v, d);
      }
      return null;
    }
    function S(v, d, m, O) {
      var H = d !== null ? d.key : null;
      if (
        (typeof m == "string" && m !== "") ||
        typeof m == "number" ||
        typeof m == "bigint"
      )
        return H !== null ? null : f(v, d, "" + m, O);
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case w:
            return m.key === H ? o(v, d, m, O) : null;
          case dt:
            return m.key === H ? g(v, d, m, O) : null;
          case $t:
            return ((H = m._init), (m = H(m._payload)), S(v, d, m, O));
        }
        if (Bt(m) || jt(m)) return H !== null ? null : p(v, d, m, O, null);
        if (typeof m.then == "function") return S(v, d, un(m), O);
        if (m.$$typeof === gt) return S(v, d, Ku(v, m), O);
        nn(v, m);
      }
      return null;
    }
    function b(v, d, m, O, H) {
      if (
        (typeof O == "string" && O !== "") ||
        typeof O == "number" ||
        typeof O == "bigint"
      )
        return ((v = v.get(m) || null), f(d, v, "" + O, H));
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case w:
            return (
              (v = v.get(O.key === null ? m : O.key) || null),
              o(d, v, O, H)
            );
          case dt:
            return (
              (v = v.get(O.key === null ? m : O.key) || null),
              g(d, v, O, H)
            );
          case $t:
            var J = O._init;
            return ((O = J(O._payload)), b(v, d, m, O, H));
        }
        if (Bt(O) || jt(O))
          return ((v = v.get(m) || null), p(d, v, O, H, null));
        if (typeof O.then == "function") return b(v, d, m, un(O), H);
        if (O.$$typeof === gt) return b(v, d, m, Ku(d, O), H);
        nn(d, O);
      }
      return null;
    }
    function X(v, d, m, O) {
      for (
        var H = null, J = null, C = d, B = (d = 0), Rt = null;
        C !== null && B < m.length;
        B++
      ) {
        C.index > B ? ((Rt = C), (C = null)) : (Rt = C.sibling);
        var lt = S(v, C, m[B], O);
        if (lt === null) {
          C === null && (C = Rt);
          break;
        }
        (t && C && lt.alternate === null && l(v, C),
          (d = n(lt, d, B)),
          J === null ? (H = lt) : (J.sibling = lt),
          (J = lt),
          (C = Rt));
      }
      if (B === m.length) return (e(v, C), at && Oe(v, B), H);
      if (C === null) {
        for (; B < m.length; B++)
          ((C = M(v, m[B], O)),
            C !== null &&
              ((d = n(C, d, B)),
              J === null ? (H = C) : (J.sibling = C),
              (J = C)));
        return (at && Oe(v, B), H);
      }
      for (C = a(C); B < m.length; B++)
        ((Rt = b(C, v, B, m[B], O)),
          Rt !== null &&
            (t &&
              Rt.alternate !== null &&
              C.delete(Rt.key === null ? B : Rt.key),
            (d = n(Rt, d, B)),
            J === null ? (H = Rt) : (J.sibling = Rt),
            (J = Rt)));
      return (
        t &&
          C.forEach(function (ye) {
            return l(v, ye);
          }),
        at && Oe(v, B),
        H
      );
    }
    function j(v, d, m, O) {
      if (m == null) throw Error(r(151));
      for (
        var H = null, J = null, C = d, B = (d = 0), Rt = null, lt = m.next();
        C !== null && !lt.done;
        B++, lt = m.next()
      ) {
        C.index > B ? ((Rt = C), (C = null)) : (Rt = C.sibling);
        var ye = S(v, C, lt.value, O);
        if (ye === null) {
          C === null && (C = Rt);
          break;
        }
        (t && C && ye.alternate === null && l(v, C),
          (d = n(ye, d, B)),
          J === null ? (H = ye) : (J.sibling = ye),
          (J = ye),
          (C = Rt));
      }
      if (lt.done) return (e(v, C), at && Oe(v, B), H);
      if (C === null) {
        for (; !lt.done; B++, lt = m.next())
          ((lt = M(v, lt.value, O)),
            lt !== null &&
              ((d = n(lt, d, B)),
              J === null ? (H = lt) : (J.sibling = lt),
              (J = lt)));
        return (at && Oe(v, B), H);
      }
      for (C = a(C); !lt.done; B++, lt = m.next())
        ((lt = b(C, v, B, lt.value, O)),
          lt !== null &&
            (t &&
              lt.alternate !== null &&
              C.delete(lt.key === null ? B : lt.key),
            (d = n(lt, d, B)),
            J === null ? (H = lt) : (J.sibling = lt),
            (J = lt)));
      return (
        t &&
          C.forEach(function (ay) {
            return l(v, ay);
          }),
        at && Oe(v, B),
        H
      );
    }
    function ft(v, d, m, O) {
      if (
        (typeof m == "object" &&
          m !== null &&
          m.type === et &&
          m.key === null &&
          (m = m.props.children),
        typeof m == "object" && m !== null)
      ) {
        switch (m.$$typeof) {
          case w:
            t: {
              for (var H = m.key; d !== null; ) {
                if (d.key === H) {
                  if (((H = m.type), H === et)) {
                    if (d.tag === 7) {
                      (e(v, d.sibling),
                        (O = u(d, m.props.children)),
                        (O.return = v),
                        (v = O));
                      break t;
                    }
                  } else if (
                    d.elementType === H ||
                    (typeof H == "object" &&
                      H !== null &&
                      H.$$typeof === $t &&
                      br(H) === d.type)
                  ) {
                    (e(v, d.sibling),
                      (O = u(d, m.props)),
                      Fa(O, m),
                      (O.return = v),
                      (v = O));
                    break t;
                  }
                  e(v, d);
                  break;
                } else l(v, d);
                d = d.sibling;
              }
              m.type === et
                ? ((O = Ee(m.props.children, v.mode, O, m.key)),
                  (O.return = v),
                  (v = O))
                : ((O = Xu(m.type, m.key, m.props, null, v.mode, O)),
                  Fa(O, m),
                  (O.return = v),
                  (v = O));
            }
            return c(v);
          case dt:
            t: {
              for (H = m.key; d !== null; ) {
                if (d.key === H)
                  if (
                    d.tag === 4 &&
                    d.stateNode.containerInfo === m.containerInfo &&
                    d.stateNode.implementation === m.implementation
                  ) {
                    (e(v, d.sibling),
                      (O = u(d, m.children || [])),
                      (O.return = v),
                      (v = O));
                    break t;
                  } else {
                    e(v, d);
                    break;
                  }
                else l(v, d);
                d = d.sibling;
              }
              ((O = Mi(m, v.mode, O)), (O.return = v), (v = O));
            }
            return c(v);
          case $t:
            return ((H = m._init), (m = H(m._payload)), ft(v, d, m, O));
        }
        if (Bt(m)) return X(v, d, m, O);
        if (jt(m)) {
          if (((H = jt(m)), typeof H != "function")) throw Error(r(150));
          return ((m = H.call(m)), j(v, d, m, O));
        }
        if (typeof m.then == "function") return ft(v, d, un(m), O);
        if (m.$$typeof === gt) return ft(v, d, Ku(v, m), O);
        nn(v, m);
      }
      return (typeof m == "string" && m !== "") ||
        typeof m == "number" ||
        typeof m == "bigint"
        ? ((m = "" + m),
          d !== null && d.tag === 6
            ? (e(v, d.sibling), (O = u(d, m)), (O.return = v), (v = O))
            : (e(v, d), (O = Oi(m, v.mode, O)), (O.return = v), (v = O)),
          c(v))
        : e(v, d);
    }
    return function (v, d, m, O) {
      try {
        $a = 0;
        var H = ft(v, d, m, O);
        return ((ia = null), H);
      } catch (C) {
        if (C === Xa || C === Ju) throw C;
        var J = ll(29, C, null, v.mode);
        return ((J.lanes = O), (J.return = v), J);
      } finally {
      }
    };
  }
  var ca = pr(!0),
    Tr = pr(!1),
    dl = z(null),
    Al = null;
  function Il(t) {
    var l = t.alternate;
    (N(Mt, Mt.current & 1),
      N(dl, t),
      Al === null &&
        (l === null || ea.current !== null || l.memoizedState !== null) &&
        (Al = t));
  }
  function Er(t) {
    if (t.tag === 22) {
      if ((N(Mt, Mt.current), N(dl, t), Al === null)) {
        var l = t.alternate;
        l !== null && l.memoizedState !== null && (Al = t);
      }
    } else te();
  }
  function te() {
    (N(Mt, Mt.current), N(dl, dl.current));
  }
  function jl(t) {
    (q(dl), Al === t && (Al = null), q(Mt));
  }
  var Mt = z(0);
  function cn(t) {
    for (var l = t; l !== null; ) {
      if (l.tag === 13) {
        var e = l.memoizedState;
        if (
          e !== null &&
          ((e = e.dehydrated), e === null || e.data === "$?" || Jc(e))
        )
          return l;
      } else if (l.tag === 19 && l.memoizedProps.revealOrder !== void 0) {
        if ((l.flags & 128) !== 0) return l;
      } else if (l.child !== null) {
        ((l.child.return = l), (l = l.child));
        continue;
      }
      if (l === t) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === t) return null;
        l = l.return;
      }
      ((l.sibling.return = l.return), (l = l.sibling));
    }
    return null;
  }
  function uc(t, l, e, a) {
    ((l = t.memoizedState),
      (e = e(a, l)),
      (e = e == null ? l : R({}, l, e)),
      (t.memoizedState = e),
      t.lanes === 0 && (t.updateQueue.baseState = e));
  }
  var nc = {
    enqueueSetState: function (t, l, e) {
      t = t._reactInternals;
      var a = nl(),
        u = $l(a);
      ((u.payload = l),
        e != null && (u.callback = e),
        (l = Fl(t, u, a)),
        l !== null && (il(l, t, a), Va(l, t, a)));
    },
    enqueueReplaceState: function (t, l, e) {
      t = t._reactInternals;
      var a = nl(),
        u = $l(a);
      ((u.tag = 1),
        (u.payload = l),
        e != null && (u.callback = e),
        (l = Fl(t, u, a)),
        l !== null && (il(l, t, a), Va(l, t, a)));
    },
    enqueueForceUpdate: function (t, l) {
      t = t._reactInternals;
      var e = nl(),
        a = $l(e);
      ((a.tag = 2),
        l != null && (a.callback = l),
        (l = Fl(t, a, e)),
        l !== null && (il(l, t, e), Va(l, t, e)));
    },
  };
  function Ar(t, l, e, a, u, n, c) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(a, n, c)
        : l.prototype && l.prototype.isPureReactComponent
          ? !qa(e, a) || !qa(u, n)
          : !0
    );
  }
  function Or(t, l, e, a) {
    ((t = l.state),
      typeof l.componentWillReceiveProps == "function" &&
        l.componentWillReceiveProps(e, a),
      typeof l.UNSAFE_componentWillReceiveProps == "function" &&
        l.UNSAFE_componentWillReceiveProps(e, a),
      l.state !== t && nc.enqueueReplaceState(l, l.state, null));
  }
  function Ne(t, l) {
    var e = l;
    if ("ref" in l) {
      e = {};
      for (var a in l) a !== "ref" && (e[a] = l[a]);
    }
    if ((t = t.defaultProps)) {
      e === l && (e = R({}, e));
      for (var u in t) e[u] === void 0 && (e[u] = t[u]);
    }
    return e;
  }
  var fn =
    typeof reportError == "function"
      ? reportError
      : function (t) {
          if (
            typeof window == "object" &&
            typeof window.ErrorEvent == "function"
          ) {
            var l = new window.ErrorEvent("error", {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof t == "object" &&
                t !== null &&
                typeof t.message == "string"
                  ? String(t.message)
                  : String(t),
              error: t,
            });
            if (!window.dispatchEvent(l)) return;
          } else if (
            typeof process == "object" &&
            typeof process.emit == "function"
          ) {
            process.emit("uncaughtException", t);
            return;
          }
          console.error(t);
        };
  function Mr(t) {
    fn(t);
  }
  function zr(t) {
    console.error(t);
  }
  function Dr(t) {
    fn(t);
  }
  function sn(t, l) {
    try {
      var e = t.onUncaughtError;
      e(l.value, { componentStack: l.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function _r(t, l, e) {
    try {
      var a = t.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: l.tag === 1 ? l.stateNode : null,
      });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function ic(t, l, e) {
    return (
      (e = $l(e)),
      (e.tag = 3),
      (e.payload = { element: null }),
      (e.callback = function () {
        sn(t, l);
      }),
      e
    );
  }
  function Ur(t) {
    return ((t = $l(t)), (t.tag = 3), t);
  }
  function Rr(t, l, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var n = a.value;
      ((t.payload = function () {
        return u(n);
      }),
        (t.callback = function () {
          _r(l, e, a);
        }));
    }
    var c = e.stateNode;
    c !== null &&
      typeof c.componentDidCatch == "function" &&
      (t.callback = function () {
        (_r(l, e, a),
          typeof u != "function" &&
            (ie === null ? (ie = new Set([this])) : ie.add(this)));
        var f = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: f !== null ? f : "",
        });
      });
  }
  function a0(t, l, e, a, u) {
    if (
      ((e.flags |= 32768),
      a !== null && typeof a == "object" && typeof a.then == "function")
    ) {
      if (
        ((l = e.alternate),
        l !== null && Ba(l, e, u, !0),
        (e = dl.current),
        e !== null)
      ) {
        switch (e.tag) {
          case 13:
            return (
              Al === null ? Rc() : e.alternate === null && bt === 0 && (bt = 3),
              (e.flags &= -257),
              (e.flags |= 65536),
              (e.lanes = u),
              a === Ci
                ? (e.flags |= 16384)
                : ((l = e.updateQueue),
                  l === null ? (e.updateQueue = new Set([a])) : l.add(a),
                  xc(t, a, u)),
              !1
            );
          case 22:
            return (
              (e.flags |= 65536),
              a === Ci
                ? (e.flags |= 16384)
                : ((l = e.updateQueue),
                  l === null
                    ? ((l = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a]),
                      }),
                      (e.updateQueue = l))
                    : ((e = l.retryQueue),
                      e === null ? (l.retryQueue = new Set([a])) : e.add(a)),
                  xc(t, a, u)),
              !1
            );
        }
        throw Error(r(435, e.tag));
      }
      return (xc(t, a, u), Rc(), !1);
    }
    if (at)
      return (
        (l = dl.current),
        l !== null
          ? ((l.flags & 65536) === 0 && (l.flags |= 256),
            (l.flags |= 65536),
            (l.lanes = u),
            a !== _i && ((t = Error(r(422), { cause: a })), ja(sl(t, e))))
          : (a !== _i && ((l = Error(r(423), { cause: a })), ja(sl(l, e))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (u &= -u),
            (t.lanes |= u),
            (a = sl(a, e)),
            (u = ic(t.stateNode, a, u)),
            Bi(t, u),
            bt !== 4 && (bt = 2)),
        !1
      );
    var n = Error(r(520), { cause: a });
    if (
      ((n = sl(n, e)),
      uu === null ? (uu = [n]) : uu.push(n),
      bt !== 4 && (bt = 2),
      l === null)
    )
      return !0;
    ((a = sl(a, e)), (e = l));
    do {
      switch (e.tag) {
        case 3:
          return (
            (e.flags |= 65536),
            (t = u & -u),
            (e.lanes |= t),
            (t = ic(e.stateNode, a, t)),
            Bi(e, t),
            !1
          );
        case 1:
          if (
            ((l = e.type),
            (n = e.stateNode),
            (e.flags & 128) === 0 &&
              (typeof l.getDerivedStateFromError == "function" ||
                (n !== null &&
                  typeof n.componentDidCatch == "function" &&
                  (ie === null || !ie.has(n)))))
          )
            return (
              (e.flags |= 65536),
              (u &= -u),
              (e.lanes |= u),
              (u = Ur(u)),
              Rr(u, t, e, a),
              Bi(e, u),
              !1
            );
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var Nr = Error(r(461)),
    _t = !1;
  function xt(t, l, e, a) {
    l.child = t === null ? Tr(l, null, e, a) : ca(l, t.child, e, a);
  }
  function xr(t, l, e, a, u) {
    e = e.render;
    var n = l.ref;
    if ("ref" in a) {
      var c = {};
      for (var f in a) f !== "ref" && (c[f] = a[f]);
    } else c = a;
    return (
      _e(l),
      (a = Vi(t, l, e, c, n, u)),
      (f = Li()),
      t !== null && !_t
        ? (Ki(t, l, u), Bl(t, l, u))
        : (at && f && zi(l), (l.flags |= 1), xt(t, l, a, u), l.child)
    );
  }
  function qr(t, l, e, a, u) {
    if (t === null) {
      var n = e.type;
      return typeof n == "function" &&
        !Ai(n) &&
        n.defaultProps === void 0 &&
        e.compare === null
        ? ((l.tag = 15), (l.type = n), Hr(t, l, n, a, u))
        : ((t = Xu(e.type, null, a, l, l.mode, u)),
          (t.ref = l.ref),
          (t.return = l),
          (l.child = t));
    }
    if (((n = t.child), !yc(t, u))) {
      var c = n.memoizedProps;
      if (
        ((e = e.compare), (e = e !== null ? e : qa), e(c, a) && t.ref === l.ref)
      )
        return Bl(t, l, u);
    }
    return (
      (l.flags |= 1),
      (t = Nl(n, a)),
      (t.ref = l.ref),
      (t.return = l),
      (l.child = t)
    );
  }
  function Hr(t, l, e, a, u) {
    if (t !== null) {
      var n = t.memoizedProps;
      if (qa(n, a) && t.ref === l.ref)
        if (((_t = !1), (l.pendingProps = a = n), yc(t, u)))
          (t.flags & 131072) !== 0 && (_t = !0);
        else return ((l.lanes = t.lanes), Bl(t, l, u));
    }
    return cc(t, l, e, a, u);
  }
  function Cr(t, l, e) {
    var a = l.pendingProps,
      u = a.children,
      n = t !== null ? t.memoizedState : null;
    if (a.mode === "hidden") {
      if ((l.flags & 128) !== 0) {
        if (((a = n !== null ? n.baseLanes | e : e), t !== null)) {
          for (u = l.child = t.child, n = 0; u !== null; )
            ((n = n | u.lanes | u.childLanes), (u = u.sibling));
          l.childLanes = n & ~a;
        } else ((l.childLanes = 0), (l.child = null));
        return Qr(t, l, a, e);
      }
      if ((e & 536870912) !== 0)
        ((l.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && wu(l, n !== null ? n.cachePool : null),
          n !== null ? Hs(l, n) : Gi(),
          Er(l));
      else
        return (
          (l.lanes = l.childLanes = 536870912),
          Qr(t, l, n !== null ? n.baseLanes | e : e, e)
        );
    } else
      n !== null
        ? (wu(l, n.cachePool), Hs(l, n), te(), (l.memoizedState = null))
        : (t !== null && wu(l, null), Gi(), te());
    return (xt(t, l, u, e), l.child);
  }
  function Qr(t, l, e, a) {
    var u = Hi();
    return (
      (u = u === null ? null : { parent: Ot._currentValue, pool: u }),
      (l.memoizedState = { baseLanes: e, cachePool: u }),
      t !== null && wu(l, null),
      Gi(),
      Er(l),
      t !== null && Ba(t, l, a, !0),
      null
    );
  }
  function rn(t, l) {
    var e = l.ref;
    if (e === null) t !== null && t.ref !== null && (l.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object") throw Error(r(284));
      (t === null || t.ref !== e) && (l.flags |= 4194816);
    }
  }
  function cc(t, l, e, a, u) {
    return (
      _e(l),
      (e = Vi(t, l, e, a, void 0, u)),
      (a = Li()),
      t !== null && !_t
        ? (Ki(t, l, u), Bl(t, l, u))
        : (at && a && zi(l), (l.flags |= 1), xt(t, l, e, u), l.child)
    );
  }
  function jr(t, l, e, a, u, n) {
    return (
      _e(l),
      (l.updateQueue = null),
      (e = Qs(l, a, e, u)),
      Cs(t),
      (a = Li()),
      t !== null && !_t
        ? (Ki(t, l, n), Bl(t, l, n))
        : (at && a && zi(l), (l.flags |= 1), xt(t, l, e, n), l.child)
    );
  }
  function Br(t, l, e, a, u) {
    if ((_e(l), l.stateNode === null)) {
      var n = Fe,
        c = e.contextType;
      (typeof c == "object" && c !== null && (n = Gt(c)),
        (n = new e(a, n)),
        (l.memoizedState =
          n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = nc),
        (l.stateNode = n),
        (n._reactInternals = l),
        (n = l.stateNode),
        (n.props = a),
        (n.state = l.memoizedState),
        (n.refs = {}),
        Qi(l),
        (c = e.contextType),
        (n.context = typeof c == "object" && c !== null ? Gt(c) : Fe),
        (n.state = l.memoizedState),
        (c = e.getDerivedStateFromProps),
        typeof c == "function" && (uc(l, e, c, a), (n.state = l.memoizedState)),
        typeof e.getDerivedStateFromProps == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function" ||
          (typeof n.UNSAFE_componentWillMount != "function" &&
            typeof n.componentWillMount != "function") ||
          ((c = n.state),
          typeof n.componentWillMount == "function" && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == "function" &&
            n.UNSAFE_componentWillMount(),
          c !== n.state && nc.enqueueReplaceState(n, n.state, null),
          Ka(l, a, n, u),
          La(),
          (n.state = l.memoizedState)),
        typeof n.componentDidMount == "function" && (l.flags |= 4194308),
        (a = !0));
    } else if (t === null) {
      n = l.stateNode;
      var f = l.memoizedProps,
        o = Ne(e, f);
      n.props = o;
      var g = n.context,
        p = e.contextType;
      ((c = Fe), typeof p == "object" && p !== null && (c = Gt(p)));
      var M = e.getDerivedStateFromProps;
      ((p =
        typeof M == "function" ||
        typeof n.getSnapshotBeforeUpdate == "function"),
        (f = l.pendingProps !== f),
        p ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((f || g !== c) && Or(l, n, a, c)),
        (Wl = !1));
      var S = l.memoizedState;
      ((n.state = S),
        Ka(l, a, n, u),
        La(),
        (g = l.memoizedState),
        f || S !== g || Wl
          ? (typeof M == "function" && (uc(l, e, M, a), (g = l.memoizedState)),
            (o = Wl || Ar(l, e, o, a, S, g, c))
              ? (p ||
                  (typeof n.UNSAFE_componentWillMount != "function" &&
                    typeof n.componentWillMount != "function") ||
                  (typeof n.componentWillMount == "function" &&
                    n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == "function" &&
                    n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == "function" &&
                  (l.flags |= 4194308))
              : (typeof n.componentDidMount == "function" &&
                  (l.flags |= 4194308),
                (l.memoizedProps = a),
                (l.memoizedState = g)),
            (n.props = a),
            (n.state = g),
            (n.context = c),
            (a = o))
          : (typeof n.componentDidMount == "function" && (l.flags |= 4194308),
            (a = !1)));
    } else {
      ((n = l.stateNode),
        ji(t, l),
        (c = l.memoizedProps),
        (p = Ne(e, c)),
        (n.props = p),
        (M = l.pendingProps),
        (S = n.context),
        (g = e.contextType),
        (o = Fe),
        typeof g == "object" && g !== null && (o = Gt(g)),
        (f = e.getDerivedStateFromProps),
        (g =
          typeof f == "function" ||
          typeof n.getSnapshotBeforeUpdate == "function") ||
          (typeof n.UNSAFE_componentWillReceiveProps != "function" &&
            typeof n.componentWillReceiveProps != "function") ||
          ((c !== M || S !== o) && Or(l, n, a, o)),
        (Wl = !1),
        (S = l.memoizedState),
        (n.state = S),
        Ka(l, a, n, u),
        La());
      var b = l.memoizedState;
      c !== M ||
      S !== b ||
      Wl ||
      (t !== null && t.dependencies !== null && Lu(t.dependencies))
        ? (typeof f == "function" && (uc(l, e, f, a), (b = l.memoizedState)),
          (p =
            Wl ||
            Ar(l, e, p, a, S, b, o) ||
            (t !== null && t.dependencies !== null && Lu(t.dependencies)))
            ? (g ||
                (typeof n.UNSAFE_componentWillUpdate != "function" &&
                  typeof n.componentWillUpdate != "function") ||
                (typeof n.componentWillUpdate == "function" &&
                  n.componentWillUpdate(a, b, o),
                typeof n.UNSAFE_componentWillUpdate == "function" &&
                  n.UNSAFE_componentWillUpdate(a, b, o)),
              typeof n.componentDidUpdate == "function" && (l.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == "function" &&
                (l.flags |= 1024))
            : (typeof n.componentDidUpdate != "function" ||
                (c === t.memoizedProps && S === t.memoizedState) ||
                (l.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != "function" ||
                (c === t.memoizedProps && S === t.memoizedState) ||
                (l.flags |= 1024),
              (l.memoizedProps = a),
              (l.memoizedState = b)),
          (n.props = a),
          (n.state = b),
          (n.context = o),
          (a = p))
        : (typeof n.componentDidUpdate != "function" ||
            (c === t.memoizedProps && S === t.memoizedState) ||
            (l.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != "function" ||
            (c === t.memoizedProps && S === t.memoizedState) ||
            (l.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      rn(t, l),
      (a = (l.flags & 128) !== 0),
      n || a
        ? ((n = l.stateNode),
          (e =
            a && typeof e.getDerivedStateFromError != "function"
              ? null
              : n.render()),
          (l.flags |= 1),
          t !== null && a
            ? ((l.child = ca(l, t.child, null, u)),
              (l.child = ca(l, null, e, u)))
            : xt(t, l, e, u),
          (l.memoizedState = n.state),
          (t = l.child))
        : (t = Bl(t, l, u)),
      t
    );
  }
  function Yr(t, l, e, a) {
    return (Qa(), (l.flags |= 256), xt(t, l, e, a), l.child);
  }
  var fc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function sc(t) {
    return { baseLanes: t, cachePool: zs() };
  }
  function rc(t, l, e) {
    return ((t = t !== null ? t.childLanes & ~e : 0), l && (t |= yl), t);
  }
  function Gr(t, l, e) {
    var a = l.pendingProps,
      u = !1,
      n = (l.flags & 128) !== 0,
      c;
    if (
      ((c = n) ||
        (c =
          t !== null && t.memoizedState === null ? !1 : (Mt.current & 2) !== 0),
      c && ((u = !0), (l.flags &= -129)),
      (c = (l.flags & 32) !== 0),
      (l.flags &= -33),
      t === null)
    ) {
      if (at) {
        if ((u ? Il(l) : te(), at)) {
          var f = St,
            o;
          if ((o = f)) {
            t: {
              for (o = f, f = El; o.nodeType !== 8; ) {
                if (!f) {
                  f = null;
                  break t;
                }
                if (((o = Sl(o.nextSibling)), o === null)) {
                  f = null;
                  break t;
                }
              }
              f = o;
            }
            f !== null
              ? ((l.memoizedState = {
                  dehydrated: f,
                  treeContext: Ae !== null ? { id: xl, overflow: ql } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (o = ll(18, null, null, 0)),
                (o.stateNode = f),
                (o.return = l),
                (l.child = o),
                (Zt = l),
                (St = null),
                (o = !0))
              : (o = !1);
          }
          o || ze(l);
        }
        if (
          ((f = l.memoizedState),
          f !== null && ((f = f.dehydrated), f !== null))
        )
          return (Jc(f) ? (l.lanes = 32) : (l.lanes = 536870912), null);
        jl(l);
      }
      return (
        (f = a.children),
        (a = a.fallback),
        u
          ? (te(),
            (u = l.mode),
            (f = on({ mode: "hidden", children: f }, u)),
            (a = Ee(a, u, e, null)),
            (f.return = l),
            (a.return = l),
            (f.sibling = a),
            (l.child = f),
            (u = l.child),
            (u.memoizedState = sc(e)),
            (u.childLanes = rc(t, c, e)),
            (l.memoizedState = fc),
            a)
          : (Il(l), oc(l, f))
      );
    }
    if (
      ((o = t.memoizedState), o !== null && ((f = o.dehydrated), f !== null))
    ) {
      if (n)
        l.flags & 256
          ? (Il(l), (l.flags &= -257), (l = hc(t, l, e)))
          : l.memoizedState !== null
            ? (te(), (l.child = t.child), (l.flags |= 128), (l = null))
            : (te(),
              (u = a.fallback),
              (f = l.mode),
              (a = on({ mode: "visible", children: a.children }, f)),
              (u = Ee(u, f, e, null)),
              (u.flags |= 2),
              (a.return = l),
              (u.return = l),
              (a.sibling = u),
              (l.child = a),
              ca(l, t.child, null, e),
              (a = l.child),
              (a.memoizedState = sc(e)),
              (a.childLanes = rc(t, c, e)),
              (l.memoizedState = fc),
              (l = u));
      else if ((Il(l), Jc(f))) {
        if (((c = f.nextSibling && f.nextSibling.dataset), c)) var g = c.dgst;
        ((c = g),
          (a = Error(r(419))),
          (a.stack = ""),
          (a.digest = c),
          ja({ value: a, source: null, stack: null }),
          (l = hc(t, l, e)));
      } else if (
        (_t || Ba(t, l, e, !1), (c = (e & t.childLanes) !== 0), _t || c)
      ) {
        if (
          ((c = ht),
          c !== null &&
            ((a = e & -e),
            (a = (a & 42) !== 0 ? 1 : kn(a)),
            (a = (a & (c.suspendedLanes | e)) !== 0 ? 0 : a),
            a !== 0 && a !== o.retryLane))
        )
          throw ((o.retryLane = a), $e(t, a), il(c, t, a), Nr);
        (f.data === "$?" || Rc(), (l = hc(t, l, e)));
      } else
        f.data === "$?"
          ? ((l.flags |= 192), (l.child = t.child), (l = null))
          : ((t = o.treeContext),
            (St = Sl(f.nextSibling)),
            (Zt = l),
            (at = !0),
            (Me = null),
            (El = !1),
            t !== null &&
              ((ol[hl++] = xl),
              (ol[hl++] = ql),
              (ol[hl++] = Ae),
              (xl = t.id),
              (ql = t.overflow),
              (Ae = l)),
            (l = oc(l, a.children)),
            (l.flags |= 4096));
      return l;
    }
    return u
      ? (te(),
        (u = a.fallback),
        (f = l.mode),
        (o = t.child),
        (g = o.sibling),
        (a = Nl(o, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = o.subtreeFlags & 65011712),
        g !== null ? (u = Nl(g, u)) : ((u = Ee(u, f, e, null)), (u.flags |= 2)),
        (u.return = l),
        (a.return = l),
        (a.sibling = u),
        (l.child = a),
        (a = u),
        (u = l.child),
        (f = t.child.memoizedState),
        f === null
          ? (f = sc(e))
          : ((o = f.cachePool),
            o !== null
              ? ((g = Ot._currentValue),
                (o = o.parent !== g ? { parent: g, pool: g } : o))
              : (o = zs()),
            (f = { baseLanes: f.baseLanes | e, cachePool: o })),
        (u.memoizedState = f),
        (u.childLanes = rc(t, c, e)),
        (l.memoizedState = fc),
        a)
      : (Il(l),
        (e = t.child),
        (t = e.sibling),
        (e = Nl(e, { mode: "visible", children: a.children })),
        (e.return = l),
        (e.sibling = null),
        t !== null &&
          ((c = l.deletions),
          c === null ? ((l.deletions = [t]), (l.flags |= 16)) : c.push(t)),
        (l.child = e),
        (l.memoizedState = null),
        e);
  }
  function oc(t, l) {
    return (
      (l = on({ mode: "visible", children: l }, t.mode)),
      (l.return = t),
      (t.child = l)
    );
  }
  function on(t, l) {
    return (
      (t = ll(22, t, null, l)),
      (t.lanes = 0),
      (t.stateNode = {
        _visibility: 1,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null,
      }),
      t
    );
  }
  function hc(t, l, e) {
    return (
      ca(l, t.child, null, e),
      (t = oc(l, l.pendingProps.children)),
      (t.flags |= 2),
      (l.memoizedState = null),
      t
    );
  }
  function Xr(t, l, e) {
    t.lanes |= l;
    var a = t.alternate;
    (a !== null && (a.lanes |= l), Ri(t.return, l, e));
  }
  function dc(t, l, e, a, u) {
    var n = t.memoizedState;
    n === null
      ? (t.memoizedState = {
          isBackwards: l,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: e,
          tailMode: u,
        })
      : ((n.isBackwards = l),
        (n.rendering = null),
        (n.renderingStartTime = 0),
        (n.last = a),
        (n.tail = e),
        (n.tailMode = u));
  }
  function Zr(t, l, e) {
    var a = l.pendingProps,
      u = a.revealOrder,
      n = a.tail;
    if ((xt(t, l, a.children, e), (a = Mt.current), (a & 2) !== 0))
      ((a = (a & 1) | 2), (l.flags |= 128));
    else {
      if (t !== null && (t.flags & 128) !== 0)
        t: for (t = l.child; t !== null; ) {
          if (t.tag === 13) t.memoizedState !== null && Xr(t, e, l);
          else if (t.tag === 19) Xr(t, e, l);
          else if (t.child !== null) {
            ((t.child.return = t), (t = t.child));
            continue;
          }
          if (t === l) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === l) break t;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      a &= 1;
    }
    switch ((N(Mt, a), u)) {
      case "forwards":
        for (e = l.child, u = null; e !== null; )
          ((t = e.alternate),
            t !== null && cn(t) === null && (u = e),
            (e = e.sibling));
        ((e = u),
          e === null
            ? ((u = l.child), (l.child = null))
            : ((u = e.sibling), (e.sibling = null)),
          dc(l, !1, u, e, n));
        break;
      case "backwards":
        for (e = null, u = l.child, l.child = null; u !== null; ) {
          if (((t = u.alternate), t !== null && cn(t) === null)) {
            l.child = u;
            break;
          }
          ((t = u.sibling), (u.sibling = e), (e = u), (u = t));
        }
        dc(l, !0, e, null, n);
        break;
      case "together":
        dc(l, !1, null, null, void 0);
        break;
      default:
        l.memoizedState = null;
    }
    return l.child;
  }
  function Bl(t, l, e) {
    if (
      (t !== null && (l.dependencies = t.dependencies),
      (ne |= l.lanes),
      (e & l.childLanes) === 0)
    )
      if (t !== null) {
        if ((Ba(t, l, e, !1), (e & l.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && l.child !== t.child) throw Error(r(153));
    if (l.child !== null) {
      for (
        t = l.child, e = Nl(t, t.pendingProps), l.child = e, e.return = l;
        t.sibling !== null;
      )
        ((t = t.sibling),
          (e = e.sibling = Nl(t, t.pendingProps)),
          (e.return = l));
      e.sibling = null;
    }
    return l.child;
  }
  function yc(t, l) {
    return (t.lanes & l) !== 0
      ? !0
      : ((t = t.dependencies), !!(t !== null && Lu(t)));
  }
  function u0(t, l, e) {
    switch (l.tag) {
      case 3:
        (yt(l, l.stateNode.containerInfo),
          kl(l, Ot, t.memoizedState.cache),
          Qa());
        break;
      case 27:
      case 5:
        Vn(l);
        break;
      case 4:
        yt(l, l.stateNode.containerInfo);
        break;
      case 10:
        kl(l, l.type, l.memoizedProps.value);
        break;
      case 13:
        var a = l.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (Il(l), (l.flags |= 128), null)
            : (e & l.child.childLanes) !== 0
              ? Gr(t, l, e)
              : (Il(l), (t = Bl(t, l, e)), t !== null ? t.sibling : null);
        Il(l);
        break;
      case 19:
        var u = (t.flags & 128) !== 0;
        if (
          ((a = (e & l.childLanes) !== 0),
          a || (Ba(t, l, e, !1), (a = (e & l.childLanes) !== 0)),
          u)
        ) {
          if (a) return Zr(t, l, e);
          l.flags |= 128;
        }
        if (
          ((u = l.memoizedState),
          u !== null &&
            ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          N(Mt, Mt.current),
          a)
        )
          break;
        return null;
      case 22:
      case 23:
        return ((l.lanes = 0), Cr(t, l, e));
      case 24:
        kl(l, Ot, t.memoizedState.cache);
    }
    return Bl(t, l, e);
  }
  function Vr(t, l, e) {
    if (t !== null)
      if (t.memoizedProps !== l.pendingProps) _t = !0;
      else {
        if (!yc(t, e) && (l.flags & 128) === 0) return ((_t = !1), u0(t, l, e));
        _t = (t.flags & 131072) !== 0;
      }
    else ((_t = !1), at && (l.flags & 1048576) !== 0 && bs(l, Vu, l.index));
    switch (((l.lanes = 0), l.tag)) {
      case 16:
        t: {
          t = l.pendingProps;
          var a = l.elementType,
            u = a._init;
          if (((a = u(a._payload)), (l.type = a), typeof a == "function"))
            Ai(a)
              ? ((t = Ne(a, t)), (l.tag = 1), (l = Br(null, l, a, t, e)))
              : ((l.tag = 0), (l = cc(null, l, a, t, e)));
          else {
            if (a != null) {
              if (((u = a.$$typeof), u === Ct)) {
                ((l.tag = 11), (l = xr(null, l, a, t, e)));
                break t;
              } else if (u === Wt) {
                ((l.tag = 14), (l = qr(null, l, a, t, e)));
                break t;
              }
            }
            throw ((l = me(a) || a), Error(r(306, l, "")));
          }
        }
        return l;
      case 0:
        return cc(t, l, l.type, l.pendingProps, e);
      case 1:
        return ((a = l.type), (u = Ne(a, l.pendingProps)), Br(t, l, a, u, e));
      case 3:
        t: {
          if ((yt(l, l.stateNode.containerInfo), t === null))
            throw Error(r(387));
          a = l.pendingProps;
          var n = l.memoizedState;
          ((u = n.element), ji(t, l), Ka(l, a, null, e));
          var c = l.memoizedState;
          if (
            ((a = c.cache),
            kl(l, Ot, a),
            a !== n.cache && Ni(l, [Ot], e, !0),
            La(),
            (a = c.element),
            n.isDehydrated)
          )
            if (
              ((n = { element: a, isDehydrated: !1, cache: c.cache }),
              (l.updateQueue.baseState = n),
              (l.memoizedState = n),
              l.flags & 256)
            ) {
              l = Yr(t, l, a, e);
              break t;
            } else if (a !== u) {
              ((u = sl(Error(r(424)), l)), ja(u), (l = Yr(t, l, a, e)));
              break t;
            } else {
              switch (((t = l.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (
                St = Sl(t.firstChild),
                  Zt = l,
                  at = !0,
                  Me = null,
                  El = !0,
                  e = Tr(l, null, a, e),
                  l.child = e;
                e;
              )
                ((e.flags = (e.flags & -3) | 4096), (e = e.sibling));
            }
          else {
            if ((Qa(), a === u)) {
              l = Bl(t, l, e);
              break t;
            }
            xt(t, l, a, e);
          }
          l = l.child;
        }
        return l;
      case 26:
        return (
          rn(t, l),
          t === null
            ? (e = ko(l.type, null, l.pendingProps, null))
              ? (l.memoizedState = e)
              : at ||
                ((e = l.type),
                (t = l.pendingProps),
                (a = Mn(Z.current).createElement(e)),
                (a[Yt] = l),
                (a[Lt] = t),
                Ht(a, e, t),
                Dt(a),
                (l.stateNode = a))
            : (l.memoizedState = ko(
                l.type,
                t.memoizedProps,
                l.pendingProps,
                t.memoizedState,
              )),
          null
        );
      case 27:
        return (
          Vn(l),
          t === null &&
            at &&
            ((a = l.stateNode = Ko(l.type, l.pendingProps, Z.current)),
            (Zt = l),
            (El = !0),
            (u = St),
            se(l.type) ? ((kc = u), (St = Sl(a.firstChild))) : (St = u)),
          xt(t, l, l.pendingProps.children, e),
          rn(t, l),
          t === null && (l.flags |= 4194304),
          l.child
        );
      case 5:
        return (
          t === null &&
            at &&
            ((u = a = St) &&
              ((a = x0(a, l.type, l.pendingProps, El)),
              a !== null
                ? ((l.stateNode = a),
                  (Zt = l),
                  (St = Sl(a.firstChild)),
                  (El = !1),
                  (u = !0))
                : (u = !1)),
            u || ze(l)),
          Vn(l),
          (u = l.type),
          (n = l.pendingProps),
          (c = t !== null ? t.memoizedProps : null),
          (a = n.children),
          Lc(u, n) ? (a = null) : c !== null && Lc(u, c) && (l.flags |= 32),
          l.memoizedState !== null &&
            ((u = Vi(t, l, $d, null, null, e)), (du._currentValue = u)),
          rn(t, l),
          xt(t, l, a, e),
          l.child
        );
      case 6:
        return (
          t === null &&
            at &&
            ((t = e = St) &&
              ((e = q0(e, l.pendingProps, El)),
              e !== null
                ? ((l.stateNode = e), (Zt = l), (St = null), (t = !0))
                : (t = !1)),
            t || ze(l)),
          null
        );
      case 13:
        return Gr(t, l, e);
      case 4:
        return (
          yt(l, l.stateNode.containerInfo),
          (a = l.pendingProps),
          t === null ? (l.child = ca(l, null, a, e)) : xt(t, l, a, e),
          l.child
        );
      case 11:
        return xr(t, l, l.type, l.pendingProps, e);
      case 7:
        return (xt(t, l, l.pendingProps, e), l.child);
      case 8:
        return (xt(t, l, l.pendingProps.children, e), l.child);
      case 12:
        return (xt(t, l, l.pendingProps.children, e), l.child);
      case 10:
        return (
          (a = l.pendingProps),
          kl(l, l.type, a.value),
          xt(t, l, a.children, e),
          l.child
        );
      case 9:
        return (
          (u = l.type._context),
          (a = l.pendingProps.children),
          _e(l),
          (u = Gt(u)),
          (a = a(u)),
          (l.flags |= 1),
          xt(t, l, a, e),
          l.child
        );
      case 14:
        return qr(t, l, l.type, l.pendingProps, e);
      case 15:
        return Hr(t, l, l.type, l.pendingProps, e);
      case 19:
        return Zr(t, l, e);
      case 31:
        return (
          (a = l.pendingProps),
          (e = l.mode),
          (a = { mode: a.mode, children: a.children }),
          t === null
            ? ((e = on(a, e)),
              (e.ref = l.ref),
              (l.child = e),
              (e.return = l),
              (l = e))
            : ((e = Nl(t.child, a)),
              (e.ref = l.ref),
              (l.child = e),
              (e.return = l),
              (l = e)),
          l
        );
      case 22:
        return Cr(t, l, e);
      case 24:
        return (
          _e(l),
          (a = Gt(Ot)),
          t === null
            ? ((u = Hi()),
              u === null &&
                ((u = ht),
                (n = xi()),
                (u.pooledCache = n),
                n.refCount++,
                n !== null && (u.pooledCacheLanes |= e),
                (u = n)),
              (l.memoizedState = { parent: a, cache: u }),
              Qi(l),
              kl(l, Ot, u))
            : ((t.lanes & e) !== 0 && (ji(t, l), Ka(l, null, null, e), La()),
              (u = t.memoizedState),
              (n = l.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (l.memoizedState = u),
                  l.lanes === 0 &&
                    (l.memoizedState = l.updateQueue.baseState = u),
                  kl(l, Ot, a))
                : ((a = n.cache),
                  kl(l, Ot, a),
                  a !== u.cache && Ni(l, [Ot], e, !0))),
          xt(t, l, l.pendingProps.children, e),
          l.child
        );
      case 29:
        throw l.pendingProps;
    }
    throw Error(r(156, l.tag));
  }
  function Yl(t) {
    t.flags |= 4;
  }
  function Lr(t, l) {
    if (l.type !== "stylesheet" || (l.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (((t.flags |= 16777216), !Io(l))) {
      if (
        ((l = dl.current),
        l !== null &&
          ((P & 4194048) === P
            ? Al !== null
            : ((P & 62914560) !== P && (P & 536870912) === 0) || l !== Al))
      )
        throw ((Za = Ci), Ds);
      t.flags |= 8192;
    }
  }
  function hn(t, l) {
    (l !== null && (t.flags |= 4),
      t.flags & 16384 &&
        ((l = t.tag !== 22 ? Ef() : 536870912), (t.lanes |= l), (oa |= l)));
  }
  function Pa(t, l) {
    if (!at)
      switch (t.tailMode) {
        case "hidden":
          l = t.tail;
          for (var e = null; l !== null; )
            (l.alternate !== null && (e = l), (l = l.sibling));
          e === null ? (t.tail = null) : (e.sibling = null);
          break;
        case "collapsed":
          e = t.tail;
          for (var a = null; e !== null; )
            (e.alternate !== null && (a = e), (e = e.sibling));
          a === null
            ? l || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function mt(t) {
    var l = t.alternate !== null && t.alternate.child === t.child,
      e = 0,
      a = 0;
    if (l)
      for (var u = t.child; u !== null; )
        ((e |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = t),
          (u = u.sibling));
    else
      for (u = t.child; u !== null; )
        ((e |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags),
          (a |= u.flags),
          (u.return = t),
          (u = u.sibling));
    return ((t.subtreeFlags |= a), (t.childLanes = e), l);
  }
  function n0(t, l, e) {
    var a = l.pendingProps;
    switch ((Di(l), l.tag)) {
      case 31:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (mt(l), null);
      case 1:
        return (mt(l), null);
      case 3:
        return (
          (e = l.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          l.memoizedState.cache !== a && (l.flags |= 2048),
          Cl(Ot),
          Ll(),
          e.pendingContext &&
            ((e.context = e.pendingContext), (e.pendingContext = null)),
          (t === null || t.child === null) &&
            (Ca(l)
              ? Yl(l)
              : t === null ||
                (t.memoizedState.isDehydrated && (l.flags & 256) === 0) ||
                ((l.flags |= 1024), Es())),
          mt(l),
          null
        );
      case 26:
        return (
          (e = l.memoizedState),
          t === null
            ? (Yl(l),
              e !== null ? (mt(l), Lr(l, e)) : (mt(l), (l.flags &= -16777217)))
            : e
              ? e !== t.memoizedState
                ? (Yl(l), mt(l), Lr(l, e))
                : (mt(l), (l.flags &= -16777217))
              : (t.memoizedProps !== a && Yl(l), mt(l), (l.flags &= -16777217)),
          null
        );
      case 27:
        (Eu(l), (e = Z.current));
        var u = l.type;
        if (t !== null && l.stateNode != null) t.memoizedProps !== a && Yl(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return (mt(l), null);
          }
          ((t = Q.current),
            Ca(l) ? ps(l) : ((t = Ko(u, a, e)), (l.stateNode = t), Yl(l)));
        }
        return (mt(l), null);
      case 5:
        if ((Eu(l), (e = l.type), t !== null && l.stateNode != null))
          t.memoizedProps !== a && Yl(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return (mt(l), null);
          }
          if (((t = Q.current), Ca(l))) ps(l);
          else {
            switch (((u = Mn(Z.current)), t)) {
              case 1:
                t = u.createElementNS("http://www.w3.org/2000/svg", e);
                break;
              case 2:
                t = u.createElementNS("http://www.w3.org/1998/Math/MathML", e);
                break;
              default:
                switch (e) {
                  case "svg":
                    t = u.createElementNS("http://www.w3.org/2000/svg", e);
                    break;
                  case "math":
                    t = u.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e,
                    );
                    break;
                  case "script":
                    ((t = u.createElement("div")),
                      (t.innerHTML = "<script><\/script>"),
                      (t = t.removeChild(t.firstChild)));
                    break;
                  case "select":
                    ((t =
                      typeof a.is == "string"
                        ? u.createElement("select", { is: a.is })
                        : u.createElement("select")),
                      a.multiple
                        ? (t.multiple = !0)
                        : a.size && (t.size = a.size));
                    break;
                  default:
                    t =
                      typeof a.is == "string"
                        ? u.createElement(e, { is: a.is })
                        : u.createElement(e);
                }
            }
            ((t[Yt] = l), (t[Lt] = a));
            t: for (u = l.child; u !== null; ) {
              if (u.tag === 5 || u.tag === 6) t.appendChild(u.stateNode);
              else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                ((u.child.return = u), (u = u.child));
                continue;
              }
              if (u === l) break t;
              for (; u.sibling === null; ) {
                if (u.return === null || u.return === l) break t;
                u = u.return;
              }
              ((u.sibling.return = u.return), (u = u.sibling));
            }
            l.stateNode = t;
            t: switch ((Ht(t, e, a), e)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                t = !!a.autoFocus;
                break t;
              case "img":
                t = !0;
                break t;
              default:
                t = !1;
            }
            t && Yl(l);
          }
        }
        return (mt(l), (l.flags &= -16777217), null);
      case 6:
        if (t && l.stateNode != null) t.memoizedProps !== a && Yl(l);
        else {
          if (typeof a != "string" && l.stateNode === null) throw Error(r(166));
          if (((t = Z.current), Ca(l))) {
            if (
              ((t = l.stateNode),
              (e = l.memoizedProps),
              (a = null),
              (u = Zt),
              u !== null)
            )
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((t[Yt] = l),
              (t = !!(
                t.nodeValue === e ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Bo(t.nodeValue, e)
              )),
              t || ze(l));
          } else
            ((t = Mn(t).createTextNode(a)), (t[Yt] = l), (l.stateNode = t));
        }
        return (mt(l), null);
      case 13:
        if (
          ((a = l.memoizedState),
          t === null ||
            (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((u = Ca(l)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!u) throw Error(r(318));
              if (
                ((u = l.memoizedState),
                (u = u !== null ? u.dehydrated : null),
                !u)
              )
                throw Error(r(317));
              u[Yt] = l;
            } else
              (Qa(),
                (l.flags & 128) === 0 && (l.memoizedState = null),
                (l.flags |= 4));
            (mt(l), (u = !1));
          } else
            ((u = Es()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = u),
              (u = !0));
          if (!u) return l.flags & 256 ? (jl(l), l) : (jl(l), null);
        }
        if ((jl(l), (l.flags & 128) !== 0)) return ((l.lanes = e), l);
        if (
          ((e = a !== null), (t = t !== null && t.memoizedState !== null), e)
        ) {
          ((a = l.child),
            (u = null),
            a.alternate !== null &&
              a.alternate.memoizedState !== null &&
              a.alternate.memoizedState.cachePool !== null &&
              (u = a.alternate.memoizedState.cachePool.pool));
          var n = null;
          (a.memoizedState !== null &&
            a.memoizedState.cachePool !== null &&
            (n = a.memoizedState.cachePool.pool),
            n !== u && (a.flags |= 2048));
        }
        return (
          e !== t && e && (l.child.flags |= 8192),
          hn(l, l.updateQueue),
          mt(l),
          null
        );
      case 4:
        return (Ll(), t === null && Yc(l.stateNode.containerInfo), mt(l), null);
      case 10:
        return (Cl(l.type), mt(l), null);
      case 19:
        if ((q(Mt), (u = l.memoizedState), u === null)) return (mt(l), null);
        if (((a = (l.flags & 128) !== 0), (n = u.rendering), n === null))
          if (a) Pa(u, !1);
          else {
            if (bt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = l.child; t !== null; ) {
                if (((n = cn(t)), n !== null)) {
                  for (
                    l.flags |= 128,
                      Pa(u, !1),
                      t = n.updateQueue,
                      l.updateQueue = t,
                      hn(l, t),
                      l.subtreeFlags = 0,
                      t = e,
                      e = l.child;
                    e !== null;
                  )
                    (Ss(e, t), (e = e.sibling));
                  return (N(Mt, (Mt.current & 1) | 2), l.child);
                }
                t = t.sibling;
              }
            u.tail !== null &&
              Tl() > vn &&
              ((l.flags |= 128), (a = !0), Pa(u, !1), (l.lanes = 4194304));
          }
        else {
          if (!a)
            if (((t = cn(n)), t !== null)) {
              if (
                ((l.flags |= 128),
                (a = !0),
                (t = t.updateQueue),
                (l.updateQueue = t),
                hn(l, t),
                Pa(u, !0),
                u.tail === null &&
                  u.tailMode === "hidden" &&
                  !n.alternate &&
                  !at)
              )
                return (mt(l), null);
            } else
              2 * Tl() - u.renderingStartTime > vn &&
                e !== 536870912 &&
                ((l.flags |= 128), (a = !0), Pa(u, !1), (l.lanes = 4194304));
          u.isBackwards
            ? ((n.sibling = l.child), (l.child = n))
            : ((t = u.last),
              t !== null ? (t.sibling = n) : (l.child = n),
              (u.last = n));
        }
        return u.tail !== null
          ? ((l = u.tail),
            (u.rendering = l),
            (u.tail = l.sibling),
            (u.renderingStartTime = Tl()),
            (l.sibling = null),
            (t = Mt.current),
            N(Mt, a ? (t & 1) | 2 : t & 1),
            l)
          : (mt(l), null);
      case 22:
      case 23:
        return (
          jl(l),
          Xi(),
          (a = l.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== a && (l.flags |= 8192)
            : a && (l.flags |= 8192),
          a
            ? (e & 536870912) !== 0 &&
              (l.flags & 128) === 0 &&
              (mt(l), l.subtreeFlags & 6 && (l.flags |= 8192))
            : mt(l),
          (e = l.updateQueue),
          e !== null && hn(l, e.retryQueue),
          (e = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (e = t.memoizedState.cachePool.pool),
          (a = null),
          l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (a = l.memoizedState.cachePool.pool),
          a !== e && (l.flags |= 2048),
          t !== null && q(Ue),
          null
        );
      case 24:
        return (
          (e = null),
          t !== null && (e = t.memoizedState.cache),
          l.memoizedState.cache !== e && (l.flags |= 2048),
          Cl(Ot),
          mt(l),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, l.tag));
  }
  function i0(t, l) {
    switch ((Di(l), l.tag)) {
      case 1:
        return (
          (t = l.flags),
          t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 3:
        return (
          Cl(Ot),
          Ll(),
          (t = l.flags),
          (t & 65536) !== 0 && (t & 128) === 0
            ? ((l.flags = (t & -65537) | 128), l)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Eu(l), null);
      case 13:
        if (
          (jl(l), (t = l.memoizedState), t !== null && t.dehydrated !== null)
        ) {
          if (l.alternate === null) throw Error(r(340));
          Qa();
        }
        return (
          (t = l.flags),
          t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 19:
        return (q(Mt), null);
      case 4:
        return (Ll(), null);
      case 10:
        return (Cl(l.type), null);
      case 22:
      case 23:
        return (
          jl(l),
          Xi(),
          t !== null && q(Ue),
          (t = l.flags),
          t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 24:
        return (Cl(Ot), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Kr(t, l) {
    switch ((Di(l), l.tag)) {
      case 3:
        (Cl(Ot), Ll());
        break;
      case 26:
      case 27:
      case 5:
        Eu(l);
        break;
      case 4:
        Ll();
        break;
      case 13:
        jl(l);
        break;
      case 19:
        q(Mt);
        break;
      case 10:
        Cl(l.type);
        break;
      case 22:
      case 23:
        (jl(l), Xi(), t !== null && q(Ue));
        break;
      case 24:
        Cl(Ot);
    }
  }
  function Ia(t, l) {
    try {
      var e = l.updateQueue,
        a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        e = u;
        do {
          if ((e.tag & t) === t) {
            a = void 0;
            var n = e.create,
              c = e.inst;
            ((a = n()), (c.destroy = a));
          }
          e = e.next;
        } while (e !== u);
      }
    } catch (f) {
      ot(l, l.return, f);
    }
  }
  function le(t, l, e) {
    try {
      var a = l.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & t) === t) {
            var c = a.inst,
              f = c.destroy;
            if (f !== void 0) {
              ((c.destroy = void 0), (u = l));
              var o = e,
                g = f;
              try {
                g();
              } catch (p) {
                ot(u, o, p);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (p) {
      ot(l, l.return, p);
    }
  }
  function wr(t) {
    var l = t.updateQueue;
    if (l !== null) {
      var e = t.stateNode;
      try {
        qs(l, e);
      } catch (a) {
        ot(t, t.return, a);
      }
    }
  }
  function Jr(t, l, e) {
    ((e.props = Ne(t.type, t.memoizedProps)), (e.state = t.memoizedState));
    try {
      e.componentWillUnmount();
    } catch (a) {
      ot(t, l, a);
    }
  }
  function tu(t, l) {
    try {
      var e = t.ref;
      if (e !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof e == "function" ? (t.refCleanup = e(a)) : (e.current = a);
      }
    } catch (u) {
      ot(t, l, u);
    }
  }
  function Ol(t, l) {
    var e = t.ref,
      a = t.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          ot(t, l, u);
        } finally {
          ((t.refCleanup = null),
            (t = t.alternate),
            t != null && (t.refCleanup = null));
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (u) {
          ot(t, l, u);
        }
      else e.current = null;
  }
  function kr(t) {
    var l = t.type,
      e = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (l) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break t;
        case "img":
          e.src ? (a.src = e.src) : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (u) {
      ot(t, t.return, u);
    }
  }
  function vc(t, l, e) {
    try {
      var a = t.stateNode;
      (D0(a, t.type, e, l), (a[Lt] = l));
    } catch (u) {
      ot(t, t.return, u);
    }
  }
  function Wr(t) {
    return (
      t.tag === 5 ||
      t.tag === 3 ||
      t.tag === 26 ||
      (t.tag === 27 && se(t.type)) ||
      t.tag === 4
    );
  }
  function mc(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Wr(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;
      ) {
        if (
          (t.tag === 27 && se(t.type)) ||
          t.flags & 2 ||
          t.child === null ||
          t.tag === 4
        )
          continue t;
        ((t.child.return = t), (t = t.child));
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function gc(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode),
        l
          ? (e.nodeType === 9
              ? e.body
              : e.nodeName === "HTML"
                ? e.ownerDocument.body
                : e
            ).insertBefore(t, l)
          : ((l =
              e.nodeType === 9
                ? e.body
                : e.nodeName === "HTML"
                  ? e.ownerDocument.body
                  : e),
            l.appendChild(t),
            (e = e._reactRootContainer),
            e != null || l.onclick !== null || (l.onclick = On)));
    else if (
      a !== 4 &&
      (a === 27 && se(t.type) && ((e = t.stateNode), (l = null)),
      (t = t.child),
      t !== null)
    )
      for (gc(t, l, e), t = t.sibling; t !== null; )
        (gc(t, l, e), (t = t.sibling));
  }
  function dn(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6)
      ((t = t.stateNode), l ? e.insertBefore(t, l) : e.appendChild(t));
    else if (
      a !== 4 &&
      (a === 27 && se(t.type) && (e = t.stateNode), (t = t.child), t !== null)
    )
      for (dn(t, l, e), t = t.sibling; t !== null; )
        (dn(t, l, e), (t = t.sibling));
  }
  function $r(t) {
    var l = t.stateNode,
      e = t.memoizedProps;
    try {
      for (var a = t.type, u = l.attributes; u.length; )
        l.removeAttributeNode(u[0]);
      (Ht(l, a, e), (l[Yt] = t), (l[Lt] = e));
    } catch (n) {
      ot(t, t.return, n);
    }
  }
  var Gl = !1,
    Tt = !1,
    Sc = !1,
    Fr = typeof WeakSet == "function" ? WeakSet : Set,
    Ut = null;
  function c0(t, l) {
    if (((t = t.containerInfo), (Zc = Nn), (t = fs(t)), mi(t))) {
      if ("selectionStart" in t)
        var e = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          e = ((e = t.ownerDocument) && e.defaultView) || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var u = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (e.nodeType, n.nodeType);
            } catch {
              e = null;
              break t;
            }
            var c = 0,
              f = -1,
              o = -1,
              g = 0,
              p = 0,
              M = t,
              S = null;
            l: for (;;) {
              for (
                var b;
                M !== e || (u !== 0 && M.nodeType !== 3) || (f = c + u),
                  M !== n || (a !== 0 && M.nodeType !== 3) || (o = c + a),
                  M.nodeType === 3 && (c += M.nodeValue.length),
                  (b = M.firstChild) !== null;
              )
                ((S = M), (M = b));
              for (;;) {
                if (M === t) break l;
                if (
                  (S === e && ++g === u && (f = c),
                  S === n && ++p === a && (o = c),
                  (b = M.nextSibling) !== null)
                )
                  break;
                ((M = S), (S = M.parentNode));
              }
              M = b;
            }
            e = f === -1 || o === -1 ? null : { start: f, end: o };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (
      Vc = { focusedElem: t, selectionRange: e }, Nn = !1, Ut = l;
      Ut !== null;
    )
      if (
        ((l = Ut), (t = l.child), (l.subtreeFlags & 1024) !== 0 && t !== null)
      )
        ((t.return = l), (Ut = t));
      else
        for (; Ut !== null; ) {
          switch (((l = Ut), (n = l.alternate), (t = l.flags), l.tag)) {
            case 0:
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && n !== null) {
                ((t = void 0),
                  (e = l),
                  (u = n.memoizedProps),
                  (n = n.memoizedState),
                  (a = e.stateNode));
                try {
                  var X = Ne(e.type, u, e.elementType === e.type);
                  ((t = a.getSnapshotBeforeUpdate(X, n)),
                    (a.__reactInternalSnapshotBeforeUpdate = t));
                } catch (j) {
                  ot(e, e.return, j);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (
                  ((t = l.stateNode.containerInfo), (e = t.nodeType), e === 9)
                )
                  wc(t);
                else if (e === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      wc(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(r(163));
          }
          if (((t = l.sibling), t !== null)) {
            ((t.return = l.return), (Ut = t));
            break;
          }
          Ut = l.return;
        }
  }
  function Pr(t, l, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (ee(t, e), a & 4 && Ia(5, e));
        break;
      case 1:
        if ((ee(t, e), a & 4))
          if (((t = e.stateNode), l === null))
            try {
              t.componentDidMount();
            } catch (c) {
              ot(e, e.return, c);
            }
          else {
            var u = Ne(e.type, l.memoizedProps);
            l = l.memoizedState;
            try {
              t.componentDidUpdate(u, l, t.__reactInternalSnapshotBeforeUpdate);
            } catch (c) {
              ot(e, e.return, c);
            }
          }
        (a & 64 && wr(e), a & 512 && tu(e, e.return));
        break;
      case 3:
        if ((ee(t, e), a & 64 && ((t = e.updateQueue), t !== null))) {
          if (((l = null), e.child !== null))
            switch (e.child.tag) {
              case 27:
              case 5:
                l = e.child.stateNode;
                break;
              case 1:
                l = e.child.stateNode;
            }
          try {
            qs(t, l);
          } catch (c) {
            ot(e, e.return, c);
          }
        }
        break;
      case 27:
        l === null && a & 4 && $r(e);
      case 26:
      case 5:
        (ee(t, e), l === null && a & 4 && kr(e), a & 512 && tu(e, e.return));
        break;
      case 12:
        ee(t, e);
        break;
      case 13:
        (ee(t, e),
          a & 4 && lo(t, e),
          a & 64 &&
            ((t = e.memoizedState),
            t !== null &&
              ((t = t.dehydrated),
              t !== null && ((e = m0.bind(null, e)), H0(t, e)))));
        break;
      case 22:
        if (((a = e.memoizedState !== null || Gl), !a)) {
          ((l = (l !== null && l.memoizedState !== null) || Tt), (u = Gl));
          var n = Tt;
          ((Gl = a),
            (Tt = l) && !n ? ae(t, e, (e.subtreeFlags & 8772) !== 0) : ee(t, e),
            (Gl = u),
            (Tt = n));
        }
        break;
      case 30:
        break;
      default:
        ee(t, e);
    }
  }
  function Ir(t) {
    var l = t.alternate;
    (l !== null && ((t.alternate = null), Ir(l)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((l = t.stateNode), l !== null && Fn(l)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null));
  }
  var vt = null,
    Jt = !1;
  function Xl(t, l, e) {
    for (e = e.child; e !== null; ) (to(t, l, e), (e = e.sibling));
  }
  function to(t, l, e) {
    if (Pt && typeof Pt.onCommitFiberUnmount == "function")
      try {
        Pt.onCommitFiberUnmount(Ta, e);
      } catch {}
    switch (e.tag) {
      case 26:
        (Tt || Ol(e, l),
          Xl(t, l, e),
          e.memoizedState
            ? e.memoizedState.count--
            : e.stateNode && ((e = e.stateNode), e.parentNode.removeChild(e)));
        break;
      case 27:
        Tt || Ol(e, l);
        var a = vt,
          u = Jt;
        (se(e.type) && ((vt = e.stateNode), (Jt = !1)),
          Xl(t, l, e),
          su(e.stateNode),
          (vt = a),
          (Jt = u));
        break;
      case 5:
        Tt || Ol(e, l);
      case 6:
        if (
          ((a = vt),
          (u = Jt),
          (vt = null),
          Xl(t, l, e),
          (vt = a),
          (Jt = u),
          vt !== null)
        )
          if (Jt)
            try {
              (vt.nodeType === 9
                ? vt.body
                : vt.nodeName === "HTML"
                  ? vt.ownerDocument.body
                  : vt
              ).removeChild(e.stateNode);
            } catch (n) {
              ot(e, l, n);
            }
          else
            try {
              vt.removeChild(e.stateNode);
            } catch (n) {
              ot(e, l, n);
            }
        break;
      case 18:
        vt !== null &&
          (Jt
            ? ((t = vt),
              Vo(
                t.nodeType === 9
                  ? t.body
                  : t.nodeName === "HTML"
                    ? t.ownerDocument.body
                    : t,
                e.stateNode,
              ),
              gu(t))
            : Vo(vt, e.stateNode));
        break;
      case 4:
        ((a = vt),
          (u = Jt),
          (vt = e.stateNode.containerInfo),
          (Jt = !0),
          Xl(t, l, e),
          (vt = a),
          (Jt = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (Tt || le(2, e, l), Tt || le(4, e, l), Xl(t, l, e));
        break;
      case 1:
        (Tt ||
          (Ol(e, l),
          (a = e.stateNode),
          typeof a.componentWillUnmount == "function" && Jr(e, l, a)),
          Xl(t, l, e));
        break;
      case 21:
        Xl(t, l, e);
        break;
      case 22:
        ((Tt = (a = Tt) || e.memoizedState !== null), Xl(t, l, e), (Tt = a));
        break;
      default:
        Xl(t, l, e);
    }
  }
  function lo(t, l) {
    if (
      l.memoizedState === null &&
      ((t = l.alternate),
      t !== null &&
        ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        gu(t);
      } catch (e) {
        ot(l, l.return, e);
      }
  }
  function f0(t) {
    switch (t.tag) {
      case 13:
      case 19:
        var l = t.stateNode;
        return (l === null && (l = t.stateNode = new Fr()), l);
      case 22:
        return (
          (t = t.stateNode),
          (l = t._retryCache),
          l === null && (l = t._retryCache = new Fr()),
          l
        );
      default:
        throw Error(r(435, t.tag));
    }
  }
  function bc(t, l) {
    var e = f0(t);
    l.forEach(function (a) {
      var u = g0.bind(null, t, a);
      e.has(a) || (e.add(a), a.then(u, u));
    });
  }
  function el(t, l) {
    var e = l.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a],
          n = t,
          c = l,
          f = c;
        t: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (se(f.type)) {
                ((vt = f.stateNode), (Jt = !1));
                break t;
              }
              break;
            case 5:
              ((vt = f.stateNode), (Jt = !1));
              break t;
            case 3:
            case 4:
              ((vt = f.stateNode.containerInfo), (Jt = !0));
              break t;
          }
          f = f.return;
        }
        if (vt === null) throw Error(r(160));
        (to(n, c, u),
          (vt = null),
          (Jt = !1),
          (n = u.alternate),
          n !== null && (n.return = null),
          (u.return = null));
      }
    if (l.subtreeFlags & 13878)
      for (l = l.child; l !== null; ) (eo(l, t), (l = l.sibling));
  }
  var gl = null;
  function eo(t, l) {
    var e = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (el(l, t),
          al(t),
          a & 4 && (le(3, t, t.return), Ia(3, t), le(5, t, t.return)));
        break;
      case 1:
        (el(l, t),
          al(t),
          a & 512 && (Tt || e === null || Ol(e, e.return)),
          a & 64 &&
            Gl &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((e = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = e === null ? a : e.concat(a))))));
        break;
      case 26:
        var u = gl;
        if (
          (el(l, t),
          al(t),
          a & 512 && (Tt || e === null || Ol(e, e.return)),
          a & 4)
        ) {
          var n = e !== null ? e.memoizedState : null;
          if (((a = t.memoizedState), e === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  ((a = t.type),
                    (e = t.memoizedProps),
                    (u = u.ownerDocument || u));
                  l: switch (a) {
                    case "title":
                      ((n = u.getElementsByTagName("title")[0]),
                        (!n ||
                          n[Oa] ||
                          n[Yt] ||
                          n.namespaceURI === "http://www.w3.org/2000/svg" ||
                          n.hasAttribute("itemprop")) &&
                          ((n = u.createElement(a)),
                          u.head.insertBefore(
                            n,
                            u.querySelector("head > title"),
                          )),
                        Ht(n, a, e),
                        (n[Yt] = t),
                        Dt(n),
                        (a = n));
                      break t;
                    case "link":
                      var c = Fo("link", "href", u).get(a + (e.href || ""));
                      if (c) {
                        for (var f = 0; f < c.length; f++)
                          if (
                            ((n = c[f]),
                            n.getAttribute("href") ===
                              (e.href == null || e.href === ""
                                ? null
                                : e.href) &&
                              n.getAttribute("rel") ===
                                (e.rel == null ? null : e.rel) &&
                              n.getAttribute("title") ===
                                (e.title == null ? null : e.title) &&
                              n.getAttribute("crossorigin") ===
                                (e.crossOrigin == null ? null : e.crossOrigin))
                          ) {
                            c.splice(f, 1);
                            break l;
                          }
                      }
                      ((n = u.createElement(a)),
                        Ht(n, a, e),
                        u.head.appendChild(n));
                      break;
                    case "meta":
                      if (
                        (c = Fo("meta", "content", u).get(
                          a + (e.content || ""),
                        ))
                      ) {
                        for (f = 0; f < c.length; f++)
                          if (
                            ((n = c[f]),
                            n.getAttribute("content") ===
                              (e.content == null ? null : "" + e.content) &&
                              n.getAttribute("name") ===
                                (e.name == null ? null : e.name) &&
                              n.getAttribute("property") ===
                                (e.property == null ? null : e.property) &&
                              n.getAttribute("http-equiv") ===
                                (e.httpEquiv == null ? null : e.httpEquiv) &&
                              n.getAttribute("charset") ===
                                (e.charSet == null ? null : e.charSet))
                          ) {
                            c.splice(f, 1);
                            break l;
                          }
                      }
                      ((n = u.createElement(a)),
                        Ht(n, a, e),
                        u.head.appendChild(n));
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  ((n[Yt] = t), Dt(n), (a = n));
                }
                t.stateNode = a;
              } else Po(u, t.type, t.stateNode);
            else t.stateNode = $o(u, a, t.memoizedProps);
          else
            n !== a
              ? (n === null
                  ? e.stateNode !== null &&
                    ((e = e.stateNode), e.parentNode.removeChild(e))
                  : n.count--,
                a === null
                  ? Po(u, t.type, t.stateNode)
                  : $o(u, a, t.memoizedProps))
              : a === null &&
                t.stateNode !== null &&
                vc(t, t.memoizedProps, e.memoizedProps);
        }
        break;
      case 27:
        (el(l, t),
          al(t),
          a & 512 && (Tt || e === null || Ol(e, e.return)),
          e !== null && a & 4 && vc(t, t.memoizedProps, e.memoizedProps));
        break;
      case 5:
        if (
          (el(l, t),
          al(t),
          a & 512 && (Tt || e === null || Ol(e, e.return)),
          t.flags & 32)
        ) {
          u = t.stateNode;
          try {
            Ve(u, "");
          } catch (b) {
            ot(t, t.return, b);
          }
        }
        (a & 4 &&
          t.stateNode != null &&
          ((u = t.memoizedProps), vc(t, u, e !== null ? e.memoizedProps : u)),
          a & 1024 && (Sc = !0));
        break;
      case 6:
        if ((el(l, t), al(t), a & 4)) {
          if (t.stateNode === null) throw Error(r(162));
          ((a = t.memoizedProps), (e = t.stateNode));
          try {
            e.nodeValue = a;
          } catch (b) {
            ot(t, t.return, b);
          }
        }
        break;
      case 3:
        if (
          ((_n = null),
          (u = gl),
          (gl = zn(l.containerInfo)),
          el(l, t),
          (gl = u),
          al(t),
          a & 4 && e !== null && e.memoizedState.isDehydrated)
        )
          try {
            gu(l.containerInfo);
          } catch (b) {
            ot(t, t.return, b);
          }
        Sc && ((Sc = !1), ao(t));
        break;
      case 4:
        ((a = gl),
          (gl = zn(t.stateNode.containerInfo)),
          el(l, t),
          al(t),
          (gl = a));
        break;
      case 12:
        (el(l, t), al(t));
        break;
      case 13:
        (el(l, t),
          al(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) !=
              (e !== null && e.memoizedState !== null) &&
            (Mc = Tl()),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), bc(t, a))));
        break;
      case 22:
        u = t.memoizedState !== null;
        var o = e !== null && e.memoizedState !== null,
          g = Gl,
          p = Tt;
        if (
          ((Gl = g || u),
          (Tt = p || o),
          el(l, t),
          (Tt = p),
          (Gl = g),
          al(t),
          a & 8192)
        )
          t: for (
            l = t.stateNode,
              l._visibility = u ? l._visibility & -2 : l._visibility | 1,
              u && (e === null || o || Gl || Tt || xe(t)),
              e = null,
              l = t;
            ;
          ) {
            if (l.tag === 5 || l.tag === 26) {
              if (e === null) {
                o = e = l;
                try {
                  if (((n = o.stateNode), u))
                    ((c = n.style),
                      typeof c.setProperty == "function"
                        ? c.setProperty("display", "none", "important")
                        : (c.display = "none"));
                  else {
                    f = o.stateNode;
                    var M = o.memoizedProps.style,
                      S =
                        M != null && M.hasOwnProperty("display")
                          ? M.display
                          : null;
                    f.style.display =
                      S == null || typeof S == "boolean" ? "" : ("" + S).trim();
                  }
                } catch (b) {
                  ot(o, o.return, b);
                }
              }
            } else if (l.tag === 6) {
              if (e === null) {
                o = l;
                try {
                  o.stateNode.nodeValue = u ? "" : o.memoizedProps;
                } catch (b) {
                  ot(o, o.return, b);
                }
              }
            } else if (
              ((l.tag !== 22 && l.tag !== 23) ||
                l.memoizedState === null ||
                l === t) &&
              l.child !== null
            ) {
              ((l.child.return = l), (l = l.child));
              continue;
            }
            if (l === t) break t;
            for (; l.sibling === null; ) {
              if (l.return === null || l.return === t) break t;
              (e === l && (e = null), (l = l.return));
            }
            (e === l && (e = null),
              (l.sibling.return = l.return),
              (l = l.sibling));
          }
        a & 4 &&
          ((a = t.updateQueue),
          a !== null &&
            ((e = a.retryQueue),
            e !== null && ((a.retryQueue = null), bc(t, e))));
        break;
      case 19:
        (el(l, t),
          al(t),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), bc(t, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (el(l, t), al(t));
    }
  }
  function al(t) {
    var l = t.flags;
    if (l & 2) {
      try {
        for (var e, a = t.return; a !== null; ) {
          if (Wr(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(r(160));
        switch (e.tag) {
          case 27:
            var u = e.stateNode,
              n = mc(t);
            dn(t, n, u);
            break;
          case 5:
            var c = e.stateNode;
            e.flags & 32 && (Ve(c, ""), (e.flags &= -33));
            var f = mc(t);
            dn(t, f, c);
            break;
          case 3:
          case 4:
            var o = e.stateNode.containerInfo,
              g = mc(t);
            gc(t, g, o);
            break;
          default:
            throw Error(r(161));
        }
      } catch (p) {
        ot(t, t.return, p);
      }
      t.flags &= -3;
    }
    l & 4096 && (t.flags &= -4097);
  }
  function ao(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var l = t;
        (ao(l),
          l.tag === 5 && l.flags & 1024 && l.stateNode.reset(),
          (t = t.sibling));
      }
  }
  function ee(t, l) {
    if (l.subtreeFlags & 8772)
      for (l = l.child; l !== null; ) (Pr(t, l.alternate, l), (l = l.sibling));
  }
  function xe(t) {
    for (t = t.child; t !== null; ) {
      var l = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (le(4, l, l.return), xe(l));
          break;
        case 1:
          Ol(l, l.return);
          var e = l.stateNode;
          (typeof e.componentWillUnmount == "function" && Jr(l, l.return, e),
            xe(l));
          break;
        case 27:
          su(l.stateNode);
        case 26:
        case 5:
          (Ol(l, l.return), xe(l));
          break;
        case 22:
          l.memoizedState === null && xe(l);
          break;
        case 30:
          xe(l);
          break;
        default:
          xe(l);
      }
      t = t.sibling;
    }
  }
  function ae(t, l, e) {
    for (e = e && (l.subtreeFlags & 8772) !== 0, l = l.child; l !== null; ) {
      var a = l.alternate,
        u = t,
        n = l,
        c = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (ae(u, n, e), Ia(4, n));
          break;
        case 1:
          if (
            (ae(u, n, e),
            (a = n),
            (u = a.stateNode),
            typeof u.componentDidMount == "function")
          )
            try {
              u.componentDidMount();
            } catch (g) {
              ot(a, a.return, g);
            }
          if (((a = n), (u = a.updateQueue), u !== null)) {
            var f = a.stateNode;
            try {
              var o = u.shared.hiddenCallbacks;
              if (o !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < o.length; u++)
                  xs(o[u], f);
            } catch (g) {
              ot(a, a.return, g);
            }
          }
          (e && c & 64 && wr(n), tu(n, n.return));
          break;
        case 27:
          $r(n);
        case 26:
        case 5:
          (ae(u, n, e), e && a === null && c & 4 && kr(n), tu(n, n.return));
          break;
        case 12:
          ae(u, n, e);
          break;
        case 13:
          (ae(u, n, e), e && c & 4 && lo(u, n));
          break;
        case 22:
          (n.memoizedState === null && ae(u, n, e), tu(n, n.return));
          break;
        case 30:
          break;
        default:
          ae(u, n, e);
      }
      l = l.sibling;
    }
  }
  function pc(t, l) {
    var e = null;
    (t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (e = t.memoizedState.cachePool.pool),
      (t = null),
      l.memoizedState !== null &&
        l.memoizedState.cachePool !== null &&
        (t = l.memoizedState.cachePool.pool),
      t !== e && (t != null && t.refCount++, e != null && Ya(e)));
  }
  function Tc(t, l) {
    ((t = null),
      l.alternate !== null && (t = l.alternate.memoizedState.cache),
      (l = l.memoizedState.cache),
      l !== t && (l.refCount++, t != null && Ya(t)));
  }
  function Ml(t, l, e, a) {
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) (uo(t, l, e, a), (l = l.sibling));
  }
  function uo(t, l, e, a) {
    var u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (Ml(t, l, e, a), u & 2048 && Ia(9, l));
        break;
      case 1:
        Ml(t, l, e, a);
        break;
      case 3:
        (Ml(t, l, e, a),
          u & 2048 &&
            ((t = null),
            l.alternate !== null && (t = l.alternate.memoizedState.cache),
            (l = l.memoizedState.cache),
            l !== t && (l.refCount++, t != null && Ya(t))));
        break;
      case 12:
        if (u & 2048) {
          (Ml(t, l, e, a), (t = l.stateNode));
          try {
            var n = l.memoizedProps,
              c = n.id,
              f = n.onPostCommit;
            typeof f == "function" &&
              f(
                c,
                l.alternate === null ? "mount" : "update",
                t.passiveEffectDuration,
                -0,
              );
          } catch (o) {
            ot(l, l.return, o);
          }
        } else Ml(t, l, e, a);
        break;
      case 13:
        Ml(t, l, e, a);
        break;
      case 23:
        break;
      case 22:
        ((n = l.stateNode),
          (c = l.alternate),
          l.memoizedState !== null
            ? n._visibility & 2
              ? Ml(t, l, e, a)
              : lu(t, l)
            : n._visibility & 2
              ? Ml(t, l, e, a)
              : ((n._visibility |= 2),
                fa(t, l, e, a, (l.subtreeFlags & 10256) !== 0)),
          u & 2048 && pc(c, l));
        break;
      case 24:
        (Ml(t, l, e, a), u & 2048 && Tc(l.alternate, l));
        break;
      default:
        Ml(t, l, e, a);
    }
  }
  function fa(t, l, e, a, u) {
    for (u = u && (l.subtreeFlags & 10256) !== 0, l = l.child; l !== null; ) {
      var n = t,
        c = l,
        f = e,
        o = a,
        g = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          (fa(n, c, f, o, u), Ia(8, c));
          break;
        case 23:
          break;
        case 22:
          var p = c.stateNode;
          (c.memoizedState !== null
            ? p._visibility & 2
              ? fa(n, c, f, o, u)
              : lu(n, c)
            : ((p._visibility |= 2), fa(n, c, f, o, u)),
            u && g & 2048 && pc(c.alternate, c));
          break;
        case 24:
          (fa(n, c, f, o, u), u && g & 2048 && Tc(c.alternate, c));
          break;
        default:
          fa(n, c, f, o, u);
      }
      l = l.sibling;
    }
  }
  function lu(t, l) {
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) {
        var e = t,
          a = l,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (lu(e, a), u & 2048 && pc(a.alternate, a));
            break;
          case 24:
            (lu(e, a), u & 2048 && Tc(a.alternate, a));
            break;
          default:
            lu(e, a);
        }
        l = l.sibling;
      }
  }
  var eu = 8192;
  function sa(t) {
    if (t.subtreeFlags & eu)
      for (t = t.child; t !== null; ) (no(t), (t = t.sibling));
  }
  function no(t) {
    switch (t.tag) {
      case 26:
        (sa(t),
          t.flags & eu &&
            t.memoizedState !== null &&
            J0(gl, t.memoizedState, t.memoizedProps));
        break;
      case 5:
        sa(t);
        break;
      case 3:
      case 4:
        var l = gl;
        ((gl = zn(t.stateNode.containerInfo)), sa(t), (gl = l));
        break;
      case 22:
        t.memoizedState === null &&
          ((l = t.alternate),
          l !== null && l.memoizedState !== null
            ? ((l = eu), (eu = 16777216), sa(t), (eu = l))
            : sa(t));
        break;
      default:
        sa(t);
    }
  }
  function io(t) {
    var l = t.alternate;
    if (l !== null && ((t = l.child), t !== null)) {
      l.child = null;
      do ((l = t.sibling), (t.sibling = null), (t = l));
      while (t !== null);
    }
  }
  function au(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          ((Ut = a), fo(a, t));
        }
      io(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (co(t), (t = t.sibling));
  }
  function co(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (au(t), t.flags & 2048 && le(9, t, t.return));
        break;
      case 3:
        au(t);
        break;
      case 12:
        au(t);
        break;
      case 22:
        var l = t.stateNode;
        t.memoizedState !== null &&
        l._visibility & 2 &&
        (t.return === null || t.return.tag !== 13)
          ? ((l._visibility &= -3), yn(t))
          : au(t);
        break;
      default:
        au(t);
    }
  }
  function yn(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          ((Ut = a), fo(a, t));
        }
      io(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((l = t), l.tag)) {
        case 0:
        case 11:
        case 15:
          (le(8, l, l.return), yn(l));
          break;
        case 22:
          ((e = l.stateNode),
            e._visibility & 2 && ((e._visibility &= -3), yn(l)));
          break;
        default:
          yn(l);
      }
      t = t.sibling;
    }
  }
  function fo(t, l) {
    for (; Ut !== null; ) {
      var e = Ut;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          le(8, e, l);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Ya(e.memoizedState.cache);
      }
      if (((a = e.child), a !== null)) ((a.return = e), (Ut = a));
      else
        t: for (e = t; Ut !== null; ) {
          a = Ut;
          var u = a.sibling,
            n = a.return;
          if ((Ir(a), a === e)) {
            Ut = null;
            break t;
          }
          if (u !== null) {
            ((u.return = n), (Ut = u));
            break t;
          }
          Ut = n;
        }
    }
  }
  var s0 = {
      getCacheForType: function (t) {
        var l = Gt(Ot),
          e = l.data.get(t);
        return (e === void 0 && ((e = t()), l.data.set(t, e)), e);
      },
    },
    r0 = typeof WeakMap == "function" ? WeakMap : Map,
    ut = 0,
    ht = null,
    W = null,
    P = 0,
    nt = 0,
    ul = null,
    ue = !1,
    ra = !1,
    Ec = !1,
    Zl = 0,
    bt = 0,
    ne = 0,
    qe = 0,
    Ac = 0,
    yl = 0,
    oa = 0,
    uu = null,
    kt = null,
    Oc = !1,
    Mc = 0,
    vn = 1 / 0,
    mn = null,
    ie = null,
    qt = 0,
    ce = null,
    ha = null,
    da = 0,
    zc = 0,
    Dc = null,
    so = null,
    nu = 0,
    _c = null;
  function nl() {
    if ((ut & 2) !== 0 && P !== 0) return P & -P;
    if (T.T !== null) {
      var t = ta;
      return t !== 0 ? t : Cc();
    }
    return Mf();
  }
  function ro() {
    yl === 0 && (yl = (P & 536870912) === 0 || at ? Tf() : 536870912);
    var t = dl.current;
    return (t !== null && (t.flags |= 32), yl);
  }
  function il(t, l, e) {
    (((t === ht && (nt === 2 || nt === 9)) || t.cancelPendingCommit !== null) &&
      (ya(t, 0), fe(t, P, yl, !1)),
      Aa(t, e),
      ((ut & 2) === 0 || t !== ht) &&
        (t === ht &&
          ((ut & 2) === 0 && (qe |= e), bt === 4 && fe(t, P, yl, !1)),
        zl(t)));
  }
  function oo(t, l, e) {
    if ((ut & 6) !== 0) throw Error(r(327));
    var a = (!e && (l & 124) === 0 && (l & t.expiredLanes) === 0) || Ea(t, l),
      u = a ? d0(t, l) : Nc(t, l, !0),
      n = a;
    do {
      if (u === 0) {
        ra && !a && fe(t, l, 0, !1);
        break;
      } else {
        if (((e = t.current.alternate), n && !o0(e))) {
          ((u = Nc(t, l, !1)), (n = !1));
          continue;
        }
        if (u === 2) {
          if (((n = l), t.errorRecoveryDisabledLanes & n)) var c = 0;
          else
            ((c = t.pendingLanes & -536870913),
              (c = c !== 0 ? c : c & 536870912 ? 536870912 : 0));
          if (c !== 0) {
            l = c;
            t: {
              var f = t;
              u = uu;
              var o = f.current.memoizedState.isDehydrated;
              if ((o && (ya(f, c).flags |= 256), (c = Nc(f, c, !1)), c !== 2)) {
                if (Ec && !o) {
                  ((f.errorRecoveryDisabledLanes |= n), (qe |= n), (u = 4));
                  break t;
                }
                ((n = kt),
                  (kt = u),
                  n !== null &&
                    (kt === null ? (kt = n) : kt.push.apply(kt, n)));
              }
              u = c;
            }
            if (((n = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (ya(t, 0), fe(t, l, 0, !0));
          break;
        }
        t: {
          switch (((a = t), (n = u), n)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((l & 4194048) !== l) break;
            case 6:
              fe(a, l, yl, !ue);
              break t;
            case 2:
              kt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((l & 62914560) === l && ((u = Mc + 300 - Tl()), 10 < u)) {
            if ((fe(a, l, yl, !ue), zu(a, 0, !0) !== 0)) break t;
            a.timeoutHandle = Xo(
              ho.bind(null, a, e, kt, mn, Oc, l, yl, qe, oa, ue, n, 2, -0, 0),
              u,
            );
            break t;
          }
          ho(a, e, kt, mn, Oc, l, yl, qe, oa, ue, n, 0, -0, 0);
        }
      }
      break;
    } while (!0);
    zl(t);
  }
  function ho(t, l, e, a, u, n, c, f, o, g, p, M, S, b) {
    if (
      ((t.timeoutHandle = -1),
      (M = l.subtreeFlags),
      (M & 8192 || (M & 16785408) === 16785408) &&
        ((hu = { stylesheets: null, count: 0, unsuspend: w0 }),
        no(l),
        (M = k0()),
        M !== null))
    ) {
      ((t.cancelPendingCommit = M(
        po.bind(null, t, l, n, e, a, u, c, f, o, p, 1, S, b),
      )),
        fe(t, n, c, !g));
      return;
    }
    po(t, l, n, e, a, u, c, f, o);
  }
  function o0(t) {
    for (var l = t; ; ) {
      var e = l.tag;
      if (
        (e === 0 || e === 11 || e === 15) &&
        l.flags & 16384 &&
        ((e = l.updateQueue), e !== null && ((e = e.stores), e !== null))
      )
        for (var a = 0; a < e.length; a++) {
          var u = e[a],
            n = u.getSnapshot;
          u = u.value;
          try {
            if (!tl(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((e = l.child), l.subtreeFlags & 16384 && e !== null))
        ((e.return = l), (l = e));
      else {
        if (l === t) break;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t) return !0;
          l = l.return;
        }
        ((l.sibling.return = l.return), (l = l.sibling));
      }
    }
    return !0;
  }
  function fe(t, l, e, a) {
    ((l &= ~Ac),
      (l &= ~qe),
      (t.suspendedLanes |= l),
      (t.pingedLanes &= ~l),
      a && (t.warmLanes |= l),
      (a = t.expirationTimes));
    for (var u = l; 0 < u; ) {
      var n = 31 - It(u),
        c = 1 << n;
      ((a[n] = -1), (u &= ~c));
    }
    e !== 0 && Af(t, e, l);
  }
  function gn() {
    return (ut & 6) === 0 ? (iu(0), !1) : !0;
  }
  function Uc() {
    if (W !== null) {
      if (nt === 0) var t = W.return;
      else ((t = W), (Hl = De = null), wi(t), (ia = null), ($a = 0), (t = W));
      for (; t !== null; ) (Kr(t.alternate, t), (t = t.return));
      W = null;
    }
  }
  function ya(t, l) {
    var e = t.timeoutHandle;
    (e !== -1 && ((t.timeoutHandle = -1), U0(e)),
      (e = t.cancelPendingCommit),
      e !== null && ((t.cancelPendingCommit = null), e()),
      Uc(),
      (ht = t),
      (W = e = Nl(t.current, null)),
      (P = l),
      (nt = 0),
      (ul = null),
      (ue = !1),
      (ra = Ea(t, l)),
      (Ec = !1),
      (oa = yl = Ac = qe = ne = bt = 0),
      (kt = uu = null),
      (Oc = !1),
      (l & 8) !== 0 && (l |= l & 32));
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= l; 0 < a; ) {
        var u = 31 - It(a),
          n = 1 << u;
        ((l |= t[u]), (a &= ~n));
      }
    return ((Zl = l), Bu(), e);
  }
  function yo(t, l) {
    ((K = null),
      (T.H = an),
      l === Xa || l === Ju
        ? ((l = Rs()), (nt = 3))
        : l === Ds
          ? ((l = Rs()), (nt = 4))
          : (nt =
              l === Nr
                ? 8
                : l !== null &&
                    typeof l == "object" &&
                    typeof l.then == "function"
                  ? 6
                  : 1),
      (ul = l),
      W === null && ((bt = 1), sn(t, sl(l, t.current))));
  }
  function vo() {
    var t = T.H;
    return ((T.H = an), t === null ? an : t);
  }
  function mo() {
    var t = T.A;
    return ((T.A = s0), t);
  }
  function Rc() {
    ((bt = 4),
      ue || ((P & 4194048) !== P && dl.current !== null) || (ra = !0),
      ((ne & 134217727) === 0 && (qe & 134217727) === 0) ||
        ht === null ||
        fe(ht, P, yl, !1));
  }
  function Nc(t, l, e) {
    var a = ut;
    ut |= 2;
    var u = vo(),
      n = mo();
    ((ht !== t || P !== l) && ((mn = null), ya(t, l)), (l = !1));
    var c = bt;
    t: do
      try {
        if (nt !== 0 && W !== null) {
          var f = W,
            o = ul;
          switch (nt) {
            case 8:
              (Uc(), (c = 6));
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              dl.current === null && (l = !0);
              var g = nt;
              if (((nt = 0), (ul = null), va(t, f, o, g), e && ra)) {
                c = 0;
                break t;
              }
              break;
            default:
              ((g = nt), (nt = 0), (ul = null), va(t, f, o, g));
          }
        }
        (h0(), (c = bt));
        break;
      } catch (p) {
        yo(t, p);
      }
    while (!0);
    return (
      l && t.shellSuspendCounter++,
      (Hl = De = null),
      (ut = a),
      (T.H = u),
      (T.A = n),
      W === null && ((ht = null), (P = 0), Bu()),
      c
    );
  }
  function h0() {
    for (; W !== null; ) go(W);
  }
  function d0(t, l) {
    var e = ut;
    ut |= 2;
    var a = vo(),
      u = mo();
    ht !== t || P !== l
      ? ((mn = null), (vn = Tl() + 500), ya(t, l))
      : (ra = Ea(t, l));
    t: do
      try {
        if (nt !== 0 && W !== null) {
          l = W;
          var n = ul;
          l: switch (nt) {
            case 1:
              ((nt = 0), (ul = null), va(t, l, n, 1));
              break;
            case 2:
            case 9:
              if (_s(n)) {
                ((nt = 0), (ul = null), So(l));
                break;
              }
              ((l = function () {
                ((nt !== 2 && nt !== 9) || ht !== t || (nt = 7), zl(t));
              }),
                n.then(l, l));
              break t;
            case 3:
              nt = 7;
              break t;
            case 4:
              nt = 5;
              break t;
            case 7:
              _s(n)
                ? ((nt = 0), (ul = null), So(l))
                : ((nt = 0), (ul = null), va(t, l, n, 7));
              break;
            case 5:
              var c = null;
              switch (W.tag) {
                case 26:
                  c = W.memoizedState;
                case 5:
                case 27:
                  var f = W;
                  if (!c || Io(c)) {
                    ((nt = 0), (ul = null));
                    var o = f.sibling;
                    if (o !== null) W = o;
                    else {
                      var g = f.return;
                      g !== null ? ((W = g), Sn(g)) : (W = null);
                    }
                    break l;
                  }
              }
              ((nt = 0), (ul = null), va(t, l, n, 5));
              break;
            case 6:
              ((nt = 0), (ul = null), va(t, l, n, 6));
              break;
            case 8:
              (Uc(), (bt = 6));
              break t;
            default:
              throw Error(r(462));
          }
        }
        y0();
        break;
      } catch (p) {
        yo(t, p);
      }
    while (!0);
    return (
      (Hl = De = null),
      (T.H = a),
      (T.A = u),
      (ut = e),
      W !== null ? 0 : ((ht = null), (P = 0), Bu(), bt)
    );
  }
  function y0() {
    for (; W !== null && !Qh(); ) go(W);
  }
  function go(t) {
    var l = Vr(t.alternate, t, Zl);
    ((t.memoizedProps = t.pendingProps), l === null ? Sn(t) : (W = l));
  }
  function So(t) {
    var l = t,
      e = l.alternate;
    switch (l.tag) {
      case 15:
      case 0:
        l = jr(e, l, l.pendingProps, l.type, void 0, P);
        break;
      case 11:
        l = jr(e, l, l.pendingProps, l.type.render, l.ref, P);
        break;
      case 5:
        wi(l);
      default:
        (Kr(e, l), (l = W = Ss(l, Zl)), (l = Vr(e, l, Zl)));
    }
    ((t.memoizedProps = t.pendingProps), l === null ? Sn(t) : (W = l));
  }
  function va(t, l, e, a) {
    ((Hl = De = null), wi(l), (ia = null), ($a = 0));
    var u = l.return;
    try {
      if (a0(t, u, l, e, P)) {
        ((bt = 1), sn(t, sl(e, t.current)), (W = null));
        return;
      }
    } catch (n) {
      if (u !== null) throw ((W = u), n);
      ((bt = 1), sn(t, sl(e, t.current)), (W = null));
      return;
    }
    l.flags & 32768
      ? (at || a === 1
          ? (t = !0)
          : ra || (P & 536870912) !== 0
            ? (t = !1)
            : ((ue = t = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = dl.current),
                a !== null && a.tag === 13 && (a.flags |= 16384))),
        bo(l, t))
      : Sn(l);
  }
  function Sn(t) {
    var l = t;
    do {
      if ((l.flags & 32768) !== 0) {
        bo(l, ue);
        return;
      }
      t = l.return;
      var e = n0(l.alternate, l, Zl);
      if (e !== null) {
        W = e;
        return;
      }
      if (((l = l.sibling), l !== null)) {
        W = l;
        return;
      }
      W = l = t;
    } while (l !== null);
    bt === 0 && (bt = 5);
  }
  function bo(t, l) {
    do {
      var e = i0(t.alternate, t);
      if (e !== null) {
        ((e.flags &= 32767), (W = e));
        return;
      }
      if (
        ((e = t.return),
        e !== null &&
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)),
        !l && ((t = t.sibling), t !== null))
      ) {
        W = t;
        return;
      }
      W = t = e;
    } while (t !== null);
    ((bt = 6), (W = null));
  }
  function po(t, l, e, a, u, n, c, f, o) {
    t.cancelPendingCommit = null;
    do bn();
    while (qt !== 0);
    if ((ut & 6) !== 0) throw Error(r(327));
    if (l !== null) {
      if (l === t.current) throw Error(r(177));
      if (
        ((n = l.lanes | l.childLanes),
        (n |= Ti),
        wh(t, e, n, c, f, o),
        t === ht && ((W = ht = null), (P = 0)),
        (ha = l),
        (ce = t),
        (da = e),
        (zc = n),
        (Dc = u),
        (so = a),
        (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            S0(Au, function () {
              return (Mo(), null);
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (l.flags & 13878) !== 0),
        (l.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = T.T), (T.T = null), (u = x.p), (x.p = 2), (c = ut), (ut |= 4));
        try {
          c0(t, l, e);
        } finally {
          ((ut = c), (x.p = u), (T.T = a));
        }
      }
      ((qt = 1), To(), Eo(), Ao());
    }
  }
  function To() {
    if (qt === 1) {
      qt = 0;
      var t = ce,
        l = ha,
        e = (l.flags & 13878) !== 0;
      if ((l.subtreeFlags & 13878) !== 0 || e) {
        ((e = T.T), (T.T = null));
        var a = x.p;
        x.p = 2;
        var u = ut;
        ut |= 4;
        try {
          eo(l, t);
          var n = Vc,
            c = fs(t.containerInfo),
            f = n.focusedElem,
            o = n.selectionRange;
          if (
            c !== f &&
            f &&
            f.ownerDocument &&
            cs(f.ownerDocument.documentElement, f)
          ) {
            if (o !== null && mi(f)) {
              var g = o.start,
                p = o.end;
              if ((p === void 0 && (p = g), "selectionStart" in f))
                ((f.selectionStart = g),
                  (f.selectionEnd = Math.min(p, f.value.length)));
              else {
                var M = f.ownerDocument || document,
                  S = (M && M.defaultView) || window;
                if (S.getSelection) {
                  var b = S.getSelection(),
                    X = f.textContent.length,
                    j = Math.min(o.start, X),
                    ft = o.end === void 0 ? j : Math.min(o.end, X);
                  !b.extend && j > ft && ((c = ft), (ft = j), (j = c));
                  var v = is(f, j),
                    d = is(f, ft);
                  if (
                    v &&
                    d &&
                    (b.rangeCount !== 1 ||
                      b.anchorNode !== v.node ||
                      b.anchorOffset !== v.offset ||
                      b.focusNode !== d.node ||
                      b.focusOffset !== d.offset)
                  ) {
                    var m = M.createRange();
                    (m.setStart(v.node, v.offset),
                      b.removeAllRanges(),
                      j > ft
                        ? (b.addRange(m), b.extend(d.node, d.offset))
                        : (m.setEnd(d.node, d.offset), b.addRange(m)));
                  }
                }
              }
            }
            for (M = [], b = f; (b = b.parentNode); )
              b.nodeType === 1 &&
                M.push({ element: b, left: b.scrollLeft, top: b.scrollTop });
            for (
              typeof f.focus == "function" && f.focus(), f = 0;
              f < M.length;
              f++
            ) {
              var O = M[f];
              ((O.element.scrollLeft = O.left), (O.element.scrollTop = O.top));
            }
          }
          ((Nn = !!Zc), (Vc = Zc = null));
        } finally {
          ((ut = u), (x.p = a), (T.T = e));
        }
      }
      ((t.current = l), (qt = 2));
    }
  }
  function Eo() {
    if (qt === 2) {
      qt = 0;
      var t = ce,
        l = ha,
        e = (l.flags & 8772) !== 0;
      if ((l.subtreeFlags & 8772) !== 0 || e) {
        ((e = T.T), (T.T = null));
        var a = x.p;
        x.p = 2;
        var u = ut;
        ut |= 4;
        try {
          Pr(t, l.alternate, l);
        } finally {
          ((ut = u), (x.p = a), (T.T = e));
        }
      }
      qt = 3;
    }
  }
  function Ao() {
    if (qt === 4 || qt === 3) {
      ((qt = 0), jh());
      var t = ce,
        l = ha,
        e = da,
        a = so;
      (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
        ? (qt = 5)
        : ((qt = 0), (ha = ce = null), Oo(t, t.pendingLanes));
      var u = t.pendingLanes;
      if (
        (u === 0 && (ie = null),
        Wn(e),
        (l = l.stateNode),
        Pt && typeof Pt.onCommitFiberRoot == "function")
      )
        try {
          Pt.onCommitFiberRoot(Ta, l, void 0, (l.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((l = T.T), (u = x.p), (x.p = 2), (T.T = null));
        try {
          for (var n = t.onRecoverableError, c = 0; c < a.length; c++) {
            var f = a[c];
            n(f.value, { componentStack: f.stack });
          }
        } finally {
          ((T.T = l), (x.p = u));
        }
      }
      ((da & 3) !== 0 && bn(),
        zl(t),
        (u = t.pendingLanes),
        (e & 4194090) !== 0 && (u & 42) !== 0
          ? t === _c
            ? nu++
            : ((nu = 0), (_c = t))
          : (nu = 0),
        iu(0));
    }
  }
  function Oo(t, l) {
    (t.pooledCacheLanes &= l) === 0 &&
      ((l = t.pooledCache), l != null && ((t.pooledCache = null), Ya(l)));
  }
  function bn(t) {
    return (To(), Eo(), Ao(), Mo());
  }
  function Mo() {
    if (qt !== 5) return !1;
    var t = ce,
      l = zc;
    zc = 0;
    var e = Wn(da),
      a = T.T,
      u = x.p;
    try {
      ((x.p = 32 > e ? 32 : e), (T.T = null), (e = Dc), (Dc = null));
      var n = ce,
        c = da;
      if (((qt = 0), (ha = ce = null), (da = 0), (ut & 6) !== 0))
        throw Error(r(331));
      var f = ut;
      if (
        ((ut |= 4),
        co(n.current),
        uo(n, n.current, c, e),
        (ut = f),
        iu(0, !1),
        Pt && typeof Pt.onPostCommitFiberRoot == "function")
      )
        try {
          Pt.onPostCommitFiberRoot(Ta, n);
        } catch {}
      return !0;
    } finally {
      ((x.p = u), (T.T = a), Oo(t, l));
    }
  }
  function zo(t, l, e) {
    ((l = sl(e, l)),
      (l = ic(t.stateNode, l, 2)),
      (t = Fl(t, l, 2)),
      t !== null && (Aa(t, 2), zl(t)));
  }
  function ot(t, l, e) {
    if (t.tag === 3) zo(t, t, e);
    else
      for (; l !== null; ) {
        if (l.tag === 3) {
          zo(l, t, e);
          break;
        } else if (l.tag === 1) {
          var a = l.stateNode;
          if (
            typeof l.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" &&
              (ie === null || !ie.has(a)))
          ) {
            ((t = sl(e, t)),
              (e = Ur(2)),
              (a = Fl(l, e, 2)),
              a !== null && (Rr(e, a, l, t), Aa(a, 2), zl(a)));
            break;
          }
        }
        l = l.return;
      }
  }
  function xc(t, l, e) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new r0();
      var u = new Set();
      a.set(l, u);
    } else ((u = a.get(l)), u === void 0 && ((u = new Set()), a.set(l, u)));
    u.has(e) ||
      ((Ec = !0), u.add(e), (t = v0.bind(null, t, l, e)), l.then(t, t));
  }
  function v0(t, l, e) {
    var a = t.pingCache;
    (a !== null && a.delete(l),
      (t.pingedLanes |= t.suspendedLanes & e),
      (t.warmLanes &= ~e),
      ht === t &&
        (P & e) === e &&
        (bt === 4 || (bt === 3 && (P & 62914560) === P && 300 > Tl() - Mc)
          ? (ut & 2) === 0 && ya(t, 0)
          : (Ac |= e),
        oa === P && (oa = 0)),
      zl(t));
  }
  function Do(t, l) {
    (l === 0 && (l = Ef()), (t = $e(t, l)), t !== null && (Aa(t, l), zl(t)));
  }
  function m0(t) {
    var l = t.memoizedState,
      e = 0;
    (l !== null && (e = l.retryLane), Do(t, e));
  }
  function g0(t, l) {
    var e = 0;
    switch (t.tag) {
      case 13:
        var a = t.stateNode,
          u = t.memoizedState;
        u !== null && (e = u.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    (a !== null && a.delete(l), Do(t, e));
  }
  function S0(t, l) {
    return Kn(t, l);
  }
  var pn = null,
    ma = null,
    qc = !1,
    Tn = !1,
    Hc = !1,
    He = 0;
  function zl(t) {
    (t !== ma &&
      t.next === null &&
      (ma === null ? (pn = ma = t) : (ma = ma.next = t)),
      (Tn = !0),
      qc || ((qc = !0), p0()));
  }
  function iu(t, l) {
    if (!Hc && Tn) {
      Hc = !0;
      do
        for (var e = !1, a = pn; a !== null; ) {
          if (t !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var c = a.suspendedLanes,
                f = a.pingedLanes;
              ((n = (1 << (31 - It(42 | t) + 1)) - 1),
                (n &= u & ~(c & ~f)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((e = !0), No(a, n));
          } else
            ((n = P),
              (n = zu(
                a,
                a === ht ? n : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1,
              )),
              (n & 3) === 0 || Ea(a, n) || ((e = !0), No(a, n)));
          a = a.next;
        }
      while (e);
      Hc = !1;
    }
  }
  function b0() {
    _o();
  }
  function _o() {
    Tn = qc = !1;
    var t = 0;
    He !== 0 && (_0() && (t = He), (He = 0));
    for (var l = Tl(), e = null, a = pn; a !== null; ) {
      var u = a.next,
        n = Uo(a, l);
      (n === 0
        ? ((a.next = null),
          e === null ? (pn = u) : (e.next = u),
          u === null && (ma = e))
        : ((e = a), (t !== 0 || (n & 3) !== 0) && (Tn = !0)),
        (a = u));
    }
    iu(t);
  }
  function Uo(t, l) {
    for (
      var e = t.suspendedLanes,
        a = t.pingedLanes,
        u = t.expirationTimes,
        n = t.pendingLanes & -62914561;
      0 < n;
    ) {
      var c = 31 - It(n),
        f = 1 << c,
        o = u[c];
      (o === -1
        ? ((f & e) === 0 || (f & a) !== 0) && (u[c] = Kh(f, l))
        : o <= l && (t.expiredLanes |= f),
        (n &= ~f));
    }
    if (
      ((l = ht),
      (e = P),
      (e = zu(
        t,
        t === l ? e : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      (a = t.callbackNode),
      e === 0 ||
        (t === l && (nt === 2 || nt === 9)) ||
        t.cancelPendingCommit !== null)
    )
      return (
        a !== null && a !== null && wn(a),
        (t.callbackNode = null),
        (t.callbackPriority = 0)
      );
    if ((e & 3) === 0 || Ea(t, e)) {
      if (((l = e & -e), l === t.callbackPriority)) return l;
      switch ((a !== null && wn(a), Wn(e))) {
        case 2:
        case 8:
          e = bf;
          break;
        case 32:
          e = Au;
          break;
        case 268435456:
          e = pf;
          break;
        default:
          e = Au;
      }
      return (
        (a = Ro.bind(null, t)),
        (e = Kn(e, a)),
        (t.callbackPriority = l),
        (t.callbackNode = e),
        l
      );
    }
    return (
      a !== null && a !== null && wn(a),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function Ro(t, l) {
    if (qt !== 0 && qt !== 5)
      return ((t.callbackNode = null), (t.callbackPriority = 0), null);
    var e = t.callbackNode;
    if (bn() && t.callbackNode !== e) return null;
    var a = P;
    return (
      (a = zu(
        t,
        t === ht ? a : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1,
      )),
      a === 0
        ? null
        : (oo(t, a, l),
          Uo(t, Tl()),
          t.callbackNode != null && t.callbackNode === e
            ? Ro.bind(null, t)
            : null)
    );
  }
  function No(t, l) {
    if (bn()) return null;
    oo(t, l, !0);
  }
  function p0() {
    R0(function () {
      (ut & 6) !== 0 ? Kn(Sf, b0) : _o();
    });
  }
  function Cc() {
    return (He === 0 && (He = Tf()), He);
  }
  function xo(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean"
      ? null
      : typeof t == "function"
        ? t
        : Nu("" + t);
  }
  function qo(t, l) {
    var e = l.ownerDocument.createElement("input");
    return (
      (e.name = l.name),
      (e.value = l.value),
      t.id && e.setAttribute("form", t.id),
      l.parentNode.insertBefore(e, l),
      (t = new FormData(t)),
      e.parentNode.removeChild(e),
      t
    );
  }
  function T0(t, l, e, a, u) {
    if (l === "submit" && e && e.stateNode === u) {
      var n = xo((u[Lt] || null).action),
        c = a.submitter;
      c &&
        ((l = (l = c[Lt] || null)
          ? xo(l.formAction)
          : c.getAttribute("formAction")),
        l !== null && ((n = l), (c = null)));
      var f = new Cu("action", "action", null, a, u);
      t.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (He !== 0) {
                  var o = c ? qo(u, c) : new FormData(u);
                  lc(
                    e,
                    { pending: !0, data: o, method: u.method, action: n },
                    null,
                    o,
                  );
                }
              } else
                typeof n == "function" &&
                  (f.preventDefault(),
                  (o = c ? qo(u, c) : new FormData(u)),
                  lc(
                    e,
                    { pending: !0, data: o, method: u.method, action: n },
                    n,
                    o,
                  ));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var Qc = 0; Qc < pi.length; Qc++) {
    var jc = pi[Qc],
      E0 = jc.toLowerCase(),
      A0 = jc[0].toUpperCase() + jc.slice(1);
    ml(E0, "on" + A0);
  }
  (ml(os, "onAnimationEnd"),
    ml(hs, "onAnimationIteration"),
    ml(ds, "onAnimationStart"),
    ml("dblclick", "onDoubleClick"),
    ml("focusin", "onFocus"),
    ml("focusout", "onBlur"),
    ml(Gd, "onTransitionRun"),
    ml(Xd, "onTransitionStart"),
    ml(Zd, "onTransitionCancel"),
    ml(ys, "onTransitionEnd"),
    Ge("onMouseEnter", ["mouseout", "mouseover"]),
    Ge("onMouseLeave", ["mouseout", "mouseover"]),
    Ge("onPointerEnter", ["pointerout", "pointerover"]),
    Ge("onPointerLeave", ["pointerout", "pointerover"]),
    Se(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    Se(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    Se("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    Se(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    Se(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    Se(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var cu =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    O0 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(cu),
    );
  function Ho(t, l) {
    l = (l & 4) !== 0;
    for (var e = 0; e < t.length; e++) {
      var a = t[e],
        u = a.event;
      a = a.listeners;
      t: {
        var n = void 0;
        if (l)
          for (var c = a.length - 1; 0 <= c; c--) {
            var f = a[c],
              o = f.instance,
              g = f.currentTarget;
            if (((f = f.listener), o !== n && u.isPropagationStopped()))
              break t;
            ((n = f), (u.currentTarget = g));
            try {
              n(u);
            } catch (p) {
              fn(p);
            }
            ((u.currentTarget = null), (n = o));
          }
        else
          for (c = 0; c < a.length; c++) {
            if (
              ((f = a[c]),
              (o = f.instance),
              (g = f.currentTarget),
              (f = f.listener),
              o !== n && u.isPropagationStopped())
            )
              break t;
            ((n = f), (u.currentTarget = g));
            try {
              n(u);
            } catch (p) {
              fn(p);
            }
            ((u.currentTarget = null), (n = o));
          }
      }
    }
  }
  function $(t, l) {
    var e = l[$n];
    e === void 0 && (e = l[$n] = new Set());
    var a = t + "__bubble";
    e.has(a) || (Co(l, t, 2, !1), e.add(a));
  }
  function Bc(t, l, e) {
    var a = 0;
    (l && (a |= 4), Co(e, t, a, l));
  }
  var En = "_reactListening" + Math.random().toString(36).slice(2);
  function Yc(t) {
    if (!t[En]) {
      ((t[En] = !0),
        Df.forEach(function (e) {
          e !== "selectionchange" && (O0.has(e) || Bc(e, !1, t), Bc(e, !0, t));
        }));
      var l = t.nodeType === 9 ? t : t.ownerDocument;
      l === null || l[En] || ((l[En] = !0), Bc("selectionchange", !1, l));
    }
  }
  function Co(t, l, e, a) {
    switch (nh(l)) {
      case 2:
        var u = F0;
        break;
      case 8:
        u = P0;
        break;
      default:
        u = Ic;
    }
    ((e = u.bind(null, l, e, t)),
      (u = void 0),
      !ci ||
        (l !== "touchstart" && l !== "touchmove" && l !== "wheel") ||
        (u = !0),
      a
        ? u !== void 0
          ? t.addEventListener(l, e, { capture: !0, passive: u })
          : t.addEventListener(l, e, !0)
        : u !== void 0
          ? t.addEventListener(l, e, { passive: u })
          : t.addEventListener(l, e, !1));
  }
  function Gc(t, l, e, a, u) {
    var n = a;
    if ((l & 1) === 0 && (l & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var f = a.stateNode.containerInfo;
          if (f === u) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var o = c.tag;
              if ((o === 3 || o === 4) && c.stateNode.containerInfo === u)
                return;
              c = c.return;
            }
          for (; f !== null; ) {
            if (((c = je(f)), c === null)) return;
            if (((o = c.tag), o === 5 || o === 6 || o === 26 || o === 27)) {
              a = n = c;
              continue t;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    Xf(function () {
      var g = n,
        p = ni(e),
        M = [];
      t: {
        var S = vs.get(t);
        if (S !== void 0) {
          var b = Cu,
            X = t;
          switch (t) {
            case "keypress":
              if (qu(e) === 0) break t;
            case "keydown":
            case "keyup":
              b = Sd;
              break;
            case "focusin":
              ((X = "focus"), (b = oi));
              break;
            case "focusout":
              ((X = "blur"), (b = oi));
              break;
            case "beforeblur":
            case "afterblur":
              b = oi;
              break;
            case "click":
              if (e.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              b = Lf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              b = id;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              b = Td;
              break;
            case os:
            case hs:
            case ds:
              b = sd;
              break;
            case ys:
              b = Ad;
              break;
            case "scroll":
            case "scrollend":
              b = ud;
              break;
            case "wheel":
              b = Md;
              break;
            case "copy":
            case "cut":
            case "paste":
              b = od;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              b = wf;
              break;
            case "toggle":
            case "beforetoggle":
              b = Dd;
          }
          var j = (l & 4) !== 0,
            ft = !j && (t === "scroll" || t === "scrollend"),
            v = j ? (S !== null ? S + "Capture" : null) : S;
          j = [];
          for (var d = g, m; d !== null; ) {
            var O = d;
            if (
              ((m = O.stateNode),
              (O = O.tag),
              (O !== 5 && O !== 26 && O !== 27) ||
                m === null ||
                v === null ||
                ((O = za(d, v)), O != null && j.push(fu(d, O, m))),
              ft)
            )
              break;
            d = d.return;
          }
          0 < j.length &&
            ((S = new b(S, X, null, e, p)), M.push({ event: S, listeners: j }));
        }
      }
      if ((l & 7) === 0) {
        t: {
          if (
            ((S = t === "mouseover" || t === "pointerover"),
            (b = t === "mouseout" || t === "pointerout"),
            S &&
              e !== ui &&
              (X = e.relatedTarget || e.fromElement) &&
              (je(X) || X[Qe]))
          )
            break t;
          if (
            (b || S) &&
            ((S =
              p.window === p
                ? p
                : (S = p.ownerDocument)
                  ? S.defaultView || S.parentWindow
                  : window),
            b
              ? ((X = e.relatedTarget || e.toElement),
                (b = g),
                (X = X ? je(X) : null),
                X !== null &&
                  ((ft = _(X)),
                  (j = X.tag),
                  X !== ft || (j !== 5 && j !== 27 && j !== 6)) &&
                  (X = null))
              : ((b = null), (X = g)),
            b !== X)
          ) {
            if (
              ((j = Lf),
              (O = "onMouseLeave"),
              (v = "onMouseEnter"),
              (d = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                ((j = wf),
                (O = "onPointerLeave"),
                (v = "onPointerEnter"),
                (d = "pointer")),
              (ft = b == null ? S : Ma(b)),
              (m = X == null ? S : Ma(X)),
              (S = new j(O, d + "leave", b, e, p)),
              (S.target = ft),
              (S.relatedTarget = m),
              (O = null),
              je(p) === g &&
                ((j = new j(v, d + "enter", X, e, p)),
                (j.target = m),
                (j.relatedTarget = ft),
                (O = j)),
              (ft = O),
              b && X)
            )
              l: {
                for (j = b, v = X, d = 0, m = j; m; m = ga(m)) d++;
                for (m = 0, O = v; O; O = ga(O)) m++;
                for (; 0 < d - m; ) ((j = ga(j)), d--);
                for (; 0 < m - d; ) ((v = ga(v)), m--);
                for (; d--; ) {
                  if (j === v || (v !== null && j === v.alternate)) break l;
                  ((j = ga(j)), (v = ga(v)));
                }
                j = null;
              }
            else j = null;
            (b !== null && Qo(M, S, b, j, !1),
              X !== null && ft !== null && Qo(M, ft, X, j, !0));
          }
        }
        t: {
          if (
            ((S = g ? Ma(g) : window),
            (b = S.nodeName && S.nodeName.toLowerCase()),
            b === "select" || (b === "input" && S.type === "file"))
          )
            var H = ts;
          else if (Pf(S))
            if (ls) H = jd;
            else {
              H = Cd;
              var J = Hd;
            }
          else
            ((b = S.nodeName),
              !b ||
              b.toLowerCase() !== "input" ||
              (S.type !== "checkbox" && S.type !== "radio")
                ? g && ai(g.elementType) && (H = ts)
                : (H = Qd));
          if (H && (H = H(t, g))) {
            If(M, H, e, p);
            break t;
          }
          (J && J(t, S, g),
            t === "focusout" &&
              g &&
              S.type === "number" &&
              g.memoizedProps.value != null &&
              ei(S, "number", S.value));
        }
        switch (((J = g ? Ma(g) : window), t)) {
          case "focusin":
            (Pf(J) || J.contentEditable === "true") &&
              ((Je = J), (gi = g), (Ha = null));
            break;
          case "focusout":
            Ha = gi = Je = null;
            break;
          case "mousedown":
            Si = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Si = !1), ss(M, e, p));
            break;
          case "selectionchange":
            if (Yd) break;
          case "keydown":
          case "keyup":
            ss(M, e, p);
        }
        var C;
        if (di)
          t: {
            switch (t) {
              case "compositionstart":
                var B = "onCompositionStart";
                break t;
              case "compositionend":
                B = "onCompositionEnd";
                break t;
              case "compositionupdate":
                B = "onCompositionUpdate";
                break t;
            }
            B = void 0;
          }
        else
          we
            ? $f(t, e) && (B = "onCompositionEnd")
            : t === "keydown" &&
              e.keyCode === 229 &&
              (B = "onCompositionStart");
        (B &&
          (Jf &&
            e.locale !== "ko" &&
            (we || B !== "onCompositionStart"
              ? B === "onCompositionEnd" && we && (C = Zf())
              : ((Jl = p),
                (fi = "value" in Jl ? Jl.value : Jl.textContent),
                (we = !0))),
          (J = An(g, B)),
          0 < J.length &&
            ((B = new Kf(B, t, null, e, p)),
            M.push({ event: B, listeners: J }),
            C ? (B.data = C) : ((C = Ff(e)), C !== null && (B.data = C)))),
          (C = Ud ? Rd(t, e) : Nd(t, e)) &&
            ((B = An(g, "onBeforeInput")),
            0 < B.length &&
              ((J = new Kf("onBeforeInput", "beforeinput", null, e, p)),
              M.push({ event: J, listeners: B }),
              (J.data = C))),
          T0(M, t, g, e, p));
      }
      Ho(M, l);
    });
  }
  function fu(t, l, e) {
    return { instance: t, listener: l, currentTarget: e };
  }
  function An(t, l) {
    for (var e = l + "Capture", a = []; t !== null; ) {
      var u = t,
        n = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          n === null ||
          ((u = za(t, e)),
          u != null && a.unshift(fu(t, u, n)),
          (u = za(t, l)),
          u != null && a.push(fu(t, u, n))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function ga(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Qo(t, l, e, a, u) {
    for (var n = l._reactName, c = []; e !== null && e !== a; ) {
      var f = e,
        o = f.alternate,
        g = f.stateNode;
      if (((f = f.tag), o !== null && o === a)) break;
      ((f !== 5 && f !== 26 && f !== 27) ||
        g === null ||
        ((o = g),
        u
          ? ((g = za(e, n)), g != null && c.unshift(fu(e, g, o)))
          : u || ((g = za(e, n)), g != null && c.push(fu(e, g, o)))),
        (e = e.return));
    }
    c.length !== 0 && t.push({ event: l, listeners: c });
  }
  var M0 = /\r\n?/g,
    z0 = /\u0000|\uFFFD/g;
  function jo(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        M0,
        `
`,
      )
      .replace(z0, "");
  }
  function Bo(t, l) {
    return ((l = jo(l)), jo(t) === l);
  }
  function On() {}
  function ct(t, l, e, a, u, n) {
    switch (e) {
      case "children":
        typeof a == "string"
          ? l === "body" || (l === "textarea" && a === "") || Ve(t, a)
          : (typeof a == "number" || typeof a == "bigint") &&
            l !== "body" &&
            Ve(t, "" + a);
        break;
      case "className":
        _u(t, "class", a);
        break;
      case "tabIndex":
        _u(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        _u(t, e, a);
        break;
      case "style":
        Yf(t, a, n);
        break;
      case "data":
        if (l !== "object") {
          _u(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (l !== "a" || e !== "href")) {
          t.removeAttribute(e);
          break;
        }
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "symbol" ||
          typeof a == "boolean"
        ) {
          t.removeAttribute(e);
          break;
        }
        ((a = Nu("" + a)), t.setAttribute(e, a));
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof n == "function" &&
            (e === "formAction"
              ? (l !== "input" && ct(t, l, "name", u.name, u, null),
                ct(t, l, "formEncType", u.formEncType, u, null),
                ct(t, l, "formMethod", u.formMethod, u, null),
                ct(t, l, "formTarget", u.formTarget, u, null))
              : (ct(t, l, "encType", u.encType, u, null),
                ct(t, l, "method", u.method, u, null),
                ct(t, l, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(e);
          break;
        }
        ((a = Nu("" + a)), t.setAttribute(e, a));
        break;
      case "onClick":
        a != null && (t.onclick = On);
        break;
      case "onScroll":
        a != null && $("scroll", t);
        break;
      case "onScrollEnd":
        a != null && $("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = e;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "boolean" ||
          typeof a == "symbol"
        ) {
          t.removeAttribute("xlink:href");
          break;
        }
        ((e = Nu("" + a)),
          t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(e, "" + a)
          : t.removeAttribute(e);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(e, "")
          : t.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0
          ? t.setAttribute(e, "")
          : a !== !1 &&
              a != null &&
              typeof a != "function" &&
              typeof a != "symbol"
            ? t.setAttribute(e, a)
            : t.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null &&
        typeof a != "function" &&
        typeof a != "symbol" &&
        !isNaN(a) &&
        1 <= a
          ? t.setAttribute(e, a)
          : t.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? t.removeAttribute(e)
          : t.setAttribute(e, a);
        break;
      case "popover":
        ($("beforetoggle", t), $("toggle", t), Du(t, "popover", a));
        break;
      case "xlinkActuate":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        Ul(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        Ul(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        Ul(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        Ul(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        Du(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) ||
          (e[0] !== "o" && e[0] !== "O") ||
          (e[1] !== "n" && e[1] !== "N")) &&
          ((e = ed.get(e) || e), Du(t, e, a));
    }
  }
  function Xc(t, l, e, a, u, n) {
    switch (e) {
      case "style":
        Yf(t, a, n);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(r(60));
            t.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof a == "string"
          ? Ve(t, a)
          : (typeof a == "number" || typeof a == "bigint") && Ve(t, "" + a);
        break;
      case "onScroll":
        a != null && $("scroll", t);
        break;
      case "onScrollEnd":
        a != null && $("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = On);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!_f.hasOwnProperty(e))
          t: {
            if (
              e[0] === "o" &&
              e[1] === "n" &&
              ((u = e.endsWith("Capture")),
              (l = e.slice(2, u ? e.length - 7 : void 0)),
              (n = t[Lt] || null),
              (n = n != null ? n[e] : null),
              typeof n == "function" && t.removeEventListener(l, n, u),
              typeof a == "function")
            ) {
              (typeof n != "function" &&
                n !== null &&
                (e in t
                  ? (t[e] = null)
                  : t.hasAttribute(e) && t.removeAttribute(e)),
                t.addEventListener(l, a, u));
              break t;
            }
            e in t
              ? (t[e] = a)
              : a === !0
                ? t.setAttribute(e, "")
                : Du(t, e, a);
          }
    }
  }
  function Ht(t, l, e) {
    switch (l) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ($("error", t), $("load", t));
        var a = !1,
          u = !1,
          n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var c = e[n];
            if (c != null)
              switch (n) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, l));
                default:
                  ct(t, l, n, c, e, null);
              }
          }
        (u && ct(t, l, "srcSet", e.srcSet, e, null),
          a && ct(t, l, "src", e.src, e, null));
        return;
      case "input":
        $("invalid", t);
        var f = (n = c = u = null),
          o = null,
          g = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var p = e[a];
            if (p != null)
              switch (a) {
                case "name":
                  u = p;
                  break;
                case "type":
                  c = p;
                  break;
                case "checked":
                  o = p;
                  break;
                case "defaultChecked":
                  g = p;
                  break;
                case "value":
                  n = p;
                  break;
                case "defaultValue":
                  f = p;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (p != null) throw Error(r(137, l));
                  break;
                default:
                  ct(t, l, a, p, e, null);
              }
          }
        (Cf(t, n, f, o, g, c, u, !1), Uu(t));
        return;
      case "select":
        ($("invalid", t), (a = c = n = null));
        for (u in e)
          if (e.hasOwnProperty(u) && ((f = e[u]), f != null))
            switch (u) {
              case "value":
                n = f;
                break;
              case "defaultValue":
                c = f;
                break;
              case "multiple":
                a = f;
              default:
                ct(t, l, u, f, e, null);
            }
        ((l = n),
          (e = c),
          (t.multiple = !!a),
          l != null ? Ze(t, !!a, l, !1) : e != null && Ze(t, !!a, e, !0));
        return;
      case "textarea":
        ($("invalid", t), (n = u = a = null));
        for (c in e)
          if (e.hasOwnProperty(c) && ((f = e[c]), f != null))
            switch (c) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                u = f;
                break;
              case "children":
                n = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(r(91));
                break;
              default:
                ct(t, l, c, f, e, null);
            }
        (jf(t, a, u, n), Uu(t));
        return;
      case "option":
        for (o in e)
          if (e.hasOwnProperty(o) && ((a = e[o]), a != null))
            switch (o) {
              case "selected":
                t.selected =
                  a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                ct(t, l, o, a, e, null);
            }
        return;
      case "dialog":
        ($("beforetoggle", t), $("toggle", t), $("cancel", t), $("close", t));
        break;
      case "iframe":
      case "object":
        $("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < cu.length; a++) $(cu[a], t);
        break;
      case "image":
        ($("error", t), $("load", t));
        break;
      case "details":
        $("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        ($("error", t), $("load", t));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (g in e)
          if (e.hasOwnProperty(g) && ((a = e[g]), a != null))
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, l));
              default:
                ct(t, l, g, a, e, null);
            }
        return;
      default:
        if (ai(l)) {
          for (p in e)
            e.hasOwnProperty(p) &&
              ((a = e[p]), a !== void 0 && Xc(t, l, p, a, e, void 0));
          return;
        }
    }
    for (f in e)
      e.hasOwnProperty(f) && ((a = e[f]), a != null && ct(t, l, f, a, e, null));
  }
  function D0(t, l, e, a) {
    switch (l) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null,
          n = null,
          c = null,
          f = null,
          o = null,
          g = null,
          p = null;
        for (b in e) {
          var M = e[b];
          if (e.hasOwnProperty(b) && M != null)
            switch (b) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = M;
              default:
                a.hasOwnProperty(b) || ct(t, l, b, null, a, M);
            }
        }
        for (var S in a) {
          var b = a[S];
          if (((M = e[S]), a.hasOwnProperty(S) && (b != null || M != null)))
            switch (S) {
              case "type":
                n = b;
                break;
              case "name":
                u = b;
                break;
              case "checked":
                g = b;
                break;
              case "defaultChecked":
                p = b;
                break;
              case "value":
                c = b;
                break;
              case "defaultValue":
                f = b;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(r(137, l));
                break;
              default:
                b !== M && ct(t, l, S, b, a, M);
            }
        }
        li(t, c, f, o, g, p, n, u);
        return;
      case "select":
        b = c = f = S = null;
        for (n in e)
          if (((o = e[n]), e.hasOwnProperty(n) && o != null))
            switch (n) {
              case "value":
                break;
              case "multiple":
                b = o;
              default:
                a.hasOwnProperty(n) || ct(t, l, n, null, a, o);
            }
        for (u in a)
          if (
            ((n = a[u]),
            (o = e[u]),
            a.hasOwnProperty(u) && (n != null || o != null))
          )
            switch (u) {
              case "value":
                S = n;
                break;
              case "defaultValue":
                f = n;
                break;
              case "multiple":
                c = n;
              default:
                n !== o && ct(t, l, u, n, a, o);
            }
        ((l = f),
          (e = c),
          (a = b),
          S != null
            ? Ze(t, !!e, S, !1)
            : !!a != !!e &&
              (l != null ? Ze(t, !!e, l, !0) : Ze(t, !!e, e ? [] : "", !1)));
        return;
      case "textarea":
        b = S = null;
        for (f in e)
          if (
            ((u = e[f]),
            e.hasOwnProperty(f) && u != null && !a.hasOwnProperty(f))
          )
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                ct(t, l, f, null, a, u);
            }
        for (c in a)
          if (
            ((u = a[c]),
            (n = e[c]),
            a.hasOwnProperty(c) && (u != null || n != null))
          )
            switch (c) {
              case "value":
                S = u;
                break;
              case "defaultValue":
                b = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== n && ct(t, l, c, u, a, n);
            }
        Qf(t, S, b);
        return;
      case "option":
        for (var X in e)
          if (
            ((S = e[X]),
            e.hasOwnProperty(X) && S != null && !a.hasOwnProperty(X))
          )
            switch (X) {
              case "selected":
                t.selected = !1;
                break;
              default:
                ct(t, l, X, null, a, S);
            }
        for (o in a)
          if (
            ((S = a[o]),
            (b = e[o]),
            a.hasOwnProperty(o) && S !== b && (S != null || b != null))
          )
            switch (o) {
              case "selected":
                t.selected =
                  S && typeof S != "function" && typeof S != "symbol";
                break;
              default:
                ct(t, l, o, S, a, b);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var j in e)
          ((S = e[j]),
            e.hasOwnProperty(j) &&
              S != null &&
              !a.hasOwnProperty(j) &&
              ct(t, l, j, null, a, S));
        for (g in a)
          if (
            ((S = a[g]),
            (b = e[g]),
            a.hasOwnProperty(g) && S !== b && (S != null || b != null))
          )
            switch (g) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (S != null) throw Error(r(137, l));
                break;
              default:
                ct(t, l, g, S, a, b);
            }
        return;
      default:
        if (ai(l)) {
          for (var ft in e)
            ((S = e[ft]),
              e.hasOwnProperty(ft) &&
                S !== void 0 &&
                !a.hasOwnProperty(ft) &&
                Xc(t, l, ft, void 0, a, S));
          for (p in a)
            ((S = a[p]),
              (b = e[p]),
              !a.hasOwnProperty(p) ||
                S === b ||
                (S === void 0 && b === void 0) ||
                Xc(t, l, p, S, a, b));
          return;
        }
    }
    for (var v in e)
      ((S = e[v]),
        e.hasOwnProperty(v) &&
          S != null &&
          !a.hasOwnProperty(v) &&
          ct(t, l, v, null, a, S));
    for (M in a)
      ((S = a[M]),
        (b = e[M]),
        !a.hasOwnProperty(M) ||
          S === b ||
          (S == null && b == null) ||
          ct(t, l, M, S, a, b));
  }
  var Zc = null,
    Vc = null;
  function Mn(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function Yo(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Go(t, l) {
    if (t === 0)
      switch (l) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && l === "foreignObject" ? 0 : t;
  }
  function Lc(t, l) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof l.children == "string" ||
      typeof l.children == "number" ||
      typeof l.children == "bigint" ||
      (typeof l.dangerouslySetInnerHTML == "object" &&
        l.dangerouslySetInnerHTML !== null &&
        l.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Kc = null;
  function _0() {
    var t = window.event;
    return t && t.type === "popstate"
      ? t === Kc
        ? !1
        : ((Kc = t), !0)
      : ((Kc = null), !1);
  }
  var Xo = typeof setTimeout == "function" ? setTimeout : void 0,
    U0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Zo = typeof Promise == "function" ? Promise : void 0,
    R0 =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Zo < "u"
          ? function (t) {
              return Zo.resolve(null).then(t).catch(N0);
            }
          : Xo;
  function N0(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function se(t) {
    return t === "head";
  }
  function Vo(t, l) {
    var e = l,
      a = 0,
      u = 0;
    do {
      var n = e.nextSibling;
      if ((t.removeChild(e), n && n.nodeType === 8))
        if (((e = n.data), e === "/$")) {
          if (0 < a && 8 > a) {
            e = a;
            var c = t.ownerDocument;
            if ((e & 1 && su(c.documentElement), e & 2 && su(c.body), e & 4))
              for (e = c.head, su(e), c = e.firstChild; c; ) {
                var f = c.nextSibling,
                  o = c.nodeName;
                (c[Oa] ||
                  o === "SCRIPT" ||
                  o === "STYLE" ||
                  (o === "LINK" && c.rel.toLowerCase() === "stylesheet") ||
                  e.removeChild(c),
                  (c = f));
              }
          }
          if (u === 0) {
            (t.removeChild(n), gu(l));
            return;
          }
          u--;
        } else
          e === "$" || e === "$?" || e === "$!"
            ? u++
            : (a = e.charCodeAt(0) - 48);
      else a = 0;
      e = n;
    } while (e);
    gu(l);
  }
  function wc(t) {
    var l = t.firstChild;
    for (l && l.nodeType === 10 && (l = l.nextSibling); l; ) {
      var e = l;
      switch (((l = l.nextSibling), e.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (wc(e), Fn(e));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(e);
    }
  }
  function x0(t, l, e, a) {
    for (; t.nodeType === 1; ) {
      var u = e;
      if (t.nodeName.toLowerCase() !== l.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (a) {
        if (!t[Oa])
          switch (l) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (
                ((n = t.getAttribute("rel")),
                n === "stylesheet" && t.hasAttribute("data-precedence"))
              )
                break;
              if (
                n !== u.rel ||
                t.getAttribute("href") !==
                  (u.href == null || u.href === "" ? null : u.href) ||
                t.getAttribute("crossorigin") !==
                  (u.crossOrigin == null ? null : u.crossOrigin) ||
                t.getAttribute("title") !== (u.title == null ? null : u.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((n = t.getAttribute("src")),
                (n !== (u.src == null ? null : u.src) ||
                  t.getAttribute("type") !== (u.type == null ? null : u.type) ||
                  t.getAttribute("crossorigin") !==
                    (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  n &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (l === "input" && t.type === "hidden") {
        var n = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && t.getAttribute("name") === n) return t;
      } else return t;
      if (((t = Sl(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function q0(t, l, e) {
    if (l === "") return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !e) ||
        ((t = Sl(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Jc(t) {
    return (
      t.data === "$!" ||
      (t.data === "$?" && t.ownerDocument.readyState === "complete")
    );
  }
  function H0(t, l) {
    var e = t.ownerDocument;
    if (t.data !== "$?" || e.readyState === "complete") l();
    else {
      var a = function () {
        (l(), e.removeEventListener("DOMContentLoaded", a));
      };
      (e.addEventListener("DOMContentLoaded", a), (t._reactRetry = a));
    }
  }
  function Sl(t) {
    for (; t != null; t = t.nextSibling) {
      var l = t.nodeType;
      if (l === 1 || l === 3) break;
      if (l === 8) {
        if (
          ((l = t.data),
          l === "$" || l === "$!" || l === "$?" || l === "F!" || l === "F")
        )
          break;
        if (l === "/$") return null;
      }
    }
    return t;
  }
  var kc = null;
  function Lo(t) {
    t = t.previousSibling;
    for (var l = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === "$" || e === "$!" || e === "$?") {
          if (l === 0) return t;
          l--;
        } else e === "/$" && l++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Ko(t, l, e) {
    switch (((l = Mn(e)), t)) {
      case "html":
        if (((t = l.documentElement), !t)) throw Error(r(452));
        return t;
      case "head":
        if (((t = l.head), !t)) throw Error(r(453));
        return t;
      case "body":
        if (((t = l.body), !t)) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function su(t) {
    for (var l = t.attributes; l.length; ) t.removeAttributeNode(l[0]);
    Fn(t);
  }
  var vl = new Map(),
    wo = new Set();
  function zn(t) {
    return typeof t.getRootNode == "function"
      ? t.getRootNode()
      : t.nodeType === 9
        ? t
        : t.ownerDocument;
  }
  var Vl = x.d;
  x.d = { f: C0, r: Q0, D: j0, C: B0, L: Y0, m: G0, X: Z0, S: X0, M: V0 };
  function C0() {
    var t = Vl.f(),
      l = gn();
    return t || l;
  }
  function Q0(t) {
    var l = Be(t);
    l !== null && l.tag === 5 && l.type === "form" ? or(l) : Vl.r(t);
  }
  var Sa = typeof document > "u" ? null : document;
  function Jo(t, l, e) {
    var a = Sa;
    if (a && typeof l == "string" && l) {
      var u = fl(l);
      ((u = 'link[rel="' + t + '"][href="' + u + '"]'),
        typeof e == "string" && (u += '[crossorigin="' + e + '"]'),
        wo.has(u) ||
          (wo.add(u),
          (t = { rel: t, crossOrigin: e, href: l }),
          a.querySelector(u) === null &&
            ((l = a.createElement("link")),
            Ht(l, "link", t),
            Dt(l),
            a.head.appendChild(l))));
    }
  }
  function j0(t) {
    (Vl.D(t), Jo("dns-prefetch", t, null));
  }
  function B0(t, l) {
    (Vl.C(t, l), Jo("preconnect", t, l));
  }
  function Y0(t, l, e) {
    Vl.L(t, l, e);
    var a = Sa;
    if (a && t && l) {
      var u = 'link[rel="preload"][as="' + fl(l) + '"]';
      l === "image" && e && e.imageSrcSet
        ? ((u += '[imagesrcset="' + fl(e.imageSrcSet) + '"]'),
          typeof e.imageSizes == "string" &&
            (u += '[imagesizes="' + fl(e.imageSizes) + '"]'))
        : (u += '[href="' + fl(t) + '"]');
      var n = u;
      switch (l) {
        case "style":
          n = ba(t);
          break;
        case "script":
          n = pa(t);
      }
      vl.has(n) ||
        ((t = R(
          {
            rel: "preload",
            href: l === "image" && e && e.imageSrcSet ? void 0 : t,
            as: l,
          },
          e,
        )),
        vl.set(n, t),
        a.querySelector(u) !== null ||
          (l === "style" && a.querySelector(ru(n))) ||
          (l === "script" && a.querySelector(ou(n))) ||
          ((l = a.createElement("link")),
          Ht(l, "link", t),
          Dt(l),
          a.head.appendChild(l)));
    }
  }
  function G0(t, l) {
    Vl.m(t, l);
    var e = Sa;
    if (e && t) {
      var a = l && typeof l.as == "string" ? l.as : "script",
        u =
          'link[rel="modulepreload"][as="' + fl(a) + '"][href="' + fl(t) + '"]',
        n = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = pa(t);
      }
      if (
        !vl.has(n) &&
        ((t = R({ rel: "modulepreload", href: t }, l)),
        vl.set(n, t),
        e.querySelector(u) === null)
      ) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(ou(n))) return;
        }
        ((a = e.createElement("link")),
          Ht(a, "link", t),
          Dt(a),
          e.head.appendChild(a));
      }
    }
  }
  function X0(t, l, e) {
    Vl.S(t, l, e);
    var a = Sa;
    if (a && t) {
      var u = Ye(a).hoistableStyles,
        n = ba(t);
      l = l || "default";
      var c = u.get(n);
      if (!c) {
        var f = { loading: 0, preload: null };
        if ((c = a.querySelector(ru(n)))) f.loading = 5;
        else {
          ((t = R({ rel: "stylesheet", href: t, "data-precedence": l }, e)),
            (e = vl.get(n)) && Wc(t, e));
          var o = (c = a.createElement("link"));
          (Dt(o),
            Ht(o, "link", t),
            (o._p = new Promise(function (g, p) {
              ((o.onload = g), (o.onerror = p));
            })),
            o.addEventListener("load", function () {
              f.loading |= 1;
            }),
            o.addEventListener("error", function () {
              f.loading |= 2;
            }),
            (f.loading |= 4),
            Dn(c, l, a));
        }
        ((c = { type: "stylesheet", instance: c, count: 1, state: f }),
          u.set(n, c));
      }
    }
  }
  function Z0(t, l) {
    Vl.X(t, l);
    var e = Sa;
    if (e && t) {
      var a = Ye(e).hoistableScripts,
        u = pa(t),
        n = a.get(u);
      n ||
        ((n = e.querySelector(ou(u))),
        n ||
          ((t = R({ src: t, async: !0 }, l)),
          (l = vl.get(u)) && $c(t, l),
          (n = e.createElement("script")),
          Dt(n),
          Ht(n, "link", t),
          e.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function V0(t, l) {
    Vl.M(t, l);
    var e = Sa;
    if (e && t) {
      var a = Ye(e).hoistableScripts,
        u = pa(t),
        n = a.get(u);
      n ||
        ((n = e.querySelector(ou(u))),
        n ||
          ((t = R({ src: t, async: !0, type: "module" }, l)),
          (l = vl.get(u)) && $c(t, l),
          (n = e.createElement("script")),
          Dt(n),
          Ht(n, "link", t),
          e.head.appendChild(n)),
        (n = { type: "script", instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function ko(t, l, e, a) {
    var u = (u = Z.current) ? zn(u) : null;
    if (!u) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string"
          ? ((l = ba(e.href)),
            (e = Ye(u).hoistableStyles),
            (a = e.get(l)),
            a ||
              ((a = { type: "style", instance: null, count: 0, state: null }),
              e.set(l, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          e.rel === "stylesheet" &&
          typeof e.href == "string" &&
          typeof e.precedence == "string"
        ) {
          t = ba(e.href);
          var n = Ye(u).hoistableStyles,
            c = n.get(t);
          if (
            (c ||
              ((u = u.ownerDocument || u),
              (c = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              n.set(t, c),
              (n = u.querySelector(ru(t))) &&
                !n._p &&
                ((c.instance = n), (c.state.loading = 5)),
              vl.has(t) ||
                ((e = {
                  rel: "preload",
                  as: "style",
                  href: e.href,
                  crossOrigin: e.crossOrigin,
                  integrity: e.integrity,
                  media: e.media,
                  hrefLang: e.hrefLang,
                  referrerPolicy: e.referrerPolicy,
                }),
                vl.set(t, e),
                n || L0(u, t, e, c.state))),
            l && a === null)
          )
            throw Error(r(528, ""));
          return c;
        }
        if (l && a !== null) throw Error(r(529, ""));
        return null;
      case "script":
        return (
          (l = e.async),
          (e = e.src),
          typeof e == "string" &&
          l &&
          typeof l != "function" &&
          typeof l != "symbol"
            ? ((l = pa(e)),
              (e = Ye(u).hoistableScripts),
              (a = e.get(l)),
              a ||
                ((a = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                e.set(l, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(r(444, t));
    }
  }
  function ba(t) {
    return 'href="' + fl(t) + '"';
  }
  function ru(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function Wo(t) {
    return R({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function L0(t, l, e, a) {
    t.querySelector('link[rel="preload"][as="style"][' + l + "]")
      ? (a.loading = 1)
      : ((l = t.createElement("link")),
        (a.preload = l),
        l.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        l.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        Ht(l, "link", e),
        Dt(l),
        t.head.appendChild(l));
  }
  function pa(t) {
    return '[src="' + fl(t) + '"]';
  }
  function ou(t) {
    return "script[async]" + t;
  }
  function $o(t, l, e) {
    if ((l.count++, l.instance === null))
      switch (l.type) {
        case "style":
          var a = t.querySelector('style[data-href~="' + fl(e.href) + '"]');
          if (a) return ((l.instance = a), Dt(a), a);
          var u = R({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (t.ownerDocument || t).createElement("style")),
            Dt(a),
            Ht(a, "style", u),
            Dn(a, e.precedence, t),
            (l.instance = a)
          );
        case "stylesheet":
          u = ba(e.href);
          var n = t.querySelector(ru(u));
          if (n) return ((l.state.loading |= 4), (l.instance = n), Dt(n), n);
          ((a = Wo(e)),
            (u = vl.get(u)) && Wc(a, u),
            (n = (t.ownerDocument || t).createElement("link")),
            Dt(n));
          var c = n;
          return (
            (c._p = new Promise(function (f, o) {
              ((c.onload = f), (c.onerror = o));
            })),
            Ht(n, "link", a),
            (l.state.loading |= 4),
            Dn(n, e.precedence, t),
            (l.instance = n)
          );
        case "script":
          return (
            (n = pa(e.src)),
            (u = t.querySelector(ou(n)))
              ? ((l.instance = u), Dt(u), u)
              : ((a = e),
                (u = vl.get(n)) && ((a = R({}, e)), $c(a, u)),
                (t = t.ownerDocument || t),
                (u = t.createElement("script")),
                Dt(u),
                Ht(u, "link", a),
                t.head.appendChild(u),
                (l.instance = u))
          );
        case "void":
          return null;
        default:
          throw Error(r(443, l.type));
      }
    else
      l.type === "stylesheet" &&
        (l.state.loading & 4) === 0 &&
        ((a = l.instance), (l.state.loading |= 4), Dn(a, e.precedence, t));
    return l.instance;
  }
  function Dn(t, l, e) {
    for (
      var a = e.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        u = a.length ? a[a.length - 1] : null,
        n = u,
        c = 0;
      c < a.length;
      c++
    ) {
      var f = a[c];
      if (f.dataset.precedence === l) n = f;
      else if (n !== u) break;
    }
    n
      ? n.parentNode.insertBefore(t, n.nextSibling)
      : ((l = e.nodeType === 9 ? e.head : e), l.insertBefore(t, l.firstChild));
  }
  function Wc(t, l) {
    (t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.title == null && (t.title = l.title));
  }
  function $c(t, l) {
    (t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.integrity == null && (t.integrity = l.integrity));
  }
  var _n = null;
  function Fo(t, l, e) {
    if (_n === null) {
      var a = new Map(),
        u = (_n = new Map());
      u.set(e, a);
    } else ((u = _n), (a = u.get(e)), a || ((a = new Map()), u.set(e, a)));
    if (a.has(t)) return a;
    for (
      a.set(t, null), e = e.getElementsByTagName(t), u = 0;
      u < e.length;
      u++
    ) {
      var n = e[u];
      if (
        !(
          n[Oa] ||
          n[Yt] ||
          (t === "link" && n.getAttribute("rel") === "stylesheet")
        ) &&
        n.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var c = n.getAttribute(l) || "";
        c = t + c;
        var f = a.get(c);
        f ? f.push(n) : a.set(c, [n]);
      }
    }
    return a;
  }
  function Po(t, l, e) {
    ((t = t.ownerDocument || t),
      t.head.insertBefore(
        e,
        l === "title" ? t.querySelector("head > title") : null,
      ));
  }
  function K0(t, l, e) {
    if (e === 1 || l.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof l.precedence != "string" ||
          typeof l.href != "string" ||
          l.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof l.rel != "string" ||
          typeof l.href != "string" ||
          l.href === "" ||
          l.onLoad ||
          l.onError
        )
          break;
        switch (l.rel) {
          case "stylesheet":
            return (
              (t = l.disabled),
              typeof l.precedence == "string" && t == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          l.async &&
          typeof l.async != "function" &&
          typeof l.async != "symbol" &&
          !l.onLoad &&
          !l.onError &&
          l.src &&
          typeof l.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Io(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  var hu = null;
  function w0() {}
  function J0(t, l, e) {
    if (hu === null) throw Error(r(475));
    var a = hu;
    if (
      l.type === "stylesheet" &&
      (typeof e.media != "string" || matchMedia(e.media).matches !== !1) &&
      (l.state.loading & 4) === 0
    ) {
      if (l.instance === null) {
        var u = ba(e.href),
          n = t.querySelector(ru(u));
        if (n) {
          ((t = n._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (a.count++, (a = Un.bind(a)), t.then(a, a)),
            (l.state.loading |= 4),
            (l.instance = n),
            Dt(n));
          return;
        }
        ((n = t.ownerDocument || t),
          (e = Wo(e)),
          (u = vl.get(u)) && Wc(e, u),
          (n = n.createElement("link")),
          Dt(n));
        var c = n;
        ((c._p = new Promise(function (f, o) {
          ((c.onload = f), (c.onerror = o));
        })),
          Ht(n, "link", e),
          (l.instance = n));
      }
      (a.stylesheets === null && (a.stylesheets = new Map()),
        a.stylesheets.set(l, t),
        (t = l.state.preload) &&
          (l.state.loading & 3) === 0 &&
          (a.count++,
          (l = Un.bind(a)),
          t.addEventListener("load", l),
          t.addEventListener("error", l)));
    }
  }
  function k0() {
    if (hu === null) throw Error(r(475));
    var t = hu;
    return (
      t.stylesheets && t.count === 0 && Fc(t, t.stylesheets),
      0 < t.count
        ? function (l) {
            var e = setTimeout(function () {
              if ((t.stylesheets && Fc(t, t.stylesheets), t.unsuspend)) {
                var a = t.unsuspend;
                ((t.unsuspend = null), a());
              }
            }, 6e4);
            return (
              (t.unsuspend = l),
              function () {
                ((t.unsuspend = null), clearTimeout(e));
              }
            );
          }
        : null
    );
  }
  function Un() {
    if ((this.count--, this.count === 0)) {
      if (this.stylesheets) Fc(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        ((this.unsuspend = null), t());
      }
    }
  }
  var Rn = null;
  function Fc(t, l) {
    ((t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++,
        (Rn = new Map()),
        l.forEach(W0, t),
        (Rn = null),
        Un.call(t)));
  }
  function W0(t, l) {
    if (!(l.state.loading & 4)) {
      var e = Rn.get(t);
      if (e) var a = e.get(null);
      else {
        ((e = new Map()), Rn.set(t, e));
        for (
          var u = t.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            n = 0;
          n < u.length;
          n++
        ) {
          var c = u[n];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") &&
            (e.set(c.dataset.precedence, c), (a = c));
        }
        a && e.set(null, a);
      }
      ((u = l.instance),
        (c = u.getAttribute("data-precedence")),
        (n = e.get(c) || a),
        n === a && e.set(null, u),
        e.set(c, u),
        this.count++,
        (a = Un.bind(this)),
        u.addEventListener("load", a),
        u.addEventListener("error", a),
        n
          ? n.parentNode.insertBefore(u, n.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t),
            t.insertBefore(u, t.firstChild)),
        (l.state.loading |= 4));
    }
  }
  var du = {
    $$typeof: gt,
    Provider: null,
    Consumer: null,
    _currentValue: G,
    _currentValue2: G,
    _threadCount: 0,
  };
  function $0(t, l, e, a, u, n, c, f) {
    ((this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Jn(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Jn(0)),
      (this.hiddenUpdates = Jn(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = n),
      (this.onRecoverableError = c),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = f),
      (this.incompleteTransitions = new Map()));
  }
  function th(t, l, e, a, u, n, c, f, o, g, p, M) {
    return (
      (t = new $0(t, l, e, c, f, o, g, M)),
      (l = 1),
      n === !0 && (l |= 24),
      (n = ll(3, null, null, l)),
      (t.current = n),
      (n.stateNode = t),
      (l = xi()),
      l.refCount++,
      (t.pooledCache = l),
      l.refCount++,
      (n.memoizedState = { element: a, isDehydrated: e, cache: l }),
      Qi(n),
      t
    );
  }
  function lh(t) {
    return t ? ((t = Fe), t) : Fe;
  }
  function eh(t, l, e, a, u, n) {
    ((u = lh(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = $l(l)),
      (a.payload = { element: e }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (e = Fl(t, a, l)),
      e !== null && (il(e, t, l), Va(e, t, l)));
  }
  function ah(t, l) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var e = t.retryLane;
      t.retryLane = e !== 0 && e < l ? e : l;
    }
  }
  function Pc(t, l) {
    (ah(t, l), (t = t.alternate) && ah(t, l));
  }
  function uh(t) {
    if (t.tag === 13) {
      var l = $e(t, 67108864);
      (l !== null && il(l, t, 67108864), Pc(t, 67108864));
    }
  }
  var Nn = !0;
  function F0(t, l, e, a) {
    var u = T.T;
    T.T = null;
    var n = x.p;
    try {
      ((x.p = 2), Ic(t, l, e, a));
    } finally {
      ((x.p = n), (T.T = u));
    }
  }
  function P0(t, l, e, a) {
    var u = T.T;
    T.T = null;
    var n = x.p;
    try {
      ((x.p = 8), Ic(t, l, e, a));
    } finally {
      ((x.p = n), (T.T = u));
    }
  }
  function Ic(t, l, e, a) {
    if (Nn) {
      var u = tf(a);
      if (u === null) (Gc(t, l, a, xn, e), ih(t, a));
      else if (ty(u, t, l, e, a)) a.stopPropagation();
      else if ((ih(t, a), l & 4 && -1 < I0.indexOf(t))) {
        for (; u !== null; ) {
          var n = Be(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var c = ge(n.pendingLanes);
                  if (c !== 0) {
                    var f = n;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var o = 1 << (31 - It(c));
                      ((f.entanglements[1] |= o), (c &= ~o));
                    }
                    (zl(n), (ut & 6) === 0 && ((vn = Tl() + 500), iu(0)));
                  }
                }
                break;
              case 13:
                ((f = $e(n, 2)), f !== null && il(f, n, 2), gn(), Pc(n, 2));
            }
          if (((n = tf(a)), n === null && Gc(t, l, a, xn, e), n === u)) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else Gc(t, l, a, null, e);
    }
  }
  function tf(t) {
    return ((t = ni(t)), lf(t));
  }
  var xn = null;
  function lf(t) {
    if (((xn = null), (t = je(t)), t !== null)) {
      var l = _(t);
      if (l === null) t = null;
      else {
        var e = l.tag;
        if (e === 13) {
          if (((t = Y(l)), t !== null)) return t;
          t = null;
        } else if (e === 3) {
          if (l.stateNode.current.memoizedState.isDehydrated)
            return l.tag === 3 ? l.stateNode.containerInfo : null;
          t = null;
        } else l !== t && (t = null);
      }
    }
    return ((xn = t), null);
  }
  function nh(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Bh()) {
          case Sf:
            return 2;
          case bf:
            return 8;
          case Au:
          case Yh:
            return 32;
          case pf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ef = !1,
    re = null,
    oe = null,
    he = null,
    yu = new Map(),
    vu = new Map(),
    de = [],
    I0 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function ih(t, l) {
    switch (t) {
      case "focusin":
      case "focusout":
        re = null;
        break;
      case "dragenter":
      case "dragleave":
        oe = null;
        break;
      case "mouseover":
      case "mouseout":
        he = null;
        break;
      case "pointerover":
      case "pointerout":
        yu.delete(l.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        vu.delete(l.pointerId);
    }
  }
  function mu(t, l, e, a, u, n) {
    return t === null || t.nativeEvent !== n
      ? ((t = {
          blockedOn: l,
          domEventName: e,
          eventSystemFlags: a,
          nativeEvent: n,
          targetContainers: [u],
        }),
        l !== null && ((l = Be(l)), l !== null && uh(l)),
        t)
      : ((t.eventSystemFlags |= a),
        (l = t.targetContainers),
        u !== null && l.indexOf(u) === -1 && l.push(u),
        t);
  }
  function ty(t, l, e, a, u) {
    switch (l) {
      case "focusin":
        return ((re = mu(re, t, l, e, a, u)), !0);
      case "dragenter":
        return ((oe = mu(oe, t, l, e, a, u)), !0);
      case "mouseover":
        return ((he = mu(he, t, l, e, a, u)), !0);
      case "pointerover":
        var n = u.pointerId;
        return (yu.set(n, mu(yu.get(n) || null, t, l, e, a, u)), !0);
      case "gotpointercapture":
        return (
          (n = u.pointerId),
          vu.set(n, mu(vu.get(n) || null, t, l, e, a, u)),
          !0
        );
    }
    return !1;
  }
  function ch(t) {
    var l = je(t.target);
    if (l !== null) {
      var e = _(l);
      if (e !== null) {
        if (((l = e.tag), l === 13)) {
          if (((l = Y(e)), l !== null)) {
            ((t.blockedOn = l),
              Jh(t.priority, function () {
                if (e.tag === 13) {
                  var a = nl();
                  a = kn(a);
                  var u = $e(e, a);
                  (u !== null && il(u, e, a), Pc(e, a));
                }
              }));
            return;
          }
        } else if (l === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function qn(t) {
    if (t.blockedOn !== null) return !1;
    for (var l = t.targetContainers; 0 < l.length; ) {
      var e = tf(t.nativeEvent);
      if (e === null) {
        e = t.nativeEvent;
        var a = new e.constructor(e.type, e);
        ((ui = a), e.target.dispatchEvent(a), (ui = null));
      } else return ((l = Be(e)), l !== null && uh(l), (t.blockedOn = e), !1);
      l.shift();
    }
    return !0;
  }
  function fh(t, l, e) {
    qn(t) && e.delete(l);
  }
  function ly() {
    ((ef = !1),
      re !== null && qn(re) && (re = null),
      oe !== null && qn(oe) && (oe = null),
      he !== null && qn(he) && (he = null),
      yu.forEach(fh),
      vu.forEach(fh));
  }
  function Hn(t, l) {
    t.blockedOn === l &&
      ((t.blockedOn = null),
      ef ||
        ((ef = !0),
        i.unstable_scheduleCallback(i.unstable_NormalPriority, ly)));
  }
  var Cn = null;
  function sh(t) {
    Cn !== t &&
      ((Cn = t),
      i.unstable_scheduleCallback(i.unstable_NormalPriority, function () {
        Cn === t && (Cn = null);
        for (var l = 0; l < t.length; l += 3) {
          var e = t[l],
            a = t[l + 1],
            u = t[l + 2];
          if (typeof a != "function") {
            if (lf(a || e) === null) continue;
            break;
          }
          var n = Be(e);
          n !== null &&
            (t.splice(l, 3),
            (l -= 3),
            lc(n, { pending: !0, data: u, method: e.method, action: a }, a, u));
        }
      }));
  }
  function gu(t) {
    function l(o) {
      return Hn(o, t);
    }
    (re !== null && Hn(re, t),
      oe !== null && Hn(oe, t),
      he !== null && Hn(he, t),
      yu.forEach(l),
      vu.forEach(l));
    for (var e = 0; e < de.length; e++) {
      var a = de[e];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < de.length && ((e = de[0]), e.blockedOn === null); )
      (ch(e), e.blockedOn === null && de.shift());
    if (((e = (t.ownerDocument || t).$$reactFormReplay), e != null))
      for (a = 0; a < e.length; a += 3) {
        var u = e[a],
          n = e[a + 1],
          c = u[Lt] || null;
        if (typeof n == "function") c || sh(e);
        else if (c) {
          var f = null;
          if (n && n.hasAttribute("formAction")) {
            if (((u = n), (c = n[Lt] || null))) f = c.formAction;
            else if (lf(u) !== null) continue;
          } else f = c.action;
          (typeof f == "function" ? (e[a + 1] = f) : (e.splice(a, 3), (a -= 3)),
            sh(e));
        }
      }
  }
  function af(t) {
    this._internalRoot = t;
  }
  ((Qn.prototype.render = af.prototype.render =
    function (t) {
      var l = this._internalRoot;
      if (l === null) throw Error(r(409));
      var e = l.current,
        a = nl();
      eh(e, a, t, l, null, null);
    }),
    (Qn.prototype.unmount = af.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var l = t.containerInfo;
          (eh(t.current, 2, null, t, null, null), gn(), (l[Qe] = null));
        }
      }));
  function Qn(t) {
    this._internalRoot = t;
  }
  Qn.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var l = Mf();
      t = { blockedOn: null, target: t, priority: l };
      for (var e = 0; e < de.length && l !== 0 && l < de[e].priority; e++);
      (de.splice(e, 0, t), e === 0 && ch(t));
    }
  };
  var rh = s.version;
  if (rh !== "19.1.1") throw Error(r(527, rh, "19.1.1"));
  x.findDOMNode = function (t) {
    var l = t._reactInternals;
    if (l === void 0)
      throw typeof t.render == "function"
        ? Error(r(188))
        : ((t = Object.keys(t).join(",")), Error(r(268, t)));
    return (
      (t = U(l)),
      (t = t !== null ? A(t) : null),
      (t = t === null ? null : t.stateNode),
      t
    );
  };
  var ey = {
    bundleType: 0,
    version: "19.1.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: T,
    reconcilerVersion: "19.1.1",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var jn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!jn.isDisabled && jn.supportsFiber)
      try {
        ((Ta = jn.inject(ey)), (Pt = jn));
      } catch {}
  }
  return (
    (bu.createRoot = function (t, l) {
      if (!E(t)) throw Error(r(299));
      var e = !1,
        a = "",
        u = Mr,
        n = zr,
        c = Dr,
        f = null;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (e = !0),
          l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (u = l.onUncaughtError),
          l.onCaughtError !== void 0 && (n = l.onCaughtError),
          l.onRecoverableError !== void 0 && (c = l.onRecoverableError),
          l.unstable_transitionCallbacks !== void 0 &&
            (f = l.unstable_transitionCallbacks)),
        (l = th(t, 1, !1, null, null, e, a, u, n, c, f, null)),
        (t[Qe] = l.current),
        Yc(t),
        new af(l)
      );
    }),
    (bu.hydrateRoot = function (t, l, e) {
      if (!E(t)) throw Error(r(299));
      var a = !1,
        u = "",
        n = Mr,
        c = zr,
        f = Dr,
        o = null,
        g = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (a = !0),
          e.identifierPrefix !== void 0 && (u = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (c = e.onCaughtError),
          e.onRecoverableError !== void 0 && (f = e.onRecoverableError),
          e.unstable_transitionCallbacks !== void 0 &&
            (o = e.unstable_transitionCallbacks),
          e.formState !== void 0 && (g = e.formState)),
        (l = th(t, 1, !0, l, e ?? null, a, u, n, c, f, o, g)),
        (l.context = lh(null)),
        (e = l.current),
        (a = nl()),
        (a = kn(a)),
        (u = $l(a)),
        (u.callback = null),
        Fl(e, u, a),
        (e = a),
        (l.current.lanes = e),
        Aa(l, e),
        zl(l),
        (t[Qe] = l.current),
        Yc(t),
        new Qn(l)
      );
    }),
    (bu.version = "19.1.1"),
    bu
  );
}
var ph;
function hy() {
  if (ph) return cf.exports;
  ph = 1;
  function i() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i);
      } catch (s) {
        console.error(s);
      }
  }
  return (i(), (cf.exports = oy()), cf.exports);
}
var dy = hy(),
  Gn = class {
    constructor() {
      ((this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this)));
    }
    subscribe(i) {
      return (
        this.listeners.add(i),
        this.onSubscribe(),
        () => {
          (this.listeners.delete(i), this.onUnsubscribe());
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  yy = {
    setTimeout: (i, s) => setTimeout(i, s),
    clearTimeout: (i) => clearTimeout(i),
    setInterval: (i, s) => setInterval(i, s),
    clearInterval: (i) => clearInterval(i),
  },
  vy = class {
    #t = yy;
    #l = !1;
    setTimeoutProvider(i) {
      this.#t = i;
    }
    setTimeout(i, s) {
      return this.#t.setTimeout(i, s);
    }
    clearTimeout(i) {
      this.#t.clearTimeout(i);
    }
    setInterval(i, s) {
      return this.#t.setInterval(i, s);
    }
    clearInterval(i) {
      this.#t.clearInterval(i);
    }
  },
  of = new vy();
function my(i) {
  setTimeout(i, 0);
}
var Xn = typeof window > "u" || "Deno" in globalThis;
function bl() {}
function gy(i, s) {
  return typeof i == "function" ? i(s) : i;
}
function Sy(i) {
  return typeof i == "number" && i >= 0 && i !== 1 / 0;
}
function by(i, s) {
  return Math.max(i + (s || 0) - Date.now(), 0);
}
function hf(i, s) {
  return typeof i == "function" ? i(s) : i;
}
function py(i, s) {
  return typeof i == "function" ? i(s) : i;
}
function Th(i, s) {
  const {
    type: y = "all",
    exact: r,
    fetchStatus: E,
    predicate: _,
    queryKey: Y,
    stale: D,
  } = i;
  if (Y) {
    if (r) {
      if (s.queryHash !== mf(Y, s.options)) return !1;
    } else if (!Tu(s.queryKey, Y)) return !1;
  }
  if (y !== "all") {
    const U = s.isActive();
    if ((y === "active" && !U) || (y === "inactive" && U)) return !1;
  }
  return !(
    (typeof D == "boolean" && s.isStale() !== D) ||
    (E && E !== s.state.fetchStatus) ||
    (_ && !_(s))
  );
}
function Eh(i, s) {
  const { exact: y, status: r, predicate: E, mutationKey: _ } = i;
  if (_) {
    if (!s.options.mutationKey) return !1;
    if (y) {
      if (pu(s.options.mutationKey) !== pu(_)) return !1;
    } else if (!Tu(s.options.mutationKey, _)) return !1;
  }
  return !((r && s.state.status !== r) || (E && !E(s)));
}
function mf(i, s) {
  return (s?.queryKeyHashFn || pu)(i);
}
function pu(i) {
  return JSON.stringify(i, (s, y) =>
    df(y)
      ? Object.keys(y)
          .sort()
          .reduce((r, E) => ((r[E] = y[E]), r), {})
      : y,
  );
}
function Tu(i, s) {
  return i === s
    ? !0
    : typeof i != typeof s
      ? !1
      : i && s && typeof i == "object" && typeof s == "object"
        ? Object.keys(s).every((y) => Tu(i[y], s[y]))
        : !1;
}
var Ty = Object.prototype.hasOwnProperty;
function Uh(i, s) {
  if (i === s) return i;
  const y = Ah(i) && Ah(s);
  if (!y && !(df(i) && df(s))) return s;
  const E = (y ? i : Object.keys(i)).length,
    _ = y ? s : Object.keys(s),
    Y = _.length,
    D = y ? new Array(Y) : {};
  let U = 0;
  for (let A = 0; A < Y; A++) {
    const R = y ? A : _[A],
      F = i[R],
      w = s[R];
    if (F === w) {
      ((D[R] = F), (y ? A < E : Ty.call(i, R)) && U++);
      continue;
    }
    if (
      F === null ||
      w === null ||
      typeof F != "object" ||
      typeof w != "object"
    ) {
      D[R] = w;
      continue;
    }
    const dt = Uh(F, w);
    ((D[R] = dt), dt === F && U++);
  }
  return E === Y && U === E ? i : D;
}
function Ah(i) {
  return Array.isArray(i) && i.length === Object.keys(i).length;
}
function df(i) {
  if (!Oh(i)) return !1;
  const s = i.constructor;
  if (s === void 0) return !0;
  const y = s.prototype;
  return !(
    !Oh(y) ||
    !y.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(i) !== Object.prototype
  );
}
function Oh(i) {
  return Object.prototype.toString.call(i) === "[object Object]";
}
function Ey(i) {
  return new Promise((s) => {
    of.setTimeout(s, i);
  });
}
function Ay(i, s, y) {
  return typeof y.structuralSharing == "function"
    ? y.structuralSharing(i, s)
    : y.structuralSharing !== !1
      ? Uh(i, s)
      : s;
}
function Oy(i, s, y = 0) {
  const r = [...i, s];
  return y && r.length > y ? r.slice(1) : r;
}
function My(i, s, y = 0) {
  const r = [s, ...i];
  return y && r.length > y ? r.slice(0, -1) : r;
}
var gf = Symbol();
function Rh(i, s) {
  return !i.queryFn && s?.initialPromise
    ? () => s.initialPromise
    : !i.queryFn || i.queryFn === gf
      ? () => Promise.reject(new Error(`Missing queryFn: '${i.queryHash}'`))
      : i.queryFn;
}
var zy = class extends Gn {
    #t;
    #l;
    #e;
    constructor() {
      (super(),
        (this.#e = (i) => {
          if (!Xn && window.addEventListener) {
            const s = () => i();
            return (
              window.addEventListener("visibilitychange", s, !1),
              () => {
                window.removeEventListener("visibilitychange", s);
              }
            );
          }
        }));
    }
    onSubscribe() {
      this.#l || this.setEventListener(this.#e);
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#l?.(), (this.#l = void 0));
    }
    setEventListener(i) {
      ((this.#e = i),
        this.#l?.(),
        (this.#l = i((s) => {
          typeof s == "boolean" ? this.setFocused(s) : this.onFocus();
        })));
    }
    setFocused(i) {
      this.#t !== i && ((this.#t = i), this.onFocus());
    }
    onFocus() {
      const i = this.isFocused();
      this.listeners.forEach((s) => {
        s(i);
      });
    }
    isFocused() {
      return typeof this.#t == "boolean"
        ? this.#t
        : globalThis.document?.visibilityState !== "hidden";
    }
  },
  Nh = new zy();
function Dy() {
  let i, s;
  const y = new Promise((E, _) => {
    ((i = E), (s = _));
  });
  ((y.status = "pending"), y.catch(() => {}));
  function r(E) {
    (Object.assign(y, E), delete y.resolve, delete y.reject);
  }
  return (
    (y.resolve = (E) => {
      (r({ status: "fulfilled", value: E }), i(E));
    }),
    (y.reject = (E) => {
      (r({ status: "rejected", reason: E }), s(E));
    }),
    y
  );
}
var _y = my;
function Uy() {
  let i = [],
    s = 0,
    y = (D) => {
      D();
    },
    r = (D) => {
      D();
    },
    E = _y;
  const _ = (D) => {
      s
        ? i.push(D)
        : E(() => {
            y(D);
          });
    },
    Y = () => {
      const D = i;
      ((i = []),
        D.length &&
          E(() => {
            r(() => {
              D.forEach((U) => {
                y(U);
              });
            });
          }));
    };
  return {
    batch: (D) => {
      let U;
      s++;
      try {
        U = D();
      } finally {
        (s--, s || Y());
      }
      return U;
    },
    batchCalls:
      (D) =>
      (...U) => {
        _(() => {
          D(...U);
        });
      },
    schedule: _,
    setNotifyFunction: (D) => {
      y = D;
    },
    setBatchNotifyFunction: (D) => {
      r = D;
    },
    setScheduler: (D) => {
      E = D;
    },
  };
}
var Vt = Uy(),
  Ry = class extends Gn {
    #t = !0;
    #l;
    #e;
    constructor() {
      (super(),
        (this.#e = (i) => {
          if (!Xn && window.addEventListener) {
            const s = () => i(!0),
              y = () => i(!1);
            return (
              window.addEventListener("online", s, !1),
              window.addEventListener("offline", y, !1),
              () => {
                (window.removeEventListener("online", s),
                  window.removeEventListener("offline", y));
              }
            );
          }
        }));
    }
    onSubscribe() {
      this.#l || this.setEventListener(this.#e);
    }
    onUnsubscribe() {
      this.hasListeners() || (this.#l?.(), (this.#l = void 0));
    }
    setEventListener(i) {
      ((this.#e = i), this.#l?.(), (this.#l = i(this.setOnline.bind(this))));
    }
    setOnline(i) {
      this.#t !== i &&
        ((this.#t = i),
        this.listeners.forEach((y) => {
          y(i);
        }));
    }
    isOnline() {
      return this.#t;
    }
  },
  Yn = new Ry();
function Ny(i) {
  return Math.min(1e3 * 2 ** i, 3e4);
}
function xh(i) {
  return (i ?? "online") === "online" ? Yn.isOnline() : !0;
}
var yf = class extends Error {
  constructor(i) {
    (super("CancelledError"),
      (this.revert = i?.revert),
      (this.silent = i?.silent));
  }
};
function qh(i) {
  let s = !1,
    y = 0,
    r;
  const E = Dy(),
    _ = () => E.status !== "pending",
    Y = (I) => {
      if (!_()) {
        const st = new yf(I);
        (w(st), i.onCancel?.(st));
      }
    },
    D = () => {
      s = !0;
    },
    U = () => {
      s = !1;
    },
    A = () =>
      Nh.isFocused() &&
      (i.networkMode === "always" || Yn.isOnline()) &&
      i.canRun(),
    R = () => xh(i.networkMode) && i.canRun(),
    F = (I) => {
      _() || (r?.(), E.resolve(I));
    },
    w = (I) => {
      _() || (r?.(), E.reject(I));
    },
    dt = () =>
      new Promise((I) => {
        ((r = (st) => {
          (_() || A()) && I(st);
        }),
          i.onPause?.());
      }).then(() => {
        ((r = void 0), _() || i.onContinue?.());
      }),
    et = () => {
      if (_()) return;
      let I;
      const st = y === 0 ? i.initialPromise : void 0;
      try {
        I = st ?? i.fn();
      } catch (zt) {
        I = Promise.reject(zt);
      }
      Promise.resolve(I)
        .then(F)
        .catch((zt) => {
          if (_()) return;
          const Nt = i.retry ?? (Xn ? 0 : 3),
            gt = i.retryDelay ?? Ny,
            Ct = typeof gt == "function" ? gt(y, zt) : gt,
            k =
              Nt === !0 ||
              (typeof Nt == "number" && y < Nt) ||
              (typeof Nt == "function" && Nt(y, zt));
          if (s || !k) {
            w(zt);
            return;
          }
          (y++,
            i.onFail?.(y, zt),
            Ey(Ct)
              .then(() => (A() ? void 0 : dt()))
              .then(() => {
                s ? w(zt) : et();
              }));
        });
    };
  return {
    promise: E,
    status: () => E.status,
    cancel: Y,
    continue: () => (r?.(), E),
    cancelRetry: D,
    continueRetry: U,
    canStart: R,
    start: () => (R() ? et() : dt().then(et), E),
  };
}
var Hh = class {
    #t;
    destroy() {
      this.clearGcTimeout();
    }
    scheduleGc() {
      (this.clearGcTimeout(),
        Sy(this.gcTime) &&
          (this.#t = of.setTimeout(() => {
            this.optionalRemove();
          }, this.gcTime)));
    }
    updateGcTime(i) {
      this.gcTime = Math.max(this.gcTime || 0, i ?? (Xn ? 1 / 0 : 300 * 1e3));
    }
    clearGcTimeout() {
      this.#t && (of.clearTimeout(this.#t), (this.#t = void 0));
    }
  },
  xy = class extends Hh {
    #t;
    #l;
    #e;
    #u;
    #a;
    #i;
    #c;
    constructor(i) {
      (super(),
        (this.#c = !1),
        (this.#i = i.defaultOptions),
        this.setOptions(i.options),
        (this.observers = []),
        (this.#u = i.client),
        (this.#e = this.#u.getQueryCache()),
        (this.queryKey = i.queryKey),
        (this.queryHash = i.queryHash),
        (this.#t = Mh(this.options)),
        (this.state = i.state ?? this.#t),
        this.scheduleGc());
    }
    get meta() {
      return this.options.meta;
    }
    get promise() {
      return this.#a?.promise;
    }
    setOptions(i) {
      if (
        ((this.options = { ...this.#i, ...i }),
        this.updateGcTime(this.options.gcTime),
        this.state && this.state.data === void 0)
      ) {
        const s = Mh(this.options);
        s.data !== void 0 &&
          (this.setData(s.data, { updatedAt: s.dataUpdatedAt, manual: !0 }),
          (this.#t = s));
      }
    }
    optionalRemove() {
      !this.observers.length &&
        this.state.fetchStatus === "idle" &&
        this.#e.remove(this);
    }
    setData(i, s) {
      const y = Ay(this.state.data, i, this.options);
      return (
        this.#n({
          data: y,
          type: "success",
          dataUpdatedAt: s?.updatedAt,
          manual: s?.manual,
        }),
        y
      );
    }
    setState(i, s) {
      this.#n({ type: "setState", state: i, setStateOptions: s });
    }
    cancel(i) {
      const s = this.#a?.promise;
      return (this.#a?.cancel(i), s ? s.then(bl).catch(bl) : Promise.resolve());
    }
    destroy() {
      (super.destroy(), this.cancel({ silent: !0 }));
    }
    reset() {
      (this.destroy(), this.setState(this.#t));
    }
    isActive() {
      return this.observers.some((i) => py(i.options.enabled, this) !== !1);
    }
    isDisabled() {
      return this.getObserversCount() > 0
        ? !this.isActive()
        : this.options.queryFn === gf ||
            this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
    }
    isStatic() {
      return this.getObserversCount() > 0
        ? this.observers.some((i) => hf(i.options.staleTime, this) === "static")
        : !1;
    }
    isStale() {
      return this.getObserversCount() > 0
        ? this.observers.some((i) => i.getCurrentResult().isStale)
        : this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(i = 0) {
      return this.state.data === void 0
        ? !0
        : i === "static"
          ? !1
          : this.state.isInvalidated
            ? !0
            : !by(this.state.dataUpdatedAt, i);
    }
    onFocus() {
      (this.observers
        .find((s) => s.shouldFetchOnWindowFocus())
        ?.refetch({ cancelRefetch: !1 }),
        this.#a?.continue());
    }
    onOnline() {
      (this.observers
        .find((s) => s.shouldFetchOnReconnect())
        ?.refetch({ cancelRefetch: !1 }),
        this.#a?.continue());
    }
    addObserver(i) {
      this.observers.includes(i) ||
        (this.observers.push(i),
        this.clearGcTimeout(),
        this.#e.notify({ type: "observerAdded", query: this, observer: i }));
    }
    removeObserver(i) {
      this.observers.includes(i) &&
        ((this.observers = this.observers.filter((s) => s !== i)),
        this.observers.length ||
          (this.#a &&
            (this.#c ? this.#a.cancel({ revert: !0 }) : this.#a.cancelRetry()),
          this.scheduleGc()),
        this.#e.notify({ type: "observerRemoved", query: this, observer: i }));
    }
    getObserversCount() {
      return this.observers.length;
    }
    invalidate() {
      this.state.isInvalidated || this.#n({ type: "invalidate" });
    }
    async fetch(i, s) {
      if (
        this.state.fetchStatus !== "idle" &&
        this.#a?.status() !== "rejected"
      ) {
        if (this.state.data !== void 0 && s?.cancelRefetch)
          this.cancel({ silent: !0 });
        else if (this.#a) return (this.#a.continueRetry(), this.#a.promise);
      }
      if ((i && this.setOptions(i), !this.options.queryFn)) {
        const D = this.observers.find((U) => U.options.queryFn);
        D && this.setOptions(D.options);
      }
      const y = new AbortController(),
        r = (D) => {
          Object.defineProperty(D, "signal", {
            enumerable: !0,
            get: () => ((this.#c = !0), y.signal),
          });
        },
        E = () => {
          const D = Rh(this.options, s),
            A = (() => {
              const R = {
                client: this.#u,
                queryKey: this.queryKey,
                meta: this.meta,
              };
              return (r(R), R);
            })();
          return (
            (this.#c = !1),
            this.options.persister ? this.options.persister(D, A, this) : D(A)
          );
        },
        Y = (() => {
          const D = {
            fetchOptions: s,
            options: this.options,
            queryKey: this.queryKey,
            client: this.#u,
            state: this.state,
            fetchFn: E,
          };
          return (r(D), D);
        })();
      (this.options.behavior?.onFetch(Y, this),
        (this.#l = this.state),
        (this.state.fetchStatus === "idle" ||
          this.state.fetchMeta !== Y.fetchOptions?.meta) &&
          this.#n({ type: "fetch", meta: Y.fetchOptions?.meta }),
        (this.#a = qh({
          initialPromise: s?.initialPromise,
          fn: Y.fetchFn,
          onCancel: (D) => {
            (D instanceof yf &&
              D.revert &&
              this.setState({ ...this.#l, fetchStatus: "idle" }),
              y.abort());
          },
          onFail: (D, U) => {
            this.#n({ type: "failed", failureCount: D, error: U });
          },
          onPause: () => {
            this.#n({ type: "pause" });
          },
          onContinue: () => {
            this.#n({ type: "continue" });
          },
          retry: Y.options.retry,
          retryDelay: Y.options.retryDelay,
          networkMode: Y.options.networkMode,
          canRun: () => !0,
        })));
      try {
        const D = await this.#a.start();
        if (D === void 0)
          throw new Error(`${this.queryHash} data is undefined`);
        return (
          this.setData(D),
          this.#e.config.onSuccess?.(D, this),
          this.#e.config.onSettled?.(D, this.state.error, this),
          D
        );
      } catch (D) {
        if (D instanceof yf) {
          if (D.silent) return this.#a.promise;
          if (D.revert) {
            if (this.state.data === void 0) throw D;
            return this.state.data;
          }
        }
        throw (
          this.#n({ type: "error", error: D }),
          this.#e.config.onError?.(D, this),
          this.#e.config.onSettled?.(this.state.data, D, this),
          D
        );
      } finally {
        this.scheduleGc();
      }
    }
    #n(i) {
      const s = (y) => {
        switch (i.type) {
          case "failed":
            return {
              ...y,
              fetchFailureCount: i.failureCount,
              fetchFailureReason: i.error,
            };
          case "pause":
            return { ...y, fetchStatus: "paused" };
          case "continue":
            return { ...y, fetchStatus: "fetching" };
          case "fetch":
            return {
              ...y,
              ...qy(y.data, this.options),
              fetchMeta: i.meta ?? null,
            };
          case "success":
            const r = {
              ...y,
              data: i.data,
              dataUpdateCount: y.dataUpdateCount + 1,
              dataUpdatedAt: i.dataUpdatedAt ?? Date.now(),
              error: null,
              isInvalidated: !1,
              status: "success",
              ...(!i.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null,
              }),
            };
            return ((this.#l = i.manual ? r : void 0), r);
          case "error":
            const E = i.error;
            return {
              ...y,
              error: E,
              errorUpdateCount: y.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: y.fetchFailureCount + 1,
              fetchFailureReason: E,
              fetchStatus: "idle",
              status: "error",
            };
          case "invalidate":
            return { ...y, isInvalidated: !0 };
          case "setState":
            return { ...y, ...i.state };
        }
      };
      ((this.state = s(this.state)),
        Vt.batch(() => {
          (this.observers.forEach((y) => {
            y.onQueryUpdate();
          }),
            this.#e.notify({ query: this, type: "updated", action: i }));
        }));
    }
  };
function qy(i, s) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: xh(s.networkMode) ? "fetching" : "paused",
    ...(i === void 0 && { error: null, status: "pending" }),
  };
}
function Mh(i) {
  const s =
      typeof i.initialData == "function" ? i.initialData() : i.initialData,
    y = s !== void 0,
    r = y
      ? typeof i.initialDataUpdatedAt == "function"
        ? i.initialDataUpdatedAt()
        : i.initialDataUpdatedAt
      : 0;
  return {
    data: s,
    dataUpdateCount: 0,
    dataUpdatedAt: y ? (r ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: y ? "success" : "pending",
    fetchStatus: "idle",
  };
}
function zh(i) {
  return {
    onFetch: (s, y) => {
      const r = s.options,
        E = s.fetchOptions?.meta?.fetchMore?.direction,
        _ = s.state.data?.pages || [],
        Y = s.state.data?.pageParams || [];
      let D = { pages: [], pageParams: [] },
        U = 0;
      const A = async () => {
        let R = !1;
        const F = (et) => {
            Object.defineProperty(et, "signal", {
              enumerable: !0,
              get: () => (
                s.signal.aborted
                  ? (R = !0)
                  : s.signal.addEventListener("abort", () => {
                      R = !0;
                    }),
                s.signal
              ),
            });
          },
          w = Rh(s.options, s.fetchOptions),
          dt = async (et, I, st) => {
            if (R) return Promise.reject();
            if (I == null && et.pages.length) return Promise.resolve(et);
            const Nt = (() => {
                const Qt = {
                  client: s.client,
                  queryKey: s.queryKey,
                  pageParam: I,
                  direction: st ? "backward" : "forward",
                  meta: s.options.meta,
                };
                return (F(Qt), Qt);
              })(),
              gt = await w(Nt),
              { maxPages: Ct } = s.options,
              k = st ? My : Oy;
            return {
              pages: k(et.pages, gt, Ct),
              pageParams: k(et.pageParams, I, Ct),
            };
          };
        if (E && _.length) {
          const et = E === "backward",
            I = et ? Hy : Dh,
            st = { pages: _, pageParams: Y },
            zt = I(r, st);
          D = await dt(st, zt, et);
        } else {
          const et = i ?? _.length;
          do {
            const I = U === 0 ? (Y[0] ?? r.initialPageParam) : Dh(r, D);
            if (U > 0 && I == null) break;
            ((D = await dt(D, I)), U++);
          } while (U < et);
        }
        return D;
      };
      s.options.persister
        ? (s.fetchFn = () =>
            s.options.persister?.(
              A,
              {
                client: s.client,
                queryKey: s.queryKey,
                meta: s.options.meta,
                signal: s.signal,
              },
              y,
            ))
        : (s.fetchFn = A);
    },
  };
}
function Dh(i, { pages: s, pageParams: y }) {
  const r = s.length - 1;
  return s.length > 0 ? i.getNextPageParam(s[r], s, y[r], y) : void 0;
}
function Hy(i, { pages: s, pageParams: y }) {
  return s.length > 0 ? i.getPreviousPageParam?.(s[0], s, y[0], y) : void 0;
}
var Cy = class extends Hh {
  #t;
  #l;
  #e;
  constructor(i) {
    (super(),
      (this.mutationId = i.mutationId),
      (this.#l = i.mutationCache),
      (this.#t = []),
      (this.state = i.state || Qy()),
      this.setOptions(i.options),
      this.scheduleGc());
  }
  setOptions(i) {
    ((this.options = i), this.updateGcTime(this.options.gcTime));
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(i) {
    this.#t.includes(i) ||
      (this.#t.push(i),
      this.clearGcTimeout(),
      this.#l.notify({ type: "observerAdded", mutation: this, observer: i }));
  }
  removeObserver(i) {
    ((this.#t = this.#t.filter((s) => s !== i)),
      this.scheduleGc(),
      this.#l.notify({ type: "observerRemoved", mutation: this, observer: i }));
  }
  optionalRemove() {
    this.#t.length ||
      (this.state.status === "pending"
        ? this.scheduleGc()
        : this.#l.remove(this));
  }
  continue() {
    return this.#e?.continue() ?? this.execute(this.state.variables);
  }
  async execute(i) {
    const s = () => {
      this.#u({ type: "continue" });
    };
    this.#e = qh({
      fn: () =>
        this.options.mutationFn
          ? this.options.mutationFn(i)
          : Promise.reject(new Error("No mutationFn found")),
      onFail: (E, _) => {
        this.#u({ type: "failed", failureCount: E, error: _ });
      },
      onPause: () => {
        this.#u({ type: "pause" });
      },
      onContinue: s,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#l.canRun(this),
    });
    const y = this.state.status === "pending",
      r = !this.#e.canStart();
    try {
      if (y) s();
      else {
        (this.#u({ type: "pending", variables: i, isPaused: r }),
          await this.#l.config.onMutate?.(i, this));
        const _ = await this.options.onMutate?.(i);
        _ !== this.state.context &&
          this.#u({ type: "pending", context: _, variables: i, isPaused: r });
      }
      const E = await this.#e.start();
      return (
        await this.#l.config.onSuccess?.(E, i, this.state.context, this),
        await this.options.onSuccess?.(E, i, this.state.context),
        await this.#l.config.onSettled?.(
          E,
          null,
          this.state.variables,
          this.state.context,
          this,
        ),
        await this.options.onSettled?.(E, null, i, this.state.context),
        this.#u({ type: "success", data: E }),
        E
      );
    } catch (E) {
      try {
        throw (
          await this.#l.config.onError?.(E, i, this.state.context, this),
          await this.options.onError?.(E, i, this.state.context),
          await this.#l.config.onSettled?.(
            void 0,
            E,
            this.state.variables,
            this.state.context,
            this,
          ),
          await this.options.onSettled?.(void 0, E, i, this.state.context),
          E
        );
      } finally {
        this.#u({ type: "error", error: E });
      }
    } finally {
      this.#l.runNext(this);
    }
  }
  #u(i) {
    const s = (y) => {
      switch (i.type) {
        case "failed":
          return { ...y, failureCount: i.failureCount, failureReason: i.error };
        case "pause":
          return { ...y, isPaused: !0 };
        case "continue":
          return { ...y, isPaused: !1 };
        case "pending":
          return {
            ...y,
            context: i.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: i.isPaused,
            status: "pending",
            variables: i.variables,
            submittedAt: Date.now(),
          };
        case "success":
          return {
            ...y,
            data: i.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: !1,
          };
        case "error":
          return {
            ...y,
            data: void 0,
            error: i.error,
            failureCount: y.failureCount + 1,
            failureReason: i.error,
            isPaused: !1,
            status: "error",
          };
      }
    };
    ((this.state = s(this.state)),
      Vt.batch(() => {
        (this.#t.forEach((y) => {
          y.onMutationUpdate(i);
        }),
          this.#l.notify({ mutation: this, type: "updated", action: i }));
      }));
  }
};
function Qy() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var jy = class extends Gn {
  constructor(i = {}) {
    (super(),
      (this.config = i),
      (this.#t = new Set()),
      (this.#l = new Map()),
      (this.#e = 0));
  }
  #t;
  #l;
  #e;
  build(i, s, y) {
    const r = new Cy({
      mutationCache: this,
      mutationId: ++this.#e,
      options: i.defaultMutationOptions(s),
      state: y,
    });
    return (this.add(r), r);
  }
  add(i) {
    this.#t.add(i);
    const s = Bn(i);
    if (typeof s == "string") {
      const y = this.#l.get(s);
      y ? y.push(i) : this.#l.set(s, [i]);
    }
    this.notify({ type: "added", mutation: i });
  }
  remove(i) {
    if (this.#t.delete(i)) {
      const s = Bn(i);
      if (typeof s == "string") {
        const y = this.#l.get(s);
        if (y)
          if (y.length > 1) {
            const r = y.indexOf(i);
            r !== -1 && y.splice(r, 1);
          } else y[0] === i && this.#l.delete(s);
      }
    }
    this.notify({ type: "removed", mutation: i });
  }
  canRun(i) {
    const s = Bn(i);
    if (typeof s == "string") {
      const r = this.#l.get(s)?.find((E) => E.state.status === "pending");
      return !r || r === i;
    } else return !0;
  }
  runNext(i) {
    const s = Bn(i);
    return typeof s == "string"
      ? (this.#l
          .get(s)
          ?.find((r) => r !== i && r.state.isPaused)
          ?.continue() ?? Promise.resolve())
      : Promise.resolve();
  }
  clear() {
    Vt.batch(() => {
      (this.#t.forEach((i) => {
        this.notify({ type: "removed", mutation: i });
      }),
        this.#t.clear(),
        this.#l.clear());
    });
  }
  getAll() {
    return Array.from(this.#t);
  }
  find(i) {
    const s = { exact: !0, ...i };
    return this.getAll().find((y) => Eh(s, y));
  }
  findAll(i = {}) {
    return this.getAll().filter((s) => Eh(i, s));
  }
  notify(i) {
    Vt.batch(() => {
      this.listeners.forEach((s) => {
        s(i);
      });
    });
  }
  resumePausedMutations() {
    const i = this.getAll().filter((s) => s.state.isPaused);
    return Vt.batch(() => Promise.all(i.map((s) => s.continue().catch(bl))));
  }
};
function Bn(i) {
  return i.options.scope?.id;
}
var By = class extends Gn {
    constructor(i = {}) {
      (super(), (this.config = i), (this.#t = new Map()));
    }
    #t;
    build(i, s, y) {
      const r = s.queryKey,
        E = s.queryHash ?? mf(r, s);
      let _ = this.get(E);
      return (
        _ ||
          ((_ = new xy({
            client: i,
            queryKey: r,
            queryHash: E,
            options: i.defaultQueryOptions(s),
            state: y,
            defaultOptions: i.getQueryDefaults(r),
          })),
          this.add(_)),
        _
      );
    }
    add(i) {
      this.#t.has(i.queryHash) ||
        (this.#t.set(i.queryHash, i), this.notify({ type: "added", query: i }));
    }
    remove(i) {
      const s = this.#t.get(i.queryHash);
      s &&
        (i.destroy(),
        s === i && this.#t.delete(i.queryHash),
        this.notify({ type: "removed", query: i }));
    }
    clear() {
      Vt.batch(() => {
        this.getAll().forEach((i) => {
          this.remove(i);
        });
      });
    }
    get(i) {
      return this.#t.get(i);
    }
    getAll() {
      return [...this.#t.values()];
    }
    find(i) {
      const s = { exact: !0, ...i };
      return this.getAll().find((y) => Th(s, y));
    }
    findAll(i = {}) {
      const s = this.getAll();
      return Object.keys(i).length > 0 ? s.filter((y) => Th(i, y)) : s;
    }
    notify(i) {
      Vt.batch(() => {
        this.listeners.forEach((s) => {
          s(i);
        });
      });
    }
    onFocus() {
      Vt.batch(() => {
        this.getAll().forEach((i) => {
          i.onFocus();
        });
      });
    }
    onOnline() {
      Vt.batch(() => {
        this.getAll().forEach((i) => {
          i.onOnline();
        });
      });
    }
  },
  Yy = class {
    #t;
    #l;
    #e;
    #u;
    #a;
    #i;
    #c;
    #n;
    constructor(i = {}) {
      ((this.#t = i.queryCache || new By()),
        (this.#l = i.mutationCache || new jy()),
        (this.#e = i.defaultOptions || {}),
        (this.#u = new Map()),
        (this.#a = new Map()),
        (this.#i = 0));
    }
    mount() {
      (this.#i++,
        this.#i === 1 &&
          ((this.#c = Nh.subscribe(async (i) => {
            i && (await this.resumePausedMutations(), this.#t.onFocus());
          })),
          (this.#n = Yn.subscribe(async (i) => {
            i && (await this.resumePausedMutations(), this.#t.onOnline());
          }))));
    }
    unmount() {
      (this.#i--,
        this.#i === 0 &&
          (this.#c?.(), (this.#c = void 0), this.#n?.(), (this.#n = void 0)));
    }
    isFetching(i) {
      return this.#t.findAll({ ...i, fetchStatus: "fetching" }).length;
    }
    isMutating(i) {
      return this.#l.findAll({ ...i, status: "pending" }).length;
    }
    getQueryData(i) {
      const s = this.defaultQueryOptions({ queryKey: i });
      return this.#t.get(s.queryHash)?.state.data;
    }
    ensureQueryData(i) {
      const s = this.defaultQueryOptions(i),
        y = this.#t.build(this, s),
        r = y.state.data;
      return r === void 0
        ? this.fetchQuery(i)
        : (i.revalidateIfStale &&
            y.isStaleByTime(hf(s.staleTime, y)) &&
            this.prefetchQuery(s),
          Promise.resolve(r));
    }
    getQueriesData(i) {
      return this.#t.findAll(i).map(({ queryKey: s, state: y }) => {
        const r = y.data;
        return [s, r];
      });
    }
    setQueryData(i, s, y) {
      const r = this.defaultQueryOptions({ queryKey: i }),
        _ = this.#t.get(r.queryHash)?.state.data,
        Y = gy(s, _);
      if (Y !== void 0)
        return this.#t.build(this, r).setData(Y, { ...y, manual: !0 });
    }
    setQueriesData(i, s, y) {
      return Vt.batch(() =>
        this.#t
          .findAll(i)
          .map(({ queryKey: r }) => [r, this.setQueryData(r, s, y)]),
      );
    }
    getQueryState(i) {
      const s = this.defaultQueryOptions({ queryKey: i });
      return this.#t.get(s.queryHash)?.state;
    }
    removeQueries(i) {
      const s = this.#t;
      Vt.batch(() => {
        s.findAll(i).forEach((y) => {
          s.remove(y);
        });
      });
    }
    resetQueries(i, s) {
      const y = this.#t;
      return Vt.batch(
        () => (
          y.findAll(i).forEach((r) => {
            r.reset();
          }),
          this.refetchQueries({ type: "active", ...i }, s)
        ),
      );
    }
    cancelQueries(i, s = {}) {
      const y = { revert: !0, ...s },
        r = Vt.batch(() => this.#t.findAll(i).map((E) => E.cancel(y)));
      return Promise.all(r).then(bl).catch(bl);
    }
    invalidateQueries(i, s = {}) {
      return Vt.batch(
        () => (
          this.#t.findAll(i).forEach((y) => {
            y.invalidate();
          }),
          i?.refetchType === "none"
            ? Promise.resolve()
            : this.refetchQueries(
                { ...i, type: i?.refetchType ?? i?.type ?? "active" },
                s,
              )
        ),
      );
    }
    refetchQueries(i, s = {}) {
      const y = { ...s, cancelRefetch: s.cancelRefetch ?? !0 },
        r = Vt.batch(() =>
          this.#t
            .findAll(i)
            .filter((E) => !E.isDisabled() && !E.isStatic())
            .map((E) => {
              let _ = E.fetch(void 0, y);
              return (
                y.throwOnError || (_ = _.catch(bl)),
                E.state.fetchStatus === "paused" ? Promise.resolve() : _
              );
            }),
        );
      return Promise.all(r).then(bl);
    }
    fetchQuery(i) {
      const s = this.defaultQueryOptions(i);
      s.retry === void 0 && (s.retry = !1);
      const y = this.#t.build(this, s);
      return y.isStaleByTime(hf(s.staleTime, y))
        ? y.fetch(s)
        : Promise.resolve(y.state.data);
    }
    prefetchQuery(i) {
      return this.fetchQuery(i).then(bl).catch(bl);
    }
    fetchInfiniteQuery(i) {
      return ((i.behavior = zh(i.pages)), this.fetchQuery(i));
    }
    prefetchInfiniteQuery(i) {
      return this.fetchInfiniteQuery(i).then(bl).catch(bl);
    }
    ensureInfiniteQueryData(i) {
      return ((i.behavior = zh(i.pages)), this.ensureQueryData(i));
    }
    resumePausedMutations() {
      return Yn.isOnline()
        ? this.#l.resumePausedMutations()
        : Promise.resolve();
    }
    getQueryCache() {
      return this.#t;
    }
    getMutationCache() {
      return this.#l;
    }
    getDefaultOptions() {
      return this.#e;
    }
    setDefaultOptions(i) {
      this.#e = i;
    }
    setQueryDefaults(i, s) {
      this.#u.set(pu(i), { queryKey: i, defaultOptions: s });
    }
    getQueryDefaults(i) {
      const s = [...this.#u.values()],
        y = {};
      return (
        s.forEach((r) => {
          Tu(i, r.queryKey) && Object.assign(y, r.defaultOptions);
        }),
        y
      );
    }
    setMutationDefaults(i, s) {
      this.#a.set(pu(i), { mutationKey: i, defaultOptions: s });
    }
    getMutationDefaults(i) {
      const s = [...this.#a.values()],
        y = {};
      return (
        s.forEach((r) => {
          Tu(i, r.mutationKey) && Object.assign(y, r.defaultOptions);
        }),
        y
      );
    }
    defaultQueryOptions(i) {
      if (i._defaulted) return i;
      const s = {
        ...this.#e.queries,
        ...this.getQueryDefaults(i.queryKey),
        ...i,
        _defaulted: !0,
      };
      return (
        s.queryHash || (s.queryHash = mf(s.queryKey, s)),
        s.refetchOnReconnect === void 0 &&
          (s.refetchOnReconnect = s.networkMode !== "always"),
        s.throwOnError === void 0 && (s.throwOnError = !!s.suspense),
        !s.networkMode && s.persister && (s.networkMode = "offlineFirst"),
        s.queryFn === gf && (s.enabled = !1),
        s
      );
    }
    defaultMutationOptions(i) {
      return i?._defaulted
        ? i
        : {
            ...this.#e.mutations,
            ...(i?.mutationKey && this.getMutationDefaults(i.mutationKey)),
            ...i,
            _defaulted: !0,
          };
    }
    clear() {
      (this.#t.clear(), this.#l.clear());
    }
  },
  Gy = Dl.createContext(void 0),
  Xy = ({ client: i, children: s }) => (
    Dl.useEffect(
      () => (
        i.mount(),
        () => {
          i.unmount();
        }
      ),
      [i],
    ),
    L.jsx(Gy.Provider, { value: i, children: s })
  );
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zy = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Vy = (i) =>
    i.replace(/^([A-Z])|[\s-_]+(\w)/g, (s, y, r) =>
      r ? r.toUpperCase() : y.toLowerCase(),
    ),
  _h = (i) => {
    const s = Vy(i);
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  Ch = (...i) =>
    i
      .filter((s, y, r) => !!s && s.trim() !== "" && r.indexOf(s) === y)
      .join(" ")
      .trim(),
  Ly = (i) => {
    for (const s in i)
      if (s.startsWith("aria-") || s === "role" || s === "title") return !0;
  };
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var Ky = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const wy = Dl.forwardRef(
  (
    {
      color: i = "currentColor",
      size: s = 24,
      strokeWidth: y = 2,
      absoluteStrokeWidth: r,
      className: E = "",
      children: _,
      iconNode: Y,
      ...D
    },
    U,
  ) =>
    Dl.createElement(
      "svg",
      {
        ref: U,
        ...Ky,
        width: s,
        height: s,
        stroke: i,
        strokeWidth: r ? (Number(y) * 24) / Number(s) : y,
        className: Ch("lucide", E),
        ...(!_ && !Ly(D) && { "aria-hidden": "true" }),
        ...D,
      },
      [
        ...Y.map(([A, R]) => Dl.createElement(A, R)),
        ...(Array.isArray(_) ? _ : [_]),
      ],
    ),
);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Zn = (i, s) => {
  const y = Dl.forwardRef(({ className: r, ...E }, _) =>
    Dl.createElement(wy, {
      ref: _,
      iconNode: s,
      className: Ch(`lucide-${Zy(_h(i))}`, `lucide-${i}`, r),
      ...E,
    }),
  );
  return ((y.displayName = _h(i)), y);
};
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Jy = [
    ["path", { d: "M12 7v14", key: "1akyts" }],
    [
      "path",
      {
        d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        key: "ruj8y",
      },
    ],
  ],
  ky = Zn("book-open", Jy);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wy = [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
    ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }],
  ],
  $y = Zn("circle-check-big", Wy);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Fy = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  Py = Zn("circle-x", Fy);
/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Iy = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ],
  tv = Zn("info", Iy),
  lv = () => {
    const [i, s] = Dl.useState(!0);
    Dl.useEffect(() => {
      const r = window.chrome;
      r?.storage?.sync &&
        r.storage.sync.get({ kamilEnabled: !0 }, (E) => {
          s(E.kamilEnabled !== !1);
        });
    }, []);
    const y = (r) => {
      s(r);
      const E = window.chrome;
      E?.storage?.sync && E.storage.sync.set({ kamilEnabled: r });
    };
    return L.jsxs("div", {
      className:
        "w-[380px] min-h-[480px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans",
      dir: "rtl",
      children: [
        L.jsx("div", {
          className:
            "px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800",
          children: L.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              L.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  L.jsx("div", {
                    className:
                      "w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center",
                    children: L.jsx(ky, {
                      className: "w-4 h-4 text-gray-600 dark:text-gray-400",
                    }),
                  }),
                  L.jsxs("div", {
                    children: [
                      L.jsx("h1", {
                        className:
                          "text-lg font-semibold text-gray-900 dark:text-white",
                        children: "كمّل",
                      }),
                      L.jsx("p", {
                        className: "text-xs text-gray-500 dark:text-gray-400",
                        children: "إدراج سريع للقرآن",
                      }),
                    ],
                  }),
                ],
              }),
              L.jsx("button", {
                onClick: () => y(!i),
                className: `relative w-12 h-6 rounded-full transition-colors ${i ? "bg-gray-900 dark:bg-white" : "bg-gray-200 dark:bg-gray-700"}`,
                children: L.jsx("span", {
                  className: `absolute top-0.5 w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-transform ${i ? "translate-x-6" : "translate-x-0.5"}`,
                }),
              }),
            ],
          }),
        }),
        L.jsx("div", {
          className: "px-6 py-3 bg-gray-50 dark:bg-gray-800/50",
          children: L.jsxs("div", {
            className: "flex items-center gap-2 text-sm",
            children: [
              i
                ? L.jsx($y, { className: "w-4 h-4 text-green-500" })
                : L.jsx(Py, { className: "w-4 h-4 text-gray-400" }),
              L.jsx("span", {
                className: "text-gray-700 dark:text-gray-300",
                children: i ? "مفعل" : "معطل",
              }),
            ],
          }),
        }),
        L.jsxs("div", {
          className: "px-6 py-6",
          children: [
            L.jsxs("div", {
              className: "mb-6",
              children: [
                L.jsx("h3", {
                  className:
                    "text-sm font-medium text-gray-900 dark:text-white mb-4",
                  children: "كيفية الاستخدام",
                }),
                L.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    L.jsxs("div", {
                      className: "flex gap-3",
                      children: [
                        L.jsx("div", {
                          className:
                            "w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0",
                          children: L.jsx("span", {
                            className:
                              "text-xs font-medium text-gray-600 dark:text-gray-400",
                            children: "1",
                          }),
                        }),
                        L.jsxs("div", {
                          children: [
                            L.jsxs("p", {
                              className:
                                "text-sm text-gray-700 dark:text-gray-300",
                              children: [
                                "اكتب ",
                                L.jsx("span", {
                                  className:
                                    "font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs",
                                  children: "/",
                                }),
                                " ثم ابحث",
                              ],
                            }),
                            L.jsx("p", {
                              className:
                                "text-xs text-gray-500 dark:text-gray-400 mt-1",
                              children: "مثال: /يا",
                            }),
                          ],
                        }),
                      ],
                    }),
                    L.jsxs("div", {
                      className: "flex gap-3",
                      children: [
                        L.jsx("div", {
                          className:
                            "w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0",
                          children: L.jsx("span", {
                            className:
                              "text-xs font-medium text-gray-600 dark:text-gray-400",
                            children: "2",
                          }),
                        }),
                        L.jsxs("div", {
                          children: [
                            L.jsx("p", {
                              className:
                                "text-sm text-gray-700 dark:text-gray-300",
                              children: "اختر من النتائج",
                            }),
                            L.jsx("p", {
                              className:
                                "text-xs text-gray-500 dark:text-gray-400 mt-1",
                              children: "تظهر تلقائياً",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            L.jsx("div", {
              className: "pt-4 border-t border-gray-100 dark:border-gray-800",
              children: L.jsxs("div", {
                className: "flex gap-2",
                children: [
                  L.jsx(tv, {
                    className: "w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0",
                  }),
                  L.jsx("p", {
                    className:
                      "text-xs text-gray-500 dark:text-gray-400 leading-relaxed",
                    children: "الإعدادات محفوظة تلقائياً",
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    });
  },
  ev = new Yy();
dy.createRoot(document.getElementById("root")).render(
  L.jsx(Dl.StrictMode, {
    children: L.jsx(Xy, { client: ev, children: L.jsx(lv, {}) }),
  }),
);
