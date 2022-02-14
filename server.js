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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const vm = __importStar(require("vm"));
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
const commands = [
    new builders_1.SlashCommandBuilder().setName("runjs").setDescription("To run JavaScript's code").addStringOption(opt => opt.setName("code")),
    new builders_1.SlashCommandBuilder().setName("searchstack").setDescription("To search Stack Overflow").addStringOption(opt => opt.setName("stackWord")),
    new builders_1.SlashCommandBuilder().setName("searchmdn").setDescription("To search MDN").addStringOption(opt => opt.setName("mdnWord"))
];
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
client.on("ready", () => {
    console.log("This Bot is ready");
});
client.on("guildCreate", guild => {
    rest.put(v9_1.Routes.applicationGuildCommands(process.env.BOT_ID, guild.id.toString()), { body: commands })
        .then(() => console.log("Registred commands"))
        .catch(error => console.log("Failed registred commands"));
});
client.on("interactionCreate", inter => {
    if (!inter.isCommand())
        return;
    if (inter.commandName === "js") {
        if (inter.options.getString("code") === null)
            return;
        const optStr = inter.options.getString("code");
        const context = vm.createContext();
        vm.runInContext(`(outer) => {
            globalThis.console = {
             log(...args) {
             outer.console.log(...args);
            }
          };getString
        }`, context)({ console });
        try {
            inter.reply((0, builders_1.codeBlock)("js", vm.runInContext(optStr, context)));
        }
        catch (e) {
            inter.reply((0, builders_1.codeBlock)("js", e));
        }
    }
    if (inter.commandName === "searchstack") {
        (inter.options.getString("stackWord") !== null) ? inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackWord")}`) : void 0;
    }
    if (inter.commandName === "searchmdn") {
        (inter.options.getString("mdnWord") !== null) ? inter.reply(`https://https://developer.mozilla.org/ja/search?q=${inter.options.getString("mdnWord")}`) : void 0;
    }
});
// messages
client.on("messageCreate", (message) => {
    var _a, _b, _c, _d;
    console.log("MESSAGE CREATED");
    const findJSemoji = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.emojis.cache.find(element => element.name === "js");
    const findJSemoji2 = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.emojis.cache.find(element => element.name === "JS");
    if (message.author.bot)
        return;
    if ((_d = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.me) === null || _d === void 0 ? void 0 : _d.permissions.has("SEND_MESSAGES")) {
        if (message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript") {
            const random = Math.floor(Math.random() * 3);
            switch (random) {
                case 0:
                    message.reply("Yeah! JavaScript is very very AMAZING!!");
                    break;
                case 1:
                    message.reply("I'm JavaScript!!");
                    break;
                case 2:
                    message.reply("Did you called me?");
                    break;
            }
        }
        else if (message.content.match(/js|JS|JavaScript|javascript/)) {
            findJSemoji ? message.react(findJSemoji.toString()) : (findJSemoji2 ? message.react(findJSemoji2.toString()) : void 0);
            try {
                console.log("test");
            }
            catch (e) {
                console.log(e);
            }
            ;
        }
        if (message.content === "java" || message.content === "Java") {
            message.reply("My big brother Java!!!!!!!");
        }
    }
    else {
        return;
    }
});
client.login(process.env.DISCORD_TOKEN);
