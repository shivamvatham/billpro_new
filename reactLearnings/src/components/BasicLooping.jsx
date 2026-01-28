export function BasicLooping() {
    const tableData = [
        {
            name: 'shivam',
            id: 1,
            age: 20,
            phone: 9900090999,
        },
        {
            name: 'ravi',
            id: 2,
            age: 20,
            phone: 9900090779,
        },
    ]
    return (
        <>
            <table border="1">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Name</td>
                        <td>age</td>
                        <td>phone</td>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((val) => (
                        <tr key={val.id}>
                            <td>{val.id}</td>
                            <td>{val.name}</td>
                            <td>{val.age}</td>
                            <td>{val.phone}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </>
    )
}