

interface userInfo{
    user:{
      name: string;
      email?:string;
      image?:string;
      level?:number;
    }
  }

import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Logout from './logout';
import Login from './login';



export default async function Nav(){
    
    let session = await getServerSession(authOptions) as userInfo;
    
    
    return(
        <>
        {/* {
            session && session.user.level === 10 ?
            '관리자'
            :
            session && session.user !== null && '일반회원'
            //로그아웃해도 일반회원이 나와서 null값이 아닐때 일반회원이 나오도록 설정함
        } */}
        {
        session && session.user
        //session.user?.email 원래는 이건데 카카오 로그인 때문에 코드 변경함
        ? 
        <>
        <div className="w-full h-full bg-white">
            <div className="max-w-7xl mx-auto flex items-center flex-wrap justify-between">
                <Link href="/"><img src="/images/board_logo.svg" alt="logo" className='w-40 h-20 my-1'/></Link>
                <div className="flex gap-3 mx-10 p-2">
                    <p className=""><span className='font-semibold'>{session && session.user?.name}</span>님 반갑습니다</p> 
                    <Logout />
                </div>
            </div>
        </div>
        </>
        : 
            <>
            <div className="w-full h-full bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
                <Link href="/"><img src="/images/board_logo.svg" alt="logo" className='w-40 h-20 my-1'/></Link>
                <div className="flex gap-3 mx-5 justify-end">
                    <Link href='/register'>회원가입</Link>
                    <Login />
                    {/* <button onClick={()=>{signIn('github')}}>깃허브 로그인</button>
                    <button onClick={()=>{signIn('kakao')}}>카카오 로그인</button>
                    <button onClick={()=>{signIn('naver')}}>네이버 로그인</button>
                    <button onClick={()=>{signIn('google')}}>구글 로그인</button> */}
                    {/* <button onClick={()=>{signIn('credential')}}>로그인</button> */}
                </div>
              </div>
            </div>
            </>
        }
        {/* sns 로그인 버튼 커스텀 하려면 저렇게 해야함   */}
        {/* 로그인 페이지 만들어서 버튼 설정해주기 */}
        </>
    )
}
