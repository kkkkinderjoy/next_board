'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

interface userType{
    email:string;
    password ?:string;
    name :string;
    birth: string;
    level:number;
    type:string;
    id:number;
}
export default function MemberEdit({params} :{params : 
{id:number}}){

    const [userData,setUserData] = useState<userType>();
    useEffect(()=>{
        const fetchData = async () =>{
        try{
        const res = await fetch('https://next-board-lemon.vercel.app/api/admin',{
        cache: 'no-cache',
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            pathUrl:'edit',
            id: params.id
        })
        })
        if(res.ok){
            const result = await res.json();
            const data = result.data;
            setUserData(data[0])
            console.log(data)
        }
        }catch(error){
            alert(error)
        }
        }
        fetchData()
    },[params.id])
    return(
        <>
            <div className="widget w-full overflow-hidden mb-5 p-4">
                <h3>회원수정</h3>
            </div>
            <div className="widget w-full overflow-hidden mb-5 p-4">
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">이메일 : </label>
                    <input defaultValue={userData && userData.email} type="text" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">패스워드 : </label>
                    <input type="password" name="password" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">닉네임 : </label>
                    <input defaultValue={userData && userData.name} type="text" name="name"  className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">생년월일 : </label>
                    <input defaultValue={userData && userData.birth} type="text" name="nickname"  className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">레벨 : </label>
                    <select name="level" value={userData && userData.level} className="border text-sm px-5 py-2 rounded-md">
                        {
                            Array(8).fill(null).map((_,i)=>{
                                return(
                                    <option key={i} value="{i+2}">{i+2}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-x-5">
                <Link href="/admin/member" className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600">취소</Link>
                <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600"></button>
            </div>
        </>
    )
}