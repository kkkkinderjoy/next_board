'use client';
import { faForward, faPen } from '@fortawesome/free-solid-svg-icons';
import { faBackward } from '@fortawesome/free-solid-svg-icons/faBackward';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React,{useEffect,useState} from 'react';

interface PostList {
    id: number;
    title: string;
    content :string;
    username: string;
    date: string;
    count : number;

}
export default function Post(){

    const[posts,setPosts] = useState<PostList[]>([]);
    const[totalCnt,setTotalCnt] = useState<number>(0);
    const[page,setPage]=useState<number>(1);

    // 아래 4개의 코드는 페이지네이션 만들때 쓰는 국룰코드임 (복붙해서 쓰기)
    const lastPage = Math.ceil(totalCnt / 15); //ceil : 올림  
    const totalPageCnt = 5;
    const startPage = Math.floor ((page-1) / totalPageCnt)  * totalPageCnt +1 ; //floor : 버림
    const endPage = Math.min(lastPage, startPage + totalPageCnt - 1);
    const nextpage = () =>{ // 5페이지에서 다음 누르면 6이 나오도록 하기 위해서 nextpage 함수 설정해줌 
        const nextStart = Math.ceil((page) / 5) * 5 + 1 ;
        setPage(nextStart)
    }
    const prevPage = () =>{
        const prevPage = Math.floor((page - 1) / 5) * 5 - 4 ;
        setPage(prevPage)
    }
    useEffect(()=>{
        const fetchData = async() =>{
            if(!page) return;
            //페이지가 없다면 return 시키기
            const res = await fetch(`/api/post?page=${page}`);
            const data = await res.json();
            setPosts(data.results);
            // console.log(data);
            setTotalCnt(data.totalCnt)
        } 
        fetchData()
    },[page])

    // console.log(lastPage);


    return(
        <>
        <div className="mx-auto max-w-7xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">게시판</h1>
               
                
            </div>
            <div className="bg-white shadow-md rounded-lg">
                <ul className="min-w-full bg-gray-100 flex basis-full">
                    <li className="px-6 py-3 text-center  lg:basis-1/6 mini:hidden md:block">번호</li>
                    <li className="px-6 py-3 text-center  lg:basis-1/2">제목</li>
                    <li className="px-6 py-3 text-center  lg:basis-1/6">작성자</li>
                    <li className="px-6 py-3 text-center  lg:basis-1/6">작성일</li>
                </ul>
                { 
            posts && posts.map((e,i)=>{
                const date  = new Date(e.date);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2,'0');
                const day = date.getDate().toString().padStart(2,'0');
                const formateDate = `${year}-${month}-${day}`
                return(
                    <ul key={i} className='flex justify-between basis-full'>
                        <li className="basis-1/6 text-center mini:hidden md:block">{posts.length -  i }</li>
                        <li className="basis-1/2 text-center"><Link href={`/post/${e.id}`}>{e.title}</Link></li>
                        <li className="basis-1/6 text-center">{e.username}</li>
                        <li className="basis-1/6 text-center">{formateDate}</li>
                        {/* <li className="text-xl"> 가격: {e.amount}</li>
                        <li className="text-xl"> 결제일자: {e.payment_date}</li>
                        <li className="text-sm"> 현재페이지 : {page}</li> */}
                        {/* 에러가 나는 이유는? 타입스크립트인데 타입을 지정안해줘서 그럼 */}
                    </ul>
                )
        })}
            </div>    
        </div>        
        
        <div className="flex justify-center gap-x-5">
        {page > 1 && <button onClick={() => setPage(1)} className='mb-4'><FontAwesomeIcon icon={faBackward}/></button>}
        {page > 5 && <button onClick={()=> {prevPage()}} className='bg-white border rounded text-sm mb-5 p-1.5'>이전</button>}
        {/* 숫자 5로 바꾸면 페이지가 6-11 / 12-17로 넘어감 */}
        {
            Array(endPage - startPage + 1).fill(null).map((_,i)=>{
                const pageNumber = i+ startPage;
                return(
                    <>
                        <button className={`border rounded text-sm mb-5 p-1.5 basis-8 ${pageNumber === page ?  "bg-blue-200 text-white" : "bg-white text-black"}`} key={pageNumber} onClick={()=>setPage(pageNumber)}>{pageNumber}</button>
                        {/* i로 하면 안되는 이유는 처음에 인덱스값을 정해져서 startPage랑 합쳐져있는데  */}
                    </>
                )
            })
        }
        {page < lastPage && <button onClick={()=>{nextpage()}} className='bg-white border rounded text-sm mb-5 p-1.5'>다음</button>}
        {page < lastPage && <button onClick={() => setPage(lastPage)} className='mb-4'><FontAwesomeIcon icon={faForward}/></button>}
        </div>
        
        </>
    )
}