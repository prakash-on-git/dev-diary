'use server'
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const CheckSaved = async (storyId: string) => {
    const userId = getCurrentUserId();
    if(!userId) throw new Error("No user found");
    try {
        const saved = await prisma.save.findFirst({ where:{ userId, storyId}});
        return !!saved;
    } catch (error) {
        return false;
    }
}
