'use client';
import { Bar } from 'react-chartjs-2';

import Chart, {registerables, BarElement, CategoryScale, LinearScale} from 'chart.js/auto'
import { useEffect, useState } from 'react';
interface MemberType{
  date: string;
  user_count: number;
}

export default function ChartCom(){
  const [userCount, setUserCount] = useState<Array<Number>>([]);
  const [userDate, setUserDate] = useState<Array<string>>([]);
  useEffect(()=>{
    Chart.register(...registerables, BarElement, CategoryScale, LinearScale)


    const fetchData = async ()=>{

      try{
        
        const res = await fetch('/api/admin',{
          cache: 'no-cache',
          method : "POST",
          headers : {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            pathUrl : 'mainChart_1'
          })
        });
        if(res.ok){
          // setMemberData(data);
          const result = await res.json();
          const data:MemberType[] = result.data;
          setUserCount(data.map((e) => e.user_count));
          setUserDate(data.map((e) => {
              const date = new Date(e.date);
              // date.setTime(date.getTime() + (60 * 60 * 9 * 1000)) // 필요하다면 주석 해제
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              const formatDate = `${year}-${month}-${day}`; // 시간을 포함하도록 수정
            
              return formatDate; // formatDate 반환
            }));
        }
      }catch(error){
        console.log(error)
      }
    }
    fetchData();

  }, [])

  
  
  const data = {
    labels : userDate,
    datasets : [
      {
        label : "차트",
        data : userCount,
        backgroundColor : [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
        ],
        borderWidth: 1
      }
    ]
  }
  const options = {
    // animation: {
    //   tension:{
    //     duration: 1000,
    //     easing: "easeOutBounce",
    //     from: 0,
    //     to: 1,
    //   }
    // },
    scales : {
      y: {
        beginAtZero : true,
      }
    }
  }
  return(
    <div>
     
      <Bar width={400} height={200} data={data} options={options}/>
{/* 그래프 + 조회수 + 차단 업데이트 */}
    </div>
  )
}