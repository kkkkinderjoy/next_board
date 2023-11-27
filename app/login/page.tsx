'use client'
import {signIn} from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState } from 'react';
import { useCustomSession } from '../sessions';


interface userInfo{
    user:{
        name:string;
        email:any;
        password: string;
        level: number
    }
}

export default function LoginPage() {

    const [preUrl, setPreUrl] = useState<string>('');
    const {data:session} =useCustomSession();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(()=>{
        if(typeof window !== 'undefined'){
            const prevPage = sessionStorage.getItem('preUrl') || '/';
            //null 값일때는 '/' 즉, 메인페이지라는 의미임
            // console.log(prevPage)
            setPreUrl(prevPage)
        }
    },[])
    const SignIn = () => {
      const credentials = {
        email: email,
        password: password
      };
            
    signIn('credentials', { ...credentials , callbackUrl: preUrl});
      
    }

    
    // callbackUrl은 Next.js에서 사용되는 개념이 아니라 인증 관련 라이브러리나 서비스에서 사용되는 용어로, OAuth, OpenId등의 인증 프로토콜을 사용하는 경우에 사용함. 
    // callbackUrl은 인증과정에서 사용자가 인증을 완료하고 돌아올 URL을 나타냄
    // 인증과정을 거치고 인증이 완료되면 해당인증 공급자는 사용자를 callbakcUrl로 리디렉션시킴
    // callbackUrl은 원래 사용자가 이전에 요청한 페이지로 돌아기기 위한 목적으로 사용됨
    // 즉, callbackUrl은 인증이 완료된 후 사용자를 리디렉션시킬 URL을 의미함

    if(session && session.user){
        return <p className="">이미 로그인 중입니다.</p>
    }
    //로그인 되어있을 떄 이미 로그인중이라고 뜸

    return(
        <>
         { session && session.user.level === 10 
            ?
            '관리자'
            :
            session && session.user !== null && '일반회원'
        }
            <>
            <div className='flex justify-between w-full flex-wrap items-center py-48'>
                <div className='basis-9/12 sm:basis-7/12 md:basis-5/12 lg:basis-4/12 mx-auto'>
                    <p className="p-2 font-bold text-2xl lg:text-3xl leading-[47px] text-black text-center mb-10">로그인</p>
                    <div className='text-start'>
                        <p>이메일</p>
                        <input type="text" className='px-2 border border-l-blue-300 border-l-[3px] w-full focus:outline-gray-400 h-[50px] mx-auto' placeholder='example@naver.com'
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='text-start mt-3'>
                        <p>비밀번호</p>
                        <input type="password" className='px-2 border border-l-blue-300 border-l-[3px] h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='비밀번호를 입력해주세요'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                      <button className='basis-[48%] px-6 py-2.5 bg-gray-800 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out' onClick={SignIn}>로그인</button>
                      <button className='basis-[48%] px-6 py-2.5 bg-blue-400 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-150 ease-in-out'><Link href="/register">회원가입</Link></button>

                    </div>
             
                <h3 className='text-xl font-bold mt-10'>SNS 간편 로그인</h3>
                <div className='w-full flex mb-7 justify-between'>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white' onClick={()=>signIn('kakao')}>
                        <Image src='./sns/kakao_talk.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white' onClick={()=>signIn('google')}>
                        <Image src='./sns/google.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white ' onClick={()=>signIn('naver')}>
                        <Image src='./sns/naver.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
                    <button className='basis-1/5 mt-3 mx-auto py-2  text-white ' onClick={()=>signIn('github')}>
                        <Image src='./sns/github-mark.svg' width={50} height={50} alt="naver" className='mx-auto' />
                    </button>
               
                    </div>
              </div>
            </div>
            </>
           
        </>
    )
};
