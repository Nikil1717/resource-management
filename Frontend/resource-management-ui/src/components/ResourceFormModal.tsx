import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    X,
} from "lucide-react";

import {
    createResource,
    getResources,
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
        customerCode?: string;
        customerName?: string;
        projectDUName?: string;
        projectManagerName?: string;
        projectCategory?: string;
        projectCategoryName?: string;
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

    const [allResources, setAllResources] =
        useState<Resource[]>([]);

    const [selectedBand, setSelectedBand] =
        useState<string>(formData.band || "");

    const bandOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    allResources
                        .map((item) => item.band)
                        .filter((band): band is string => Boolean(band))
                )
            ).sort((left, right) => left.localeCompare(right)),
        [allResources]
    );

    const subBandList = useMemo(
        () =>
            selectedBand
                ? Array.from(
                    new Set(
                        allResources
                            .filter((item) => item.band === selectedBand)
                            .map((item) => item.subBand)
                            .filter((subBand): subBand is string => Boolean(subBand))
                    )
                ).sort((left, right) => left.localeCompare(right))
                : [],
        [allResources, selectedBand]
    );

    useEffect(() => {

        const loadProjectOptions = async () => {
            try {
                const resources = await getResources();
                setAllResources(resources);
            } catch (loadError) {
                console.error("Failed to load project metadata", loadError);
            }
        };

        if (isOpen) {
            void loadProjectOptions();
        }

    }, [isOpen]);

    useEffect(() => {

        if (resource) {

            setFormData({
                ...resource,
                joiningDate:
                    resource.joiningDate
                    ? resource.joiningDate.substring(0, 10)
                    : null,
            });

            setSelectedBand(resource.band || "");

        } else {

            const matchedProject =
                allResources.find(
                    (projectResource) =>
                        projectResource.projectCode === defaultProject?.projectCode
                );

            setFormData({
                ...emptyResource,
                projectCode:
                    defaultProject?.projectCode ?? "",
                projectName:
                    defaultProject?.projectName ?? "",
                customerCode:
                    defaultProject?.customerCode ?? matchedProject?.customerCode ?? "",
                customerName:
                    defaultProject?.customerName ?? matchedProject?.customerName ?? "",
                projectDUName:
                    defaultProject?.projectDUName ?? matchedProject?.projectDUName ?? "",
                projectManagerName:
                    defaultProject?.projectManagerName ?? matchedProject?.projectManagerName ?? "",
                projectCategory:
                    defaultProject?.projectCategory ?? matchedProject?.projectCategory ?? "",
                projectCategoryName:
                    defaultProject?.projectCategoryName ?? matchedProject?.projectCategoryName ?? "",
            });

            setSelectedBand("");

        }

        setError("");

    }, [
        resource,
        defaultProject,
        isOpen,
        allResources,
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

        if (field === "band") {
            setSelectedBand(value);
            setFormData((previous) => ({
                ...previous,
                band: value,
                subBand: "",
            }));
        }
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

                            <FormSelect
                                label="Band"
                                value={
                                    formData.band
                                }
                                options={bandOptions}
                                onChange={(value) =>
                                    handleChange(
                                        "band",
                                        value
                                    )
                                }
                            />

                            <FormSelect
                                label="SubBand"
                                value={
                                    formData.subBand
                                }
                                options={subBandList}
                                placeholder={
                                    selectedBand
                                        ? "Select sub band"
                                        : "Select band first"
                                }
                                disabled={!selectedBand}
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

                            <FormSelect
                                label="WBS Type"
                                value={
                                    formData.wbsType
                                }
                                options={[
                                    "Onshore",
                                    "OffShore",
                                    "OnSite",
                                    "NearShore",
                                    "Domestic",
                                ]}
                                onChange={(value) =>
                                    handleChange(
                                        "wbsType",
                                        value
                                    )
                                }
                            />

                            <FormSelect
                                label="BillingStatus"
                                value={
                                    formData.billingStatus
                                }
                                options={["N", "B", "C"]}
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

interface FormSelectProps {
    label: string;
    value: string;
    options: string[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
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

function FormSelect({
    label,
    value,
    options,
    required = false,
    disabled = false,
    placeholder,
    onChange,
}: FormSelectProps) {

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

            <select
                value={value}
                required={required}
                disabled={disabled}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
            >
                <option value="">
                    {placeholder ?? "Select an option"}
                </option>

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default ResourceFormModal;