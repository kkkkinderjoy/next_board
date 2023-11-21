import { NextRequest, NextResponse } from "next/server";
import db from '@/db'

interface PostData{
    username:string;
    userid: string;
    title:string;
    content:string;
}

export const POST = async(
    req: NextRequest,
    // res: NextResponse
) : Promise<NextResponse> =>{

    if(req.method === 'POST'){
        try{
            const{userid, username, title, content} : PostData = JSON.parse(await req.text())
            // json.parse의 데이터가 변수로 들어가게 됨
            console.log(username,title,content)

            if(!username || !userid || !title || !content){ 
                //정상적인 데이터를 먼저 처리하고  예외를 else문에 넣어주는 경우가 많음
                //name. title , content 중에 하나라도 없으면 '데이터가 부족합니다'라고 콘솔창에 뜨게 됨 (or 연산자)
                return NextResponse.json({message:"데이터가 부족합니다"})
            }else{
                //select - 선택
                //insert - 입력
                //delete - 삭제
                //update - 수정
                
                const [results] = await db.query(
                    'insert into board.board (userid, username, title , content) values (?, ?, ?, ?)',[userid, username, title, content]
                    //injection(인젝션) : 공격자가 신뢰할 수 없는 입력을 프로그램에 주입하도록 하는 공격
                    
                    //물음표 입력해서 변수를 따로 빼면 그 값이 대입이 됨(MySQL2)
                    )
                    return NextResponse.json({message:"성공" , result: results})
            }
        }catch(error){
            return NextResponse.json({error:"에러"})
        }
    }else{
        return NextResponse.json({error:'정상적인 데이터가 아닙니다.'})
    }

    // return NextResponse.json({message: '성공'})
}