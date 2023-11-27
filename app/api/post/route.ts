import db from '@/db';
import { NextRequest,NextResponse } from 'next/server';
//import { NextApiRequest,NextApiResponse } from 'next'; // 자체적인 api 형태로 데이터를 받는것
import { RowDataPacket } from 'mysql2/promise';


export const GET= async (
    req:NextRequest,
    res:NextResponse
) : Promise<NextResponse > =>{
    if(req.method === 'GET'){
        const page = Number(req.nextUrl.searchParams.get('page') || 1);
        //문자열로 받지않고 숫자로 받기 위해 Number로 지정해줌
        const perPage = 15;
        const offset =(page - 1) * perPage;
        // 페이지네이션을 구현하는 데 offset을 변수 설정해서 계속 바뀔수 있도록 구현함

        // console.log(page);
        try{
            const [results] = await db.query<RowDataPacket[]>('SELECT * FROM board.board order by date desc limit ? offset ?', [perPage, offset])
            //desc 최신순(내림차순) acs 오름차순
            // from 스키마.테이블 > select * from testhyj.board 라고 하면 데이터가 없어서 나오지 않지만 샘플데이터를 연결해주면 데이터가 나오게됨
            //offset은 페이지라고 생각하면 됨 offset 10 은 페이지1 offset 20 은 페이지 2 라고 생각하기
            //order by ~ 쓸려면 날짜 데이터가 있는 테이블을 선택해줘야함 (payment)
            // 샘플 데이터에서 테이블 쿼리 선택해서 복붙해주면 데이터가 나오게됨
            // 2차 배열로 반환돼서 테이블 데이터를 받을 떄 대괄호를 작성해줘야 함
            const[countResult] = await db.query<RowDataPacket[]>('select count(*) as cnt from board.board')
            //데이터 최대개수를 가져오는 방법 > count 함수를 사용하는것
            //open API의 총개수를 가져오는 방법임
            const totalCnt = countResult[0].cnt;
            // console.log(results);
            
            return NextResponse.json({message:"성공", results , totalCnt, page , perPage})
            //실제 API를 만드는것임
        }catch(error){
            NextResponse.json({error:"에러가 발생하였습니다."})
        }
    }
    return NextResponse.json({error:"에러가 발생하였습니다."})
}