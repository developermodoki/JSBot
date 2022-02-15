import { Message,Client,Intents } from "discord.js";
import { codeBlock, SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as vm from "vm";

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});

const commands = [
    new SlashCommandBuilder().setName("runjs").setDescription("To run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new SlashCommandBuilder().setName("searchstack").setDescription("To search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new SlashCommandBuilder().setName("searchmdn").setDescription("To search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true))
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

client.on("ready",() => {
    console.log("This Bot is ready");
});

client.on("guildCreate",guild => {
    rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, guild.id.toString()), {body:commands})
        .then(() => console.log("Registred commands"))
        .catch(error => console.log(error))
})

client.on("interactionCreate",inter => {
    if(!inter.isCommand()) return;
    if(inter.commandName === "runjs") {
        if (inter.options.getString("code") === null) console.log("null");
        const optStr = inter.options.getString("code");
        const context = vm.createContext();
        vm.runInContext(`(outer) => {
            globalThis.console = {
             log(...args) {
             outer.console.log(...args);
            }
          };getString
        }`,context)({console});
        try {
            inter.reply(codeBlock("js",vm.runInContext(optStr as unknown as string,context)));
        } catch(e) {
            inter.reply(codeBlock("js",e as string));
        }
    }
    if(inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if(inter.commandName === "searchmdn") {
        (inter.options.getString("mdnword") !== null) ? inter.reply(`https://developer.mozilla.org/ja/search?q=${inter.options.getString("mdnword")}`) : void 0;
    }
});


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
            findJSemoji ? message.react(findJSemoji.toString()) : (findJSemoji2 ? message.react(findJSemoji2.toString()) : void 0);
            try{ console.log("test") } catch(e) {console.log(e)};
        }
        if(message.content === "java" || message.content === "Java") {
            message.reply("My big brother Java!!!!!!!")
        }
    } else {
        return;
    }
});



client.login(process.env.DISCORD_TOKEN);
