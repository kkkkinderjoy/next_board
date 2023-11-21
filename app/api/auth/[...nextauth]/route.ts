import NextAuth from "next-auth/next";
import GithubProvider  from "next-auth/providers/github";
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import GoogleProvider from 'next-auth/providers/google';
import CredentialProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt';
import db from '@/db'
import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";


interface User{
    id: string;
    name:string;
    email:string;
    level:string;
}

interface CustomSession extends Session{
    user?: User
}

export const authOptions :any  ={
    providers : [
        GithubProvider ({
            clientId :`${process.env.GITHUB_CLINET_ID}`,
            clientSecret:`${process.env.GITHUB_CLIENT_SECRET}`
        }),
        KakaoProvider ({
            clientId :`${process.env.KAKAO_CLINET_ID}`,
            clientSecret :`${process.env.KAKAO_CLIENT_SECRET}`
        }),
        NaverProvider ({
            clientId :`${process.env.NAVER_CLINET_ID}`,
            clientSecret :`${process.env.NAVER_CLIENT_SECRET}`
        }),
        GoogleProvider ({
            clientId :`${process.env.GOOGLE_CLINET_ID}`,
            clientSecret :`${process.env.GOOGLE_CLIENT_SECRET}`
        }),
        CredentialProvider({
            name:"Credentials",
            credentials:{
                email:{label:"email", type:"text"} ,
                //로그인페이지를 만들필요가 없이 제공함
                password:{label:"password", type:"password"} 
               
            },
            //로그인 요청시 실행되는 코드 DB와 비교 후 맞으면 return , user 정보를 보내고 틀리면 return null
            async authorize(credentials) :Promise<User | null> {
              try{
                const [results] = await db.query<RowDataPacket[]>('select * from board.member where email= ?',[credentials?.email]);
            //   console.log(results[0].email);
              const userResult = results[0]
              if(!credentials || !credentials.email || !credentials.password){
                return null
              }
              if(!userResult.email || !userResult.password){
                console.log("해당 사용자가 없습니다.")
                return null
              }
              const pwCheck = await bcrypt.compare(credentials.password , userResult?.password)
            //   console.log(pwCheck)
              if(!pwCheck){
                console.log("비밀번호 틀림")
                return null
              }
              const user:User = {
                id: userResult.id,
                name:userResult.name,
                email:userResult.email,
                level:userResult.level
              }
              return user

              }catch(error){
                return null
              }
            }
          })
    ],
    pages:{
        signIn :'/login'
    },
    //jwt 만료일 설정
    session :{
        strategy :'jwt',
        maxAge:  24 * 60 * 60 //세션만료일자 한달을 할거면 *30을 추가로 적어주면됨
    },
    //jwt 만들 때 실행되는 코드 토큰 발급
    callbacks :{
        jwt : async ({token,user} : {token:JWT, user?:User}) =>{ //JWT, Session을 import 한 이유는 타입지정하기 위해
            if(user){
                token.user = {
                name : user.name,
                email : user.email,
                level : user.level
                }      
            }
            return token
        },
        //유저 세션이 조회될 때마다 실행되는 코드
        session : async ({session,token} : {token:JWT, session:CustomSession}) =>{
            session.user = token.user as User; //as로 session.user의 타입을  User로 덮어씌움
            return session
        }
    },
    secret: `${process.env.SECRET_KEY}`, //jw 토큰 생성시 필요한 암호를 입력하는 곳, 복잡하게 써야함   
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
