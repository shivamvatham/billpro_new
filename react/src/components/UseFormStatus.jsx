import { useFormStatus } from 'react-dom'

function UseFormStatus() {
    const handleSubmit = async () => {
        await new Promise(res => {
            setTimeout(() => {
                res(
                    console.log('submitted')
                )
            }, 3000)

        })
    }
    return (
        <div>
            <h2>My Form</h2>
            <form action={handleSubmit}>
                <CustomerForm />
            </form>
        </div>
    )
}

function CustomerForm() {
    const { pending } = useFormStatus()
    // console.log(status.pending)
    return (
        <div>
            <input type="text" placeholder="Enter Username" />
            <br />
            <br />
            <input type="text" placeholder="Enter Password" />
            <br />
            <br />
            <button disabled={pending}>{pending ? 'submiting...' : 'submit'}</button>
            <br />
            <br />
            <br />
        </div>
    )
}

export default UseFormStatus

// this will not work because form action happining in same component so rect not track this tree

// export const CheckAnotherFunc = () => {
//     const { pending } = useFormStatus()
//     console.log(pending)

//     const formFunc = async () => {
//         await new Promise(res => setTimeout(res, 1000))
//         console.log('resolved')
//     }
//     return (
//         <div>
//             <form action={formFunc}>
//                 <input type="text" placeholder="Enter name" />
//                 <br />
//                 <br />
//                 <input type="text" placeholder="Enter type" />
//                 <br />
//                 <br />
//                 <button disabled={pending}>submit</button>
//             </form>
//         </div>
//     )
// }