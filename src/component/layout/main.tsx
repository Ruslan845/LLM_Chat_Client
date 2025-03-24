"use client"

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar"

interface LayoutProps {
    children?: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    const [collapseSidebar, setCollapseSidebar] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setCollapseSidebar(window.innerWidth < 1024);
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className='bg-[#202323] w-full flex overflow-x-hidden'>
            <div
                className={`h-screen`}
            >
                <Sidebar setCollapseSidebar={setCollapseSidebar} collapseSidebar={collapseSidebar} />
            </div>
            <div className="w-full h-screen"> {children}</div>
        </div>
    )
}

export default Layout