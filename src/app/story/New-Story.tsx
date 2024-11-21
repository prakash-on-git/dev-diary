'use client'
import { ClipboardPaste, Code, Image, MoreHorizontal, Plus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import './new-story.css'
import { createRoot } from 'react-dom/client';
import { ImageUpload } from '@/actions/cloudinary';
import hljs from 'highlight.js';
import "highlight.js/styles/github.css"
import axios from 'axios';

const ImageComponent = ({imageUrl, file, handleSave}:{imageUrl: string, file: File, handleSave: ()=>void }) => {

    const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);

    const updateImageUrl = async () => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            await ImageUpload(formData).then((SecureImageUrl)=> setCurrentImageUrl(SecureImageUrl))
        } catch (error) {
            console.log("Error ho gaya paijaan");
        }
    }

    useEffect(() => {
      updateImageUrl().then(()=>{handleSave()});
    }, [imageUrl]);

    return (
        <div className="py-3">
            <div>
                <img src={currentImageUrl} alt="! Image" className=' max-w-full h-[450px]' />
                <div className="text-center text-sm max-w-md mx-auto">
                    <p data-p-placeholder = 'Type Caption for image'></p>
                </div>
            </div>
            <p data-p-placeholder = '...'></p>
        </div>
    );
};

const Divider = () => {
    return(
        <div className="py-3 w-full">
            <div className='text-center flex items-center justify-center ' contentEditable={false}>
                    <MoreHorizontal size={30}/> 
            </div>
            <p data-p-placeholder='Write your text ...'></p>
        </div>
    )
};

const CodeBlock = ({handleSave}:{handleSave:() => void}) => {
    const [language, setlanguage] = useState<string>('javascript')
    const [code, setCode] = useState<string>('')
    const [highlightedCode, sethighlightedCode] = useState<string>('')
    
    const handlelanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setlanguage(e.target.value);
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        setCode(e.currentTarget.value || '');
    }

    const handlePaste = async () => {
        try {
            const clipboardData = await navigator.clipboard.readText();
            setCode((prev) => prev + clipboardData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const highlighted = hljs.highlight(code, { language, ignoreIllegals:true }).value;
        sethighlightedCode(highlighted);
        handleSave();
    }, [code, language, highlightedCode]);

    return (
        <div className='w-full'>
            <div  className='w-full relative bg-stone-100 rounded-sm p-5 focus:outline-none'>
                <div>
                    <select contentEditable={false}
                    className='bg-gray-100 border-dotted border-[2px] rounded-sm p-1 text-stone-700'
                    defaultValue={language} onChange={handlelanguageChange} >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <textarea onPaste={handlePaste} className='focus:outline-none p-2 w-full mt-4'
                    onChange={(e) => { e.preventDefault(); handleCodeChange(e) }}
                />
                <button onClick={handlePaste} className='absolute top-2 right-2 cursor-pointer'>
                    <ClipboardPaste/>
                </button>
                <div
                    className={`language-${language} text-base block overflow-auto p-3 focus:outline-none`}
                    dangerouslySetInnerHTML={{__html:highlightedCode}} style={{whiteSpace:"pre-wrap"}} >
                </div>
            </div>
            <p data-p-placeholder='Write your text ...'></p>
        </div>
    )
}

type Props = {
    storyId: string
    Storycontent:string | null |undefined
}

