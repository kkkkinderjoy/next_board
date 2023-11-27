import db from '@/db';
import { NextRequest , NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";

interface PostType{
    pathUrl ?: string;
    id? : number;
}


export const POST = async (req:NextRequest) : 
Promise<NextResponse> =>{

    const {pathUrl, id} : PostType = JSON.parse(await req.text());
    if(req.method === 'POST'){
        if(pathUrl === 'member'){
            const [memberResult] = await db.query<RowDataPacket[]>('select * from board.member order by date DESC')
            return NextResponse.json({message:"성공" , data:memberResult})
        }else if(pathUrl === 'edit'){
            const [memberResult] = await db.query<RowDataPacket[]>('select * from board.member order by date DESC')
            return NextResponse.json({message:"성공" , data:memberResult})

        }else{
            return NextResponse.json({error:"알 수 없는 에러가 발생하였습니다."})
        }

    }else{
        return NextResponse.json({error:"알 수 없는 에러가 발생하였습니다."})

    }
}




