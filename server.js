"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGES] });
client.on("ready", () => {
    console.log("This Bot is ready");
});
// message
client.on("messageCreate", (message) => {
    console.log(message.content);
    console.log("MESSAGE CREATED");
    if (message.author.bot)
        return;
    if (message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript") {
        message.reply("Yeah! JavaScript is very very AMAZING!!!!!!");
    }
    else if (message.content.match(/js|JS|JavaScript|javascript/)) {
        //message.reply("JS");
        message.react(process.env.JS_EMOJI_ID);
    }
    if (message.content === "java" || message.content === "Java") {
        message.reply("My big brother Java!!!!!!!!!!!!!!!!!");
    }
});
client.login(process.env.DISCORD_TOKEN);
