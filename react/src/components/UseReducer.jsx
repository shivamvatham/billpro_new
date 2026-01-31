import { useReducer } from "react"

const formData = {
    name: null,
    password: null,
    email: null,
}
const reducer = (states, action) => {
    return { ...states, [action.field]: action.val }

}

export default function UseReducer() {
    const [states, dispatch] = useReducer(reducer, formData)
    // console.log(states)
    const handleSubmit = () => {
        console.log('function rerender', states)
    }
    //    handleSubmit(Math.floor((Math.random() * 100)))
    return (
        <div>
            <h1 className="text-6xl">Register Form</h1>
            <br />
            <input onChange={(e) => dispatch({ field: 'name', val: e.target.value })} type="text" placeholder="Enter Name" />
            <br /><br />
            <input onChange={(e) => dispatch({ field: 'password', val: e.target.value })} type="text" placeholder="Enter Password" />
            <br /><br />
            <input onChange={(e) => dispatch({ field: 'email', val: e.target.value })} type="text" placeholder="Enter Email" />
            <br /><br />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )

}