/*

const {data: session} = useCustomSession();
 const data ={
    id:5,
    name:"홍길동",
    email:"abcd@naver.com"
 }
    변수 내에 중괄호 {} 가 들어가면 구조 분해 할당 (destructuring assignment)
    > 해당 객체에서 그 속성을 추출해서 새로운 변수로 할당할 때 사용함
    > 예를 들어, data.id 이걸 변수로 따로 저장하고 싶다면 
        const {id} = data > const id = 5 값이 저장된다.

        data.id로 사용가능하지만 변수로 사용하고 싶다면 위에 객체형태로 사용하면됨
 */

'use client'
import React, { useEffect, useState } from "react"
import { useCustomSession } from "@/app/sessions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { fetchData } from "next-auth/client/_utils";
import { useParams } from "next/navigation";

interface CommentProps{
    id:number
}

interface formType{
    parentid: number;
    userid: string;
    username: string;
    content: string;
}

interface CommentType{
    id: number;
    parentid: string;
    userid: string;
    username: string;
    content: string;
    date: string;

}

export default function Comment(props: CommentProps){
    
    
    const {data: session} = useCustomSession();
    const {id} = props;
    //id값을 구조분해할당으로 설정함
    //id가 변수로 설정됨
    // alert(id)
    const cmtSubmit = async() =>{
        try{
            const res = await fetch ('/api/comment', {
                method: "POST",
                headers:{
                    "Content-Type" :"applicatoin/json",
                    
                },
                body: JSON.stringify(formData)
            })
            if(res.ok){
                const data = await res.json();
                // console.log(data);
                setTotalComment(data.result)
            }
        }catch(error){
            console.log(error)
        }
    }

    const [formData,setFormData] = useState<formType>({
        parentid: id,
        userid: session?.user?.email ?? '',
        username: session?.user?.name ?? '',
        content: '' //comment

    })
    useEffect(()=>{
        setFormData({
            parentid:id,
            userid: session?.user?.email ?? '',
            username: session?.user?.name ?? '',
            content:''
        })
    },[session?.user.name, session?.user.email,id])
    
    const params = useParams();
    // console.log(params)
    
    useEffect(()=>{
        const fetchData = async() =>{
            const res = await fetch(`/api/comment?id=${params.id}`)
            const data = await res.json();
            setTotalComment(data.result);
        }
        fetchData()

    },[params.id])

    const [comment , setComment] = useState<string>("");
    const [totalComment,setTotalComment] = useState<CommentType[]>();

    const commentValue = (e: React.ChangeEvent<HTMLInputElement>) =>{
        // setComment(e.target.value);
        setFormData({...formData, [e.target.name] : e.target.value});
        // console.log(formData);
        
    }
    // const currentDate = new Date().toLocaleDateString();


    return(
        <>
            {
                session && session.user && 
                <>
                <div className="">
                    <div className="w-full h-12 flex items-center pb-[25px] border-b-[#e8e8e8] border-b-[1px] gap-1">
                        {/* state값으로  */}
                    </div>
                    <div className="pt-6">
                        <div className="mb-4 flex justify-between">
                            <div className="w-full p-[0_16px] flex items-center bg-white relative text-[#9e9e9e] font-normal text-[0.875rem] lg:text-[1rem]">
                                <input name="content" type="text" className="w-full h-[46px] text-[#171717] border text-[0.875rem] lg:text-[1rem] p-2" onChange={commentValue}/>
                            </div>
                            <button onClick={cmtSubmit} className="flex items-center justify-center cursor-pointer font-medium p-[11px_27px] text-[0.875rem] lg:text-[1rem] border-[#171717] border-[1px] rounded-lg text-white bg-[#171717]">
                                <div className="font-medium m-[0_2.5%] whitespace-nowrap text-[0.875rem] lg:text-[1rem]">등록</div>
                            </button>
                        </div>
                        
                    </div>
                    {
                        totalComment && totalComment.slice().reverse().map((e,i)=>{
                            //배열 복사 후 reverse 해주기 (댓글 최신순)
                            const date  = new Date(e.date);
                            date.setTime(date.getTime()+(60*60*9*1000))
                            const year = date.getFullYear();
                            const month = (date.getMonth() + 1).toString().padStart(2,'0');
                            const day = date.getDate().toString().padStart(2,'0');
                            const hours = date.getHours().toString().padStart(2,'0');
                            const minutes = date.getMinutes().toString().padStart(2,'0');
                            const seconds = date.getSeconds().toString().padStart(2,'0');
                            const formateDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
                        return(
                            <React.Fragment key={i}>
                                <div className="p-[26px_0_24px] border-b-[1px] border-[#f4f4f4] text-[0.875rem] lg:text-[1rem]">
                                    <div className="flex gap-4 items-center text-[#9e9e9e] ">
                                        <p className="">{e.username}</p>
                                        <p className="">|</p>
                                        <p className="">{formateDate}</p>
                                    </div>
                                    <div className="text-[#6a6a6a] text-[1.1rem] flex justify-between">
                                        <p className="">{e.content}</p>
                                        <div className="flex gap-2">
                                        <FontAwesomeIcon icon={faEdit} />
                                        <FontAwesomeIcon icon={faTrash} />
                                        </div>
                                    </div>
                                </div>
                                
                            </React.Fragment>
                        )
                    })
                }
                </div>
                </>
                
            }
        </>
    )
}