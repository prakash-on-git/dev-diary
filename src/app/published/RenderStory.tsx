import { Story } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ClapComponent from './ClapComponent'
import CommentComponent from './CommentComponent'
import SaveComponent from './SaveComponent'
import ShareComponent from './ShareComponent'
import { ClapCount, ClapCountByUser } from '@/actions/clap'
import { getCurrentUser } from '@/actions/user'
import { CheckSaved } from '@/actions/save'
import FollowComponent from './FollowComponent'
import "highlight.js/styles/github.css"

type Props = {
    AuthorFirstName: string | null
    AuthorLastName: string | null
    AuthorImage: string
    PublishedStory: Story
}

const RenderStory = async({AuthorFirstName, AuthorLastName, AuthorImage, PublishedStory}: Props) => {

    const stripHtmlTags = (htmlString:string) => { return htmlString.replace(/<[^>]*>/g, '');};

    const h1match = PublishedStory.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1Element = h1match ? h1match[1] : '';
    const h1elementwithouttag = stripHtmlTags(h1Element);
    
    const clapCounts = await ClapCount(PublishedStory.id);
    const UserClaps = await ClapCountByUser(PublishedStory.id);

    const currentUser = await getCurrentUser();

    const savedStatus = await CheckSaved(PublishedStory.id);

    // to render story to user
    const content = PublishedStory.content!;
    const firstH1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/);
    const sanitizedContent = firstH1Match ? content.replace(firstH1Match[0], '') : content;
    const finalSanitizedContent = sanitizedContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>|<select[^>]*>[\s\S]*?<\/select>|<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '');

  return (
    <div className='flex items-center justify-center mt-5 w-full md:w-3/5 m-auto bg-slate-100 p-2'>
        <div>
            <h1 className='text-4xl font-bold mt-8 mb-4'> {h1elementwithouttag} </h1>
            <div className='flex items-center space-x-5'>
                <Image src={AuthorImage} width={45} height={45} alt='User Image' className='rounded-full'/>
                <div className="text-l">
                    <p>
                        {AuthorFirstName}
                        <span className='mx-2'>{AuthorLastName}</span>
                        <FollowComponent AuthorId={PublishedStory.author}/>
                    </p>
                    <p className="opacity-60 text-sm">Published on <span> </span> 
                        {new Date(PublishedStory.updatedAt).toDateString().split(" ").slice(1,4).join(" ")}
                    </p>
                </div>
            </div>
            <div className="border-y-[1px] border-neutral-200 px-3 py-3 mt-5 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <span title='Like'>
                        <ClapComponent storyId={PublishedStory.id} ClapCount={clapCounts} UserClaps={UserClaps}/>
                    </span>
                    <span title='Comment'>
                        <CommentComponent 
                            AuthorImage={currentUser.imageUrl} 
                            AuthorFirstName={currentUser.firstName} 
                            AuthorLastName={currentUser.lastName}/>
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <span title='Save'>
                        <SaveComponent storyId={PublishedStory.id} savedStatus={savedStatus}/>
                    </span>
                    <span title='Share'>
                        <ShareComponent/>
                    </span>
                    <button title='More'>
                        <MoreHorizontal size={24} className='opacity-70 text-green-700'/>
                    </button>
                </div>
            </div>
            <div className='prose my-5 font-mono' dangerouslySetInnerHTML={{__html:finalSanitizedContent}}></div>
        </div>
    </div>
  )
}

export default RenderStory
