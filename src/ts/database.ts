import * as firebase from "firebase-admin";
import { DocumentData, getFirestore } from "firebase-admin/firestore";

export interface firebaseData {
    list: string[]
}

firebase.initializeApp({
    credential: firebase.credential.cert({
        projectId: process.env.FIREBASE_ID,
        clientEmail: process.env.FIREBASE_CLIENT,
        privateKey: process.env.FIREBASE_KEY?.replace(/\\n/g, '\n')
    })
});
export const db = getFirestore();

export let ignoreList: DocumentData | undefined;
export let ignoreChannelList: DocumentData | undefined;
export async function initIgnoreList():Promise<void>{
    const initData = db.collection("ignoreList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
    const listInitData = await initData.get();
    ignoreList = listInitData.data();
}
export async function initIgnoreChannelList():Promise<void> {
    const initData = db.collection("ignoreChannelList").doc("main") as firebase.firestore.DocumentReference<firebaseData>;
    const listInitData = await initData.get();
    ignoreChannelList = listInitData.data();
}
