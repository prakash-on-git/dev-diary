'use client'
import { getStoryByTag } from '@/actions/getStory'
// import { getSelectdedTopics } from '@/actions/topics'
import { Story } from '@prisma/client'
import axios from 'axios'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Select from "react-select"
import SelectedStory from './SelectedStory'

type Props = {
  topics: {
    value: string
    label: string
  }[]
  userTags: {
    value: string
    label: string
  }[]
}

const FollowingStories = ({topics, userTags}: Props) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag');
  // const [userTagss, setUserTagss] = useState<
  //   {
  //     value:string
  //     label:string
  //   }[]
  //   >();

    // console.log("user tags",userTagss);

  // useEffect(() => {
  //   const getTags = async () => {
  //     try {
  //       const response = await getSelectdedTopics();
  //       setUserTagss(response.tags);
  //     } catch (error) {
  //       console.log("Error in fetching user selected tags");
  //     }
  //   }
  //   getTags();
  // }, [setShowPopup]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await getStoryByTag(tag || "All");
        setStories(response.stories);
      } catch (error) {
        console.log("Error fetching the story");
      }
    }
    fetchStory();
  }, [searchParams]);
  
  
  return (
    <div>
      <div className="flex items-center space-x-5 border-b-[1px] text-sm opacity-60">
        <span onClick={()=> setShowPopup(!showPopup)} className="pb-3">
          <Plus size={20} className=''/>
        </span>
        <Link href='/' className={`pb-3 ${tag === null ? "border-b-[1px] border-neutral-950":""}`}>For you</Link>
          {userTags.map((Tag,index) => (
            <Link key={index} href={`/?tag=${Tag.value}`} 
              className={`pb-3 ${Tag.value === `${tag}` ? "border-b-[1px] border-neutral-950":""}`}>
              {Tag.label}
            </Link>
          ))}
      </div>
      {stories.map((story) => (
            <SelectedStory key={story.id} story={story} />
        ))}
      {showPopup && (
        <AddTagComp allTopics={topics} setShowPopUp={setShowPopup} UserTags={userTags}/>
      )}
    </div>
  )
}

export default FollowingStories


type TagsTyps = {
  allTopics:{
      value:string
      label:string
  }[]
  UserTags:{
      value:string
      label:string
  }[] | undefined
  setShowPopUp:React.Dispatch<React.SetStateAction<boolean>>
}

const AddTagComp = ({allTopics, setShowPopUp, UserTags}: TagsTyps) => {
  const [selectedtopics, setSelectedTopics] = useState<string[]>([])
  const [userSelectedtags, setUserSelectedTags] = useState<{
    value:string
    label:string
  }[] | undefined>(UserTags);

  const Addtags = async () => {
    try {
      await axios.post('/api/topics',{
          tag : selectedtopics
      })
      window.location.reload()
      console.log("Added tags successfully")
    } catch (error) {
      console.log("Error adding tags")
    }
  }

  return(
    <div className='fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0'>
      <span onClick={(e) => {e.preventDefault() ;setShowPopUp(false)}} className='absolute top-4 right-6 text-3xl cursor-pointer'>
        &times;
      </span>
      <div className='max-w-[900px] mx-auto md:mt-28 mt-10 w-full'>
        <div>
          <Select placeholder='Select tags' isMulti defaultValue={userSelectedtags} onChange={(selectedvalues) => {
            const values = selectedvalues as {value:string; label:string}[];
            const stringValues = values.map((value) => value.value);
            setSelectedTopics(stringValues); }}  
            isOptionDisabled={() => selectedtopics?.length >= 5} name='topics' 
            options={allTopics} className='basic-multi-select' classNamePrefix='Add a topic ...'
          />
          <button onClick={() => Addtags()} 
            className='px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8'>
              Add
          </button>
        </div>
      </div>
    </div>
  )
}
