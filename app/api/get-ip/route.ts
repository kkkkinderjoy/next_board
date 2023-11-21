import {NextRequest,NextResponse} from 'next/server';

export const GET = async(req:NextRequest) :
Promise<NextResponse> =>{
    if(req.method === 'GET'){
        const ip = req.headers.get("x-forwarded-for")
        // console.log(ip) > 터미널창에 정보가 뜨게됨 그중에서 x-forward 정보가 ip 주소와 관련되어있음
        return NextResponse.json({data: ip, message: "성공"})

    }else{
        
        return NextResponse.json({error: '에러가 발생하였습니다'})

    }
}