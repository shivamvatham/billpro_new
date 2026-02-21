import { useEffect, useState } from "react"

export const useLocalStorage = (key, initialVal) => {
    const [value, setValue] = useState(() => {
        try {
            const saved = window.localStorage.getItem(key)
            return saved ? JSON.parse(saved) : initialVal
        } catch {
            return initialVal
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch (err) {
            console.log('failes to save local storage', err)
        }
    }, [key, value])

    return [value, setValue];
}