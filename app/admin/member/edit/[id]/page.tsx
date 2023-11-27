'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

interface userType{
    email:string;
    password ?:string;
    name :string;
    nickname: string;
    level:number;
    type:string;
    id:number;
}
export default function MemberEdit({params} :{params : 
{id:number}}){

    const [userData,setUserData] = useState<userType>();

    return(
        <>
            <div className="widget w-full overflow-hidden mb-5 p-4">
                <h3>회원수정</h3>
            </div>
            <div className="widget w-full overflow-hidden mb-5 p-4">
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">이메일 : </label>
                    <input type="text" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">이메일 : </label>
                    <input type="text" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">이메일 : </label>
                    <input type="text" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">이메일 : </label>
                    <input type="text" className="border text-sm p-2 rounded-md"/>
                </div>
                <div className="flex mb-4 items-center">
                    <label htmlFor="email" className="basis-3/12 text-xs sm:text-xm">레벨 : </label>
                    <select name="level" className="border text-sm px-5 py-2 rounded-md">
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
        </>
    )
}