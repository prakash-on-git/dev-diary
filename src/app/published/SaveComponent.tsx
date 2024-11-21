"use client"
import axios from 'axios'
import { FolderCheck, FolderClock } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
  storyId: string
  savedStatus:  boolean
}

const SaveComponent = ({storyId, savedStatus}: Props) => {
  
  const [currentSavedStatus, setcurrentSavedStatus] = useState<boolean>(savedStatus);

  const saveStory = async () => {
    setcurrentSavedStatus(!currentSavedStatus);
    try {
      await axios.post('/api/save',{storyId});
    } catch (error) {
      console.log("Error while saving story");
      setcurrentSavedStatus(!currentSavedStatus);
    }
  }
  console.log(currentSavedStatus);
  
  return (
    <button onClick={saveStory} className='flex items-center opacity-60'>
      {currentSavedStatus? (
        <span title='Click to save'>
          <FolderClock/>
        </span>
      ):(
        <span title='Click to unsave'>
          <FolderCheck/>
        </span>
      )}
    </button>
  )
}

export default SaveComponent
