export function NestedLoopingGrandChild({std}){
    return(
        <>
        <h4>{std.studentId}</h4>
        <ul>
            <li>{std.name}</li>
            <li>{std.year}</li>
            <li>{std.course}</li>
        </ul>
        </>
    )
}