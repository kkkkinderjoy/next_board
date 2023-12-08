import db from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';

interface PostData {
  pathUrl?: string;
  id?: number;
}

interface MainType {
  totalCnt: number;
  memberCnt: number;
  writeCnt: number;
  commentCnt: number;
  visitCnt: number;
  visitTotalCnt: number;
  
}


export const POST = async (req:NextRequest) : Promise<NextResponse> =>{
  const {pathUrl, id}: PostData = JSON.parse(await req.text());
  if(req.method === 'POST'){
    switch (pathUrl) {
      case 'member':
        const [resultsMember] = await db.query<RowDataPacket[]>('select * from board.member order by date DESC');
        return NextResponse.json({ message: "성공", data: resultsMember });
      case 'edit':
        const [resultsEdit] = await db.query<RowDataPacket[]>('select * from board.member where id = ?', [id]);
        return NextResponse.json({ message: "성공", data: resultsEdit });

      case 'mainChart_1':
        const [resultsChart_1] = await db.query<RowDataPacket[]>('select DATE(date) as date, count(*) as user_count from board.member where date >= CURDATE() - interval 7 day group by DATE(date) order by date DESC');
        return NextResponse.json({ message: "성공", data: resultsChart_1 });

      case 'mainChart_2':
        const [visitResult] = await db.query<RowDataPacket[]>(`select agent, platform, DATE(CONVERT_TZ(visit_time, "+00:00", "+09:00")) as date, HOUR(CONVERT_TZ(visit_time, "+00:00", "+09:00")) as hour, count(*) as user_count from board.visits where CONVERT_TZ(visit_time, "+00:00", "+09:00") >= CONVERT_TZ(CURDATE(), "+00:00", "+09:00") - INTERVAL 7 DAY  group by agent, platform,  DATE(CONVERT_TZ(visit_time, "+00:00", "+09:00")), HOUR(CONVERT_TZ(visit_time, "+00:00", "+09:00"))  order by date DESC, hour DESC;`);

        const [agentResult] = await db.query<RowDataPacket[]>(`SELECT agent,COUNT(*) AS agent_count FROM  board.visits WHERE CONVERT_TZ(visit_time, '+00:00','09:00') >= CONVERT_TZ(CURDATE(), '+00:00', '+09:00') - INTERVAL 7 DAY GROUP BY agent;`);

      const [platformResult] = await db.query<RowDataPacket[]>(`SELECT  platform,COUNT(*) AS platform_count FROM  board.visits WHERE CONVERT_TZ(visit_time,'+00:00', '+09:00') >= CONVERT_TZ(CURDATE(), '+00:00', '+09:00') - INTERVAL 7 DAY GROUP BY platform;`);
        const dataResult = {
          visitResult : visitResult,
          agentResult : agentResult,
          platformResult : platformResult
        }
        return NextResponse.json({ message: "성공", data: dataResult });
      case 'mainCnt' :
        const [totalCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.member');
        const [memberCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.member where date >= NOW() - INTERVAL 1 DAY');
        const [writeCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.board where date >= NOW() - INTERVAL 1 DAY');
        const [commentCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.comment where date >= NOW() - INTERVAL 1 DAY');
        const [visitCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.visits where visit_time >= NOW() - INTERVAL 1 DAY');
        const [visitTotalCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.visits');
        const data:MainType = {
          totalCnt: totalCnt[0].cnt,
          memberCnt: memberCnt[0].cnt,
          writeCnt: writeCnt[0].cnt,
          commentCnt: commentCnt[0].cnt,
          visitCnt: visitCnt[0].cnt,
          visitTotalCnt: visitTotalCnt[0].cnt
      }; 
        return NextResponse.json({ message: "성공", data:data });

        case 'mainNewMember' :
        const [newMember] = await db.query<RowDataPacket[]>('select * from board.member where date >= NOW() - INTERVAL 1 DAY')
        return NextResponse.json({ message: "성공", data: newMember});          
        case 'mainPost' :
        const [newPost] = await db.query<RowDataPacket[]>('select * from board.board where date >= NOW() - INTERVAL 1 DAY');
        const [newComment] = await db.query<RowDataPacket[]>('select * from board.comment where date >= NOW() - INTERVAL 1 DAY');
        const postData:{ newPost: RowDataPacket[]; newComment: RowDataPacket[] } = {
          newPost : newPost,
          newComment : newComment
        }
        return NextResponse.json({ message: "성공", data:postData});          


      default:
        return NextResponse.json({ message: "아님" });
    }
  }else{
    return NextResponse.json({message: "에러"})
  }

}