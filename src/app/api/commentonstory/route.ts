import prisma from "@/app/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest){
    const {userId} = auth();
    if(!userId) throw new Error ('No user found');

    try {
        const body = await request.json();
        const {storyId, content} = body;

        if (!storyId || !content) throw new Error("Insufficient data");

        const existingStory = await prisma.story.findUnique({ where:{ id:storyId } });

        if (!existingStory) throw new Error("Story not found to comment");

        const newComment = await prisma.comment.create({ data:{ userId, storyId, content } });

        return NextResponse.json('Comment updated!');
    } catch (error) {
        console.log("Error commenting", error);
        return NextResponse.error()
    }
}
