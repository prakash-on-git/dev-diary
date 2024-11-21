"use server"
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const ClapCount = async (storyId: string, commentId?: string) => {
    const commentedId =commentId;
    try {
        if(!commentId){
            const Clap = await prisma.clap.aggregate({
                where:{ storyId, commentedId: null, },
                _sum:{ clapCount: true }
            })
            return Clap._sum?.clapCount || 0;
        }

        const Clap = await prisma.clap.aggregate({
            where:{ storyId, commentedId, },
            _sum:{ clapCount: true }
        })
        return Clap._sum?.clapCount || 0;
    } catch (error) {
        return 0;
    }
}

export const ClapCountByUser = async (storyId: string, commentId?: string) => {
    const userId = await getCurrentUserId();
    if(!userId) throw new Error("No logged user");
    const commentedId =commentId;
    try {
        if(!commentId){
            const Clap = await prisma.clap.aggregate({
                where:{ storyId, userId, commentedId: null, },
                _sum:{ clapCount: true }
            })
            return JSON.parse(JSON.stringify(Clap._sum?.clapCount || 0));
        }

        const Clap = await prisma.clap.aggregate({
            where:{ storyId, commentedId, },
            _sum:{ clapCount: true }
        })
        return JSON.parse(JSON.stringify(Clap._sum?.clapCount || 0));
    } catch (error) {
        return 0;
    }
}
