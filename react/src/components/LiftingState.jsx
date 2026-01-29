import { useState } from "react";
import { LiftState1 } from "./common/LiftState1";
import { LiftState2 } from "./common/LiftState2";

function LiftState() {
    const [name, setName] = useState('')
    return (
        <div>
            <h1>Lift State Parent</h1>
            <LiftState1 setName={setName} />
            <hr />
            <LiftState2 name={name} />
        </div>
    )
}

export default LiftState

// lifting state is nothing when data is lift one child to parent and used in another child is lifting state