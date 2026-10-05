import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ChevronDown,
    ChevronRight,
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

interface Project {
    projectCode: string;
    projectName: string;
    customerCode: string;
    customerName: string;
    projectDUName: string;
    projectManagerName: string;
    projectCategory: string;
    projectCategoryName: string;
    resources: Resource[];
}

function Projects() {

    const [resources, setResources] =
        useState<Resource[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [error, setError] =
        useState<string>("");

    const [expandedProjects, setExpandedProjects] =
        useState<Set<string>>(
            new Set()
        );

    const [showResourceModal, setShowResourceModal] =
        useState<boolean>(false);

    const [editingResource, setEditingResource] =
        useState<Resource | null>(null);

    const [selectedProject, setSelectedProject] =
        useState<Project | null>(null);

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
                    "Failed to load projects:",
                    error
                );

                setError(
                    "Unable to load project data."
                );

            } finally {

                setLoading(false);

            }
        };

    useEffect(() => {

        loadResources();

    }, []);

    const projects =
        useMemo<Project[]>(() => {

            const projectMap =
                new Map<string, Project>();

            resources.forEach(
                (resource: Resource) => {

                    const code =
                        resource.projectCode;

                    if (!code) {
                        return;
                    }

                    if (!projectMap.has(code)) {

                        projectMap.set(
                            code,
                            {
                                projectCode:
                                    code,

                                projectName:
                                    resource.projectName,

                                customerCode:
                                    resource.customerCode,

                                customerName:
                                    resource.customerName,

                                projectDUName:
                                    resource.projectDUName,

                                projectManagerName:
                                    resource.projectManagerName,

                                projectCategory:
                                    resource.projectCategory,

                                projectCategoryName:
                                    resource.projectCategoryName,

                                resources: [],
                            }
                        );

                    }

                    const project =
                        projectMap.get(code);

                    if (project) {

                        project.resources.push(
                            resource
                        );

                    }

                }
            );

            return Array.from(
                projectMap.values()
            );

        }, [resources]);

    const toggleProject =
        (projectCode: string): void => {

            setExpandedProjects(
                (previous) => {

                    const next =
                        new Set(previous);

                    if (
                        next.has(projectCode)
                    ) {

                        next.delete(
                            projectCode
                        );

                    } else {

                        next.add(
                            projectCode
                        );

                    }

                    return next;

                }
            );
        };

    const handleAddResource =
        (project: Project): void => {

            setSelectedProject({
                ...project,
                customerCode: project.customerCode,
                customerName: project.customerName,
                projectDUName: project.projectDUName,
                projectManagerName: project.projectManagerName,
                projectCategory: project.projectCategory,
                projectCategoryName: project.projectCategoryName,
            });
            setEditingResource(null);
            setShowResourceModal(true);

        };

    const handleEditResource =
        (
            resource: Resource,
            project: Project
        ): void => {

            setSelectedProject(project);
            setEditingResource(resource);
            setShowResourceModal(true);

        };

    const handleDeleteResource =
        async (
            id: number | undefined
        ): Promise<void> => {

            if (id === undefined) {
                return;
            }

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this resource?"
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

    const handleAddProject =
        (): void => {

            /*
             * Because the application intentionally uses
             * one database table, a project is created
             * together with its first resource allocation.
             *
             * Therefore we open the resource form with
             * empty employee information and let the user
             * enter the first resource at the same time.
             */

            setSelectedProject(null);
            setEditingResource(null);
            setShowResourceModal(true);

        };

    return (
        <div>

            <div className="page-toolbar">

                <div>

                    <h2 className="page-section-title">
                        Projects
                    </h2>

                    <p className="page-section-subtitle">
                        View projects and resources assigned to each project.
                    </p>

                </div>

                <button
                    className="primary-button"
                    type="button"
                    onClick={
                        handleAddProject
                    }
                >

                    <Plus size={18} />

                    Add Project

                </button>

            </div>

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}

            <div className="card">

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th className="expand-column">
                                </th>

                                <th>
                                    Project Code
                                </th>

                                <th>
                                    Project Name
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
                                    Resources
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={11}
                                        className="empty-state"
                                    >
                                        Loading projects...
                                    </td>

                                </tr>

                            ) : projects.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={11}
                                        className="empty-state"
                                    >
                                        No projects found.
                                    </td>

                                </tr>

                            ) : (

                                projects.map(
                                    (
                                        project
                                    ) => {

                                        const expanded =
                                            expandedProjects.has(
                                                project.projectCode
                                            );

                                        return (
                                            <ProjectRows
                                                key={
                                                    project.projectCode
                                                }
                                                project={
                                                    project
                                                }
                                                expanded={
                                                    expanded
                                                }
                                                onToggle={() =>
                                                    toggleProject(
                                                        project.projectCode
                                                    )
                                                }
                                                onAddResource={() =>
                                                    handleAddResource(
                                                        project
                                                    )
                                                }
                                                onEditResource={
                                                    handleEditResource
                                                }
                                                onDeleteResource={
                                                    handleDeleteResource
                                                }
                                            />
                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            <ResourceFormModal
                isOpen={showResourceModal}
                resource={editingResource}
                defaultProject={
                    selectedProject
                        ? {
                            projectCode:
                                selectedProject.projectCode,
                            projectName:
                                selectedProject.projectName,
                        }
                        : undefined
                }
                onClose={() => {

                    setShowResourceModal(
                        false
                    );

                    setEditingResource(
                        null
                    );

                    setSelectedProject(
                        null
                    );

                }}
                onSaved={loadResources}
            />

        </div>
    );
}

interface ProjectRowsProps {
    project: Project;
    expanded: boolean;
    onToggle: () => void;
    onAddResource: () => void;
    onEditResource: (
        resource: Resource,
        project: Project
    ) => void;
    onDeleteResource: (
        id: number | undefined
    ) => void;
}

function ProjectRows({
    project,
    expanded,
    onToggle,
    onAddResource,
    onEditResource,
    onDeleteResource,
}: ProjectRowsProps) {

    return (
        <>
            <tr>

                <td>

                    <button
                        className="expand-button"
                        type="button"
                        onClick={onToggle}
                    >

                        {expanded ? (
                            <ChevronDown size={18} />
                        ) : (
                            <ChevronRight size={18} />
                        )}

                    </button>

                </td>

                <td>
                    {project.projectCode}
                </td>

                <td className="font-medium">
                    {project.projectName}
                </td>

                <td>
                    {project.customerCode}
                </td>

                <td>
                    {project.customerName}
                </td>

                <td>
                    {project.projectDUName}
                </td>

                <td>
                    {project.projectManagerName}
                </td>

                <td>
                    {project.projectCategory}
                </td>

                <td>
                    {project.projectCategoryName}
                </td>

                <td>

                    <span className="resource-count">
                        {project.resources.length}
                    </span>

                </td>

                <td>

                    <button
                        className="small-primary-button"
                        type="button"
                        onClick={onAddResource}
                    >

                        <Plus size={15} />

                        Resource

                    </button>

                </td>

            </tr>

            {expanded && (

                <tr className="project-resource-row">

                    <td
                        colSpan={11}
                    >

                        <div className="project-resource-panel">

                            <div className="project-resource-header">

                                <div>

                                    <h3>
                                        Resources under{" "}
                                        {project.projectName}
                                    </h3>

                                    <p>
                                        {
                                            project.resources.length
                                        }{" "}
                                        resource records
                                    </p>

                                </div>

                                <button
                                    className="primary-button"
                                    type="button"
                                    onClick={
                                        onAddResource
                                    }
                                >

                                    <Plus size={16} />

                                    Add Resource

                                </button>

                            </div>

                            {project.resources.length === 0 ? (

                                <div className="empty-project-resources">

                                    No resources assigned to this project.

                                </div>

                            ) : (

                                <div className="table-container">

                                    <table className="nested-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Employee Code
                                                </th>

                                                <th>
                                                    Employee Name
                                                </th>

                                                <th>
                                                    Allocation
                                                </th>

                                                <th>
                                                    FTE
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

                                            {project.resources.map(
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
                                                                resource.billingStatus ||
                                                                "-"
                                                            }
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
                                                                    onClick={() =>
                                                                        onEditResource(
                                                                            resource,
                                                                            project
                                                                        )
                                                                    }
                                                                >

                                                                    <Pencil
                                                                        size={15}
                                                                    />

                                                                </button>

                                                                <button
                                                                    className="table-action delete"
                                                                    type="button"
                                                                    onClick={() =>
                                                                        onDeleteResource(
                                                                            resource.id
                                                                        )
                                                                    }
                                                                >

                                                                    <Trash2
                                                                        size={15}
                                                                    />

                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </td>

                </tr>

            )}

        </>
    );
}

export default Projects;