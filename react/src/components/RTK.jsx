import { useDispatch, useSelector } from "react-redux"
import { increament } from "../services/counter"
import { setName1 } from "../services/navbarTitle"
import { useEffect, useRef, useState } from "react"

export default function RTK() {
    const count = useSelector((state) => state.counter.value)
    const dispatch = useDispatch()

    const nameRef = useRef()
    const [name, setName] = useState('')

    useEffect(() => {
        nameRef.current.focus()
    }, [])
    return (
        <div>
            <h1>welcome to redux toolkit</h1>
            <h2>count: {count} </h2>
            <button onClick={() => dispatch(increament('hello shivam'))}>increase</button>

            <br />
            <br />
            <input ref={nameRef} onKeyDown={(key) => {
                if (key.key == 'Enter') {
                    dispatch(setName1(name))
                }
            }} value={name} type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
            <button onClick={() => dispatch(setName1(name))}>Set Name</button>
        </div>
    )
}