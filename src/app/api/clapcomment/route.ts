import prisma from "@/app/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest){
    const {userId} = auth()
    if(!userId) throw new Error ('No user found')

    try {
        const {storyId, commentId} = await request.json()
        const commentedId = commentId;
        const storyExist = await prisma.story.findUnique({ where:{ id:storyId } })
        
        if(!storyExist) throw new Error ('No Stories were found to clap');

        const clapped = await prisma.clap.findFirst({ where:{ storyId, userId, commentedId} })

        if(clapped && clapped.clapCount < 50){
            await prisma.clap.update({ where:{ id:clapped.id }, data:{ clapCount:clapped.clapCount + 1 }})
            return NextResponse.json('Clap updated!');
        } else {
            const clapStory = await prisma.clap.create({ data:{ userId, commentedId, storyId:storyExist.id, clapCount:1 }})
            return NextResponse.json('Clap created');
        }
    } catch (error) {
        console.log("Error clapping the story", error);
        return NextResponse.error();
    }
}
