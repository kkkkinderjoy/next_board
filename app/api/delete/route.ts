import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
import { RowDataPacket } from "mysql2";
interface PostNumber {
  id: number;
  pathUrl ?: string;
}

export const POST = async (
  req: NextRequest  
) : Promise<NextResponse> =>{

  if(req.method === 'POST'){
    const {id, pathUrl}: PostNumber = JSON.parse(await req.text());
    try{
      if(!id){
        return NextResponse.json({message: "데이터가 부족합니다."});
      }
      if(pathUrl === 'member'){
        const [chkMember] = await db.query<RowDataPacket[]>('select level from board.member where id = ?', [id]);
        if(chkMember[0].level === 10){
          return NextResponse.json({message:"관리자는 삭제할 수 없습니다."});
        }else{
          await db.query<RowDataPacket[]>('delete from board.member where id =?', [id]);
          return NextResponse.json({message: "정상적으로 삭제 되었습니다."});
        }
      }else{
        // await db.query('delete from board.board where id = ?', [id]);
        return NextResponse.json({message:"정상적으로 삭제 되었습니다."});
      }    

    }catch(error){
      return NextResponse.json({error: "에러"});
    }
  }else{
    return NextResponse.json({error: "정상적인 데이터가 아닙니다."});
  }


}