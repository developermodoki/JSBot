"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateignoreUserList = exports.setUpCommands = void 0;
const discord_js_1 = require("discord.js");
const firebase = __importStar(require("firebase-admin"));
const database_1 = require("./database");
const database_2 = require("./database");
;
/* Commands Utilities  */
const commands = [
    new discord_js_1.SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("ignoreuser").setDescription("Ignore any users(bot level)").addStringOption(opt => opt.setName("ignoreid").setDescription("User ID").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("unignoreuser").setDescription("Unignore any users(bot level)").addStringOption(opt => opt.setName("unignoreid").setDescription("User ID").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("ignorechannel").setDescription("Ignore any channels").addStringOption(opt => opt.setName("ignorechannelid").setDescription("Channnel ID").setRequired(true)),
    new discord_js_1.SlashCommandBuilder().setName("unignorechannel").setDescription("Unignore any channels").addStringOption(opt => opt.setName("unignorechannelid").setDescription("Channel ID").setRequired(true))
];
const setUpCommands = (guildId) => {
    const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.BOT_ID, guildId), { body: commands })
        .then(() => void 0)
        .catch(error => console.log(error));
};
exports.setUpCommands = setUpCommands;
/* Add & remove ignoreList */
const updateignoreUserList = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (type === "ADD") {
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        const query = yield database_1.db.collection("ignoreList").where("main", "in", [userId]).get();
        if (!ignoreDoc.exists) {
            yield ignoreData.set({ list: [userId] });
            (0, database_2.initIgnoreList)();
            return "has been added to the ignore user list";
        }
        else if (query.empty) {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayUnion(userId) });
            return "has been added to the ignore user list";
        }
        else {
            return "has already been added";
        }
    }
    else {
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        const query = yield database_1.db.collection("ignoreList").where("main", "in", [userId]).get();
        if (!ignoreDoc.exists) {
            return "has not been added to the ignore list";
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayRemove(userId) });
            (0, database_2.initIgnoreList)();
            console.log(database_1.ignoreChannelList);
            return "has been removed from the ignore user list";
        }
    }
});
exports.updateignoreUserList = updateignoreUserList;
