import { NextRequest, NextResponse } from "next/server";
import db from '@/db';

interface PostData {
  id: string;
  username: string;
  userid: string;
  title: string;
  content: string;
}

export const POST = async (
  req: NextRequest,
  
): Promise<NextResponse> => {
  if (req.method === "POST") {
    try {
      const { id, username, userid, title, content }: PostData = JSON.parse(await req.text());
      // console.log(id, username, title, content);

      if (!id || !username || !userid || !title || !content) {
        return NextResponse.json({ message: "데이터가 부족합니다" });
      } else {
        const [results] = await db.query(
          "UPDATE board.board SET title = ?, content = ? WHERE id = ?",
          [title, content, id]
        );
        return NextResponse.json({ message: "수정을 하였습니다", result: results });
      }
    } catch (error) {
      return NextResponse.json({ error: "에러" });
    }
  } else {
    return NextResponse.json({ error: "정상적인 데이터가 아닙니다." });
  }
};
