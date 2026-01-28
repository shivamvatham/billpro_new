import { UseContextGrandChild } from "./UseContextGrandChild";

export function UseContextChild() {
    return (
        <div style={{ backgroundColor: 'skyblue', padding: '10px' }}>
            <h1>Use Context Child</h1>
            <UseContextGrandChild />
        </div>
    )
}