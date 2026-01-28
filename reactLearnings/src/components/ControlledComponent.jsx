import { useState } from "react"

export default function ControlledComponent() {
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')

    return (
        <>
            <input onChange={(event) => setName(event.target.value)} value={name} style={{ marginBottom: '10px' }} type="text" placeholder="enter name" /><span>{name}</span><br />
            <input onChange={(event) => setAge(event.target.value)} value={age} style={{ marginBottom: '10px' }} type="number" placeholder="enter age" />  <span>{age}</span> <br />
            <input onChange={(event) => setEmail(event.target.value)} value={email} type="email" placeholder="enter email" />
            <span>{email}</span><br/><br/>

            <button onClick={() => { setName(''); setAge(''); setEmail(''); }}>clear</button>
        </>
    )
}