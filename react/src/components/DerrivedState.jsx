import { useState } from "react"

// derrive state when any variable is dependent on any state value
export function DerrivedState() {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState('')

    // derrived variables
    const total = users.length
    const last = users[users.length - 1]
    const unique = [...new Set(users)].length
    // derrived variables

    const AddUsers = () => {
        setUsers([...users, user])
        setUser('')
    }
    return (
        <div>
            <h2>Derrived State sample</h2>

            <h3>Total Users: {total}</h3>
            <h3>Last Added: {last}</h3>
            <h3>Unique Users: {unique}</h3>

            <input type="text" onKeyDown={(e) => {
                if (e.key == 'Enter') {
                    AddUsers()
                }
            }} value={user} placeholder="Enter user" onChange={(event) => setUser(event.target.value)} />
            <br /> <br />
            <button onClick={AddUsers}>Add User</button>
            <br />
            <br />

            {
                users.map((user, index) => (
                    <h4 key={index}>{user}</h4>
                ))
            }
        </div>
    )
}