'use client'
import { UserButton } from "@clerk/nextjs"
import axios from "axios"
import { NotebookPen, NotebookPenIcon, ScrollText, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Navbar = () => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState<string>("");

    const SearchFun = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') router.push(`/search?${searchInput}`);
    }

    const NewStory = async () => {
        try {
            const response = await axios.post('/api/new-story');
            router.push(`/story/for=${response.data.id}`)
        } catch (error) {
            console.log("error creating storyyyy", error);
        }
    };

  return (
    <div className="px-8 py-2 border-b-[1.5px]">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Link href={"/"} className="sm:mx-8 mx-1">
                    <NotebookPenIcon size={32}/>
                </Link>
                <div className="flex items-center bg-gray-200 hover:bg-gray-100 rounded-xl px-2">
                    <Search onClick={(e)=> router.push(`/search?for${searchInput}`)} size={20} className="mx-2" />
                    <input type="text" placeholder="Search . . ." onChange={(i)=>setSearchInput(i.target.value)}
                        className="focus:outline-none px-1 py-2 placeholder:text-sm text-sm bg-transparent"
                        onKeyDown={(e)=>SearchFun(e)}/>
                </div>
            </div>
            <div className="flex items-center space-x-7">
                <span onClick={NewStory} className="flex items-center space-x-2 opacity-70 hover:opacity-100 duration-100 ease-in cursor-pointer">
                        <NotebookPen/>
                        <p className=" font-semibold text-sm">Write</p>
                </span>
                <Link href='/me/drafts' className='opacity-70 hover:opacity-100 flex items-center space-x- font-semibold'><ScrollText size={20} opacity={20} /> Me</Link>
                <div className=" md:hidden block">
                    <UserButton appearance={{ elements: { userProfileImage: 'rounded-lg', }, }} />
                </div>
                <div className="hidden md:block">
                    <UserButton showName appearance={{ elements: { userProfileImage: 'rounded-lg', }, }} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar
