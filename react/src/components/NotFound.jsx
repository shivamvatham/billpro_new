import { useResolvedPath } from "react-router"

export default function NotFound() {
    const page = useResolvedPath()
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>404 Page Not Found</h1>
            <h3>{page.pathname}</h3>
            <img style={{width: '40%'}} src="https://img.freepik.com/premium-vector/file-folder-mascot-character-design-vector_166742-4413.jpg?semt=ais_user_personalization&w=740&q=80" alt="not found" />
        </div>
    )
}