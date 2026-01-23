export function ChildFunctionComponent({showAlert}){
    return(
        <div>
            <h3>Child Component Button</h3>
            <button onClick={()=>showAlert()}>call parent func</button>
        </div>
    )
}