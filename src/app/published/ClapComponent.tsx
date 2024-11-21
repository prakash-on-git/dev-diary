'use client'
import axios from 'axios'
import { ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Props = {
  storyId: string
  ClapCount: number
  commentId?:string
  UserClaps: number
}

const ClapComponent = ({storyId, ClapCount, commentId, UserClaps}: Props) => {

  const [currentClaps, setCurrentClaps] = useState<number>(ClapCount);
  const [currentClapByUser, setCurrentClapByUser] = useState<number>(UserClaps);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    setCurrentClapByUser(UserClaps);
    setCurrentClaps(ClapCount);
  },[UserClaps, ClapCount])

  useEffect(() => {
    const timeout = setTimeout(()=>{
      setShowPopup(false);
    },1000)
    return ()=>{clearTimeout(timeout)}
  }, [showPopup])
  
  const ClapStoryorComment = async () => {
    if(currentClapByUser >= 50){ setShowPopup(true); return;}

    setCurrentClapByUser((prev) => prev + 1);
    setShowPopup(true);
    setCurrentClaps((prev) => prev + 1);

    try {
        if(!commentId){
            await axios.post('/api/clap',{ storyId })
        }else{
            const claps = await axios.post('/api/clapcomment',{ storyId, commentId });
            // setCurrentClaps(claps);
            // setCurrentClapByUser(claps);
        }
        console.log('success');
    } catch (error) {
        console.log('Error while clapping story or comment', Error);
        setCurrentClaps((prev) => prev -1);
        setCurrentClapByUser((prev) => prev -1 );
    }
  }

  return (
    <button onClick={ClapStoryorComment} className='flex items-center relative'>
      <span className={`absolute bottom-10 w-[45px] h-[40px] bg-black rounded-full 
        shadow-2xl shadow-neutral-300 text-white flex items-center justify-center 
        duration-75 ease-in ${showPopup? "scale-100 basis-10 opacity-60 translate-y-0"
        :"scale-0 opacity-0 translate-y-8"}`}>
          {currentClapByUser}
      </span>
      <span className="opacity-65">
        {currentClapByUser > 0 ? (<ThumbsUp className='mr-2' size={25}/>):(<ThumbsUp className='mr-2' size={21}/>)}
      </span>
      <p className='text-sm opacity-60'>{ currentClaps}</p>
    </button>
  )
}

export default ClapComponent
