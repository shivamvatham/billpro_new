import { useNavigate, useParams, useSearchParams } from "react-router"

export default function EditUsers() {
    const params = useParams()
    const navigate = useNavigate()
    const [query] = useSearchParams()
    console.log(query.get('name'))
    return (
        <>
            <h1>Edit User</h1>
            <h2>User Id is {params.id}</h2>
            <button onClick={() => navigate(-1)}>
                ⬅ Back
            </button>
        </>
    )
}