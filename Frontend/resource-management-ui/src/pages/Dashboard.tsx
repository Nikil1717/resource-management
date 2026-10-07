import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Users,
    FolderKanban,
    Building2,
} from "lucide-react";

import type {
    LucideIcon,
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
    icon: LucideIcon;
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

                console.log(
                    "Dashboard resource data:",
                    data
                );

                setResources(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load resources:",
                    err
                );

                setResources([]);

                setError(
                    "Unable to load resource data. Please make sure the backend is running."
                );

            } finally {

                setLoading(false);

            }
        };


        loadResources();

    }, []);


    /*
     * UNIQUE EMPLOYEES
     */
    const uniqueEmployees =
        new Set(
            resources
                .map(
                    (resource) =>
                        resource.employeeCode?.trim()
                )
                .filter(Boolean)
        ).size;


    /*
     * UNIQUE PROJECTS
     */
    const uniqueProjects =
        new Set(
            resources
                .map(
                    (resource) =>
                        resource.projectCode?.trim()
                )
                .filter(Boolean)
        ).size;

    /*
     * UNIQUE CUSTOMERS
     */
    const uniqueCustomers =
        new Set(
            resources
                .map((resource) => {
                    const customerCode =
                        resource.customerCode?.trim().toLocaleLowerCase();
                    const customerName =
                        resource.customerName?.trim().toLocaleLowerCase();

                    return customerCode || customerName;
                })
                .filter(Boolean)
        ).size;


    /*
     * DASHBOARD STATISTICS
     */
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
            title: "Total Customers",
            value: uniqueCustomers,
            icon: Building2,
        },

    ];


    /*
     * CUSTOMER SUMMARY
     */
    const customerSummaries =
        useMemo(() => {
            const customerMap =
                new Map<
                    string,
                    {
                        customerCode: string;
                        customerName: string;
                        projectSet: Set<string>;
                        resourceCount: number;
                    }
                >();

            resources.forEach(
                (resource) => {
                    const customerCode =
                        (
                            resource.customerCode ??
                            "-"
                        ).trim() || "-";

                    const customerName =
                        (
                            resource.customerName ??
                            "Unknown Customer"
                        ).trim() || "Unknown Customer";

                    const key =
                        `${customerCode}|${customerName}`;

                    const existing =
                        customerMap.get(key);

                    if (existing) {
                        existing.resourceCount += 1;

                        if (resource.projectCode) {
                            existing.projectSet.add(
                                resource.projectCode.trim()
                            );
                        }

                        return;
                    }

                    customerMap.set(key, {
                        customerCode,
                        customerName,
                        projectSet: new Set(
                            resource.projectCode
                                ? [resource.projectCode.trim()]
                                : []
                        ),
                        resourceCount: 1,
                    });
                }
            );

            return Array.from(
                customerMap.values()
            )
                .map((customer) => ({
                    customerCode: customer.customerCode,
                    customerName: customer.customerName,
                    totalProjects:
                        customer.projectSet.size,
                    totalResources:
                        customer.resourceCount,
                }))
                .sort(
                    (left, right) =>
                        right.totalResources -
                        left.totalResources ||
                        left.customerName.localeCompare(
                            right.customerName
                        )
                );
        }, [resources]);


    return (

        <div>

            {/* =========================
                DASHBOARD STATISTICS
               ========================= */}

            <div className="stats-grid">

                {stats.map((stat) => {

                    const Icon =
                        stat.icon;

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


            {/* =========================
                ERROR MESSAGE
               ========================= */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* =========================
                CUSTOMER DETAILS
               ========================= */}

            <div className="dashboard-grid">

                <div className="card">

                    <div className="card-header">

                        <div>

                            <h2>
                                Customer Details
                            </h2>

                            <p>
                                Customers with total projects and resources
                            </p>

                        </div>

                    </div>


                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Customer Code
                                    </th>

                                    <th>
                                        Customer Name
                                    </th>

                                    <th>
                                        Total Projects
                                    </th>

                                    <th>
                                        Total Resources
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading && (

                                    <tr>

                                        <td
                                            colSpan={4}
                                            className="empty-state"
                                        >
                                            Loading customer data...
                                        </td>

                                    </tr>

                                )}


                                {!loading &&
                                    customerSummaries.map(
                                        (customer) => (

                                            <tr
                                                key={
                                                    `${customer.customerCode}-${customer.customerName}`
                                                }
                                            >

                                                <td>
                                                    {customer.customerCode || "-"}
                                                </td>


                                                <td className="font-medium">
                                                    {customer.customerName || "-"}
                                                </td>


                                                <td>
                                                    {customer.totalProjects}
                                                </td>


                                                <td>
                                                    {customer.totalResources}
                                                </td>

                                            </tr>

                                        )
                                    )}


                                {!loading &&
                                    !error &&
                                    customerSummaries.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan={4}
                                                className="empty-state"
                                            >
                                                No customer records found.
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