import { useEffect } from "react";
import { useLocalStorage } from "../customHook/useLocalStorage"

export default function UseLocalStorageHook() {
    const [theme, setTheme] = useLocalStorage('theme', 'light')
    useEffect(() => {
        const color = theme == 'light' ? '#ccc' : '#000'
            document.body.style.background = color;
    }, [theme]);
    return (
        <>
            <button onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}>toggle theme</button>
        </>
    )
}