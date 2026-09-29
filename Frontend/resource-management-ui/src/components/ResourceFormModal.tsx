import {
    useEffect,
    useState,
} from "react";

import {
    X,
} from "lucide-react";

import {
    createResource,
    updateResource,
} from "../services/resourceService";

import type {
    Resource,
} from "../services/resourceService";

interface ResourceFormModalProps {
    isOpen: boolean;
    resource: Resource | null;
    defaultProject?: {
        projectCode: string;
        projectName: string;
    };
    onClose: () => void;
    onSaved: () => void;
}

const emptyResource: Resource = {
    employeeCode: "",
    employeeName: "",
    projectCode: "",
    projectName: "",
    allocation: null,
    fte: null,
    customerCode: "",
    customerName: "",
    projectDUName: "",
    projectManagerName: "",
    projectCategory: "",
    projectCategoryName: "",
    wbsType: "",
    billingStatus: "",
    employeeLOBName: "",
    band: "",
    subBand: "",
    joiningDate: null,
    psa: "",
};

function ResourceFormModal({
    isOpen,
    resource,
    defaultProject,
    onClose,
    onSaved,
}: ResourceFormModalProps) {

    const [formData, setFormData] =
        useState<Resource>(emptyResource);

    const [saving, setSaving] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>("");

    useEffect(() => {

        if (resource) {

            setFormData({
                ...resource,
                joiningDate:
                    resource.joiningDate
                    ? resource.joiningDate.substring(0, 10)
                    : null,
            });

        } else {

            setFormData({
                ...emptyResource,
                projectCode:
                    defaultProject?.projectCode ?? "",
                projectName:
                    defaultProject?.projectName ?? "",
            });

        }

        setError("");

    }, [
        resource,
        defaultProject,
        isOpen,
    ]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (
        field: keyof Resource,
        value: string
    ): void => {

        setFormData(
            (previous) => ({
                ...previous,
                [field]: value,
            })
        );
    };

    const handleNumberChange = (
        field: "allocation" | "fte",
        value: string
    ): void => {

        setFormData(
            (previous) => ({
                ...previous,
                [field]:
                    value === ""
                        ? null
                        : Number(value),
            })
        );
    };

    const handleSubmit =
        async (
            event: React.FormEvent<HTMLFormElement>
        ): Promise<void> => {

            event.preventDefault();

            setError("");

            if (!formData.employeeCode.trim()) {

                setError(
                    "Employee Code is required."
                );

                return;
            }

            if (!formData.employeeName.trim()) {

                setError(
                    "Employee Name is required."
                );

                return;
            }

            if (!formData.projectCode.trim()) {

                setError(
                    "Project Code is required."
                );

                return;
            }

            if (!formData.projectName.trim()) {

                setError(
                    "Project Name is required."
                );

                return;
            }

            try {

                setSaving(true);

                if (resource?.id !== undefined) {

                    await updateResource(
                        resource.id,
                        formData
                    );

                } else {

                    await createResource(
                        formData
                    );

                }

                onSaved();

                onClose();

            } catch (error) {

                console.error(
                    "Failed to save resource:",
                    error
                );

                setError(
                    "Unable to save resource. Please check the backend."
                );

            } finally {

                setSaving(false);

            }
        };

    return (
        <div className="modal-overlay">

            <div className="modal modal-large">

                <div className="modal-header">

                    <div>

                        <h2>
                            {resource
                                ? "Edit Resource"
                                : "Add Resource"}
                        </h2>

                        <p>
                            Enter the resource details
                            matching the Excel fields.
                        </p>

                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="resource-form"
                >

                    <div className="form-section">

                        <h3>
                            Employee Details
                        </h3>

                        <div className="form-grid">

                            <FormInput
                                label="Employee Code"
                                value={
                                    formData.employeeCode
                                }
                                required
                                onChange={(value) =>
                                    handleChange(
                                        "employeeCode",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Employee Name"
                                value={
                                    formData.employeeName
                                }
                                required
                                onChange={(value) =>
                                    handleChange(
                                        "employeeName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="EmployeeLOBName"
                                value={
                                    formData.employeeLOBName
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "employeeLOBName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Band"
                                value={
                                    formData.band
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "band",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="SubBand"
                                value={
                                    formData.subBand
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "subBand",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="JoiningDate"
                                type="date"
                                value={
                                    formData.joiningDate ??
                                    ""
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "joiningDate",
                                        value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="form-section">

                        <h3>
                            Project Details
                        </h3>

                        <div className="form-grid">

                            <FormInput
                                label="Project Code"
                                value={
                                    formData.projectCode
                                }
                                required
                                onChange={(value) =>
                                    handleChange(
                                        "projectCode",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Project Name"
                                value={
                                    formData.projectName
                                }
                                required
                                onChange={(value) =>
                                    handleChange(
                                        "projectName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="ProjectDUName"
                                value={
                                    formData.projectDUName
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "projectDUName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="ProjectManagerName"
                                value={
                                    formData.projectManagerName
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "projectManagerName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Project Category"
                                value={
                                    formData.projectCategory
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "projectCategory",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="ProjectCategoryName"
                                value={
                                    formData.projectCategoryName
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "projectCategoryName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="WBS Type"
                                value={
                                    formData.wbsType
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "wbsType",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="BillingStatus"
                                value={
                                    formData.billingStatus
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "billingStatus",
                                        value
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="form-section">

                        <h3>
                            Customer & Allocation
                        </h3>

                        <div className="form-grid">

                            <FormInput
                                label="Customer Code"
                                value={
                                    formData.customerCode
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "customerCode",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Customer Name"
                                value={
                                    formData.customerName
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "customerName",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="Allocation"
                                type="number"
                                value={
                                    formData.allocation ??
                                    ""
                                }
                                onChange={(value) =>
                                    handleNumberChange(
                                        "allocation",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="FTE"
                                type="number"
                                step="0.01"
                                value={
                                    formData.fte ??
                                    ""
                                }
                                onChange={(value) =>
                                    handleNumberChange(
                                        "fte",
                                        value
                                    )
                                }
                            />

                            <FormInput
                                label="PSA"
                                value={
                                    formData.psa
                                }
                                onChange={(value) =>
                                    handleChange(
                                        "psa",
                                        value
                                    )
                                }
                            />

                        </div>

                    </div>

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}

                    <div className="modal-footer">

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            className="primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : resource
                                    ? "Save Changes"
                                    : "Add Resource"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

interface FormInputProps {
    label: string;
    value: string | number | null;
    type?: string;
    step?: string;
    required?: boolean;
    onChange: (value: string) => void;
}

function FormInput({
    label,
    value,
    type = "text",
    step,
    required = false,
    onChange,
}: FormInputProps) {

    return (
        <div className="form-field">

            <label>

                {label}

                {required && (
                    <span className="required">
                        *
                    </span>
                )}

            </label>

            <input
                type={type}
                step={step}
                value={value ?? ""}
                required={required}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            />

        </div>
    );
}

export default ResourceFormModal;