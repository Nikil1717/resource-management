import { NavLink } from "react-router-dom";
import type { ElementType } from "react";

import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Upload,
} from "lucide-react";

interface MenuItem {
    name: string;
    path: string;
    icon: ElementType;
}

function Sidebar() {

    const menuItems: MenuItem[] = [
        {
            name: "Dashboard",
            path: "/",
            icon: LayoutDashboard,
        },
        {
            name: "Resources",
            path: "/resources",
            icon: Users,
        },
        {
            name: "Projects",
            path: "/projects",
            icon: FolderKanban,
        },
        {
            name: "Import Excel",
            path: "/import",
            icon: Upload,
        },
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">

                <div className="logo-icon">
                    R
                </div>

                <div>

                    <div className="logo-title">
                        ResourceHub
                    </div>

                    <div className="logo-subtitle">
                        Resource Management
                    </div>

                </div>

            </div>

            <nav className="sidebar-nav">

                <div className="nav-section-title">
                    MANAGEMENT
                </div>

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <Icon size={19} />

                            <span>
                                {item.name}
                            </span>

                        </NavLink>
                    );

                })}

            </nav>

            <div className="sidebar-footer">

                <div className="user-avatar">
                    CD
                </div>

                <div>

                    <div className="user-name">
                        Delivery Manager
                    </div>

                    <div className="user-role">
                        Client Delivery
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;