import prisma from "@/app/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse, NextRequest } from "next/server"

export async function POST(request: NextRequest){
    const {userId} = auth();
    if(!userId) throw new Error ('No user found');

    try {
        const body = await request.json();
        const {storyId, Content, parentCommentId} = body;
        const content = Content;
        if (!storyId || !content || !parentCommentId) throw new Error("Insufficient data to reply comment");

        const existingStory = await prisma.story.findUnique({where: {id: storyId}});

        if (!existingStory) throw new Error("Story not found to comment");

        const newComment = await prisma.comment.create({ data:{ userId, storyId, content, parentCommentId } });
        return NextResponse.json('Reply updated!');
    } catch (error) {
        console.log("Error replying comment", error);
        return NextResponse.error()
    }
}
