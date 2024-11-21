"use server"
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const CheckFollowing = async (author: string) => {
    const CurrentUserId = await getCurrentUserId();
    if(!CurrentUserId) return;
    // author
    try {
        const IsFollowed = await prisma.following.findFirst(
            { where:{ followingId: author, followerId: CurrentUserId }}
        );
        return {ifFollowing: !!IsFollowed};
    } catch (error) {
        return {ifFollowing: false};
    }
}
