import { useEffect, useState } from "react"
import { UseEffectUsageChild } from "./common/UseEffectUsageChild"

export const UseEffectUsage = () => {
    const [count, setCount] = useState(0)
    const [multi, setMulti] = useState(1)
    const [toggle, setToggle] = useState(true)

    const handleInit = () => {
        // console.log('called every render')
    }
    const handleInit2 = () => {
        // console.log('called once')
    }
    const handleInit3 = () => {
        // console.log('called on count state change')
    }
    useEffect(() => {
        handleInit()
        // call every render
    })
    useEffect(() => {
        handleInit2()
        // call once
    }, [])

    useEffect(() => {
        handleInit3()
        // call on count state change
    }, [count])
    return (
        <>
            <h1>Use Effect all Usage</h1>
            <h4>count : {count}</h4>
            <button onClick={() => setCount(count + 1)}>increse</button>
            <h4>multiply : {multi}</h4>
            <button onClick={() => setMulti(multi + multi)}>multiply</button>
            <button onClick={() => setToggle(!toggle)}>toggle child</button>
            {
               toggle && <UseEffectUsageChild count={count} />
            }
        </>
    )
}