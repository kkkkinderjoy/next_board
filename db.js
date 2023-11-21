import db from 'mysql2/promise';

const connectDB = db.createPool({
    host: `${process.env.NEXT_PUBLIC_DATABASE_HOST}`,
    user: `${process.env.NEXT_PUBLIC_DATABASE_USERNAME}`,
    password: `${process.env.NEXT_PUBLIC_DATABASE_PASSWORD}`,
    database: `${process.env.NEXT_PUBLIC_DATABASE_NAME}`, //데이터베이스 이름은 내가 설정한 스키마의 이름을 작성해야함       
    ssl:{
        rejectUnauthorized: true
    }
    //ssl 설정해줘야지 error가 안뜸
})

export default connectDB