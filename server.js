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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const lib_1 = require("./lib");
const axios_1 = __importDefault(require("axios"));
const vm2_1 = require("vm2");
const firebase = __importStar(require("firebase-admin"));
const database_1 = require("./database");
const database_2 = require("./database");
const util = __importStar(require("util"));
// v13 => const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});
const Intents = discord_js_1.GatewayIntentBits;
const client = new discord_js_1.Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.GuildEmojisAndStickers,
        Intents.GuildMessageReactions
    ]
});
/* Initialization setup & setting Activity */
client.on("ready", bot => {
    (0, database_1.initList)();
    console.log("This Bot is ready");
    setTimeout(() => {
        bot.user.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`, { type: discord_js_1.ActivityType.Watching });
    }, 5000);
});
/* Update activity */
setInterval(() => {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`, { type: discord_js_1.ActivityType.Watching });
}, 600000);
client.on("guildCreate", guild => {
    (0, lib_1.setUpCommands)(guild.id.toString());
});
client.on("interactionCreate", (inter) => __awaiter(void 0, void 0, void 0, function* () {
    if (!inter.isChatInputCommand())
        return;
    if (database_1.ignoreList === null || database_1.ignoreList === void 0 ? void 0 : database_1.ignoreList.list.includes(inter.user.id))
        return;
    // VM
    if (inter.commandName === "runjs") {
        const vm = new vm2_1.VM({
            timeout: 1000
        });
        try {
            const evalResult = vm.run(inter.options.getString("code"));
            inter.reply("```js\n" + util.inspect(evalResult) + "```");
        }
        catch (e) {
            inter.reply("```" + e + "```");
        }
    }
    // Search Stack Overflow
    if (inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? yield inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    // Search MDN
    if (inter.commandName === "searchmdn") {
        const { data } = yield axios_1.default.get(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);
        if (data && data.documents.length !== 0) {
            yield inter.reply({ embeds: [{
                        color: 16776960,
                        title: "Result",
                        fields: [
                            {
                                name: data.documents[0].title,
                                value: data.documents[0].summary
                            },
                            {
                                name: "URL",
                                value: "https://developer.mozilla.org" + data.documents[0].mdn_url
                            }
                        ]
                    }] });
        }
        else {
            yield inter.reply({ embeds: [{
                        color: 16776960,
                        title: "Result",
                        fields: [
                            {
                                name: "Not Found",
                                value: "not exist"
                            }
                        ]
                    }] });
        }
    }
    // Add Ignored users
    if (inter.commandName === "ignoreuser") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            yield inter.reply("You don't have the permission to run this command.");
        }
        if (inter.options.getString("ignoreid") === process.env.ADMIN_ID) {
            yield inter.reply("Couldn't run this command because you are the administrator of this bot.");
        }
        const userId = inter.options.getString("ignoreid");
        yield inter.deferReply({ ephemeral: true });
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists) {
            yield ignoreData.set({ list: [userId] });
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayUnion(userId) });
        }
        yield (0, database_2.initIgnoreList)();
        yield inter.followUp({ content: `${(yield client.users.fetch(userId)).tag} has been added to the Ignore List`, ephemeral: true });
    }
    if (inter.commandName === "unignoreuser") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }
        yield inter.deferReply({ ephemeral: true });
        const userId = inter.options.getString("unignoreid");
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists)
            void 0;
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayRemove(userId) });
            (0, database_2.initIgnoreList)();
            console.log(database_1.ignoreChannelList);
        }
        yield inter.followUp({ content: `**${(yield client.users.fetch(userId)).tag}** has been removed from the Ignore List`, ephemeral: true });
    }
    if (inter.commandName === "ignorechannel") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            yield inter.reply("You don't have the permission to run this command.");
        }
        yield inter.reply("OK");
        const ignoreData = database_1.db.collection("ignoreChannelList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists) {
            yield ignoreData.set({ list: [inter.options.getString("ignorechannelid")] });
            yield (0, database_2.initIgnoreChannelList)();
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayUnion(inter.options.getString("ignorechannelid")) });
            yield (0, database_2.initIgnoreChannelList)();
        }
    }
    if (inter.commandName === "unignorechannel") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }
        yield inter.reply("OK");
        const ignoreData = database_1.db.collection("ignoreChannelList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists) {
            void 0;
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayRemove(inter.options.getString("unignorechannelid")) });
            (0, database_2.initIgnoreChannelList)();
            console.log(database_1.ignoreChannelList);
        }
    }
}));
//const test = (/^([Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT])$/.test("JavaScript"))
// messages
client.on("messageCreate", (message) => {
    var _a, _b;
    if (database_1.ignoreList === null || database_1.ignoreList === void 0 ? void 0 : database_1.ignoreList.list.includes(message.author.id))
        return;
    if (database_1.ignoreChannelList === null || database_1.ignoreChannelList === void 0 ? void 0 : database_1.ignoreChannelList.list.includes(message.channelId))
        return;
    if (message.author.bot)
        return;
    if ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.me) === null || _b === void 0 ? void 0 : _b.permissions.has(discord_js_1.PermissionFlagsBits.SendMessages)) {
        if (message.content.match(/[Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT]/)) {
            message.react(process.env.JS_EMOJI_ID);
        }
    }
    else
        return;
});
client.login(process.env.DISCORD_TOKEN);
