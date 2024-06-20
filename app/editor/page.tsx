"use client"

import Tiptap from "@/app/componets/Tiptap";
import { useState } from "react";
import cookie from 'js-cookie';
import { useRouter } from "next/navigation";


export default function Home() {

    const cookieContent = cookie.get('content');

    const [content, setContent] = useState(cookieContent)

    const router = useRouter()

    const handlerSave = () => {
        console.log(content)
        cookie.set('content', content || "");
        router.push("/")
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-16">
            <div className="z-10 w-full max-w-7xl font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8">Tiptap Editor</h1>

                <Tiptap content={content} className="focus:outline-none" onChange={setContent} />
            </div>
            <button onClick={handlerSave} className="mt-3">Save</button>
        </main>
    );
}