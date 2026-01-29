import { useRef } from "react";
import ForwardRefChild from "./common/ForwardRefChild";

function ForwardRefParent() {
    const inputRef = useRef(null)
    const functionRef = useRef(null)
    const refHandle = () => {
        inputRef.current.value = '1000'
        inputRef.current.style.color = 'red'
        inputRef.current.focus()
    }
    const callChildFunc = () => {
        console.log(functionRef)
        functionRef.current.callFromParent()
        functionRef.current.callFromParent2()
    }
    return (
        <div>
            <ForwardRefChild ref={functionRef} inputRef={inputRef} />
            <button onClick={refHandle}>trigger</button>
            <button onClick={callChildFunc}>call child function</button>
        </div>
    )
}

export default ForwardRefParent

