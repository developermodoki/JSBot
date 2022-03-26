"use strict";
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
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
;
const commands = [
    new builders_1.SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true))
];
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
client.on("ready", () => {
    console.log("This Bot is ready");
});
client.on("guildCreate", guild => {
    var _a;
    const checkJSemoji = guild.emojis.cache.find(element => element.name === "js");
    const checkJSemoji2 = guild.emojis.cache.find(element => element.name === "JS");
    checkJSemoji ? void 0 : (checkJSemoji2 ? void 0 : (((_a = guild.me) === null || _a === void 0 ? void 0 : _a.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) ? guild.emojis.create("https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png", "js") : void 0));
    rest.put(v9_1.Routes.applicationGuildCommands(process.env.BOT_ID, guild.id.toString()), { body: commands })
        .then(() => console.log("Registred commands"))
        .catch(error => console.log(error));
});
client.on("interactionCreate", (inter) => __awaiter(void 0, void 0, void 0, function* () {
    if (!inter.isCommand())
        return;
    if (inter.commandName === "runjs") {
        /*
         const vm = new VM({timeout:1000});
         try {
            const result = vm.run(inter.options.getString("code") as string);
            await inter.channel?.send({
                content:result
            })
         } catch(e) {
             await inter.channel?.send(e as string)
         }
         */
        yield inter.reply("This feature is under development");
    }
    if (inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? yield inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if (inter.commandName === "searchmdn") {
        const mdnRes = yield axios_1.default.get(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);
        const mdnApiResponse = JSON.parse(JSON.stringify(mdnRes.data));
        const result = mdnApiResponse.documents.find(element => element.title === inter.options.getString("mdnword"));
        if (result) {
            yield inter.reply({ embeds: [{
                        color: 16776960,
                        title: "Result",
                        fields: [
                            {
                                name: result.title,
                                value: result.summary
                            },
                            {
                                name: "URL",
                                value: "https://developer.mozilla.org" + result.mdn_url
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
}));
//const test = (/^([Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT])$/.test("JavaScript"))
// messages
client.on("messageCreate", (message) => {
    var _a, _b, _c, _d;
    console.log("MESSAGE CREATED");
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
        message.channel.send(`**WARNING: "JS" means JavaScript. It doesn't mean ${process.env.WARN_WORD}**"`);
    }
});
client.login(process.env.DISCORD_TOKEN);
