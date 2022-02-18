"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
const commands = [
    new builders_1.SlashCommandBuilder().setName("runjs").setDescription("To run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchstack").setDescription("To search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new builders_1.SlashCommandBuilder().setName("searchmdn").setDescription("To search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true))
];
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
client.on("ready", () => {
    console.log("This Bot is ready");
});
client.on("guildCreate", guild => {
    rest.put(v9_1.Routes.applicationGuildCommands(process.env.BOT_ID, guild.id.toString()), { body: commands })
        .then(() => console.log("Registred commands"))
        .catch(error => console.log(error));
});
client.on("interactionCreate", inter => {
    if (!inter.isCommand())
        return;
    if (inter.commandName === "runjs") {
        inter.reply("This feature is under development");
    }
    if (inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if (inter.commandName === "searchmdn") {
        (inter.options.getString("mdnword") !== null) ? inter.reply(`https://developer.mozilla.org/ja/search?q=${inter.options.getString("mdnword")}`) : void 0;
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
