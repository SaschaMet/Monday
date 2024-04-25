import { Modal } from "@/components/Modal";

export const DocumentsModel = ({
    showDocuments,
    setShowDocuments,
    files,
    setFiles,
}: {
    files: any,
    showDocuments: boolean,
    setShowDocuments: (value: boolean) => void,
    setFiles: (value: any) => void
}) => {

    const handleSaveDocuments = async () => {
        await Promise.all(files.map(async (file: any) => {
            const formData = new FormData();
            formData.append("file", file);
            return fetch("/api/qdrant-add-documents", {
                method: "POST",
                body: formData,
            })
                .then(() => setShowDocuments(false))
                .catch((err) => console.error(err));
        }));
    };

    const stopEvent = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e: any) {
        stopEvent(e)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
                setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
            }
        }
    }

    function removeFile(fileName: any) {
        setFiles(files.filter((file: any) => file.name !== fileName));
    }

    return (
        <>
            <button
                className="outline secondary small"
                onClick={() => setShowDocuments(!showDocuments)}
            >
                {showDocuments ? "Hide" : "Add"} Documents
            </button>

            {showDocuments && (
                <Modal headline={"Documents"} onClose={() => setShowDocuments(false)}>
                    <div className="file-dropzone">
                        <form className=""
                            onDrop={handleDrop}
                            onDragEnter={stopEvent}
                            onDragLeave={stopEvent}
                            onDragOver={stopEvent}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <label htmlFor="dropzone-file" className="">
                                <div className="upload-helpers">
                                    <svg className="file-upload" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className=""><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="">TXT, PDF, MD & HTML files are supported.</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </form>
                    </div>
                    <div className="upload-wrapper">
                        <div className="files">
                            <span>
                                Files:
                            </span>
                            {files && files.length ? (
                                files.map((file: any, idx: any) => (
                                    <>
                                        <span key={`${file.name}-${idx}`} className=""> {file.name}</span>
                                        <button onClick={() => removeFile(file.name)} className="remove-file-button">Remove</button>
                                    </>
                                ))
                            ) : "No files selected"}
                        </div>
                        <button className="small"
                            onClick={handleSaveDocuments} >
                            Upload Documents
                        </button>
                    </div>
                </Modal>
            )}
        </>
    )
}