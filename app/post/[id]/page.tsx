import db from '@/db';
import { RowDataPacket } from 'mysql2';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Comment from '@/components/comment';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditDelete from './editDelete';
import CountView from './count';

interface userInfo {
    user : {
        name : string;
        email ?: string;
        image ?: string;
        level ?: number;
    }
}

interface propsType{
    results : {
        id : number;
        userid : string;
        title ?: string;
        content ?: string;
        username ?: string;
        count ?: number;
        date ?: string;
    }
}

export default async function Detatil({
    params
} : {
    params ?: {id?: number}
}){
    
    const postId = params?.id !== undefined ? params.id : 1;
    const [results] = await db.query<RowDataPacket[]>('select * from board.board where id = ?', [postId])
    const post = results && results[0]
    let session = await getServerSession(authOptions) as userInfo;

    // select 1 존재 여부를 확인하기 위해 사용 > 1이라는건 상수 값으로 실제 데이터는 중요하지 않으며 , 존재 여부를 확인하기 위함
    //내가 원하는 테이블에서 어떠한 조건 즉 and 까지 포함한 3가지 조건이 모두 충족하는 조건을 찾는다.
    // 어떠한 행도 반환하지 않을 때만 참이 된다 . 즉 3가지 조건이 모두 참일 때 혹은 데이터가 없을때 쿼리가 실행

    return(
        <>
            {
                results.length > 0 && (
                    <>
                  <CountView postId={postId}/>
                  <div className="w-full h-full p-10 bg-white">
                  <div className="max-w-7xl mx-auto lg:mx-13 flex flex-col ">
                    <p className="font-bold text-[1.6rem] lg:text-[1.75rem] text-left my-5 mb-12">게시글</p>
                      <div className="border-[#e8e8e8] border-[1px] p-10 rounded-lg">
                        <div className="p-[0_0_24px] m-[0_0_24px] border-b-[1px] border-[#f4f4f4]">
                            <div className="flex">
                                <div className="text-[#171717] mb-3 font-bold text-[1.6rem] lg:text-[1.75rem]">
                                    <p className="">{post?.title}</p>
                                    <p className=""> 조회수 : {post?.count}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="w-full flex justify-between mr-4 pr-4 relative z-10 font-medium text-[0.875rem]">
                                <p className="text-[#ff501b]">{post && post[0]?.username}</p>
                                {/* <p className="">{currentDate}</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="mb-[81px] leading-6 text-[#6a6a6a]">
                          {/* <p className="">{post && post[0]?.content}</p> */}
                          <p className="">{post?.content}</p>
                        </div>
                        
                        {
                        //id값을 props로 넘김 > 댓글에서 누가작성한 글인지 알기 위해
                          session ? <Comment id={post?.id} /> : <p className="block border p-4 text-center my-5 rounded-md"><Link href="/login">로그인 후 댓글 이용이 가능합니다</Link></p>
                        }
                        <EditDelete results={post as propsType['results']}/>
                        
                      </div>
                    </div>
                </div>
                
                    </>
                )
            }
        </>
    )
}