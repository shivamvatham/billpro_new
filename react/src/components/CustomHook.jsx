import { useToggle } from "../customHook/useToggle"

const CustomHook = () => {
    const [toggle, setToggle] = useToggle()
    return (
        <>
            <h1>custom hook test</h1>
            <button onClick={setToggle}>toggle</button>
            <button onClick={()=>setToggle(false)}>Hide</button>
            <button onClick={()=>setToggle(true)}>Show</button>
            { 
                toggle && <h2>First Element</h2>
            }
        </>
    )
}

export default CustomHook