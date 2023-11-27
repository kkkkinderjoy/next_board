import { NextRequest, NextResponse } from "next/server";
import db from '@/db';
import bcrypt from 'bcrypt';
import { RowDataPacket } from "mysql2";

interface formType{
    email:string;
    name:string;
    password:string;
    birth:string;

}

export const POST = async(
    
    req: NextRequest
) :Promise<NextResponse> =>{
    if(req.method === "POST"){
        
        const{email,password,name,birth} :formType = JSON.parse(await req.text());
        const hash = await bcrypt.hash(password, 10);
        // console.log(hash)
        
        //실제로 데이터를 보낼때는 email,hash,name을 보내는것임 password를 보내면 안됨
        //text로 받아서 받은 데이터를 json으로 parsing함
        // console.log(email, password, name)
        
        //아래는 이메일 중복확인해야함
        const [checkMember] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.member where email=?' ,[email]);

        const memberCnt = checkMember[0].cnt;

        if(!email || !password || !name || !birth){
            return NextResponse.json({message:"데이터가 부족합니다"})
        } 
        //프론트엔드(required)에서 한번 체크하고 백엔드에서도 체크해줘야함  + 프론트엔드에서는 유효성검사만 추가해주면 (파이어베이스에서 했음)


        if(memberCnt > 0){  
            return NextResponse.json({message:"해당 이메일이 존재합니다"})
        }else{
            await db.query('insert into board.member (email,password,name,birth) values (?,?,?,?)',[email,hash,name,birth])
            //바로 실행하기 1114-3
            const data ={
                email: email,
                password: password
            }
        return NextResponse.json({message:"성공", data: data})
        }
        
    }else{
        return NextResponse.json({error:"실패"})
    }
}
