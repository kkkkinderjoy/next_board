import db from '@/db';
import { NextRequest,NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';

export const GET = async(req:NextRequest) : 
Promise<NextResponse> =>{
    const pathname = req.nextUrl.pathname; //내가 접속한 URL이 콘솔창에 나옴
    const postid = pathname.split('/').pop() //내가 접속한 URL에서 숫자만 가져오기 위해서 새로운 변수를 설정하여 pop()함수를 사용해줌
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board where id = ?',[postid])
    // mysql에서 물음표를 사용하면 변수를 사용할 수 있음 (인젝션)

    return NextResponse.json({data:results})
}

export const POST = async (req:NextRequest) :

Promise<NextResponse> =>{
    if(req.method === 'POST'){
        return NextResponse.json({message:"메세지"})
    }else{
        return NextResponse.json({message:"에러"})
    }

}
