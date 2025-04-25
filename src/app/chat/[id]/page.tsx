"use client"

import ChatPage from "@/component/page/home/chatpage";
// import { use } from 'react';
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || '';
  console.log("id in chat/[id]/page.tsx", id);

  return (
    <ChatPage id={id}/>
  );
}