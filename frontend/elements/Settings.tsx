import { Toggle } from "@/components/Toggle";
import { DocumentsModel } from "@/elements/DocumentsModal";
import { SettingsModal } from "@/elements/SettingsModal";
import { useState } from "react";

export const Settings = ({ searchDocuments, setSearchDocuments }: { searchDocuments: boolean, setSearchDocuments: any }) => {

    const [files, setFiles] = useState<any>([]);

    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showDocuments, setShowDocuments] = useState<boolean>(false);

    const handleSave = () => {
        setShowSettings(false);
        setShowDocuments(false);
    };

    return (
        <>
            <div className="settings">
                <SettingsModal
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    handleSave={handleSave}
                />
                <DocumentsModel
                    files={files}
                    setFiles={setFiles}
                    showDocuments={showDocuments}
                    setShowDocuments={setShowDocuments}
                />
                <Toggle active={searchDocuments} onChangeFunction={setSearchDocuments} labelText="Search Documents" />
                {/* <Toggle onChangeFunction={setSearchDocuments} labelText="Boost?" /> */}
            </div>
        </>
    )
}