import { useEffect } from "react"

export const UseEffectUsageChild = ({count}) => {
    useEffect(()=>{
        // console.log('working on count prop change:' , count);
        
    },[count])

    useEffect(()=>{
        // on Unmount run
        return()=>{
        console.log('component unmount')
        }
    },[])
    return(
        <>
        <h5>from child count prop change {count}</h5>
        </>
    )
}