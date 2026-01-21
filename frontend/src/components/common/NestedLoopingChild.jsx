import { NestedLoopingGrandChild } from "./NestedLoopingGrandChild";

export function NestedLoopingChild({colleges}){
    return(
        <>
        <h2>{colleges.collegeName}</h2>
        <ul>
        <li>{colleges.city}</li>
            {
                colleges.students.map((std, index)=>(
                    <div key={index}>
                    <NestedLoopingGrandChild std={std} />
                    </div>
                ))
            }
        </ul>
        </>
    )
}