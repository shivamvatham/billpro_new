import { useState } from "react";
import { ClockChild } from "./common/ClockChild";

export function ClockParent() {
    const [color, setColor] = useState('red')
    const colors = ['red', 'yellow', 'green', 'brown', 'blue'];
    return (
        <>
        <h2>Select Color</h2>
            <select style={{width: '200px', height:'30px',margin:'10px'}} defaultValue={color} onChange={(event) => setColor(event.target.value)} name="color" id="colorSelect">
                {colors.map((val) => (
                        <option key={val} value={val}>{val}</option>
                ))
                }
            </select>
            <ClockChild color={color} />
        </>
    )
}