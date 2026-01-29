import { useState } from "react"

function UpdateArray() {
    const [arr, setArr] = useState([
        {
            city: 'ahmedabad',
            state: 'gujarat',
        },
        {
            city: 'lucknow',
            state: 'uttarpradesh',
        }
    ]
    )
    function UpdateObj(val, field) {
        setArr(prev => 
            prev.map((item,index)=> index == field ? {...item,city: val}: item)
        )
        // arr[0].city = val
        // setArr([...arr])

    }
    return (
        <div>
            <h2>Update Object</h2>
            <input type="text" placeholder="update city 1" onChange={(e) => UpdateObj(e.target.value, '0')} />
            <input type="text" placeholder="update city 2" onChange={(e) => UpdateObj(e.target.value, '1')} />

            <h5>city 1: {arr[0].city}</h5>
            <h5>city 2: {arr[1].city}</h5>
        </div>
    )
}

export default UpdateArray