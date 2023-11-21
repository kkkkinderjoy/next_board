
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Comment from "@/components/comment";
import db from "@/db";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import Link from 'next/link';
import EditDelete from "./editDelete";

interface userInfo{
  user:{
    name:string;
    email?:string; //kakao때문
    image?:string;
    level?:number;
  }
}

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

//데이터를 호출해서 하단에서 async로 데이터를 불러들임

async function Getip(){
  const res = await fetch('http://localhost:3000/api/get-ip')
  //fetch문에 슬러쉬가 안먹기 때문에 주소전체를 적어줘야함
  //axios 대신 fetch를 사용하는 이유?
  const data = res.json();
  if(!res.ok){
    alert('에러가 발생하였습니다.');
    return;
  }
  return data
}



export default async function Detail({
  params
}:{
  params ?: {id?: number}
}
){
  const getIp = await Getip();
  const userIp = getIp.data
  // console.log(userIp + "내아이피")
  console.log(getIp)
  const postId = params?.id !== undefined ? params.id : 1 ;
  const[results] = await db.query<RowDataPacket[]>('select * from board.board where id= ?', [postId])
  const post = results && results[0]
  let session = await getServerSession(authOptions) as userInfo;
  const[countResult] = await db.query<RowDataPacket[]>('select count (*) as cnt from board.view_log where postid= ? and ip_address =?',[postId, userIp])
  const totalCnt = countResult[0].cnt;
  console.log(totalCnt+'개')
  if(results.length > 0){
    if(totalCnt === 0){
      await db.query<RowDataPacket[]>('UPDATE board.board set count = count + 1 where id=?',[postId])
      
    }else{

    }
    await db.query<RowDataPacket[]>('INSERT into board.view_log(postid,ip_address,view_date) select ?,?, NOW() where not exists (select 1 from board.view_log where postid= ? and ip_address = ? and view_date > now() - interval 24 hour)',[postId, userIp, postId, userIp])

    // select 1 존재 여부를 확인하기 위해 사용 > 1이라는 건 상수 값으로 실제 데이터는 중요하지 않으며, 존재 여부를 확인하기 위함
    // 내가 원하는 테이블에서 어떠한 조건 즉 and 까지 포함한 3가지 조건이 모두 총족하는 조건을 찾는다
    //어떠한 행동 반환하지 않을 때만 참이 된다. 즉, 3가지 조건이 모두 참일때 혹은 데이터가 없을 때 쿼리가 실행됨

  }

    return(
        <>
            {
                results.length > 0 && (
                  
                <>
                <div className="w-full h-full p-10 bg-white">
                  <div className="max-w-7xl mx-auto lg:mx-13 flex flex-col ">
                    <p className="font-bold text-[1.6rem] lg:text-[1.75rem] text-left my-5 mb-12">게시글</p>
                      <div className="border-[#e8e8e8] border-[1px] p-10 rounded-lg">
                        <div className="p-[0_0_24px] m-[0_0_24px] border-b-[1px] border-[#f4f4f4]">
                            <div className="flex">
                                <div className="text-[#171717] mb-3 font-bold text-[1.6rem] lg:text-[1.75rem]">
                                    <p className="">제목: {post?.title}</p>
                                    <p className="">제목: {post?.content}</p>
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
                          <p className="">{post && post[0]?.content}</p>
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

