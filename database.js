"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIgnoreChannelList = exports.initIgnoreList = exports.ignoreChannelList = exports.ignoreList = exports.db = void 0;
const firebase = __importStar(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
firebase.initializeApp({
    credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_ID,
        clientEmail: process.env.FIREBASE_CLIENT,
        privateKey: (_a = process.env.FIREBASE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')
    })
});
exports.db = (0, firestore_1.getFirestore)();
function initIgnoreList() {
    return __awaiter(this, void 0, void 0, function* () {
        const initData = exports.db.collection("ignoreList").doc("main");
        const listInitData = yield initData.get();
        exports.ignoreList = listInitData.data();
    });
}
exports.initIgnoreList = initIgnoreList;
function initIgnoreChannelList() {
    return __awaiter(this, void 0, void 0, function* () {
        const initData = exports.db.collection("ignoreChannelList").doc("main");
        const listInitData = yield initData.get();
        exports.ignoreChannelList = listInitData.data();
    });
}
exports.initIgnoreChannelList = initIgnoreChannelList;
