'use client'
import Link from "next/link";
import { useState } from "react"
import { useSession } from "next-auth/react";
import { useCustomSession } from "@/app/sessions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faList } from "@fortawesome/free-solid-svg-icons";


interface formType {
    username:string;
    userid:string;
    name: string;
    title: string;
    content: string;

}

export default function Write(){
    const {data:session} = useCustomSession();
    const [formData,setFormData] = useState<formType>({
        //데이터가 잘들어가있지만 반응이 느려서 비어보이는것 (username)
        //글쓰기를 회원만 적게 하려고 하면
        // 물음표 1개: 있으면 ~~ 물음표 2개 : ?? '': session?.user?.name의 값이 undefined 또는 null인 경우 빈 문자열('')을 반환함(조건) 
        username:session?.user?.name ?? '',
        userid: session?.user?.email ?? '',
        name:'',
        title:'',
        content:''
    });

    const changeEvent = (e :React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setFormData({...formData, [e.target.name] : e.target.value});
        console.log(formData)
    }  
    
    const submitEvent = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const res = await fetch('/api/write', {
                method : 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body :JSON.stringify(formData)
            })
            if(res.ok){
                const data = await res.json();
                console.log(data.message);
                alert('정상적으로 등록 하였습니다');
                window.location.href = '/'
            }else{
                const errorData = await res.json();
                console.log(errorData.error);

            }
        }catch(error){
            console.log(error);
        }
    } 

    return(
        <>
            <div className="w-full h-full p-10 bg-white">
                <div className="max-w-7xl mx-auto lg:mx-13 flex flex-col">
                <p className="font-bold text-[1.6rem] lg:text-[1.75rem] text-left my-5 mb-12 ">글쓰기</p>
            <form className="border-[#e8e8e8] border-[1px] p-10 rounded-lg" method="post" onSubmit={submitEvent}>
                <div className="flex items-center border-b-[#ccc] border-b-[1px]">
                    <p className="font-semibold">작성자</p>
                    <input type="text" name="name" value={session?.user?.name ?? ''} onChange={changeEvent} className="w-1/4 my-3 ml-3 p-3 border border-[#999]"/>
                </div>
                <div className="flex items-center border-b-[#ccc] border-b-[1px]">
                    <p className="font-semibold">제목</p>
                    <input type="text" name="title" onChange={changeEvent} defaultValue={formData.title} className="my-5 w-[85.5%] ml-3 p-3 border border-[#999] "/>
                </div>
                <div className="flex items-center border-b-[#ccc] border-b-[1px]">
                    <p className="font-semibold">내용</p>
                    <textarea name="content" onChange={changeEvent}  defaultValue={formData.content} className=" min-w-[85.5%] max-w-[85.5%] min-h-[200px] max-h-[200px] my-5 w-[85.5%] ml-3 p-3 border border-[#999]"></textarea>
                </div>
                <div className="flex justify-end gap-1 mt-7">
                <button className="bg-sky-400 text-white px-4 py-2 rounded shadow-md hover:bg-sky-600 focus:outline-none"><FontAwesomeIcon icon={faCheck} />등록</button>
                <Link href='/' className="inline-block bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none"><FontAwesomeIcon icon={faList} />목록</Link>
                </div>
            </form>
                </div>
            </div>
        </>
    )
}