import { ChildFunctionComponent } from "./common/ChildFunctionComponent";

export function CallParentFunctionFromChild() {
    const showAlert = (message) => {
        console.log('parent function called',message)
    }
    return (
        <div>
            <h1>Parent Function</h1>
            <ChildFunctionComponent showAlert={()=>showAlert('hello shivam')} />
        </div>
    )
}