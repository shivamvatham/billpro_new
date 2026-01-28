import { useState } from "react";
import { SubjectData } from "../contexts/SubjectContext";
import { UseContextChild } from "./common/UseContextChild";

export function UseContext() {
    const [subject, setSubject] = useState('Math')
    return (
        <div style={{ backgroundColor: 'peachpuff', padding: '10px' }}>
            <h1>Use Context main parent</h1>
            <select value={subject} onChange={(e)=> setSubject(e.target.value)}>
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="English">English</option>
                <option value="Portugue">Portugue</option>
                <option value="Marathi">Marathi</option>
            </select>
            <SubjectData.Provider value={subject}>
                <UseContextChild />
            </SubjectData.Provider>
        </div>
    )
}