"use server"
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const getSelectdedTopics = async () => {
    const userId = getCurrentUserId();
    if(!userId) throw new Error('User not logged in');

    try {
        const tags = await prisma.topics.findFirst({where: {userId:userId},select: {selectedTopics: true}});
        const formattedData = tags.selectedTopics.map((topic: any)=>({value: topic, label: topic}));
        return {tags: formattedData || []};
    } catch (error) {
        return {tags: []};
    }
}
