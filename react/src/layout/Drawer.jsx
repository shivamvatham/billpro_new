import { NavLink, useLocation } from "react-router"
import { useState } from "react"
import drawer from "../css/Drawer.module.css"
import { routes } from "../routes"

export const Drawer = () => {
    const location = useLocation()
    const [openDropdowns, setOpenDropdowns] = useState({})

    const toggleDropdown = (path) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [path]: !prev[path]
        }))
    }

    return (
        <div className={drawer.drawerWrapper}>
            <div className={drawer.logoWrapper}>logo</div>
            <div className={drawer.navContent}>
                {
                    routes.map((data) => {
                        if (data?.children && data?.element && !data?.hidden) {
                            const isParentActive = location.pathname.startsWith(data.path)
                            return (
                                <div key={data.path}>
                                    <NavLink className={({ isActive }) => isActive ? drawer.activeLink : drawer.link} to={data.path}>{data.title}</NavLink>
                                    {isParentActive && (
                                        data.children.map((child) => {
                                            if (!child?.hidden) {
                                                return (
                                                    <NavLink key={child.path} className={({ isActive }) => isActive ? drawer.activeChildLink : drawer.childLink} to={`${data.path}/${child.path}`}>{child.title}</NavLink>
                                                )
                                            }
                                        })
                                    )}
                                </div>
                            )
                        } else if (data?.children && !data?.element && !data?.hidden) {
                            const isOpen = openDropdowns[data.path]
                            return (
                                <div key={data.path}>
                                    <button
                                        className={drawer.dropdownToggle}
                                        onClick={() => toggleDropdown(data.path)}
                                    >
                                        {data.title} {isOpen ? '▼' : '▶'}
                                    </button>
                                    {isOpen && (
                                        data.children.map((child) => {
                                            if (!child?.hidden) {
                                                return (
                                                    <NavLink key={child.path} className={({ isActive }) => isActive ? drawer.activeChildLink : drawer.childLink} to={`${data.path}/${child.path}`}>{child.title}</NavLink>
                                                )
                                            }
                                        })
                                    )}
                                </div>
                            )
                        } else {
                            if (!data?.hidden) {
                                return (
                                    <NavLink key={data.path} className={({ isActive }) => isActive ? drawer.activeLink : drawer.link} to={data.path}>{data.title}</NavLink>
                                )
                            }
                        }
                    })
                }
            </div>
        </div>
    )
}