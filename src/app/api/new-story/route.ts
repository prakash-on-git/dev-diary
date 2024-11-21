import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prismadb"
import { auth, getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest){
    
    const { userId } = await getAuth(request);
    
    if (!userId) return NextResponse.json({ error: 'No user is signed in' }, { status: 401 });

    try {
        const NewStory = await prisma?.story.create({
            data:{
                author: userId  
            }
        })
        return NextResponse.json(NewStory, {status: 200});

    } catch (error) {
        return NextResponse.error();
    }
}
// export async function POST(request: NextRequest){
//     const {userId} : {userId: string | null} = auth()

//     if(!userId){
//         throw new Error('No user is signed in')
//     }

//     try {
//         const NewStory = await prisma.story.create({
//             data:{
//                 author: userId
//             }
//         })

//         return NextResponse.json(NewStory)
//     } catch (error) {
//         return NextResponse.error()
//     }
// }

export async function PATCH(request: NextRequest){
    const body = await request.json();
    const { userId } = await getAuth(request);
    
    if (!userId) return NextResponse.json({ error: 'No user is signed in' }, { status: 401 });

    let {storyId, content} = body;

    if (!storyId || !content) throw new Error('Missing Fields');

    // ---------------------------------------------------------------
    storyId = decodeURIComponent(storyId);
    // If the storyId starts with 'for=', remove the 'for=' part
    if (storyId.startsWith('for=')) {
        storyId = storyId.substring(4);  // Removes the 'for=' prefix
    }
    // console.log("-------------------------------------",storyId);

    const Story = await prisma.story.findUnique({
        where:{ id: storyId }
    });

    if (!Story) throw new Error('No story were found');
    
    try {
        await prisma.story.update({
            where: {
                id: Story.id
            },
            data: {
                content
            }
        })
        return NextResponse.json('Successfully updated');
    } catch (error) {
        return NextResponse.error();
    }
}
