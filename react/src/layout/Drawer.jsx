import { Link } from "react-router"
import drawer from "../css/Drawer.module.css"
export const Drawer = () => {
    return (
        <div className={drawer.drawerWrapper}>
            <div className={drawer.logoWrapper}>logo</div>
            <div className={drawer.navContent}>
                <Link className={drawer.link} to="/">Home</Link>
                <Link className={drawer.link} to="/about">About</Link>
                <Link className={drawer.link} to="/contact">Contact</Link>
            </div>
        </div>
    )
}