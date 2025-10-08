"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/onboarding";
exports.ids = ["pages/api/onboarding"];
exports.modules = {

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@solana/web3.js");

/***/ }),

/***/ "@supabase/supabase-js":
/*!****************************************!*\
  !*** external "@supabase/supabase-js" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@supabase/supabase-js");

/***/ }),

/***/ "bip39":
/*!************************!*\
  !*** external "bip39" ***!
  \************************/
/***/ ((module) => {

module.exports = require("bip39");

/***/ }),

/***/ "bs58":
/*!***********************!*\
  !*** external "bs58" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("bs58");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "tweetnacl":
/*!****************************!*\
  !*** external "tweetnacl" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("tweetnacl");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = import("bcryptjs");;

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fonboarding&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fonboarding.js&middlewareConfigBase64=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fonboarding&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fonboarding.js&middlewareConfigBase64=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/api/onboarding.js */ \"(api)/./pages/api/onboarding.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__]);\n_pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/onboarding\",\n        pathname: \"/api/onboarding\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _pages_api_onboarding_js__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRm9uYm9hcmRpbmcmcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPS4lMkZwYWdlcyUyRmFwaSUyRm9uYm9hcmRpbmcuanMmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ0w7QUFDMUQ7QUFDc0Q7QUFDdEQ7QUFDQSxpRUFBZSx3RUFBSyxDQUFDLHFEQUFRLFlBQVksRUFBQztBQUMxQztBQUNPLGVBQWUsd0VBQUssQ0FBQyxxREFBUTtBQUNwQztBQUNPLHdCQUF3QixnSEFBbUI7QUFDbEQ7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsWUFBWTtBQUNaLENBQUM7O0FBRUQscUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kb3Bld2FsbGV0LWZyb250ZW5kLz8wMTA1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2VzQVBJUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9wYWdlcy1hcGkvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgaG9pc3QgfSBmcm9tIFwibmV4dC9kaXN0L2J1aWxkL3RlbXBsYXRlcy9oZWxwZXJzXCI7XG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiLi9wYWdlcy9hcGkvb25ib2FyZGluZy5qc1wiO1xuLy8gUmUtZXhwb3J0IHRoZSBoYW5kbGVyIChzaG91bGQgYmUgdGhlIGRlZmF1bHQgZXhwb3J0KS5cbmV4cG9ydCBkZWZhdWx0IGhvaXN0KHVzZXJsYW5kLCBcImRlZmF1bHRcIik7XG4vLyBSZS1leHBvcnQgY29uZmlnLlxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IGhvaXN0KHVzZXJsYW5kLCBcImNvbmZpZ1wiKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzQVBJUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTX0FQSSxcbiAgICAgICAgcGFnZTogXCIvYXBpL29uYm9hcmRpbmdcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9vbmJvYXJkaW5nXCIsXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlbid0IHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAgICAgICAgYnVuZGxlUGF0aDogXCJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwiXCJcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fonboarding&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fonboarding.js&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./pages/api/onboarding.js":
/*!*********************************!*\
  !*** ./pages/api/onboarding.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _utils_solana__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/solana */ \"(api)/../utils/solana.js\");\n/* harmony import */ var _utils_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/supabase */ \"(api)/../utils/supabase.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([bcryptjs__WEBPACK_IMPORTED_MODULE_2__]);\nbcryptjs__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            error: \"Method not allowed\"\n        });\n    }\n    const { password } = req.body;\n    if (!password || password.length < 6) {\n        return res.status(400).json({\n            error: \"Password must be at least 6 characters.\"\n        });\n    }\n    try {\n        // Hash the password\n        const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hash(password, 10);\n        // Generate wallet\n        const wallet = (0,_utils_solana__WEBPACK_IMPORTED_MODULE_0__.createWallet)();\n        // Get Telegram ID from session or request (replace with your logic)\n        const telegramId = req.cookies.telegramId || req.body.telegramId || \"demo-user\";\n        // Store wallet and hashed password in Supabase\n        await (0,_utils_supabase__WEBPACK_IMPORTED_MODULE_1__.upsertUserWallet)(telegramId, wallet, hashedPassword);\n        res.status(200).json({\n            publicKey: wallet.publicKey\n        });\n    } catch (e) {\n        res.status(500).json({\n            error: e.message || \"Failed to create account.\"\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvb25ib2FyZGluZy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXFEO0FBQ007QUFDN0I7QUFFZixlQUFlRyxRQUFRQyxHQUFHLEVBQUVDLEdBQUc7SUFDNUMsSUFBSUQsSUFBSUUsTUFBTSxLQUFLLFFBQVE7UUFDekIsT0FBT0QsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXFCO0lBQzVEO0lBRUEsTUFBTSxFQUFFQyxRQUFRLEVBQUUsR0FBR04sSUFBSU8sSUFBSTtJQUM3QixJQUFJLENBQUNELFlBQVlBLFNBQVNFLE1BQU0sR0FBRyxHQUFHO1FBQ3BDLE9BQU9QLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUEwQztJQUNqRjtJQUVBLElBQUk7UUFDRixvQkFBb0I7UUFDcEIsTUFBTUksaUJBQWlCLE1BQU1YLHFEQUFXLENBQUNRLFVBQVU7UUFFbkQsa0JBQWtCO1FBQ2xCLE1BQU1LLFNBQVNmLDJEQUFZQTtRQUUzQixvRUFBb0U7UUFDcEUsTUFBTWdCLGFBQWFaLElBQUlhLE9BQU8sQ0FBQ0QsVUFBVSxJQUFJWixJQUFJTyxJQUFJLENBQUNLLFVBQVUsSUFBSTtRQUVwRSwrQ0FBK0M7UUFDL0MsTUFBTWYsaUVBQWdCQSxDQUFDZSxZQUFZRCxRQUFRRjtRQUUzQ1IsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFVSxXQUFXSCxPQUFPRyxTQUFTO1FBQUM7SUFDckQsRUFBRSxPQUFPQyxHQUFHO1FBQ1ZkLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBT1UsRUFBRUMsT0FBTyxJQUFJO1FBQTRCO0lBQ3pFO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kb3Bld2FsbGV0LWZyb250ZW5kLy4vcGFnZXMvYXBpL29uYm9hcmRpbmcuanM/ZjhmZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVXYWxsZXQgfSBmcm9tICcuLi8uLi8uLi91dGlscy9zb2xhbmEnO1xuaW1wb3J0IHsgdXBzZXJ0VXNlcldhbGxldCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3N1cGFiYXNlJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogJ01ldGhvZCBub3QgYWxsb3dlZCcgfSk7XG4gIH1cblxuICBjb25zdCB7IHBhc3N3b3JkIH0gPSByZXEuYm9keTtcbiAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPCA2KSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6ICdQYXNzd29yZCBtdXN0IGJlIGF0IGxlYXN0IDYgY2hhcmFjdGVycy4nIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBIYXNoIHRoZSBwYXNzd29yZFxuICAgIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEwKTtcblxuICAgIC8vIEdlbmVyYXRlIHdhbGxldFxuICAgIGNvbnN0IHdhbGxldCA9IGNyZWF0ZVdhbGxldCgpO1xuXG4gICAgLy8gR2V0IFRlbGVncmFtIElEIGZyb20gc2Vzc2lvbiBvciByZXF1ZXN0IChyZXBsYWNlIHdpdGggeW91ciBsb2dpYylcbiAgICBjb25zdCB0ZWxlZ3JhbUlkID0gcmVxLmNvb2tpZXMudGVsZWdyYW1JZCB8fCByZXEuYm9keS50ZWxlZ3JhbUlkIHx8ICdkZW1vLXVzZXInO1xuXG4gICAgLy8gU3RvcmUgd2FsbGV0IGFuZCBoYXNoZWQgcGFzc3dvcmQgaW4gU3VwYWJhc2VcbiAgICBhd2FpdCB1cHNlcnRVc2VyV2FsbGV0KHRlbGVncmFtSWQsIHdhbGxldCwgaGFzaGVkUGFzc3dvcmQpO1xuXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBwdWJsaWNLZXk6IHdhbGxldC5wdWJsaWNLZXkgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBjcmVhdGUgYWNjb3VudC4nIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlV2FsbGV0IiwidXBzZXJ0VXNlcldhbGxldCIsImJjcnlwdCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJwYXNzd29yZCIsImJvZHkiLCJsZW5ndGgiLCJoYXNoZWRQYXNzd29yZCIsImhhc2giLCJ3YWxsZXQiLCJ0ZWxlZ3JhbUlkIiwiY29va2llcyIsInB1YmxpY0tleSIsImUiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/onboarding.js\n");

