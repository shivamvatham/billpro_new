import { useState } from "react";
import { NavLink, Outlet } from "react-router";

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
            <h1>hello</h1>
            <NavLink to="nested">Nested</NavLink>
            <Outlet></Outlet>
        </>
    )
}

export default CounterIncrese;