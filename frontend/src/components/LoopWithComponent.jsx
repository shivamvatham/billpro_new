import { LoopComponent } from "./common/LoopComponent";

export function LoopWithComponent() {
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
            {tableData.map((val) => (
                <div key={val.id}>
                <LoopComponent data={val} />
                </div>
            ))
            }
        </>
    )
}