import db from '@/db';
import { RowDataPacket} from 'mysql2';
import Link from 'next/link';
import React from 'react';


export default async function SearchResult({
    params
}:{
    params? : {keyword?: string}
}){
    const keywords = params?.keyword !== undefined ? params.keyword : "";
    const [results] = await db.query<RowDataPacket[]>('select * from board.board where title Like ?',[`%${decodeURIComponent(keywords)}%`]);
    // 검색은 Like를 사용하면 %를 입력하면 비슷한 이름을 참조하겠다(between같은 개념) > SQL문법


    return(
        <>
            <p className="">검색결과: {decodeURIComponent(keywords)}</p>
            {results.length === 0 && <p className=''>검색결과가 없습니다</p>}
            {results && results.length > 0 && results.map((e,i)=>{
                return(
                    <div key={i}>
                        <Link href={`/post/${e.id}`}>
                        <p className="">{e.title}</p>
                        </Link>
                        <p className="">{e.username}</p>
                        <p className="">{e.content}</p>
                        
                    </div>
                )
            })}
        </>
    )
}