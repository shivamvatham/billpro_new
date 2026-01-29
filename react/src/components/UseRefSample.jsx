import { useRef, useState } from "react"

const UseRefSample = () => {
    const inputControl = useRef(null)
    const [input, setInput] = useState(0)

    function handleInput() {
        console.log(inputControl)
        inputControl.current.placeholder = 'Enter Username'
        inputControl.current.style.border = '2px solid #4CAF50'
        inputControl.current.style.backgroundColor = '#f0f8ff'
        inputControl.current.style.color = '#333'
        inputControl.current.style.height = '50px'
        inputControl.current.style.width = '200px'
        inputControl.current.style.borderRadius = '10px'
    }
    return (
        <>
            <h1>UseRef Learning</h1>
            <input ref={inputControl} value={input} type="text" onChange={(event) => setInput(event.target.value)} placeholder="User Name" onClick={handleInput} />
            <button onClick={() => setInput(input + 1)}>increse</button>
            <h2>input val: {input} fromRef: {inputControl?.current?.value}</h2>
        </>
    )
}

export default UseRefSample