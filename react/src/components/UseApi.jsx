import { Suspense, use } from "react"

const fetchData = () =>{
  return  fetch('https://jsonplaceholder.typicode.com/users').then((res)=>res.json())
}
const data = fetchData()

export default function UseApi(){
    return(
        <div>
            <h1>Use Api Sample</h1>
            <Suspense fallback={<h3>Loading...</h3>} >
            <Child data={data} />
            </Suspense>
        </div>
    )
}

function Child({data}){
    const userData = use(data)
    console.log(userData)
    return(
        <div>
            <h1>child</h1>
            {
                userData.map((u)=>(
                    <p key={u.id}>{u.name}</p>
                ))
            }
        </div>
    )
}