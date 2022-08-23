import { SlashCommandBuilder, REST, Routes } from "discord.js";
import * as firebase from "firebase-admin";
import { firebaseData,ignoreList,db,ignoreChannelList, initList } from "./database";
import { initIgnoreList, initIgnoreChannelList } from "./database";

/* Types */

export interface mdnResponse {
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


/* Commands Utilities  */
const commands = [
    new SlashCommandBuilder().setName("runjs").setDescription("Run JavaScript's code").addStringOption(opt => opt.setName("code").setDescription("Program Code").setRequired(true)),
    new SlashCommandBuilder().setName("searchstack").setDescription("Search Stack Overflow").addStringOption(opt => opt.setName("stackword").setDescription("word of Stack Overflow").setRequired(true)),
    new SlashCommandBuilder().setName("searchmdn").setDescription("Search MDN").addStringOption(opt => opt.setName("mdnword").setDescription("Word of MDN").setRequired(true)),
    new SlashCommandBuilder().setName("ignoreuser").setDescription("Ignore any users(bot level)").addStringOption(opt => opt.setName("ignoreid").setDescription("User ID").setRequired(true)),
    new SlashCommandBuilder().setName("unignoreuser").setDescription("Unignore any users(bot level)").addStringOption(opt => opt.setName("unignoreid").setDescription("User ID").setRequired(true)),
    new SlashCommandBuilder().setName("ignorechannel").setDescription("Ignore any channels").addStringOption(opt => opt.setName("ignorechannelid").setDescription("Channnel ID").setRequired(true)),
    new SlashCommandBuilder().setName("unignorechannel").setDescription("Unignore any channels").addStringOption(opt => opt.setName("unignorechannelid").setDescription("Channel ID").setRequired(true))
];

export const setUpCommands = (guildId: string) => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN as string);
    rest.put(Routes.applicationGuildCommands(process.env.BOT_ID as string, guildId), {body:commands})
        .then(() => void 0)
        .catch(error => console.log(error));
};


/* Add & remove ignoreList */
export const updateignoreUserList = async (userId: string, type: "ADD" | "REMOVE") => {
    if(type === "ADD") {
        const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();

        const query = await db.collection("ignoreList").where("main", "in", [userId]).get();

        // ここから
        if(!ignoreDoc.exists) {
            await ignoreData.set({list: [userId]});
            initIgnoreList();

            return "has been added to the ignore user list"; 
        } else if(query.empty) {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayUnion(userId)});
            return "has been added to the ignore user list";
        } else {
            return "has already been added";
        }

    } else {
        // ここから
        const ignoreData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
        const ignoreDoc = await ignoreData.get();

        const query = await db.collection("ignoreList").where("main", "in", [userId]).get();

        if(!ignoreDoc.exists) {
            return "has not been added to the ignore list"
        } else {
            await ignoreData.update({list:firebase.firestore.FieldValue.arrayRemove(userId)});
            initIgnoreList();
            console.log(ignoreChannelList);

            return "has been removed from the ignore user list";
        }


    }
};