/***/ }),

/***/ "(api)/../utils/solana.js":
/*!**************************!*\
  !*** ../utils/solana.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createWallet: () => (/* binding */ createWallet),\n/* harmony export */   getBalance: () => (/* binding */ getBalance),\n/* harmony export */   sendSol: () => (/* binding */ sendSol)\n/* harmony export */ });\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var bs58__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bs58 */ \"bs58\");\n/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bip39 */ \"bip39\");\n/* harmony import */ var tweetnacl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tweetnacl */ \"tweetnacl\");\n\n\n\n\n\nconst connection = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.Connection(process.env.RPC_URL, \"confirmed\");\n\n/**\n * Generate a new wallet (mnemonic + keypair)\n */\nconst createWallet = () => {\n  const mnemonic = (0,bip39__WEBPACK_IMPORTED_MODULE_2__.generateMnemonic)();\n  const seed = (0,bip39__WEBPACK_IMPORTED_MODULE_2__.mnemonicToSeedSync)(mnemonic).slice(0, 32);\n  const keypair = _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.Keypair.fromSeed(seed);\n  return {\n    mnemonic,\n    privateKey: bs58__WEBPACK_IMPORTED_MODULE_1__.encode(keypair.secretKey),\n    publicKey: keypair.publicKey.toBase58(),\n  };\n};\n\n/**\n * Get SOL balance\n */\nconst getBalance = async (pubkey) => {\n  const balance = await connection.getBalance(new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(pubkey));\n  return balance / _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.LAMPORTS_PER_SOL;\n};\n\n/**\n * Send SOL between wallets\n */\nconst sendSol = async (fromSecret, toAddress, amountSol) => {\n  const sender = _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.Keypair.fromSecretKey(bs58__WEBPACK_IMPORTED_MODULE_1__.decode(fromSecret));\n  const transaction = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.Transaction().add(\n    _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.SystemProgram.transfer({\n      fromPubkey: sender.publicKey,\n      toPubkey: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(toAddress),\n      lamports: amountSol * _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.LAMPORTS_PER_SOL,\n    })\n  );\n  const sig = await (0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.sendAndConfirmTransaction)(connection, transaction, [sender]);\n  return sig;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi4vdXRpbHMvc29sYW5hLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFReUI7QUFDRDtBQUNxQztBQUNoQzs7QUFFN0IsdUJBQXVCLHVEQUFVOztBQUVqQztBQUNBO0FBQ0E7QUFDTztBQUNQLG1CQUFtQix1REFBZ0I7QUFDbkMsZUFBZSx5REFBa0I7QUFDakMsa0JBQWtCLG9EQUFPO0FBQ3pCO0FBQ0E7QUFDQSxnQkFBZ0Isd0NBQVc7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1Asa0RBQWtELHNEQUFTO0FBQzNELG1CQUFtQiw2REFBZ0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUCxpQkFBaUIsb0RBQU8sZUFBZSx3Q0FBVztBQUNsRCwwQkFBMEIsd0RBQVc7QUFDckMsSUFBSSwwREFBYTtBQUNqQjtBQUNBLG9CQUFvQixzREFBUztBQUM3Qiw0QkFBNEIsNkRBQWdCO0FBQzVDLEtBQUs7QUFDTDtBQUNBLG9CQUFvQiwwRUFBeUI7QUFDN0M7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2RvcGV3YWxsZXQtZnJvbnRlbmQvLi4vdXRpbHMvc29sYW5hLmpzP2YzMjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29ubmVjdGlvbixcbiAgS2V5cGFpcixcbiAgTEFNUE9SVFNfUEVSX1NPTCxcbiAgUHVibGljS2V5LFxuICBUcmFuc2FjdGlvbixcbiAgU3lzdGVtUHJvZ3JhbSxcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbn0gZnJvbSBcIkBzb2xhbmEvd2ViMy5qc1wiO1xuaW1wb3J0IGJzNTggZnJvbSBcImJzNThcIjtcbmltcG9ydCB7IG1uZW1vbmljVG9TZWVkU3luYywgZ2VuZXJhdGVNbmVtb25pYyB9IGZyb20gXCJiaXAzOVwiO1xuaW1wb3J0IG5hY2wgZnJvbSBcInR3ZWV0bmFjbFwiO1xuXG5jb25zdCBjb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24ocHJvY2Vzcy5lbnYuUlBDX1VSTCwgXCJjb25maXJtZWRcIik7XG5cbi8qKlxuICogR2VuZXJhdGUgYSBuZXcgd2FsbGV0IChtbmVtb25pYyArIGtleXBhaXIpXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVXYWxsZXQgPSAoKSA9PiB7XG4gIGNvbnN0IG1uZW1vbmljID0gZ2VuZXJhdGVNbmVtb25pYygpO1xuICBjb25zdCBzZWVkID0gbW5lbW9uaWNUb1NlZWRTeW5jKG1uZW1vbmljKS5zbGljZSgwLCAzMik7XG4gIGNvbnN0IGtleXBhaXIgPSBLZXlwYWlyLmZyb21TZWVkKHNlZWQpO1xuICByZXR1cm4ge1xuICAgIG1uZW1vbmljLFxuICAgIHByaXZhdGVLZXk6IGJzNTguZW5jb2RlKGtleXBhaXIuc2VjcmV0S2V5KSxcbiAgICBwdWJsaWNLZXk6IGtleXBhaXIucHVibGljS2V5LnRvQmFzZTU4KCksXG4gIH07XG59O1xuXG4vKipcbiAqIEdldCBTT0wgYmFsYW5jZVxuICovXG5leHBvcnQgY29uc3QgZ2V0QmFsYW5jZSA9IGFzeW5jIChwdWJrZXkpID0+IHtcbiAgY29uc3QgYmFsYW5jZSA9IGF3YWl0IGNvbm5lY3Rpb24uZ2V0QmFsYW5jZShuZXcgUHVibGljS2V5KHB1YmtleSkpO1xuICByZXR1cm4gYmFsYW5jZSAvIExBTVBPUlRTX1BFUl9TT0w7XG59O1xuXG4vKipcbiAqIFNlbmQgU09MIGJldHdlZW4gd2FsbGV0c1xuICovXG5leHBvcnQgY29uc3Qgc2VuZFNvbCA9IGFzeW5jIChmcm9tU2VjcmV0LCB0b0FkZHJlc3MsIGFtb3VudFNvbCkgPT4ge1xuICBjb25zdCBzZW5kZXIgPSBLZXlwYWlyLmZyb21TZWNyZXRLZXkoYnM1OC5kZWNvZGUoZnJvbVNlY3JldCkpO1xuICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbigpLmFkZChcbiAgICBTeXN0ZW1Qcm9ncmFtLnRyYW5zZmVyKHtcbiAgICAgIGZyb21QdWJrZXk6IHNlbmRlci5wdWJsaWNLZXksXG4gICAgICB0b1B1YmtleTogbmV3IFB1YmxpY0tleSh0b0FkZHJlc3MpLFxuICAgICAgbGFtcG9ydHM6IGFtb3VudFNvbCAqIExBTVBPUlRTX1BFUl9TT0wsXG4gICAgfSlcbiAgKTtcbiAgY29uc3Qgc2lnID0gYXdhaXQgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbihjb25uZWN0aW9uLCB0cmFuc2FjdGlvbiwgW3NlbmRlcl0pO1xuICByZXR1cm4gc2lnO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/../utils/solana.js\n");

