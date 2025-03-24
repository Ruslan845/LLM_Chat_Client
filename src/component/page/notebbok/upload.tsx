"use client"

import { Dialog, DialogContent } from "@/component/common-component/dialog"
import { Clipboard, FileUp, LibraryBig, Link2, SquareMenu, TvMinimal, Upload, Youtube } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { CgWebsite } from "react-icons/cg"
import { GiMoebiusTriangle } from "react-icons/gi"

export interface NotebookUploadProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const NotebookUpload = ({ open, setOpen }: NotebookUploadProps) => {
    const [video, setVideo] = useState(null);

    const handleFileChange = (e: any) => {
        setVideo(e.target.files[0]);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="px-8 max-w-1/2 min-w-fit bg-gray-700 text-white">
                <div className="flex gap-4 items-center">
                    <LibraryBig className="h-8 w-8" />
                    <h1 className="text-3xl">NotebookLM</h1>
                </div>

                <div className="text-xl">Add sources</div>

                <div>
                    <div>Sources let NotebookLM base its responses on the information that matters most to you.</div>
                    <div>(Examples: marketing plans, course reading, research notes, meeting transcripts, sales documents, etc.)</div>
                </div>

                <div className="border-2 border-[#727575] rounded-2xl border-dashed p-10">
                    <div className="flex flex-col justify-center items-center relative">
                        <input type="file" className="text-blue-500 w-35 h-16 absolute top-1 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e)} />
                        <div className="text-blue-600 bg-[#35394b] rounded-full p-3"><Upload className="h-5 w-5" /></div>
                        <span className="text-lg">Upload sources</span>
                        <span className="mt-2 text-gray-400">Drag & drop or <input type="file" className="text-blue-500 w-22 overflow-hidden" onChange={(e) => handleFileChange(e)} />to upload</span>
                    </div>

                    <div className="flex justify-center items-center pt-10">
                        <span className="text-gray-400 text-sm">Supported file types: PDF, txt, Markdown, Audio (e.g.mp3)</span>
                    </div>
                </div>

                <div className="flex gap-2 justify-evenly text-xs">
                    <div className="border border-[#727575] rounded-xl p-3 w-[254px]">
                        <div className="flex items-center gap-2"><GiMoebiusTriangle className="h-5 w-5" /> Google Drive</div>
                        <div className="flex mt-4 gap-2">
                            <div className="bg-gray-600 rounded-md p-1 flex justify-between items-center gap-2 px-2">
                                <SquareMenu className="w-4 h-4" /> Google Docs
                            </div>
                            <div className="bg-gray-600 rounded-md p-1 flex justify-between items-center gap-2 px-2">
                                <TvMinimal className="w-4 h-4" />Google Docs
                            </div>
                        </div>
                    </div>
                    <div className="border border-[#727575] rounded-xl p-3 w-[254px]">
                        <div className="flex items-center gap-2"><Link2 className="h-5 w-5" /> Link</div>
                        <div className="flex mt-4 gap-2">
                            <div className="bg-gray-600 rounded-md p-1 flex justify-between items-center gap-2 px-2">
                                <CgWebsite className="w-4 h-4" /> Website
                            </div>
                            <div className="bg-gray-600 rounded-md p-1 flex justify-between items-center gap-2 px-2">
                                <Youtube className="w-4 h-4" />YouTube
                            </div>
                        </div>
                    </div>
                    <div className="border border-[#727575] rounded-xl p-3 w-[254px]">
                        <div className="flex items-center gap-2"><Clipboard className="h-5 w-5" /> Paste text</div>
                        <div className="mt-4 flex">
                            <div className="bg-gray-600 rounded-md p-1 flex justify-between items-center gap-2 px-2 w-auto">
                                <SquareMenu className="w-4 h-4" /> Copied text
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center text-xs">
                    <FileUp />
                    <span className="w-20">Source limit</span>
                    <div className="w-full rounded-full bg-gray-600 h-4"></div>
                    <span>0/50</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NotebookUpload
