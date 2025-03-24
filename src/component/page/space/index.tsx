"use client"

import SignUpButton from "@/component/common-component/buttons/SignUpButton"
import Header from "@/component/layout/Header"
import { AlignLeft, Clock, File, Lock, Sparkle } from "lucide-react"
import { useRouter } from "next/navigation"
import { FaLaptopCode } from "react-icons/fa"
import { GiBrain, GiMoneyStack } from "react-icons/gi"

const Space = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col justify-center">
            <div className="text-white w-full max-w-4xl m-auto">
                <Header header={"Spaces"} Icon={Sparkle} />
            </div>

            <div className='w-full h-[1px] bg-[#303131] '></div>

            <div className="text-white w-full max-w-4xl m-auto md:p-12 p-2">
                <span className="text-white font-medium text-lg">My Spaces</span>
                <div className="md:mt-8 mt-2 md:p-8 p-2 bg-gray-600">
                    <div className="flex md:flex-row flex-col  justify-between gap-2">
                        <div className="md:w-1/3 flex flex-col items-center gap-2">
                            <File className="text-white" />
                            <div className="font-semibold">Upload File</div>
                            <span className="text-center text-gray-400">Upload your documents and Perplexity will answer detailed questions</span>
                        </div>
                        <div className="md:w-1/3 flex flex-col items-center gap-2">
                            <AlignLeft className="text-white" />
                            <div className="font-semibold">Set AI Instructions</div>
                            <span className="text-center text-gray-400">Convert complex material into easy-to-understand formats like FAQs or Briefing Docs</span>
                        </div>
                        <div className="md:w-1/3 flex flex-col items-center gap-2">
                            <Sparkle className="text-white" />
                            <div className="font-semibold">Collaborate with others</div>
                            <span className="text-center text-gray-400">Add resources to a Space and share it to create a group knowledge base</span>
                        </div>
                    </div>
                    <div className="w-48 m-auto mt-12" onClick={() => router.push("/notebook")}>
                        <SignUpButton text="Create a Space" />
                    </div>
                </div>
            </div>

            <div className="text-white max-w-4xl md:m-auto m-2 md:p-12">
                <span className="text-white font-medium text-lg">Examples</span>
                <div className="md:mt-8 mt-2 flex gap-2 md:flex-row flex-col">
                    <div className="md:w-1/3 flex flex-col border border-gray-600 rounded-sm p-4 shadow-[2px_2px_0px_0px_#4a5565] hover:shadow-[4px_4px_0px_0px_#4a5565] cursor-pointer">
                        <div className="rounded-full bg-gray-600 w-12 p-2">
                            <GiBrain className="w-8 h-auto text-red-300" />
                        </div>
                        <span className="font-semibold mt-4">Perplexity Support</span>
                        <div className="flex text-gray-400 gap-2 items-center mt-1">
                            <Clock width={15} />
                            <span>2 hr.ago</span>
                            <Lock width={15} />
                            <span>Private</span>
                        </div>
                    </div>
                    <div className="md:w-1/3 flex flex-col border border-gray-600 rounded-sm p-4 shadow-[2px_2px_0px_0px_#4a5565] hover:shadow-[4px_4px_0px_0px_#4a5565] cursor-pointer">
                        <div className=" rounded-full bg-gray-600 w-12 p-2">
                            <GiMoneyStack className="w-8 h-auto text-green-300" />
                        </div>
                        <span className="font-semibold mt-4">What would Buffet say?</span>
                        <div className="flex text-gray-400 gap-2 items-center mt-1">
                            <Clock width={15} />
                            <span>21 min.ago</span>
                        </div>
                    </div>
                    <div className="md:w-1/3 flex flex-col border border-gray-600 rounded-sm p-4 shadow-[2px_2px_0px_0px_#4a5565] hover:shadow-[4px_4px_0px_0px_#4a5565] cursor-pointer">
                        <div className=" rounded-full bg-gray-600 w-12 p-2">
                            <FaLaptopCode className="w-8 h-auto text-blue-300" />
                        </div>
                        <span className="font-semibold mt-4">LLM Research</span>
                        <div className="flex text-gray-400 gap-2 items-center mt-1">
                            <Clock width={15} />
                            <span>21 min.ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Space
