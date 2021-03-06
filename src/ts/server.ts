import { Message,Client,Intents } from "discord.js";
import { codeBlock, SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import axios from "axios";
import { VM } from "vm2";
import * as firebase from "firebase-admin";
import { DocumentData, getFirestore } from "firebase-admin/firestore";
import { firebaseData,ignoreList,db,ignoreChannelList } from "./database";
import { initIgnoreList, initIgnoreChannelList } from "./database";
import * as util from "util";


const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});
interface mdnResponse {
    readonly documents:Array<
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
    readonly metadata: {
        took_ms:number,
        total: {value:number,relation:string},
        size:number,
        page:number
    },
    readonly suggestions: Array<any>
};


const commands = [
    new SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true)),
    new SlashCommandBuilder().setName("ignoreuser").setDescription("Ignore any users(bot level)").addStringOption(opt => opt.setName("ignoreid").setDescription("User ID").setRequired(true)),
    new SlashCommandBuilder().setName("unignoreuser").setDescription("Unignore any users(bot level)").addStringOption(opt => opt.setName("unignoreid").setDescription("User ID").setRequired(true)),
    new SlashCommandBuilder().setName("ignorechannel").setDescription("Ignore any channels").addStringOption(opt => opt.setName("ignorechannelid").setDescription("Channnel ID").setRequired(true)),
    new SlashCommandBuilder().setName("unignorechannel").setDescription("Unignore any channels").addStringOption(opt => opt.setName("unignorechannelid").setDescription("Channel ID").setRequired(true))
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);
initIgnoreList();
initIgnoreChannelList();
client.on("ready",bot => {
    console.log("This Bot is ready");
    setTimeout(() => {
        bot.user.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`, { type:"WATCHING" });
    },5000);
});

setInterval(() => {
    client.user?.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`,{ type:"WATCHING" });
},600000)

client.on("guildCreate",guild => {
    rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, guild.id.toString()), {body:commands})
        .then(() => void 0)
        .catch(error => console.log(error));
});
client.on("interactionCreate", async inter => {
    if(!inter.isCommand()) return;
    if(ignoreList?.list.includes(inter.user.id)) return;
    if(inter.commandName === "runjs") {
         const vm = new VM({
            timeout:1000
         });
         try {
            const evalResult = vm.run(inter.options.getString("code") as string);
            inter.reply("```js\n" + util.inspect(evalResult) + "```");
         } catch (e) {
             inter.reply("```" + e + "```");
         }
    } 
    if(inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? await inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }
    if(inter.commandName === "searchmdn") {
        const mdnRes = await axios.get<mdnResponse>(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);
        const mdnApiResponse:mdnResponse = JSON.parse(JSON.stringify(mdnRes.data));
        const result = mdnApiResponse;
        if (result && result.documents.length !== 0) {
            await inter.reply({embeds:[{
                color:16776960,
                title:"Result",
                fields: [
                    {
                        name:result.documents[0].title,
                        value:result.documents[0].summary
                    },
                    {
                        name:"URL",
                        value:"https://developer.mozilla.org" + result.documents[0].mdn_url
                    }
                ]
            }]});
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
            }]});
        }
    }
    if(inter.commandName === "ignoreuser") {
        if(inter.user.id !== process.env.ADMIN_ID){
            await inter.reply("You don't have the permission to run this command.");
        }
        if(inter.options.getString("ignoreid") === process.env.ADMIN_ID) {
            await inter.reply("Can't ignore Admin");
        }
        await inter.reply("OK");
          const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
          const ignoreDoc = await ignoreData.get();
          if(!ignoreDoc.exists) {
              await ignoreData.set({list:[inter.options.getString("ignoreid") as string]});
              await initIgnoreList();
          } else {
              await ignoreData.update({list:firebase.firestore.FieldValue.arrayUnion(inter.options.getString("ignoreid"))});
              await initIgnoreList();
          }
      }
    if(inter.commandName === "unignoreuser") {
        if(inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }
        await inter.reply("OK");
        const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();
        if(!ignoreDoc.exists){
            void 0;
        } else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayRemove(inter.options.getString("unignoreid"))});
            initIgnoreList();
            console.log(ignoreChannelList);
        }
    }
    if(inter.commandName === "ignorechannel") {
        if(inter.user.id !== process.env.ADMIN_ID){
            await inter.reply("You don't have the permission to run this command.");
        }
        await inter.reply("OK");
        const ignoreData = db.collection("ignoreChannelList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();
        if(!ignoreDoc.exists) {
            await ignoreData.set({list:[inter.options.getString("ignorechannelid") as string]});
            await initIgnoreChannelList();
        } else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayUnion(inter.options.getString("ignorechannelid"))});
            await initIgnoreChannelList();
        }
    }
    if(inter.commandName === "unignorechannel") {
        if(inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }
        await inter.reply("OK");
        const ignoreData = db.collection("ignoreChannelList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();
        if(!ignoreDoc.exists){
            void 0;
        } else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayRemove(inter.options.getString("unignorechannelid"))});
            initIgnoreChannelList();
            console.log(ignoreChannelList);
        }
    }
});

//const test = (/^([Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT])$/.test("JavaScript"))

// messages
client.on("messageCreate",(message:Message) => {
    if(ignoreList?.list.includes(message.author.id)) return;
    if(ignoreChannelList?.list.includes(message.channelId)) return;
    if (message.author.bot) return;

    if (message.guild?.me?.permissions.has("SEND_MESSAGES")){
        if(message.content.match(/[Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT]/)) {
           message.react(process.env.JS_EMOJI_ID as string)
        }
    } else {
        return;
    }

    if (message.content.indexOf(process.env.WARN_WORD as string) !== -1) {
        message.channel.send(`**WARNING: "JS" means JavaScript. It doesn't mean ${process.env.WARN_WORD}**`);
    }
});



client.login(process.env.DISCORD_TOKEN);