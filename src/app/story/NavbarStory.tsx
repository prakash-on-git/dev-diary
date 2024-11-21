'use client'
import { GetStoryById } from "@/actions/getStory"
import { UserButton } from "@clerk/nextjs"
import { Story } from "@prisma/client"
import axios from "axios"
import { NotebookPenIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Select from 'react-select';

type Props = {
    storyId: string
    currentUserId: String
    CurrentUserFirstName : String | null
    CurrentUserLastName : String | null
}

const NavbarStory = ({storyId, currentUserId, CurrentUserFirstName, CurrentUserLastName}: Props) => {
    const router = useRouter();
    const [popup, setPopup] = useState<boolean>(false);

    // const NewStory = async () => {
    //     try {
    //         const response = await axios.post('/api/new-story');
    //         router.push(`/story/${response.data.id}`)
    //     } catch (error) {
    //         console.log("error creating story", error);
    //     }
    // }

    const PublishStory = async (topics:string[]) => {
        try {
            const response = await axios.patch('/api/publish-new-story',{ storyId, topics});
            router.push(`/published/${response.data.id}`);
        } catch (error) {
            console.log("Error publishing story",error);
        }
    }

  return (
    <div className="px-8 py-2 border-b-[1px]">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Link href={"/"} className="sm:mx-8 mx-1">
                    <NotebookPenIcon size={35}/>
                </Link>
                {/* <div className="flex items-center bg-gray-50 rounded-full px-2">
                    <Search size={20} className=" opacity-50" />
                    <input type="text" placeholder="Search_ _ _" 
                        className="focus:outline-none px-1 py-2 placeholder:text-sm text-sm bg-gray-50"/>
                </div> */}
            </div>
            <div className="flex items-center space-x-7">
                {/* <span onClick={NewStory} className="flex items-center space-x-2 opacity-70 hover:opacity-100 duration-100 ease-in cursor-pointer">
                        <NotebookPen/>
                        <p className=" font-semibold text-sm">Write</p>
                </span> */}
                <button onClick={()=>setPopup(!popup)} 
                    className="flex items-center opacity-90 hover:opacity-100 duration-100 
                    ease-in cursor-pointer bg-green-500 hover:bg-green-800 rounded-full 
                    px-3 py-2 text-[14px] text-white">
                    Publish
                </button>
                <UserButton signInUrl="/"/>
            </div>
        </div>
        {popup && (
            <SaveStoryPopup storyId={storyId} 
                currentUserId={currentUserId} 
                CurrentUserFirstName={CurrentUserFirstName} 
                CurrentUserLastName={CurrentUserLastName} setPopup={setPopup} 
                PublishStory={PublishStory} 
            />
        )}
    </div>
  )
}

export default NavbarStory


type SaveStoryPopupType = {
    storyId: string
    PublishStory: (topics: string[]) => void
    setPopup: React.Dispatch<React.SetStateAction<boolean>>
    currentUserId: String
    CurrentUserFirstName : String | null
    CurrentUserLastName : String | null
}

const SaveStoryPopup = ({storyId, currentUserId, CurrentUserFirstName, CurrentUserLastName, setPopup, PublishStory}: SaveStoryPopupType) => {
    const [story, setStory] = useState<Story>();
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    useEffect(() => {
      const fetchStoryById = async () => {
        try {
            const result = await GetStoryById(storyId);
            if(result.response) setStory(result.response);
        } catch (error) {
            console.log("Error fetching story data", error);
        }
      }
      fetchStoryById();
    }, [])

    if(!story) return null;
    // preview image
    const ImageMatch = story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
    const imgSrc = ImageMatch ? ImageMatch[1] : '';
    
    // preview heading
    const h1match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1Element = h1match ? h1match[1] : '';
    
    // preview content
    const contentWithoutH1 = story.content!.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '');
    const stripHtmlTags = (htmlString:string) => { return htmlString.replace(/<[^>]*>/g, '');};
    const textWithoutHtml = stripHtmlTags(contentWithoutH1);
    const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(' ');

    const topics = [
        {value:"Artificial Intelligence", label:"Artificial Intelligence"},
        {value:"Programming", label:"Programming"},
        {value:"Java", label:"Java"},
        {value:"News", label:"News"},
        {value:"Tech", label:"Tech"},
        {value:"Fashion", label:"Fashion"},
    ]
    
    return (
        <div className="fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0">
            <span onClick={(e)=> {e.preventDefault(); setPopup(false);}}
            className="absolute top-4 right-6 text-3xl cursor-pointer">
                &times;
            </span>
            <div className=" max-w-[900px] mx-auto md:mt-28 mt-10 grid md:grid-cols-2 grid-cols-1 gap-14">
                <div className="max-md:hidden">
                    <p className="font-semibold">Story Preview</p>
                    <div className="h-[250px] w-full bg-gray-200 rounded my-3 border-b-[1px]">
                        {imgSrc && (
                            <Image src={imgSrc} width={250} height={250} 
                            alt="Preview Image" className="w-full h-full object-cover"/>
                        )}
                    </div>
                    <h1 className="border-b-[1px] text-[18px] font-mono py-2">{h1Element}</h1>
                    <h1 className="border-b-[1px] text-[14px] font-mono py-2 pt-3">{first10Words}</h1>
                    <p className="border-b-[1px] text-[14px] font-mono text-neutral-500 py-2 pt-3 text-center">
                        Changes here will affect how your story appears in public places like Medium's 
                        homepage and in subscribers' inboxes — not the contents of the story itself.
                    </p>
                </div>
                <div>
                    <p className="py-2">Publishing to: <span>{CurrentUserFirstName} {CurrentUserLastName} </span></p>
                    <p className="text-sm pb-2 pt-1">
                        Add or change topics (up to 5) so readers know what your story is about
                    </p>
                    <Select
                        placeholder='Select Tags'
                        isMulti
                        onChange={(selectedValues)=>{
                            const values = selectedValues as {value:string, label:string}[];
                            const stringValues = values.map((value) => value.value);
                            setSelectedTopics(stringValues);
                        }}
                        isOptionDisabled={()=> selectedTopics?.length >= 5}
                        name="topics"
                        options={topics}
                        className="basic-multi-select"
                        classNamePrefix={'Add a topic ...'}
                    />
                    <button onClick={() => {PublishStory(selectedTopics)}} 
                        className="px-4 py2 bg-green-600 hover:bg-gray-700 rounded-full text-white text-sm mt-6">
                        Publish
                    </button>
                </div>
            </div>
        </div>
    )
}
