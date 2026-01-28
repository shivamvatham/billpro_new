import { useState } from "react";

export default function CondionalRender() {
    const [condition, setCondition] = useState(1)

    function changeVal() {
        condition == 1 ? setCondition(2) : condition == 2 ? setCondition(null) : setCondition(1)
    }
    return (
        <>
            <h1>{condition == 1 ? 'shivam' : condition == 2 ? 'meetu' : 'hitesh'}</h1>
            <button onClick={changeVal}>change val</button>
        </>
    )
}