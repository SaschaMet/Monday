import { Modal } from "@/components/Modal";

export const SettingsModal = ({
    showSettings,
    setShowSettings,
    handleSave,
}: {
    showSettings: boolean,
    setShowSettings: (value: boolean) => void,
    handleSave: () => void
}) => {

    return (
        <div className="settings-modal">
            <button
                className="outline secondary small"
                onClick={() => setShowSettings(!showSettings)}
            >
                {showSettings ? "Hide" : "Show"} Settings
            </button>
            {showSettings && (
                <Modal headline={"Settings"} onClose={() => setShowSettings(false)}>
                    <form className="max-w-sm mx-auto">

                        <label htmlFor="model-selection">Select a Model</label>
                        <select id="model-selection">
                            <option value="none">Select a Model</option>
                            <option value="US">Ollama Gemma7b</option>
                            <option value="CA">Cohere Command-R</option>
                            <option value="CA">Cohere Command-R Plus</option>
                        </select>
                    </form>
                    <div className="save-settings">
                        <button className="outline contrast small"
                            onClick={handleSave} >
                            Save
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )

}