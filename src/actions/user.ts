"use server"
import { auth, clerkClient } from "@clerk/nextjs/server"

export const getCurrentUserId = async () => {
    const {userId} = await auth();
    return userId;
}

// export const getCurrentUser = async () => {
//     const {userId} = auth();
//     if(!userId) throw Error('No current user found');
//     const user = await clerkClient.users.getUser(userId);
//     return JSON.parse(JSON.stringify(user));
// }

// export const getUser = async (userId: string) => {
//     if(!userId) throw new Error('No current user found');
//     const user = await clerkClient.users.getUser(userId);
//     return JSON.parse(JSON.stringify(user));
// }

export const getCurrentUser = async () => {
    const {userId} = await auth();
    
    if(!userId) throw Error('No current user found');
    const cClient = clerkClient();
    // const user = await cClient.users.getUser(userId);
    const user = (await cClient).users.getUser(userId);
    return JSON.parse(JSON.stringify(user));
}

export const getUser = async (userId: string) => {
    if(!userId) throw new Error('No current user found');
    const cClient = clerkClient();
    const user = await (await cClient).users.getUser(userId);
    return JSON.parse(JSON.stringify(user));
}
