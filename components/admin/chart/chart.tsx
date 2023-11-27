'use client';
import { Bar } from 'react-chartjs-2';
import Chart, {registerables, BarElement, CategoryScale, LinearScale} from 'chart.js/auto'
import { useEffect } from 'react';


export default function ChartCom(){

    useEffect(()=>{
        Chart.register(...registerables, BarElement, CategoryScale, LinearScale)

    },[])
    const data ={
        labels :['orange','orangered' ,'green'],
        datasets:[
            {
                label:"차트",
                data:[10,50,5],
                backgroundColor:[
                    'rgba(255,99,132,0.2)',
                    'rgba(255,159,64,0.2)',
                    'rgba(255,205,86,0.2)',

                ],
                borderColor:[                    
                    'rgb(255,99,132)',
                    'rgb(255,159,64)',
                    'rgb(255,205,86)',
                ],
                borderWidth:1
            }
        ]

    }

    const options ={
        scales:{
            y:{
                beginAtZero: true
             }
        }
    }

    return(
        <>
        <div className="">
            <Bar width={400} height={200} data={data} options={options} />
        </div>
        </>
    )
}