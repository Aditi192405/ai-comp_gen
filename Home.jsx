import React from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { IoCopy } from 'react-icons/io5'
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { TbSettingsCode } from "react-icons/tb";
import { toast } from 'react-toastify';
import { IoMdCloseCircle } from "react-icons/io";




const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstarp', label: 'HTML + Bootstarp' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'HTML-Tailwind-Bootstarp', label: 'HTML + Bootstarp + Tailwind CSS' },
  ]

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setprompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);


  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({ apiKey: "AIzaSyDSYQaVd7WfZm0T0oDNgBg_U11ANd4sLUI" });

  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.
      `,
    });
    console.log(response.text);
    const cleaned = response.text.replace(/```html|```/g, "");
    setCode(response.text);
    setOutputScreen(true);
    setLoading(false);
    setCode(cleaned);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("code copied to clipboard")
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  }

  const downnloadFile = () => {
    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#111",
      borderColor: state.isFocused ? "#555" : "#333",
      color: "#fff",
      boxShadow: "none",
      ":hover": {
        borderColor: "#555"
      }
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "#111",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#333"
        : state.isFocused
          ? "#222"
          : "#111",
      color: "#fff",
      cursor: "pointer",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#fff"
    }),

    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    input: (base) => ({
      ...base,
      color: "#fff"
    })

  }

  return (
    <>
      <Navbar />

      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-4">
          <h3 className='text-[25px] font-semibold sp-text'>AI component generator</h3>
          <p className='text-[gray] mt-2 text-[16px]'>
            Describe your component and AI will code for you.
          </p>



          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            styles={customStyles}
            onChange={(e) => {
              setFrameWork(e)

            }}


          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea id="prompt" name="prompt" onChange={(e) => { setprompt(e.target.value) }} value={prompt} className='w-full min-h-[300px] rounded-xl bg-[#090908] mt-5 p-[10px]' placeholder='Describe your components in detail and let ai will code for your component'></textarea>
          <div className="flex items-center justify-between">
            <p className='text-[16px] text-[gray] mt-2'>Click on generate button to genearte your code</p>
            <button onClick={getResponse} className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400  to-purple-600 mt-3 ml-auto px-[20px] gap-[10px]">
              {

                loading === false ?
                  <>
                    <i><BsStars /></i>
                  </> : ""

              }
              {
                loading === true ?
                  <>
                    <ClipLoader size={20} />
                  </> : ""
              }
              Generate</button>

          </div>
        </div>

        {/*right side*/}
        <div className=" relative  mt-2 w-[50%] h-[80vh] bg-[#141319] rounded-xl">
          {
            outputScreen === false ? (
              <>


                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-600"><HiOutlineCode /></div>
                  <p className='text-[16px] text-[gray] mt-3'>Your component & code will appear here.</p>
                </div>
              </>


            ) : (
              <>

                <div className="top bg-[#17171C] w-full h-[40px]  flex items-center gap-[15px] px-[20px]">

                  <button onClick={() => { setTab(1) }} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""}`}>Code</button>
                  <button onClick={() => { setTab(2) }} className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</button>

                </div>

                <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                  <div className="left">
                    <p className='font-bold'>Code Editor</p>
                  </div>

                  <div className="right flex items-center gap-[10px]">
                    {
                      tab === 1 ?
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downnloadFile}><PiExportBold /></button>
                        </>
                        :
                        <>
                          <button className="copy w-[40px] h-[40px] rounded-xl border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setIsNewTabOpen(true) }}><ImNewTab /></button>
                          <button className="export w-[40px] h-[40px] rounded-xl border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                        </>


                    }

                  </div>
                </div>
                <div className="editor h-full">
                  {
                    tab === 1 ? (

                      <Editor className='rounded-xl' height="100%" theme='vs-dark' language="html" value={code} />

                    ) : (

                      <iframe srcDoc={code} className="preview w-full h-full  bg-white text-black flex items-center justify-center">
                      </iframe>
                    )
                  }
                </div>
              </>
            )
          }
        </div>
      </div>

      {
        isNewTabOpen === true ?
          <>
            <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
              <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
                <p className='font-bold'>Preview</p>
                <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
                  <IoMdCloseCircle />
                </button>
              </div>
              <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
            </div>

          </>
          : ""
      }
    </>
  )
}




export default Home;