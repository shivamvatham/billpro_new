import { useState } from "react"

function HandleRadioAndSelect(){
    const [gender, setGender] = useState('male')
    const [state, setState] = useState('delhi')
    return(
        <>
        <h1>Radio Control</h1>
        <h3>Select Gender</h3>
        <input type="radio" onChange={(event)=> setGender(event.target.value)} checked={gender == 'male'} name="gender" id="male" value="male" />
        <label htmlFor="male">Male</label>

        <input type="radio" onChange={(event)=> setGender(event.target.value)} checked={gender == 'female'} name="gender" id="female" value="female" />
        <label htmlFor="female">Female</label>

        <h4>Selected Gender: <span style={{textDecoration: 'underline'}}>{gender}</span></h4>
        
        <hr />

        <h1>Select Control</h1>
        <h3>Select State</h3>

        <label htmlFor="selectState">Select State: </label>
        <select name="Select" defaultValue={state} onChange={(event)=>setState(event.target.value)} id="selectState">
            <option value="gujarat">Gujarat</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="delhi">Delhi</option>
            <option value="uttarPradesh">Uttar Pradesh</option>
        </select>

        <h4>Selected State: <span style={{textDecoration: 'underline'}}>{state}</span></h4>
        </>
    )
}

export default HandleRadioAndSelect