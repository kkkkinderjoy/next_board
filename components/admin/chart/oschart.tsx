'use client';
import { Bar } from 'react-chartjs-2';

import Chart, {registerables, BarElement, CategoryScale, LinearScale} from 'chart.js/auto'
import { useEffect, useState } from 'react';
interface MemberType{
  date: string;
  hour:number;
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

export default function OsCom(){
  const [userCount, setUserCount] = useState<Array<Number>>([]);
  const [dateType, setDateType] = useState<string>('today');
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
            pathUrl : 'mainChart_2',
            dateType: dateType
          })
        });
        if(res.ok){
          const result = await res.json();
          const data:MemberType[] = result.data.visitResult;
          const userCount = Array(24).fill(0);
          data.forEach(item => {
            if (dateType === 'today' && new Date(item.date).toDateString() === new Date().toDateString()) {
              userCount[item.hour] = item.user_count;
            } else if (dateType === 'yesterday' && new Date(item.date).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
              userCount[item.hour] = item.user_count;
            }
          });

          setChartData(prevData => ({
            ...prevData,
            datasets: [{
              ...prevData.datasets[0],
              data: userCount
            }]
          }));
          
        }
      }catch(error){
        console.log(error)
      }
    }
    fetchData();

  }, [dateType])

  const options = {
    indexAxis: "y" as const,
    // as const: 이 부분은 TypeScript의 타입 단언 문법입니다. as const를 사용하면, TypeScript는 해당 값이 리터럴 타입이며 변경될 수 없음을 이해합니다. 즉, "y"는 단순한 문자열이 아니라, 값이 "y"로 고정된 특정 타입을 가집니다.
    //이 구문은 TypeScript에서 타입의 범위를 좁히고, 값이 변하지 않음을 보장하고자 할 때 유용하게 사용됩니다. 이를 통해 코드의 안정성을 높이고, 잠재적인 오류를 미리 방지할 수 있습니다.
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
        <button onClick={()=>setDateType('today')} className='text-xs px-2 mr-4'>오늘</button>
        <button onClick={()=>setDateType('yesterday')} className='text-xs px-2'>어제</button>
        </div>
        <Bar data={chartData} options={options}/>
      </div>
    </div>
  )
}