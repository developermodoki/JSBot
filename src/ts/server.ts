import { Message, Client, GatewayIntentBits, ActivityType, PermissionFlagsBits } from "discord.js";
import { setUpCommands, mdnResponse } from "./lib";
import axios from "axios";
import { VM } from "vm2";
import * as firebase from "firebase-admin";
import { firebaseData,ignoreList,db,ignoreChannelList, initList } from "./database";
import { initIgnoreList, initIgnoreChannelList } from "./database";
import * as util from "util";


// v13 => const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_MESSAGES]});
const Intents = GatewayIntentBits;
const client = new Client({ 
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.GuildEmojisAndStickers,
        Intents.GuildMessageReactions
    ]
});

/* Initialization setup & setting Activity */
client.on("ready", bot => {
    initList();
    console.log("This Bot is ready");
    setTimeout(() => {
        bot.user.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`, { type: ActivityType.Watching });
    },5000);
});

/* Update activity */
setInterval(() => {
    client.user?.setActivity(`${client.ws.ping}ms | Node.js ${process.version}`, { type: ActivityType.Watching });
},600000)


client.on("guildCreate", guild => {
    setUpCommands(guild.id.toString());
});

client.on("interactionCreate", async inter => {
    if(!inter.isChatInputCommand()) return;
    if(ignoreList?.list.includes(inter.user.id)) return;
    
    // VM
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

    // Search Stack Overflow
    if(inter.commandName === "searchstack") {
        (inter.options.getString("stackword") !== null) ? await inter.reply(`https://stackoverflow.com/search?q=${inter.options.getString("stackword")}`) : void 0;
    }

    // Search MDN
    if(inter.commandName === "searchmdn") {
        const { data } = await axios.get<mdnResponse>(`https://developer.mozilla.org/api/v1/search?q=${inter.options.getString("mdnword")}&locale=ja`);

        if (data && data.documents.length !== 0) {
            await inter.reply({embeds:[{
                color:16776960,
                title:"Result",
                fields: [
                    {
                        name:data.documents[0].title,
                        value:data.documents[0].summary
                    },
                    {
                        name:"URL",
                        value:"https://developer.mozilla.org" + data.documents[0].mdn_url
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

    // Add Ignored users
    if(inter.commandName === "ignoreuser") {
        if(inter.user.id !== process.env.ADMIN_ID){
            await inter.reply("You don't have the permission to run this command.");
        }
        if(inter.options.getString("ignoreid") === process.env.ADMIN_ID) {
            await inter.reply("Couldn't run this command because you are the administrator of this bot.");
        }

        const userId = inter.options.getString("ignoreid") as string;

        await inter.deferReply({ ephemeral: true });
        const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();

        if(!ignoreDoc.exists) {
            await ignoreData.set({list:[userId]});
        } else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayUnion(userId)});
        }

        await initIgnoreList();

        await inter.followUp({ content: `${(await client.users.fetch(userId)).tag} has been added to the Ignore List`, ephemeral: true })
    }


    if(inter.commandName === "unignoreuser") {
        if(inter.user.id !== process.env.ADMIN_ID) {
            inter.reply("You don't have the permission to run this command.");
        }

        await inter.deferReply({ ephemeral: true });

        const userId = inter.options.getString("unignoreid") as string;
        const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();

        if(!ignoreDoc.exists) void 0;
        else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayRemove(userId)});
            initIgnoreList();
            console.log(ignoreChannelList);
        }

        await inter.followUp({ content: `**${(await client.users.fetch(userId)).tag}** has been removed from the Ignore List`, ephemeral: true })
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
    if (ignoreList?.list.includes(message.author.id)) return;
    if (ignoreChannelList?.list.includes(message.channelId)) return;
    if (message.author.bot) return;

    if (message.guild?.members.me?.permissions.has(PermissionFlagsBits.SendMessages)){
        if(message.content.match(/[Jj][Ss]|[Jj][aA][vV][aA][Ss][cC][rR][iI][pP][tT]/)) {
           message.react(process.env.JS_EMOJI_ID as string)
        }
    } else return;

});



client.login(process.env.DISCORD_TOKEN);