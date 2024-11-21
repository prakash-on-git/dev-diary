"use server"
// import axios from "axios";
import prisma from '@/app/prismadb';

export const GetStoryById = async (storyId: string) => {
    if(!storyId) throw new Error("No story id");
    
    try {
        const story = await prisma?.story.findUnique({ where:{ id:storyId, published:false } });
        return {response: story};
    } catch (error) {
        return {error: `Error in getting story: ${error}`}
    }
};

export const GetPublishedStoryById = async (storyId: string) => {
    if(!storyId) throw new Error("No story id");
    
    try {
        const story = await prisma?.story.findUnique({ where:{ id:storyId, published: true, } });
        return {response: story};
    } catch (error) {
        return {error: `Error in getting story: ${error}`};
    }
};

export const GetStoryByAuthor = async (storyId: string, authorId: string) => {
    if(!storyId) throw new Error("No story id");
    
    try {
        const stories = await prisma?.story.findMany({ where:{ author:authorId,NOT:{id:storyId}, published: true}});
        return {response: stories};
    } catch (error) {
        return {error: `Error getting stories: ${error}`};
    }
};

export const getUniqueTopics = async () => {
    try {
        const AllStoryTopics = await prisma.story.findMany({select:{topics: true }});
        const UniqueTopics = Array.from(new Set(AllStoryTopics.flatMap((topic)=>topic.topics)));
        const formattedData = UniqueTopics.map((topic)=>({value: topic, label: topic}));
        return {response: formattedData};  
    } catch (error) {
        return {response: []};  
    }
}

export const getStoryByTag = async (tag: string) => {
    if(!tag) throw new Error("No tag provided");
    
    try {
        if(tag === "All"){
            const story = await prisma?.story.findMany({ where: {published: true}});
            return {stories: story};
        }
        const story = await prisma?.story.findMany({ where:{ topics: {has: tag},published: true }});
        return {stories: story};
    } catch (error) {
        return {stories: []};
    }
};
