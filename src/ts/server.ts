import { Message,Client,Intents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as vm from "vm";

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});

const commands = [
    new SlashCommandBuilder().setName("js").setDescription("To run JavaScript's code").addStringOption(opt => opt.setName("code")),
    new SlashCommandBuilder().setName("searchstack").setDescription("To search Stack Overflow").addStringOption(opt => opt.setName("word")),
    new SlashCommandBuilder().setName("searchmdn").setDescription("To search MDN").addStringOption(opt => opt.setName("word"))
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

client.on("ready",() => {
    console.log("This Bot is ready");
});
/*
client.on("guildCreate",guild => {
    rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, guild.id.toString()), {body:commands})
        .then(() => console.log("Registred commands"))
        .catch(error => console.log("Failed registred commands"))
})

client.on("interactionCreate",inter => {
    if(!inter.isCommand()) return;
    if(inter.commandName === "js") {
        const optStr = inter.options.getString;
        const context = vm.createContext();
        vm.runInContext(`(outer) => {
            globalThis.console = {
             log(...args) {
             outer.console.log(...args);
            }
          };
        }`,context)({console});
        try {
            vm.runInContext(optStr as unknown as string,context);
        } catch(e) {
            
        }
    }
});

IT'S DISABLED 
BECAUSE IT'S NOT DOING ENOUGH TESTING.
*/

// messages
client.on("messageCreate",(message:Message) => {
    console.log("MESSAGE CREATED")

    const findJSemoji = message.guild?.emojis.cache.find(element => element.name === "js");
    const findJSemoji2 = message.guild?.emojis.cache.find(element => element.name === "JS");

    if (message.author.bot) return;

    if (message.guild?.me?.permissions.has("SEND_MESSAGES")){
        if(message.content === "js" || message.content === "JS" || message.content === "JavaScript" || message.content === "javascript"){
            const random:number = Math.floor(Math.random() * 3)
            switch(random) {
                case 0 :
                  message.reply("Yeah! JavaScript is very very AMAZING!!")
                  break;
                case 1 : 
                  message.reply("I'm JavaScript!!")
                  break;
                case 2 : 
                  message.reply("Did you called me?")
                  break;
            }

        } else if(message.content.match(/js|JS|JavaScript|javascript/)) {
            findJSemoji ? message.react(findJSemoji.toString()) : (findJSemoji2 ? message.react(findJSemoji2.toString()) : void(0));
        }
        if(message.content === "java" || message.content === "Java") {
            message.reply("My big brother Java!!!!!!!")
        }
    } else {
        return;
    }
});



client.login(process.env.DISCORD_TOKEN);
