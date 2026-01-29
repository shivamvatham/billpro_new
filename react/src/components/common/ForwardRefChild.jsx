// for less version than 19

import { forwardRef, useImperativeHandle } from "react"

// const ForwardRefChild = forwardRef((props, myref) => {
//     function callFromParent(){
//         console.log('called from parent')
//     }
//     function callFromParent2(){
//         console.log('called from parent 2')
//     }

//     useImperativeHandle(myref, () => ({
//         callFromParent,
//         callFromParent2
//     }))

//     return(
//         <div>
//             <input type="text" ref={props.inputRef} placeholder="type here..." />
//         </div>
//     )
// })

// export default ForwardRefChild;

// React 19 approach

const ForwardRefChild = (props) => {
    console.log(props)
    function callFromParent() {
        console.log('called from parent')
    }
    function callFromParent2() {
        console.log('called from parent 2')
    }
    useImperativeHandle(props.ref, () => ({
        callFromParent,
        callFromParent2
    }))
    return (
        <div>
            <input type="text" ref={props.inputRef} placeholder="type here..." />
        </div>
    )
}

export default ForwardRefChild;