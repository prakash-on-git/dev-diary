import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return NextResponse.json('User not present');

  try {
    const { AuthorId } = await request.json();

    const followingCheck = await prisma.following.findFirst({where: {followerId: userId, followingId: AuthorId}});

    if (followingCheck) {
      await prisma.following.delete({where: {id: followingCheck.id}});
      return NextResponse.json({ message: 'Unfollowed successfully' });
    } else {
      const FollowingAuthor = await prisma.following.create({data: {followerId: userId, followingId: AuthorId}});
      return NextResponse.json(FollowingAuthor);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error();
  }
}
