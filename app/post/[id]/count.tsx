'use client';

import { useEffect } from "react";

export default function CountView({postId} : {postId:number} ){

    useEffect(()=>{

        const fetchData = async ()=>{
            try{
                const res = await fetch('/api/get-ip');
                const data = await res.json();

                await fetch('/api/post',{
                    cache:'no-cache',
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        ip : data.data.ip,
                        postId : postId
                    })
                })      
            }catch(error){
                alert(error)
            }
        }
        fetchData();

    }, [])
    
    return(
        <></>
    )
}