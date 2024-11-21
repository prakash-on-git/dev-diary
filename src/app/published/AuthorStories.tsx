import { Story } from '@prisma/client';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import ClapComponent from './ClapComponent';
import SaveComponent from './SaveComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { ClapCount, ClapCountByUser } from '@/actions/clap';
import { CheckSaved } from '@/actions/save';

type Props = {
    story:Story
    AuthorFirstName:string | null
    AuthorLastName:string | null
    AuthorImage: string
}

const AuthorStories = ({story, AuthorFirstName, AuthorImage, AuthorLastName}: Props) => {
    const [userClaps, setUserclaps] = useState<number>(0);
    const [totalClaps, setTotalClaps] = useState<number>(0);
    const [SavedStatus, setSavedStatus] = useState<boolean>(false);


    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await ClapCountByUser(story.id);
                setUserclaps(claps);
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }
        
        const fetchTotalClaps = async () => {
            try {
                const claps = await ClapCount(story.id)
                setTotalClaps(claps)
            } catch (error) {
                console.log("Error fetching the  claps")
            }
        }

        const fetchSavedStatus = async () => {
            try {
                const Savedstatus = await CheckSaved(story.id);
                if(Savedstatus) setSavedStatus(Savedstatus);
            } catch (error) {
                console.log("Error fetching the saved status");
            }
        }
        fetchSavedStatus()
        fetchTotalClaps()
        fetchClapCountByUser()
    },[story.id])


    // stripping etc...
    const stripHtmlTags = (htmlString:string) => {return htmlString.replace(/<[^>]*>/g, '')};
    const match = story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
    const imgSrc = match ? match[1] : '';
    const h1match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1Element = h1match ? h1match[1] : '';
    const finalh1Element = stripHtmlTags(h1Element);
    const textWithoutHtml = stripHtmlTags(story.content!);
    const first10Words = textWithoutHtml.split(/\s+/).slice(0, 20).join(' ');

  return (
    <div className="bg-gray-200 rounded-xl">
        <Link key={story.id} href={`/published/${story.id}`}>
            <Image src={imgSrc ? imgSrc : "/no-image.jpg"} width={250} height={200} alt='Image' 
                className='w-full h-60 rounded-t-xl'/>
            {/* <div className='flex items-center space-x-2 mt-5'>
                <Image src={AuthorImage} width={20} height={20} alt='User' />
                <p className='text-xs font-medium'>{AuthorFirstName} {AuthorLastName}</p>
            </div> */}
            <div className="p-4">
                <p className='font-bold mt-0'>{finalh1Element}</p>
                <p className='mt-2 text-sm text-neutral-500'>{first10Words} ...</p>
                <div className='flex items-center justify-between mt-3'>
                    <div className='flex items-center space-x-4'>
                        <ClapComponent storyId={story.id} UserClaps={userClaps} ClapCount={totalClaps}/>
                        <SaveComponent storyId={story.id} savedStatus={SavedStatus} />
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default AuthorStories
