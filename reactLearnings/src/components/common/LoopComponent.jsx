export function LoopComponent({ data }) {
    return (
        <>
            <div style={{ padding: '10px', border: '1px solid #000', borderRadius: '15px', margin: '10px', width: '400px' }}>
                <div>name: <span style={{ color: 'green' }}>{data.name}</span></div>
                <div>age: <span style={{ color: 'green' }}>{data.age}</span></div>
                <div>phone: <span style={{ color: 'green' }}>{data.phone}</span></div>
            </div>
        </>
    )
}