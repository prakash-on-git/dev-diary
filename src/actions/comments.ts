"use server"
import prisma from "@/app/prismadb";

export const getAllComments = async (storyId: string, parentCommentId?: string) => {
    if(!storyId) throw new Error("No story id to get comments");

    try {
        if(!parentCommentId) {
            const Comments = await prisma.comment.findMany({
                where:{ storyId, parentCommentId: null },
                include:{ Clap: true, replies: true },
            })
            return {response: Comments};
        }

        const Comments = await prisma?.comment.findMany({
            where:{ storyId, parentCommentId },
            include:{ Clap: true, replies: true },
        })
        return {response: Comments};

    } catch (error) {
        console.log("Error getting comments");
        return ({error: "Error getting comments"});
    }
}
