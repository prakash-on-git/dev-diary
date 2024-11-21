import { GetPublishedStoryById } from '@/actions/getStory'
import { getUser } from '@/actions/user';
import Navbar from '@/components/Navbar'
import React from 'react'
import RenderStory from '../RenderStory';
import AuthorDetails from '../AuthorDetails';

const page = async ({params}: { params: {storyId: string }}) => {
    const {storyId} = await params;
    const PublishedStory = await GetPublishedStoryById(storyId);

    if(!PublishedStory.response) return ( <div> No Stories were found </div> );
        
    const author = await getUser(PublishedStory.response?.author);

  return (
    <div>
        <Navbar/>

        <RenderStory 
            AuthorFirstName={author.firstName} 
            AuthorLastName={author.lastName} 
            AuthorImage={author.imageUrl} 
            PublishedStory={PublishedStory.response}
        />

        <AuthorDetails
          AuthorFirstName={author.firstName} 
          AuthorLastName={author.lastName} 
          AuthorImage={author.imageUrl} 
          PublishedStory={PublishedStory.response}
          AuthorEmail={author.emailAddresses[0].emailAddress}
          AuthorId={PublishedStory.response.author}
        />
    </div>
  )
}

export default page
