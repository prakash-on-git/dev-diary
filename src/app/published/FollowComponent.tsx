'use client'
import { CheckFollowing } from '@/actions/following';
import { getCurrentUserId } from '@/actions/user';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Props = {
    AuthorId: string
}

const FollowComponent = ({AuthorId}: Props) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>();

    useEffect(() => {
      const fetchFollowingStatus = async () => {
        try {
            const response = await CheckFollowing(AuthorId);
            if(response?.ifFollowing) setIsFollowing(response?.ifFollowing);
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
    }, [AuthorId])
    
    const FollowAuthor = async () => {
        setIsFollowing(!isFollowing);
        try {
            await axios.post('/api/following',{ AuthorId });
        } catch (error) {
            console.log("Error in following the author");
            setIsFollowing(!isFollowing);
        }
    }

  return (
    <span onClick={FollowAuthor}
        className={`font-medium cursor-pointer ${isFollowing?"text-green-500":"text-red-400"} 
            ${currentUserId === AuthorId ? "hidden":""}`}>
        {`${isFollowing? "following":"follow"}`}
    </span>
  )
}

export default FollowComponent