const NewStory = ({storyId, Storycontent}: Props) => {

    const [openTools, setOpenTools] = useState<Boolean>(false);
    const [buttonPosition, setbuttonPosition] = useState<{top: number, left: number}>({top:0, left:0});
    const [saving, setSaving] = useState<boolean>(false);
    // const [story, setStory] = useState<Story>();
    const contentEditableRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
      
        return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }
      
    const debouncedHandleSave = useRef(debounce(() => { handleSave(); }, 1000)).current;

    const handleSave = async () => {
        const content = contentEditableRef.current?.innerHTML;
        setSaving(true);
        try {
            await axios.patch('/api/new-story', {
                storyId,
                content
            })
            console.log("Story saved");
        } catch (error) {
            console.log("Error in saving Story");
        }
        setSaving(false);
    }

    const getCaretPosition = () => {
        let x = 0;
        let y = 0;
        const isSupported = typeof window.getSelection !== 'undefined'

        if (isSupported) {
            const selection = window.getSelection() as Selection
            console.log(selection.rangeCount);
            if (selection?.rangeCount > 0) {
                const range = selection.getRangeAt(0).cloneRange()
                const rect = range.getClientRects()[0]
                if (rect) {
                    x = rect.left + window.screenX
                    y = rect.top + window.scrollY-85
                }
            }
        }
        return {x, y};
    }

    const insertDivider = () => {
        const DividerComponent = <Divider/>
        setOpenTools(false);
        const wrapperDiv = document.createElement('div')
        const root = createRoot(wrapperDiv)
        root.render(DividerComponent)
        contentEditableRef.current?.appendChild(wrapperDiv)
        handleSave()
    }

    const insertCodeBlock = () => {
        const codeBlockComponent = <CodeBlock handleSave={()=>{}}/>;
        setOpenTools(false);
        const wrapperDiv = document.createElement('div');
        const root = createRoot(wrapperDiv);
        root.render(codeBlockComponent);
        contentEditableRef.current?.appendChild(wrapperDiv);
    }

    const insertImageComponent = () => {
        fileInputRef.current?.click()
    }

    const fileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOpenTools(false);
            const localImageUrl = URL.createObjectURL(file);
            // const ImageComponent = <ImageComponent imageUrl={localImageUrl} file={file} />
            const wrapperDiv = document.createElement('div')
            const root = createRoot(wrapperDiv)
            // root.render(ImageComponent)
            root.render(<ImageComponent imageUrl={localImageUrl} file={file} handleSave={debouncedHandleSave}/>)

            contentEditableRef.current?.appendChild(wrapperDiv)
        }
    }

    useEffect(() => {
        const handleInput = () => {
            const {x, y} = getCaretPosition();
            setbuttonPosition({top: y, left: -50});
            debouncedHandleSave();
        }
        contentEditableRef.current?.addEventListener('input', handleInput)
    }, []);

    useEffect(() => {
      if (typeof window.document !== 'undefined') {
        const editor = new MediumEditor('.editable',{
            elementsContainer:document.getElementById('container') as HTMLElement,
            toolbar:{
                buttons:['bold','italic','underline','anchor','h1','h2','h3', 'quote']
            }
        })
        return () => {
          editor.destroy();
        }
      }
    }, []);
    
  return (
    <div id='container' className='font-mono mt-6 mx-auto max-w-[800px] relative'>
        <p className="absolute -top-16 opacity-30">{saving? "Saving ... ":"Saved"}</p>
        <div id='editable' ref={contentEditableRef} contentEditable suppressContentEditableWarning
            className=" outline-none focus:outline-none editable max-w-[800px] prose"
            style={{whiteSpace:'pre-line'}}
        >   
            {Storycontent ? (
                <div>
                    <div dangerouslySetInnerHTML={{__html: Storycontent}}></div>
                </div>
            ):(
                <div>
                    <h1 className="font-medium" data-h1-placeholder='Title'></h1>
                    <p className="font-medium" data-p-placeholder='Write story ...'></p>
                </div>
            )}
        </div>

        <div className={`z-10 ${buttonPosition.top === 0 ? "hidden" :""}`} 
            style={{position: 'absolute', top:buttonPosition.top, left:buttonPosition.left}}
        >
            <button id='tooltip' onClick={() => setOpenTools(!openTools)} 
                className=' border-[1px] border-neutral-500 p-1 rounded-full inline-block'>
                <Plus className={`duration-100 ease-linear ${openTools? "rotate-45":""}`} />
            </button>

            <div id='tool' className={` flex items-center space-x-5 absolute 
                top-0 left-14 ${openTools? "visible": "invisible"}`}
            >
                <span onClick={insertImageComponent} className={`border-[1.8px] border-green-400 rounded-full block p-[5px] delay-75 
                    ${openTools? "scale-100 visible":" scale-0 invisible"} ease-linear duration-100 bg-white cursor-pointer`}>
                    <Image size={20} className='opacity-60 text-orange-600'/>
                    <input type='file' accept='image/*' style={{display: "none"}} ref={fileInputRef}
                        onChange={fileInputChange}
                    />
                </span>

                <span onClick={insertCodeBlock} className={`border-[1.8px] border-green-400 rounded-full block p-[5px] delay-75
                    ${openTools? "scale-100 visible":" scale-0 invisible"} ease-linear duration-100 bg-white cursor-pointer`}>
                    <Code size={20}  className='opacity-60 text-orange-600'/>
                </span>

                <span onClick={insertDivider} className={`border-[1.8px] border-green-400 rounded-full block p-[5px] delay-75 
                    ${openTools? "scale-100 visible":" scale-0 invisible"} ease-linear duration-100 bg-white cursor-pointer`}>
                    <MoreHorizontal size={20}  className='opacity-60 text-orange-600'/>
                </span>

            </div>
        </div>
    </div>
  )
}

export default NewStory
