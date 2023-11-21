'use client';
import { useCustomSession } from "@/app/sessions";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import React from "react";
import { useParams } from "next/dist/client/components/navigation";

interface propsType{
    results:{
      id:number;
      userid:string;
      content?:string;
      username?:string;
      count?:number;
      date?:string;
  
    }
  }


export default function EditDelete({results}:propsType){
    const {data:session} = useCustomSession();
    const params = useParams();
    const deletePost  = async(e:number) =>{
        try{
            const res = await fetch('/api/delete',{
                method: 'POST',
                headers :{
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({id:e})
            })
            if(res.ok){
                const data = await res.json();
                alert('정상적으로 삭제 되었습니다.');
                window.location.href="/"
            }else{
                alert("삭제 실패");
                return;
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <React.Fragment>
            {
              session && session.user && (
                (results && results && session.user.email === results.userid) || session.user.level === 10
              ) && 
              <>
            
              <div className="max-w-7xl mx-10 lg:mx-auto flex flex-wrap justify-end gap-1 p-3">
                  <button className="font-medium whitespace-nowrap text-[0.875rem] lg:text-[1rem] bg-gray-500 text-white px-4 py-2 rounded  hover:bg-gray-600"><FontAwesomeIcon icon={faEdit}/><Link href={`/edit/${params.id}`}>수정</Link></button>
                  <button className="font-medium whitespace-nowrap text-[0.875rem] lg:text-[1rem] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={()=>{deletePost(results.id)}}><FontAwesomeIcon icon={faTrash}/>삭제</button>
              </div>
              </>
            }
            
            {/* 위의 코드 : post 즉, 글쓴 사람의 이메일주소와 내가 로그인한 이메일주소가 같을 때만 삭제가 가능하도록 함  */}
                
        </React.Fragment>
    )
}