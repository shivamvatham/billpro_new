import { useContext } from "react"
import { SubjectData } from "../../contexts/SubjectContext"

export function UseContextGrandChild(){
    const subject = useContext(SubjectData)
    return(
        <div style={{backgroundColor: '#aaa', padding: '10px'}}>
        <h1>Use Context Grand Child</h1>
        <h3>Subject: {subject}</h3>
        </div>
    )
}