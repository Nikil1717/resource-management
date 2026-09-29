import {
    useEffect,
    useState,
} from "react";

import {
    Users,
    FolderKanban,
    BriefcaseBusiness,
    Database,
} from "lucide-react";

import {
    getResources,
} from "../services/resourceService";

import type {
    Resource,
} from "../services/resourceService";

interface Stat {
    title: string;
    value: string | number;
    icon: React.ElementType;
}

function Dashboard() {

    const [resources, setResources] =
        useState<Resource[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    useEffect(() => {

        const loadResources = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getResources();

                setResources(data);

            } catch (err) {

                console.error(
                    "Failed to load resources",
                    err
                );

                setError(
                    "Unable to load resource data."
                );

            } finally {

                setLoading(false);

            }
        };

        loadResources();

    }, []);

    const uniqueEmployees =
        new Set(
            resources
                .map(
                    (resource) =>
                        resource.employeeCode
                )
                .filter(Boolean)
        ).size;

    const uniqueProjects =
        new Set(
            resources
                .map(
                    (resource) =>
                        resource.projectCode
                )
                .filter(Boolean)
        ).size;

    const totalFte =
        resources.reduce(
            (sum, resource) =>
                sum +
                Number(resource.fte ?? 0),
            0
        );

    const stats: Stat[] = [

        {
            title: "Total Resources",
            value: uniqueEmployees,
            icon: Users,
        },

        {
            title: "Active Projects",
            value: uniqueProjects,
            icon: FolderKanban,
        },

        {
            title: "Total FTE",
            value: totalFte.toFixed(2),
            icon: BriefcaseBusiness,
        },

        {
            title: "Records",
            value: resources.length,
            icon: Database,
        },

    ];

    return (
        <div>

            <div className="stats-grid">

                {stats.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <div
                            className="stat-card"
                            key={stat.title}
                        >

                            <div className="stat-icon">
                                <Icon size={22} />
                            </div>

                            <div>

                                <div className="stat-title">
                                    {stat.title}
                                </div>

                                <div className="stat-value">

                                    {loading
                                        ? "—"
                                        : stat.value}

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="dashboard-grid">

                <div className="card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Recent Resources
                            </h2>

                            <p>
                                Latest resource records
                            </p>

                        </div>

                    </div>

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Employee Code
                                    </th>

                                    <th>
                                        Employee Name
                                    </th>

                                    <th>
                                        Project Code
                                    </th>

                                    <th>
                                        Project Name
                                    </th>

                                    <th>
                                        Allocation
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {resources
                                    .slice(0, 8)
                                    .map(
                                        (resource) => (

                                            <tr
                                                key={
                                                    resource.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        resource.employeeCode
                                                    }
                                                </td>

                                                <td className="font-medium">
                                                    {
                                                        resource.employeeName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        resource.projectCode
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        resource.projectName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        resource.allocation ??
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                {!loading &&
                                    resources.length === 0 && (
                                        <tr>

                                            <td
                                                colSpan={5}
                                                className="empty-state"
                                            >
                                                No resource records found.
                                            </td>

                                        </tr>
                                    )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;