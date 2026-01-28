import { useEffect, useState } from "react"

export function ClockChild({ color = 'red' }) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTime)
        }, 1000);
        return () => clearInterval(interval)
    }, [])
    function getTime() {
        const now = new Date()
        return now.toLocaleTimeString()
    }
    return (
        <div style={{ width: '200px', height: '60px', backgroundColor: '#ccc', borderRadius: '15px', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '25px' }}>
            {time}
        </div>
    )
}