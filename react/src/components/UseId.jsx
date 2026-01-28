import { useId } from "react"

export const UseId = () => {
    return (
        <>
            <h2>UseId Sample</h2>
            <UserForm />
            <hr />
            <UserForm />
            <hr />
            <UserForm />

        </>
    )
}

function UserForm() {
    const nameId = useId()
    console.log(nameId)
    return (
        <>
            <label htmlFor={nameId}>Enter Name:</label><br/>
            <input type="text" id={nameId} placeholder="Enter Name" />
        </>
    )
}