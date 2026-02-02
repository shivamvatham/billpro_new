import { useDispatch, useSelector } from "react-redux"
import { increament, selectIncreament } from "../services/counter"
import { setName1 } from "../services/navbarTitle"
import { useEffect, useRef, useState } from "react"
import { fetchUsers, selectError, selectLoading, selectUsers } from "../services/getUsers"

export default function RTK() {
    const count = useSelector(selectIncreament)
    const userList = useSelector(selectUsers)
    const isLoading = useSelector(selectLoading)
    const isError = useSelector(selectError)
    const dispatch = useDispatch()

    const nameRef = useRef()
    const [name, setName] = useState('')

    useEffect(() => {
        nameRef.current.focus()
        dispatch(fetchUsers())
    }, [])
    return (
        <div>
            <h1>welcome to redux toolkit</h1>
            <h2>count: {count} </h2>
            <button onClick={() => dispatch(increament())}>increase</button>

            <br />
            <br />
            <input ref={nameRef} onKeyDown={(key) => {
                if (key.key == 'Enter') {
                    dispatch(setName1(name))
                }
            }} value={name} type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
            <button onClick={() => dispatch(setName1(name))}>Set Name</button>
            <br /><br />
            {isLoading ? <h2>Loading...</h2> : isError ? <h2 style={{ color: 'red' }}>{isError}</h2> :
                <table border="1">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Username</td>
                            <td>Email</td>
                            <td>Website</td>
                            <td>Phone</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.length > 0 ?
                            userList.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        {user.name}
                                    </td>
                                    <td>
                                        {user.username}
                                    </td>
                                    <td>
                                        {user.email}
                                    </td>
                                    <td>
                                        {user.website}
                                    </td>
                                    <td>
                                        {user.phone}
                                    </td>
                                </tr>
                            ))
                            : <tr><td colSpan="5" style={{textAlign: 'center'}}>Data not found</td></tr>
                        }
                    </tbody>
                </table>
            }

        </div>
    )
}