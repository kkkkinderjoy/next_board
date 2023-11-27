import db from '@/db';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import { getServerSession } from 'next-auth';
import Search from '@/components/search';
import { useState } from 'react';


interface userInfo{
  user:{
    name: string;
    email?:string;
    image?:string;
    level?:number;
  }
}



export default async function PostList({
    params,
}: {
    params? : {page? : number}
}) {
    // console.log(params)
    const currentPage =  params?.page !== undefined ? params.page : 1 ;
    //현재 파라미터가 값이 없다면 1페이지가 되고 그게 아니라면 해당 페이지로 접속
    const perPage = 15 ;
    const offset =(currentPage - 1) * perPage ;

    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board order by date desc limit ? offset ?', [perPage, offset])
    const[countResult] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.board')
    const totalCnt = countResult[0].cnt;
    // console.log(results);
    
    const lastPage = Math.ceil(totalCnt / perPage);
    const totalPageCnt = 5;
    const startPage = Math.floor((currentPage - 1 ) / totalPageCnt) * totalPageCnt + 1;
    const endPage = Math.min(lastPage, startPage + totalPageCnt - 1);
    let prevStart = Math.floor((currentPage - 1 ) / 5) * 5 - 4;
    let nextStart = Math.ceil((currentPage) / 5) * 5 + 1;

    let sessions = await getServerSession(authOptions) as userInfo;
    // console.log(sessions)
       

  return (
    <>
      <div className="mx-auto max-w-7xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">게시판</h1>
                {
                    sessions && 
                    <Link href='/write' className='flex gap-1 bg-sky-300 text-white px-3 py-2 rounded shadow-md hover:bg-sky-600'><FontAwesomeIcon icon={faPen} className='w-5'/>글쓰기</Link>
                }
            </div>
            <div className="bg-white shadow-md rounded-lg">
                <ul className="min-w-full bg-gray-100 flex basis-full">
                    <li className="py-3 text-center md:basis-1/6 mini:hidden md:block">번호</li>
                    <li className="py-3 text-center basis-1/2">제목</li>
                    <li className="py-3 text-center mini:basis-1/4 md:basis-1/6">작성자</li>
                    <li className="py-3 text-center mini:basis-1/4 md:basis-1/6">작성일</li>
                </ul>
                { 
                results && results.map((e,i)=>{
                const date  = new Date(e.date);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2,'0');
                const day = date.getDate().toString().padStart(2,'0');
                const formateDate = `${year}-${month}-${day}`
                const number = totalCnt - ((currentPage - 1) * perPage + i );

                return(
                    <ul key={i} className='flex justify-between basis-full p-2'>
                        <li className="basis-1/6 text-center mini:hidden md:block">{number}</li>
                        <li className="basis-1/2 text-center"><Link href={`/post/${e.id}`}>{e.title}</Link></li>
                        <li className="mini:basis-1/4 md:basis-1/6 text-center">{e.username}</li>
                        <li className="mini:basis-1/4 md:basis-1/6 text-center">{formateDate}</li>
                        {/* <li className="text-xl"> 가격: {e.amount}</li>
                        <li className="text-xl"> 결제일자: {e.payment_date}</li>
                        <li className="text-sm"> 현재페이지 : {page}</li> */}
                        {/* 에러가 나는 이유는? 타입스크립트인데 타입을 지정안해줘서 그럼 */}
                    </ul>
                )
        })}
            </div>    
        </div>
        <div className="flex justify-center gap-x-5 mb-5">
            {
                currentPage > 5 && <Link href={`/posts/${prevStart}`} className='bg-white border px-1.5 py-1 text-sm rounded'>이전</Link>
            }
            {
                Array(endPage - startPage + 1).fill(null).map((_,i)=>{
                    const pageNumber = i + startPage;
                    const isActive = pageNumber === currentPage;
                    return(
                        <Link
                        key={i}
                        href={`/posts/${pageNumber}`}
                        className={`bg-white border px-1.5 py-1 text-sm rounded ${isActive ? 'active' : ''}`}
                      >
                        {pageNumber}
                      </Link>
                       
                    )
                })
            }
            {
                nextStart <= lastPage && <Link href={`/posts/${nextStart}`} className='bg-white border px-1.5 py-1 text-sm rounded'>다음</Link>

            }
            
        </div>
        <Search />



    </>
  )

}
