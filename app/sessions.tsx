import { useSession } from "next-auth/react";
// 파일마다 

interface userInfo{
    user:{
        name:string;
        email:string;
        image?:string;
        level?:number;
    }
}

//cs는 custom 줄임말
interface csSession{
    data: userInfo | null;
    status: "loading" | "authenticated" | "unauthenticated"
}

export function useCustomSession() :csSession {
    const {data, status} = useSession();
    return {data: data as userInfo, status}
}


