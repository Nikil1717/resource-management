import {
    useState,
} from "react";

import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
} from "lucide-react";

import {
    importExcel,
} from "../services/resourceService";

function ImportExcel() {

    const [file, setFile] =
        useState<File | null>(null);

    const [uploading, setUploading] =
        useState<boolean>(false);

    const [message, setMessage] =
        useState<string>("");

    const [error, setError] =
        useState<string>("");

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {

        const selectedFile =
            event.target.files?.[0] ?? null;

        setMessage("");
        setError("");

        if (!selectedFile) {

            setFile(null);

            return;
        }

        if (
            !selectedFile.name
                .toLowerCase()
                .endsWith(".xlsx")
        ) {

            setError(
                "Please select an .xlsx Excel file."
            );

            setFile(null);

            return;
        }

        setFile(selectedFile);
    };

    const handleUpload =
        async (): Promise<void> => {

            if (!file) {

                setError(
                    "Please select an Excel file first."
                );

                return;
            }

            try {

                setUploading(true);

                setMessage("");
                setError("");

                const result =
                    await importExcel(file);

                setMessage(
                    `${result.recordsImported} records imported successfully.`
                );

                setFile(null);

            } catch (err) {

                console.error(
                    "Excel import failed",
                    err
                );

                setError(
                    "Excel import failed. Please check the file and try again."
                );

            } finally {

                setUploading(false);

            }
        };

    return (
        <div className="import-page">

            <div className="card import-card">

                <div className="import-icon">

                    <FileSpreadsheet
                        size={34}
                    />

                </div>

                <h2>
                    Import Resource Data
                </h2>

                <p>
                    Upload the Excel file containing
                    resource allocation information.
                </p>

                <label className="upload-area">

                    <Upload size={32} />

                    <strong>
                        Click to select Excel file
                    </strong>

                    <span>
                        Only .xlsx files are supported
                    </span>

                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={
                            handleFileChange
                        }
                    />

                </label>

                {file && (

                    <div className="selected-file">

                        <FileSpreadsheet
                            size={20}
                        />

                        <div>

                            <strong>
                                {file.name}
                            </strong>

                            <span>
                                {(
                                    file.size /
                                    1024
                                ).toFixed(1)}{" "}
                                KB
                            </span>

                        </div>

                    </div>

                )}

                {message && (

                    <div className="success-message">

                        <CheckCircle
                            size={18}
                        />

                        {message}

                    </div>

                )}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}

                <button
                    className="primary-button upload-button"
                    type="button"
                    onClick={handleUpload}
                    disabled={
                        !file || uploading
                    }
                >

                    <Upload size={18} />

                    {uploading
                        ? "Importing..."
                        : "Import Excel"}

                </button>

            </div>

        </div>
    );
}

export default ImportExcel;