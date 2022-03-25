import { Message,Client,Intents, UserManager } from "discord.js";
import { codeBlock, SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import axios from "axios";
import { VM } from "vm2";

const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});
interface mdnResponse {
    documents:Array<
      {
          mdn_url:string,
          socre:number,
          title:string,
          locale:string,
          slug:string,
          popularity: number,
          summary:string,
          highlight: {
              body: Array<string>,
              title: Array<string>
          },
      }
    >,
    metadata: {
        took_ms:number,
        total: {value:number,relation:string},
        size:number,
        page:number
    },
    suggestions: Array<any>
};


const commands = [
    new SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true))
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

client.on("ready",() => {
    console.log("This Bot is ready");
});

client.on("guildCreate",guild => {
    const checkJSemoji = guild.emojis.cache.find(element => element.name === "js");
    const checkJSemoji2 = guild.emojis.cache.find(element => element.name === "JS");
    checkJSemoji ? void 0 : (checkJSemoji2 ? void 0 : (guild.me?.permissions.has("MANAGE_EMOJIS_AND_STICKERS") ? guild.emojis.create("https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png","js") : void 0));
    rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, guild.id.toString()), {body:commands})
        .then(() => console.log("Registred commands"))
        .catch(error => console.log(error))
})

client.on("interactionCreate", async inter => {
    if(!inter.isCommand()) return;
    if(inter.commandName === "runjs") {
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
         await inter.reply("This feature is under development");
    } 
    if(inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? await inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if(inter.commandName === "searchmdn") {
        const mdnRes = await axios.get<mdnResponse>(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);
        const mdnApiResponse:mdnResponse = JSON.parse(JSON.stringify(mdnRes.data));
        const result = mdnApiResponse.documents.find(element => element.title.indexOf(inter.options.getString("mdnword") as string) !== -1);
        if (result) {
            await inter.reply({embeds:[{
                color:16776960,
                title:"Result",
                fields: [
                    {
                        name:result.title,
                        value:result.summary
                    },
                    {
                        name:"URL",
                        value:"https://developer.mozilla.org" + result.mdn_url
                    }
                ]
            }]})
        } else {
            await inter.reply({embeds: [{
                color:16776960,
                title:"Result",
                fields: [
                    {
                        name:"Not Found",
                        value:"not exist"
                    }
                ]
            }]})
        }
    }
});

//const test = (/^([Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT])$/.test("JavaScript"))

// messages
client.on("messageCreate",(message:Message) => {
    console.log("MESSAGE CREATED")

    const findJSemoji = message.guild?.emojis.cache.find(element => element.name === "js");
    const findJSemoji2 = message.guild?.emojis.cache.find(element => element.name === "JS");

    if (message.author.bot) return;

    if (message.guild?.me?.permissions.has("SEND_MESSAGES")){
        if(message.content.match(/[Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT]/)) {
            findJSemoji ? message.react(findJSemoji.toString()) : (findJSemoji2 ? message.react(findJSemoji2.toString()) : void 0);
        }
    } else {
        return;
    }
});



client.login(process.env.DISCORD_TOKEN);
