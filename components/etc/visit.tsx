// 컴포넌트폴더 > etc폴더 > visit.tsx
'use client'
import { useEffect } from "react"


export default  function Visit(){

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
          const res1 = await fetch('/api/get-ip');
          const data = await res1.json();
          await fetch('/api/visit',{
            cache : 'no-cache',
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              ip: data.data.ip,
              platform: data.data.platform,
              agent: data.data.userAgent
            })
          })
      }catch(error){
        alert(error)
      }
    }
    fetchData()
  },[])

  return(
    <p>방문자</p>
  )
}