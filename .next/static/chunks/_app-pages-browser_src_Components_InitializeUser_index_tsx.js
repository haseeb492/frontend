"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["_app-pages-browser_src_Components_InitializeUser_index_tsx"],{

/***/ "(app-pages-browser)/./src/Components/InitializeUser/index.tsx":
/*!*************************************************!*\
  !*** ./src/Components/InitializeUser/index.tsx ***!
  \*************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ \"(app-pages-browser)/./node_modules/react-redux/dist/react-redux.mjs\");\n/* harmony import */ var _redux_slices_userSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/redux/slices/userSlice */ \"(app-pages-browser)/./src/redux/slices/userSlice.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ var _s = $RefreshSig$();\n\n\nconst InitializeUser = ()=>{\n    _s();\n    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();\n    const userData = localStorage.getItem(\"user\");\n    if (userData) {\n        try {\n            const parsedUser = JSON.parse(userData);\n            dispatch((0,_redux_slices_userSlice__WEBPACK_IMPORTED_MODULE_0__.SET_USER)(parsedUser));\n        } catch (error) {\n            console.error(\"Failed to parse user data from localStorage:\", error);\n        }\n    }\n    return null;\n};\n_s(InitializeUser, \"rgTLoBID190wEKCp9+G8W6F7A5M=\", false, function() {\n    return [\n        react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch\n    ];\n});\n_c = InitializeUser;\n/* harmony default export */ __webpack_exports__[\"default\"] = (InitializeUser);\nvar _c;\n$RefreshReg$(_c, \"InitializeUser\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9Db21wb25lbnRzL0luaXRpYWxpemVVc2VyL2luZGV4LnRzeCIsIm1hcHBpbmdzIjoiOzs7O0FBRzBDO0FBQ1U7QUFFcEQsTUFBTUUsaUJBQTJCOztJQUMvQixNQUFNQyxXQUFXSCx3REFBV0E7SUFFNUIsTUFBTUksV0FBV0MsYUFBYUMsT0FBTyxDQUFDO0lBQ3RDLElBQUlGLFVBQVU7UUFDWixJQUFJO1lBQ0YsTUFBTUcsYUFBYUMsS0FBS0MsS0FBSyxDQUFDTDtZQUM5QkQsU0FBU0YsaUVBQVFBLENBQUNNO1FBQ3BCLEVBQUUsT0FBT0csT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsZ0RBQWdEQTtRQUNoRTtJQUNGO0lBRUEsT0FBTztBQUNUO0dBZE1SOztRQUNhRixvREFBV0E7OztLQUR4QkU7QUFnQk4sK0RBQWVBLGNBQWNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL0NvbXBvbmVudHMvSW5pdGlhbGl6ZVVzZXIvaW5kZXgudHN4PzY5MTIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgdXNlRGlzcGF0Y2ggfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IFNFVF9VU0VSIH0gZnJvbSBcIkAvcmVkdXgvc2xpY2VzL3VzZXJTbGljZVwiO1xuXG5jb25zdCBJbml0aWFsaXplVXNlcjogUmVhY3QuRkMgPSAoKSA9PiB7XG4gIGNvbnN0IGRpc3BhdGNoID0gdXNlRGlzcGF0Y2goKTtcblxuICBjb25zdCB1c2VyRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlclwiKTtcbiAgaWYgKHVzZXJEYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZFVzZXIgPSBKU09OLnBhcnNlKHVzZXJEYXRhKTtcbiAgICAgIGRpc3BhdGNoKFNFVF9VU0VSKHBhcnNlZFVzZXIpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwYXJzZSB1c2VyIGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2U6XCIsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEluaXRpYWxpemVVc2VyO1xuIl0sIm5hbWVzIjpbInVzZURpc3BhdGNoIiwiU0VUX1VTRVIiLCJJbml0aWFsaXplVXNlciIsImRpc3BhdGNoIiwidXNlckRhdGEiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicGFyc2VkVXNlciIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/Components/InitializeUser/index.tsx\n"));

/***/ })

}]);