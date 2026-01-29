import { useState } from "react"

const UpdateObj = () => {
    const [obj, setObj] = useState({
        name: 'shivam',
        address: {
            city: 'ahmedabad',
            state: 'gujarat',
        }
    })
    function UpdateObj(val, field) {
        setObj(prev => {
            if (field == 'name') {
                return { ...prev, name: val }
            }
            return {
                ...prev,
                address: {
                    ...prev.address,
                    [field]: val
                }
            }
        })

    }
    return (
        <div>
            <h2>Update Object</h2>
            <input type="text" placeholder="update name" onChange={(e) => UpdateObj(e.target.value, 'name')} />
            <input type="text" placeholder="update city" onChange={(e) => UpdateObj(e.target.value, 'city')} />
            <input type="text" placeholder="update state" onChange={(e) => UpdateObj(e.target.value, 'state')} />

            <h5>name: {obj.name}</h5>
            <h5>city: {obj.address.city}</h5>
            <h5>address: {obj.address.state}</h5>
        </div>
    )
}

export default UpdateObj