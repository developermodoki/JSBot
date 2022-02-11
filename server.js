"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
client.on("ready", () => {
    console.log("This Bot is ready");
});
// messages
client.on("messageCreate", (message) => {
    var _a, _b;
    console.log("MESSAGE CREATED");
    if (message.author.bot)
        return;
    if ((_b = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.permissions.has("SEND_MESSAGES")) {
        if (message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript") {
            message.reply("Yeah! JavaScript is very very AMAZING!!!!!!");
        }
        else if (message.content.match(/js|JS|JavaScript|javascript/)) {
            message.react(process.env.JS_EMOJI_ID);
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
