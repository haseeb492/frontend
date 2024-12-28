"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_Components_InitializeUser_index_tsx";
exports.ids = ["_ssr_src_Components_InitializeUser_index_tsx"];
exports.modules = {

/***/ "(ssr)/./src/Components/InitializeUser/index.tsx":
/*!*************************************************!*\
  !*** ./src/Components/InitializeUser/index.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ \"(ssr)/./node_modules/react-redux/dist/react-redux.mjs\");\n/* harmony import */ var _redux_slices_userSlice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/redux/slices/userSlice */ \"(ssr)/./src/redux/slices/userSlice.tsx\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\nconst InitializeUser = ()=>{\n    const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();\n    const userData = localStorage.getItem(\"user\");\n    if (userData) {\n        try {\n            const parsedUser = JSON.parse(userData);\n            dispatch((0,_redux_slices_userSlice__WEBPACK_IMPORTED_MODULE_0__.SET_USER)(parsedUser));\n        } catch (error) {\n            console.error(\"Failed to parse user data from localStorage:\", error);\n        }\n    }\n    return null;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InitializeUser);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvQ29tcG9uZW50cy9Jbml0aWFsaXplVXNlci9pbmRleC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7OzZEQUcwQztBQUNVO0FBRXBELE1BQU1FLGlCQUEyQjtJQUMvQixNQUFNQyxXQUFXSCx3REFBV0E7SUFFNUIsTUFBTUksV0FBV0MsYUFBYUMsT0FBTyxDQUFDO0lBQ3RDLElBQUlGLFVBQVU7UUFDWixJQUFJO1lBQ0YsTUFBTUcsYUFBYUMsS0FBS0MsS0FBSyxDQUFDTDtZQUM5QkQsU0FBU0YsaUVBQVFBLENBQUNNO1FBQ3BCLEVBQUUsT0FBT0csT0FBTztZQUNkQyxRQUFRRCxLQUFLLENBQUMsZ0RBQWdEQTtRQUNoRTtJQUNGO0lBRUEsT0FBTztBQUNUO0FBRUEsaUVBQWVSLGNBQWNBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96dHBzLXBhbmVsLy4vc3JjL0NvbXBvbmVudHMvSW5pdGlhbGl6ZVVzZXIvaW5kZXgudHN4PzY5MTIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCI7XG5cbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgdXNlRGlzcGF0Y2ggfSBmcm9tIFwicmVhY3QtcmVkdXhcIjtcbmltcG9ydCB7IFNFVF9VU0VSIH0gZnJvbSBcIkAvcmVkdXgvc2xpY2VzL3VzZXJTbGljZVwiO1xuXG5jb25zdCBJbml0aWFsaXplVXNlcjogUmVhY3QuRkMgPSAoKSA9PiB7XG4gIGNvbnN0IGRpc3BhdGNoID0gdXNlRGlzcGF0Y2goKTtcblxuICBjb25zdCB1c2VyRGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlclwiKTtcbiAgaWYgKHVzZXJEYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcnNlZFVzZXIgPSBKU09OLnBhcnNlKHVzZXJEYXRhKTtcbiAgICAgIGRpc3BhdGNoKFNFVF9VU0VSKHBhcnNlZFVzZXIpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwYXJzZSB1c2VyIGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2U6XCIsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEluaXRpYWxpemVVc2VyO1xuIl0sIm5hbWVzIjpbInVzZURpc3BhdGNoIiwiU0VUX1VTRVIiLCJJbml0aWFsaXplVXNlciIsImRpc3BhdGNoIiwidXNlckRhdGEiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicGFyc2VkVXNlciIsIkpTT04iLCJwYXJzZSIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./src/Components/InitializeUser/index.tsx\n");

/***/ })

};
;