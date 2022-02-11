import { Message,Client,Intents } from "discord.js";

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});

client.on("ready",() => {
    console.log("This Bot is ready");
});

// messages
client.on("messageCreate",(message:Message) => {
    console.log("MESSAGE CREATED")
    if (message.author.bot) return;
    if (message.guild?.me?.permissions.has("SEND_MESSAGES")){
        if(message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript"){
            message.reply("Yeah! JavaScript is very very AMAZING!!!!!!");
        } else if(message.content.match(/js|JS|JavaScript|javascript/)) {
            message.react(process.env.JS_EMOJI_ID as string);
        }
        if(message.content === "java" || message.content === "Java") {
            message.reply("My big brother Java!!!!!!!")
        }
    } else {
        return;
    }
});



client.login(process.env.DISCORD_TOKEN);