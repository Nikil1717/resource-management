import {
    useEffect,
    useState,
} from "react";

import {
    Search,
    Plus,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    getResources,
    deleteResource,
} from "../services/resourceService";

import type {
    Resource,
} from "../services/resourceService";

import ResourceFormModal from "../components/ResourceFormModal";

function Resources() {

    const [resources, setResources] =
        useState<Resource[]>([]);

    const [search, setSearch] =
        useState<string>("");

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    const [showModal, setShowModal] =
        useState<boolean>(false);

    const [editingResource, setEditingResource] =
        useState<Resource | null>(null);

    const loadResources =
        async (): Promise<void> => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getResources();

                setResources(data);

            } catch (error) {

                console.error(
                    "Failed to load resources:",
                    error
                );

                setError(
                    "Unable to load resource data."
                );

            } finally {

                setLoading(false);

            }
        };

    useEffect(() => {

        loadResources();

    }, []);

    const filteredResources =
        resources.filter(
            (resource: Resource) => {

                const value =
                    search
                        .toLowerCase()
                        .trim();

                if (!value) {
                    return true;
                }

                return (

                    resource.employeeCode
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    resource.employeeName
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    resource.projectCode
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    resource.projectName
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    resource.customerName
                        ?.toLowerCase()
                        .includes(value)

                );
            }
        );

    const handleAdd =
        (): void => {

            setEditingResource(null);
            setShowModal(true);

        };

    const handleEdit =
        (resource: Resource): void => {

            setEditingResource(resource);
            setShowModal(true);

        };

    const handleDelete =
        async (
            id: number | undefined
        ): Promise<void> => {

            if (id === undefined) {
                return;
            }

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this resource record?"
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteResource(id);

                await loadResources();

            } catch (error) {

                console.error(
                    "Failed to delete resource:",
                    error
                );

                setError(
                    "Failed to delete resource."
                );

            }
        };

    return (
        <div>

            <div className="page-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search employee, project or customer..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

                <button
                    className="primary-button"
                    type="button"
                    onClick={handleAdd}
                >

                    <Plus size={18} />

                    Add Resource

                </button>

            </div>

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}

            <div className="card">

                <div className="card-header">

                    <div>

                        <h2>
                            Resource Allocation
                        </h2>

                        <p>
                            {filteredResources.length} records
                        </p>

                    </div>

                </div>

                <div className="table-container">

                    <table className="resource-table">

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

                                <th>
                                    FTE
                                </th>

                                <th>
                                    Customer Code
                                </th>

                                <th>
                                    Customer Name
                                </th>

                                <th>
                                    ProjectDUName
                                </th>

                                <th>
                                    ProjectManagerName
                                </th>

                                <th>
                                    Project Category
                                </th>

                                <th>
                                    ProjectCategoryName
                                </th>

                                <th>
                                    WBS Type
                                </th>

                                <th>
                                    BillingStatus
                                </th>

                                <th>
                                    EmployeeLOBName
                                </th>

                                <th>
                                    Band
                                </th>

                                <th>
                                    SubBand
                                </th>

                                <th>
                                    JoiningDate
                                </th>

                                <th>
                                    PSA
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={20}
                                        className="empty-state"
                                    >
                                        Loading resources...
                                    </td>

                                </tr>

                            ) : filteredResources.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={20}
                                        className="empty-state"
                                    >
                                        No resources found.
                                    </td>

                                </tr>

                            ) : (

                                filteredResources.map(
                                    (
                                        resource
                                    ) => (

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

                                            <td>
                                                {
                                                    resource.fte ??
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.customerCode
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.customerName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.projectDUName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.projectManagerName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.projectCategory
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.projectCategoryName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.wbsType
                                                }
                                            </td>

                                            <td>

                                                <span className="status-badge">
                                                    {
                                                        resource.billingStatus ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {
                                                    resource.employeeLOBName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.band
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.subBand
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.joiningDate
                                                        ? resource.joiningDate.substring(
                                                            0,
                                                            10
                                                        )
                                                        : "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    resource.psa
                                                }
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="table-action"
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                resource
                                                            )
                                                        }
                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>

                                                    <button
                                                        className="table-action delete"
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                resource.id
                                                            )
                                                        }
                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            <ResourceFormModal
                isOpen={showModal}
                resource={editingResource}
                onClose={() =>
                    setShowModal(false)
                }
                onSaved={loadResources}
            />

        </div>
    );
}

export default Resources;