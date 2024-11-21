import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prismadb";

export async function PATCH(request: NextRequest){
    const {storyId, topics} = await request.json();
    if(!storyId) throw new Error("No story id was found");

    const story = await prisma.story.findUnique({ where:{id:storyId} });
    if(!story) throw new Error('No story found');

    try {
        const updatedStory = await prisma.story.update({
            where:{ id:storyId },
            data:{ published: true, topics: topics },
        })
        return NextResponse.json(updatedStory);
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    }
}