/***/ }),

/***/ "(api)/../utils/supabase.js":
/*!****************************!*\
  !*** ../utils/supabase.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getUserWallet: () => (/* binding */ getUserWallet),\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   upsertUserWallet: () => (/* binding */ upsertUserWallet)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"@supabase/supabase-js\");\n\n\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(\n  process.env.SUPABASE_URL,\n  process.env.SUPABASE_KEY\n);\n\n/**\n * Save or update a user's wallet info\n */\nconst upsertUserWallet = async (telegramId, wallet, hashedPassword) => {\n  const { data, error } = await supabase\n    .from(\"profiles\")\n    .upsert({\n      telegram_id: telegramId,\n      wallet_pubkey: wallet.publicKey,\n      password_hash: hashedPassword,\n      created_at: new Date().toISOString(),\n    })\n    .select();\n  if (error) throw new Error(error.message);\n  return data;\n};\n\n/**\n ** Get a user's wallet by Telegram ID\n */\nconst getUserWallet = async (telegramId) => {\n  const { data, error } = await supabase\n    .from(\"profiles\")\n    .select(\"wallet_pubkey\")\n    .eq(\"telegram_id\", telegramId)\n    .single();\n  if (error) throw new Error(error.message);\n  return data?.wallet_pubkey;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi4vdXRpbHMvc3VwYWJhc2UuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFxRDs7QUFFOUMsaUJBQWlCLG1FQUFZO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQLFVBQVUsY0FBYztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ087QUFDUCxVQUFVLGNBQWM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kb3Bld2FsbGV0LWZyb250ZW5kLy4uL3V0aWxzL3N1cGFiYXNlLmpzP2ZiMjMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSBcIkBzdXBhYmFzZS9zdXBhYmFzZS1qc1wiO1xuXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQoXG4gIHByb2Nlc3MuZW52LlNVUEFCQVNFX1VSTCxcbiAgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfS0VZXG4pO1xuXG4vKipcbiAqIFNhdmUgb3IgdXBkYXRlIGEgdXNlcidzIHdhbGxldCBpbmZvXG4gKi9cbmV4cG9ydCBjb25zdCB1cHNlcnRVc2VyV2FsbGV0ID0gYXN5bmMgKHRlbGVncmFtSWQsIHdhbGxldCwgaGFzaGVkUGFzc3dvcmQpID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAuZnJvbShcInByb2ZpbGVzXCIpXG4gICAgLnVwc2VydCh7XG4gICAgICB0ZWxlZ3JhbV9pZDogdGVsZWdyYW1JZCxcbiAgICAgIHdhbGxldF9wdWJrZXk6IHdhbGxldC5wdWJsaWNLZXksXG4gICAgICBwYXNzd29yZF9oYXNoOiBoYXNoZWRQYXNzd29yZCxcbiAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9KVxuICAgIC5zZWxlY3QoKTtcbiAgaWYgKGVycm9yKSB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gIHJldHVybiBkYXRhO1xufTtcblxuLyoqXG4gKiogR2V0IGEgdXNlcidzIHdhbGxldCBieSBUZWxlZ3JhbSBJRFxuICovXG5leHBvcnQgY29uc3QgZ2V0VXNlcldhbGxldCA9IGFzeW5jICh0ZWxlZ3JhbUlkKSA9PiB7XG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oXCJwcm9maWxlc1wiKVxuICAgIC5zZWxlY3QoXCJ3YWxsZXRfcHVia2V5XCIpXG4gICAgLmVxKFwidGVsZWdyYW1faWRcIiwgdGVsZWdyYW1JZClcbiAgICAuc2luZ2xlKCk7XG4gIGlmIChlcnJvcikgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICByZXR1cm4gZGF0YT8ud2FsbGV0X3B1YmtleTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/../utils/supabase.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fonboarding&preferredRegion=&absolutePagePath=.%2Fpages%2Fapi%2Fonboarding.js&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();