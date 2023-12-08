'use client';
import { Bar } from 'react-chartjs-2';

import Chart, {registerables, BarElement, CategoryScale, LinearScale} from 'chart.js/auto'
import { useEffect, useState } from 'react';
interface MemberType{
  date: string;
  user_count: number;
}
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[]; // 'number[]' 타입으로 명시
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
export default function MemberChart(){
  const [userCount, setUserCount] = useState<Array<Number>>([]);
  const [userDate, setUserDate] = useState<Array<string>>([]);
  const [chartData, setChartData] = useState<ChartData>({
    labels: Array(24).fill(null).map((_, i)=> `${i}시`),
    datasets: [{
      label: '접속자 수',
      data: [], // 초기 데이터는 비어있음
      backgroundColor : [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
      borderWidth: 1
    }]
  });
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
        label : "신규회원 가입수",
        data : userCount,
        backgroundColor : [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
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
    <div className="widget basis-full md:basis-[49.3%] w-[49.3%] mb-5 md:mb-0">
     <div className="font-bold p-5 py-3 flex flex-wrap justify-between items-center">
     <div className="justify-end flex basis-full">
        <button className='text-xs px-2 mr-4'>오늘</button>
        </div>
        <Bar data={chartData} options={options}/>
      </div>
    </div>
  )
}