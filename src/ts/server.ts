import { Message,Client,Intents } from "discord.js";
import express, { Request,Response } from "express";

const app: express.Express = express();
app.get("/",(req:Request, res:Response) => {
    res.send("Not found");
});
app.listen(process.env.PORT || 5000);

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});

client.on("ready",() => {
    console.log("This Bot is ready");
});

// message
client.on("messageCreate",(message:Message) => {
    console.log("MESSAGE CREATED")
    if (message.author.bot) return;
    if(message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript") {
        message.reply("Yeah! JavaScript is very very AMAZING!!!!!!")
    } else if(message.content.match(/js|JS|JavaScript|javascript/)) {
        //message.reply("JS");
        message.react(process.env.JS_EMOJI_ID as string);
    } 
    if(message.content === "java" || message.content === "Java") {
        message.reply("My big brother Java!!!!!!!!!!!!!!!!!");
    }
});



client.login(process.env.DISCORD_TOKEN);
