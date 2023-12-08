import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import db from '@/db'


interface PostType{
    ip: string;
    platform : string;
    agent : string;

}

export const POST = async(req:NextRequest) :Promise<NextResponse>=>{
    const {ip, agent, platform} : PostType = JSON.parse(await req.text())
    
    if(req.method === 'POST'){
        
        const [results]= await db.query<RowDataPacket[]>('select count(*) as cnt from board.visits where ip_address = ? and visit_time > now() - interval 10 second', [ip])

        if(results[0].cnt <=0){
            await db.query<RowDataPacket[]>('insert into board.visits (platform, agent, ip_address) values(?,?,?)',[platform, agent, ip])
        }
        
        return NextResponse.json({message:"성공"})
    
    }else{
        return NextResponse.json({error:"에러가 발생하였습니다"})
    }
}