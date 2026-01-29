import { NavLink } from "react-router"
import drawer from "../css/Drawer.module.css"
import { routes } from "../routes"
export const Drawer = () => {
    return (
        <div className={drawer.drawerWrapper}>
            <div className={drawer.logoWrapper}>logo</div>
            <div className={drawer.navContent}>
                {
                    routes.map(({ path, title }) => (
                        <NavLink key={path} className={({isActive}) => isActive ? drawer.activeLink : drawer.link} to={path}>{title}</NavLink>
                    ))
                }
            </div>
        </div>
    )
}