import React from 'react'
import NewStory from '../New-Story';
import NavbarStory from '../NavbarStory';
import { getCurrentUser } from '@/actions/user';
import { GetStoryById } from '@/actions/getStory';

type Props = {}

const page = async ({params}: {params: {storyId: string}}) => {

  const { storyId } = await params;
  const story = await GetStoryById(storyId);
  const User  = await getCurrentUser();
    
  return (
    <div className='max-w-[1000px] mx-auto'>
      <NavbarStory storyId={storyId} currentUserId={User.id} 
        CurrentUserFirstName={User?.firstName || null}
        CurrentUserLastName={User?.lastName || null}
      />
      <NewStory storyId={storyId} Storycontent={story.response?.content}/>
    </div>
  )
}

export default page
