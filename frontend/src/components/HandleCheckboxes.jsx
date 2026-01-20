import { useState } from "react";

function HandleCheckboxes() {
    const [skills, setSkills] = useState([])

    function checkValue(event) {
        if (event.target.checked) {
            setSkills([...skills, event.target.value])
        }else{
            setSkills(skills.filter((val)=> val !== event.target.value))
        }
    }
    return (
        <>
            <h3>select skills</h3>
            <input onChange={checkValue} type="checkbox" id="js" value="javascript" />
            <label htmlFor="js">javascript</label>
            <br /><br />

            <input onChange={checkValue} type="checkbox" id="php" value="php" />
            <label htmlFor="php">PHP</label>
            <br /><br />

            <input onChange={checkValue} type="checkbox" id="node" value="node" />
            <label htmlFor="node">Node</label>
            <br /><br />

            <input onChange={checkValue} type="checkbox" id="vue" value="vue" />
            <label htmlFor="vue">Vue</label>
            <br /><br />

            <input onChange={checkValue} type="checkbox" id="react" value="react" />
            <label htmlFor="react">React</label>
            <br /><br />

            <h1>{skills.toString()}</h1>
        </>
    )
}

export default HandleCheckboxes;