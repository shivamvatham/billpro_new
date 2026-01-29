import { useRef, useTransition } from 'react'
import loader from '../css/LoadingButton.module.css'

const UseTransition = () => {
    const [pending, setTrasition] = useTransition()
    const data = useRef('')
    const submit = () =>{
        setTrasition( async ()=>{
            await new Promise(res=> setTimeout(res,3000))
            console.log(data.current.value)
        })

    }
    return(
        <div>
            <h2>Use Transition Sample</h2>

            <input type="text" ref={data} placeholder="Enter Name" /> <br /> <br />
            <button disabled={pending} className={`${loader.btn} ${pending ?  loader.loading : ''}` } onClick={submit}>Submit</button>
        </div>
    )
}

export default UseTransition