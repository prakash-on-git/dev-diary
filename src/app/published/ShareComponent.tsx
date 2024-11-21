'use client'
import { Share2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

type Props = {}

const ShareComponent = (props: Props) => {
  const [popupToggle, setPopupToggle] = useState<boolean>(false);
  const pathname  = usePathname();

  return (
    <div className='flex items-center opacity-60 mx-4 relative'>
      <button onClick={()=>setPopupToggle(!popupToggle)}>
        <Share2/>
      </button>
      {popupToggle && (
        <div className='w-[250px] h-[100px] rounded-md shadow-lg absolute bottom-12 -left-20'>
            <input value={`${process.env.NEXT_PUBLIC_URL}${pathname}`} className='overflow-hidden p-2 m-2 border-[1px] rounded-md bg-gray-200'/>
            <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}${pathname}`)} className='text-center w-full py-2'>
                Copy Link
            </button>
        </div>
        )}
    </div>
  )
}

export default ShareComponent
