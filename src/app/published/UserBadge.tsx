import { getUser } from '@/actions/user'
import { User } from '@clerk/nextjs/server'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    userId: string
    createdAt: Date
}

const UserBadge = ({userId, createdAt}: Props) => {

    const [User, setUser] = useState<User>();

    useEffect(() => {
      const fetchUser = async () => {
        try {
            const User = await getUser(userId);
            if(User) setUser(User);
        } catch (error) {
            console.log(error);
        }
        fetchUser();
    }
    }, [userId]);
    
    const timeAgo = (createdAt: Date) => {
        const current = new Date();
        const created = new Date(createdAt);
        
        const yearsDifference = current.getFullYear() - created.getFullYear();
        const monthsDifference = current.getMonth() - created.getMonth();
        // const daysDifference = current.getDate() - created.getDate();

        if (yearsDifference > 0) {
            return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
        } else if (monthsDifference > 0) {
            const monthsAgo = yearsDifference * 12 + monthsDifference;
            return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
        } else {
            const timeDifference = current.getTime() - created.getTime();
            const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        }
    }
    
  return (
    <div className=' text-sm'>
        <div className='flex items-center space-x-3'>
            <Image
                src={User?.imageUrl ? User.imageUrl:"/no-image.jpg"} width={25} height={25} alt='User Image' priority
                className='rounded-full object-cover' />
            <div>
                <p>{User?.firstName} {User?.lastName}</p>
                <p className='text-xs opacity-60'>{timeAgo(createdAt)}</p>
            </div>
        </div>
    </div>
  )
}

export default UserBadge
