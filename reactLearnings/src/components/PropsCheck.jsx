export default function PropsCheck({ data }) {
    return (
        <>
            <ul>
                <li>name: {data.name}</li>
                <li>age: {data.age}</li>
                <li>email: {data.email}</li>
                <li>mobile: {data.mobile}</li>
                <li>employee Id: {data.empId}</li>
            </ul>
        </>
    )
}