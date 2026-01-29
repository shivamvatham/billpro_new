import { useState } from "react";

function CounterIncrese() {
    const [count, setCount] = useState(0)
    return (
        <>
            <div>
                <h1>
                    {count}
                </h1>
                <button onClick={() => setCount(count + 1)}>increse</button>
            </div>
        </>
    )
}

export default CounterIncrese;