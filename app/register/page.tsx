'use client';
import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";


interface formType{
    email:string;
    name:string;
    password:string;
    birth: string;
}
export default function Register(){

    const[formData,setFormData] =useState<formType>({
        email : '',
        password: '',
        name:'',
        birth:''
    })
    const [message, setMessage] = useState<string>("");
    const changeEvent = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({
            ...formData, [e.target.name] : e.target.value
        })
        // console.log(formData)
    }
    //생년월일 8자리로 제한함
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value.length <= 8) {
            setFormData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      };
    const submitEvent = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const res = await fetch('/api/auth/signup' ,{
                method:"POST",
                headers:{
                    'Content-Type' :"application/json"
                },
                body:JSON.stringify(formData)
            })
            if(res.ok){
                const data = await res.json();
                const result = data.data;
                console.log(result)
                console.log(data)
                if(data.message==="성공"){
                    alert("회원가입이 완료 되었습니다.")
                    // window.location.href ="/"
                    //아래는 회원가입시 로그인이 안되었는데 이것을 해결하기 위한 코드임
                    signIn('credentials', {
                        email: result.email,
                        password:result.password,
                        callbackUrl:"/"
                    })
                }
                setMessage(data.message)
                
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
            <>
            <div className='flex justify-between w-full flex-wrap items-center py-48'>
                <div className='basis-3/4 sm:basis-7/12 md:basis-5/12 lg:basis-4/12 mx-auto'>
                    <p className="p-2 font-bold text-2xl lg:text-3xl leading-[47px] text-black text-center mb-10">회원가입</p>
                    <p className="">{message}</p>
		            <form onSubmit={submitEvent} className="w-full h-full flex flex-col gap-4" action="/api/auth/signup" method="POST">
                        <div className='text-start mt-3'>
                            <p>이메일</p>
                            <input type="text" className='px-2 border border-l-blue-300 border-l-[3px] w-full focus:outline-gray-400 h-[50px] mx-auto' placeholder='example@naver.com'
                            onChange={changeEvent}  name="email" required/>
                        </div>
                        <div className='text-start mt-3'>
                            <p>비밀번호</p>
                            <input type="password" className='px-2 border border-l-blue-300 border-l-[3px] h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='비밀번호를 입력해주세요'
                            onChange={changeEvent}  name="password" required/>
                        </div>
                        <div className='text-start mt-3'>
                            <p>닉네임</p>
                            <input type="text" className='px-2 border border-l-blue-300 border-l-[3px] h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='닉네임을 입력해주세요'
                            onChange={changeEvent}  name="name" required />
                        </div>
                        <div className='text-start mt-3'>
                            <p>생년월일</p>
                            <input type="text" className='px-2 border border-l-blue-300 border-l-[3px] h-[50px] w-full mx-auto focus:outline-gray-400' placeholder='생년월일을 입력해주세요'
                            onChange={handleChange}  name="birth" value={formData.birth} required />
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="basis-[48%] px-6 py-2.5 bg-blue-400 text-white font-medium text-base mt-2 leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-500 active:shadow-lg transition duration-150 ease-in-out">가입하기</button>
                        </div>
                    </form>
                </div>
             </div>
            </>
        
    )
}