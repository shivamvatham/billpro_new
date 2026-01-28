import { useRef } from "react"

export const UncontrolledComponent = () => {
    const username = useRef()
    const password = useRef()
    const handleForm = (event) => {
        event.preventDefault()
        const username = document.querySelector('#username').value
        const password = document.querySelector('#password').value
        console.log(username,password)
    }
    const handleFormRef = (event) => {
        event.preventDefault()
        
        console.log(username.current.value,password.current.value)
    }
    return (
        <div>
            <h1>Uncontrolled component with UseRef</h1>

            <form action="" onSubmit={handleForm}>
                <input type="text" id="username" placeholder="Enter Username..." /><br /><br />
                <input type="password" id="password" placeholder="Enter Password..." /><br /><br />
                <button>Submit</button>
            </form>
            <hr />
            <form action="" onSubmit={handleFormRef}>
                <input type="text" ref={username} placeholder="Enter Username..." /><br /><br />
                <input type="password" ref={password} placeholder="Enter Password..." /><br /><br />
                <button>Submit</button>
            </form>
        </div>
    )
}