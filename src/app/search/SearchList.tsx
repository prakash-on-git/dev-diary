"use client"
import { getStoryByTag } from '@/actions/getStory'
import SelectedStory from '@/components/SelectedStory'
import { Story } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const SearchList = (props: Props) => {

    const [filteredStories, setFilteredStories] = useState<Story[]>([]);
    const searchparams = useSearchParams();
    const searchValue = searchparams.get('for');
    
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await getStoryByTag(searchValue || 'All');
                setFilteredStories(response.stories);
            } catch (error) {
                console.log("Error in fetching teh data");
            }
        }
        fetchStory()
    },[searchparams]);

  return (
    <div>
        {filteredStories.map((story) => (
            <SelectedStory key={story.id} story={story} />
        ))}
</div>
  )
}

export default SearchList
