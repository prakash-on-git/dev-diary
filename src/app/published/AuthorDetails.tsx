'use client'
import { CheckFollowing } from '@/actions/following'
import { GetStoryByAuthor } from '@/actions/getStory'
import { getCurrentUserId } from '@/actions/user'
import { Story } from '@prisma/client'
import axios from 'axios'
import { MailPlus } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AuthorStories from './AuthorStories'

type Props = {
    AuthorFirstName: string | null
    AuthorLastName: string | null
    AuthorImage: string
    PublishedStory: Story
    AuthorEmail: string
    AuthorId: string
}

const AuthorDetails = ({AuthorFirstName, AuthorLastName, AuthorImage, PublishedStory, AuthorEmail, AuthorId}: Props) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [NoOfFollowings, setFollowing] = useState<number>();

    const [isfollowed, setisfollowed] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>();

    useEffect(() => {
        const fetchAuthorStories = async () => {
            try {
                const stories = await GetStoryByAuthor(PublishedStory.id, PublishedStory.author);
                if(stories.response) setStories(stories.response);
            } catch (error) {
                console.log("Error fetching data",error);
            }
        }
        fetchAuthorStories();
    }, [PublishedStory])

    useEffect(() => {
        
      const fetchFollowingStatus = async () => {
        try {
            const response = await CheckFollowing(PublishedStory.author);
            if(response?.ifFollowing) setisfollowed(response?.ifFollowing);
        } catch (error) {
            console.log("Error while fetching following status",error);
        }
      }

      const fetchCurrentUserId = async() => {
        try {
            const userId = await getCurrentUserId();
            if(userId) setCurrentUserId(userId);
        } catch (error) {
            console.log("No user found");
        }
      }

      fetchFollowingStatus();
      fetchCurrentUserId();
    }, [PublishedStory.author])
    
    const FollowAuthor = async () => {
        setisfollowed(!isfollowed);
        try {
            await axios.post('/api/following',{ AuthorId });
        } catch (error) {
            console.log("Error in following the author");
            setisfollowed(!isfollowed);
        }
    } 

    return (
    <div className='w-3/5 m-auto bg-gray-50 py-10'>
        <div className="max-w-[700px] mx-auto">
            <div className='flex items-center justify-between border-b-[1px] pb-4'>
                <div className='flex items-center justify-between'>
                    <Image src={AuthorImage} width={50} height={50} className='rounded-full' alt='Author'/> 
                    <div className="mx-4">
                        <p className='text-xl font-medium'>Written by: {AuthorFirstName} {AuthorLastName}</p>
                        <p className='text-sm opacity-60'>{NoOfFollowings} followers</p>
                    </div>
                </div>
                <div className='flex items-center space-x-4'>

                    <button onClick={FollowAuthor} 
                    className={`py-2 px-4 p-2 rounded-full text-sm text-white 
                        ${currentUserId === PublishedStory.author ? "hidden":""} 
                        ${isfollowed ? "bg-green-600 hover:bg-green-700" :"bg-orange-600 hover:bg-orange-700"}`}
                    >
                        {`${isfollowed ? "Following":"Follow"}`}
                    </button>

                    <a href={`mailto:${AuthorEmail}`} 
                        className='py-2 px-4 bg-orange-600 hover:bg-orange-700 p-2 rounded-full text-sm'>
                        <MailPlus size={18} className='text-white font-thin p-[1px]'/>
                    </a>

                </div>
            </div>
            <p className='text-sm py-5 font-medium'>More from {AuthorFirstName} {AuthorLastName}</p>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-10'>
                {stories.map((story, index) => (
                    <AuthorStories key={story.id} AuthorFirstName={AuthorFirstName} AuthorImage={AuthorImage} AuthorLastName={AuthorLastName} story={story}/>
                ))}
            </div>
        </div>
    </div>
    )
}

export default AuthorDetails
