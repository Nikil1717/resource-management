import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

export interface Resource {
    id?: number;

    employeeCode: string;
    employeeName: string;

    projectCode: string;
    projectName: string;

    allocation: number | null;
    fte: number | null;

    customerCode: string;
    customerName: string;

    projectDUName: string;
    projectManagerName: string;

    projectCategory: string;
    projectCategoryName: string;

    wbsType: string;
    billingStatus: string;

    employeeLOBName: string;

    band: string;
    subBand: string;

    joiningDate: string | null;

    psa: string;
}

export interface ImportResponse {
    message: string;
    recordsImported: number;
}

export const getResources = async (): Promise<Resource[]> => {
    const response = await api.get<Resource[]>("/resources");

    return response.data;
};

export const getResourceById = async (
    id: number
): Promise<Resource> => {
    const response = await api.get<Resource>(
        `/resources/${id}`
    );

    return response.data;
};

export const createResource = async (
    resource: Resource
): Promise<Resource> => {
    const response = await api.post<Resource>(
        "/resources",
        resource
    );

    return response.data;
};

export const updateResource = async (
    id: number,
    resource: Resource
): Promise<Resource> => {
    const response = await api.put<Resource>(
        `/resources/${id}`,
        resource
    );

    return response.data;
};

export const deleteResource = async (
    id: number
): Promise<void> => {
    await api.delete(`/resources/${id}`);
};

export const importExcel = async (
    file: File
): Promise<ImportResponse> => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<ImportResponse>(
        "/import/excel",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};