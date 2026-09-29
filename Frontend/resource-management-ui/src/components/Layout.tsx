import {
    Outlet,
    useLocation,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface PageDetails {
    title: string;
    subtitle: string;
}

function Layout() {

    const location = useLocation();

    const pageDetails: Record<
        string,
        PageDetails
    > = {

        "/": {
            title: "Dashboard",
            subtitle:
                "Overview of your resource allocation",
        },

        "/resources": {
            title: "Resources",
            subtitle:
                "Manage employees and project allocations",
        },

        "/projects": {
            title: "Projects",
            subtitle:
                "View projects and associated resources",
        },

        "/import": {
            title: "Import Excel",
            subtitle:
                "Upload resource allocation data",
        },

    };

    const currentPage =
        pageDetails[location.pathname] ??
        pageDetails["/"];

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-area">

                <Topbar
                    title={currentPage.title}
                    subtitle={currentPage.subtitle}
                />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default Layout;