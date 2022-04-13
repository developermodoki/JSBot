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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const axios_1 = __importDefault(require("axios"));
const vm2_1 = require("vm2");
const firebase = __importStar(require("firebase-admin"));
const database_1 = require("./database");
const database_2 = require("./database");
const util = __importStar(require("util"));
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
;
const commands = [
    new builders_1.SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("ignoreuser").setDescription("Ignore any users(bot level)").addStringOption(opt => opt.setName("ignoreid").setDescription("User ID").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("unignoreuser").setDescription("Unignore any users(bot level)").addStringOption(opt => opt.setName("unignoreid").setDescription("User ID").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("ignorechannel").setDescription("Ignore any channels").addStringOption(opt => opt.setName("ignorechannelid").setDescription("Channnel ID").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("unignorechannel").setDescription("Unignore any channels").addStringOption(opt => opt.setName("unignorechannelid").setDescription("Channel ID").setRequired(true))
];
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
(0, database_2.initIgnoreList)();
(0, database_2.initIgnoreChannelList)();
client.on("ready", bot => {
    console.log("This Bot is ready");
    bot.user.setActivity(`${client.ws.ping}ms | Node.js v16.x`, { type: "WATCHING" });
});
setInterval(() => {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(`${client.ws.ping}ms | Node.js v16.x`, { type: "WATCHING" });
}, 900000);
client.on("guildCreate", guild => {
    var _a;
    const checkJSemoji = guild.emojis.cache.find(element => element.name === "js");
    const checkJSemoji2 = guild.emojis.cache.find(element => element.name === "JS");
    checkJSemoji ? void 0 : (checkJSemoji2 ? void 0 : (((_a = guild.me) === null || _a === void 0 ? void 0 : _a.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) ? guild.emojis.create("https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png", "js") : void 0));
    rest.put(v9_1.Routes.applicationGuildCommands(process.env.BOT_ID, guild.id.toString()), { body: commands })
        .then(() => void 0)
        .catch(error => console.log(error));
});
client.on("interactionCreate", (inter) => __awaiter(void 0, void 0, void 0, function* () {
    if (!inter.isCommand())
        return;
    if (database_1.ignoreList === null || database_1.ignoreList === void 0 ? void 0 : database_1.ignoreList.list.includes(inter.user.id))
        return;
    if (inter.commandName === "runjs") {
        const vm = new vm2_1.VM({
            timeout: 1000
        });
        try {
            const evalResult = vm.run(inter.options.getString("code"));
            inter.reply("```" + util.inspect(evalResult) + "```");
        }
        catch (e) {
            inter.reply("```" + e + "```");
        }
    }
    if (inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? yield inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if (inter.commandName === "searchmdn") {
        const mdnRes = yield axios_1.default.get(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);
        const mdnApiResponse = JSON.parse(JSON.stringify(mdnRes.data));
        const result = mdnApiResponse;
        if (result && result.documents.length !== 0) {
            yield inter.reply({ embeds: [{
                        color: 16776960,
                        title: "Result",
                        fields: [
                            {
                                name: result.documents[0].title,
                                value: result.documents[0].summary
                            },
                            {
                                name: "URL",
                                value: "https://developer.mozilla.org" + result.documents[0].mdn_url
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
    if (inter.commandName === "ignoreuser") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            yield inter.reply("You don't have the permission to run this command.");
        }
        if (inter.options.getString("ignoreid") === process.env.ADMIN_ID) {
            yield inter.reply("Can't ignore Admin");
        }
        yield inter.reply("OK");
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists) {
            yield ignoreData.set({ list: [inter.options.getString("ignoreid")] });
            yield (0, database_2.initIgnoreList)();
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayUnion(inter.options.getString("ignoreid")) });
            yield (0, database_2.initIgnoreList)();
        }
    }
    if (inter.commandName === "unignoreuser") {
        if (inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }
        yield inter.reply("OK");
        const ignoreData = database_1.db.collection("ignoreList").doc("main");
        const ignoreDoc = yield ignoreData.get();
        if (!ignoreDoc.exists) {
            void 0;
        }
        else {
            yield ignoreData.update({ list: firebase.firestore.FieldValue.arrayRemove(inter.options.getString("unignoreid")) });
            (0, database_2.initIgnoreList)();
            console.log(database_1.ignoreChannelList);
        }
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
    var _a, _b, _c, _d;
    if (database_1.ignoreList === null || database_1.ignoreList === void 0 ? void 0 : database_1.ignoreList.list.includes(message.author.id))
        return;
    if (database_1.ignoreChannelList === null || database_1.ignoreChannelList === void 0 ? void 0 : database_1.ignoreChannelList.list.includes(message.channelId))
        return;
    const findJSemoji = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.emojis.cache.find(element => element.name === "js");
    const findJSemoji2 = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.emojis.cache.find(element => element.name === "JS");
    if (message.author.bot)
        return;
    if ((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.me) === null || _d === void 0 ? void 0 : _d.permissions.has("SEND_MESSAGES")) {
        if (message.content.match(/[Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT]/)) {
            findJSemoji ? message.react(findJSemoji.toString()) : (findJSemoji2 ? message.react(findJSemoji2.toString()) : void 0);
        }
    }
    else {
        return;
    }
    if (message.content.indexOf(process.env.WARN_WORD) !== -1) {
        message.channel.send(`**WARNING: "JS" means JavaScript. It doesn't mean ${process.env.WARN_WORD}**`);
    }
});
client.login(process.env.DISCORD_TOKEN);
