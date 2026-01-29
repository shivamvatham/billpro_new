import { Link } from "react-router"

export default function Users() {
    const userList = [
        { id: 1, name: 'shivam' },
        { id: 2, name: 'aman' },
        { id: 3, name: 'sidhu' },
        { id: 4, name: 'devanshi' },
        { id: 5, name: 'pushpa' },
    ]
    return (
        <>
            <h1>User List</h1>
            <ul>
                {
                    userList.map((user) => {
                        return (
                            <li style={{ listStyle: 'none', fontSize: '20px' }} key={user.id}><Link to={`/edituser/${user.id}`} style={{ textDecoration: 'none' }}>{user.name}</Link></li>
                        )
                    })
                }
            </ul>
        </>
    )
}