export function LiftState1({setName}){
    return(
        <div>
            <input type="text" placeholder="Enter name" onChange={(e)=>setName(e.target.value)}/>
            <h2>Child 1</h2>
        </div>
    )
}