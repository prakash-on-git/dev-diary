import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return NextResponse.json('User not present');

  try {
    const { tag } = await request.json();
    const topic = await prisma.topics.findFirst({where: {userId: userId}});

    if (!topic){
        const createTopic = await prisma.topics.create({data:{userId, selectedTopics: tag}});
        return NextResponse.json("Tags added successfully");
    } else {   
        const updateTopic = await prisma.topics.update({where:{id:topic.id},data:{selectedTopics: tag}});
        return NextResponse.json("Tags added successfully");
    }

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
