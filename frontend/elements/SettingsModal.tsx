import { Modal } from "@/components/Modal";
import { StoreContext } from "@/components/StoreContext";
import { StoreInterface } from "@/types";
import { useContext } from "react";

export const SettingsModal = ({
    setShowSettings,
}: {
    setShowSettings: (value: boolean) => void,
}) => {

    const store = useContext(StoreContext);
    const { llmSettings, setLlmSettings } = store as StoreInterface;
    const {
        model,
        temperature,
        max_tokens,
        chatEndpoint,
        sttEndpoint,
        tssEndpoint,
        systemMessage,
    } = llmSettings;

    return (
        <Modal headline={"Settings"} id="settings-modal" onClose={() => setShowSettings(false)}>

            <br />

            <div className="modal-input">
                <label>Model</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setLlmSettings({ ...llmSettings, model: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>Chat Endpoint</label>
                <input
                    type="text"
                    value={chatEndpoint}
                    onChange={(e) => setLlmSettings({ ...llmSettings, chatEndpoint: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>API Key</label>
                <input
                    type="text"
                    value={llmSettings.chatEndpointApiKey}
                    onChange={(e) => setLlmSettings({ ...llmSettings, chatEndpointApiKey: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>Qdrant Host</label>
                <input
                    type="text"
                    value={llmSettings.qdrantHost}
                    onChange={(e) => setLlmSettings({ ...llmSettings, qdrantHost: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>Qdrant Port</label>
                <input
                    type="number"
                    value={llmSettings.qdrantPort}
                    onChange={(e) => setLlmSettings({ ...llmSettings, qdrantPort: parseInt(e.target.value) })}
                />
            </div>

            <div className="modal-input">
                <label>STT Endpoint</label>
                <input
                    type="text"
                    value={sttEndpoint}
                    onChange={(e) => setLlmSettings({ ...llmSettings, sttEndpoint: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>TTS Endpoint</label>
                <input
                    type="text"
                    value={tssEndpoint}
                    onChange={(e) => setLlmSettings({ ...llmSettings, tssEndpoint: e.target.value })}
                />
            </div>

            <div className="modal-input">
                <label>Temperature</label>
                <input
                    type="number"
                    value={temperature}
                    min={0.0} max={1.0} step={0.1}
                    onChange={(e) => setLlmSettings({ ...llmSettings, temperature: parseFloat(e.target.value) })}
                />
            </div>

            <div className="modal-input">
                <label>Max Tokens</label>
                <input
                    type="number"
                    value={max_tokens}
                    min={128} max={4096} step={10}
                    onChange={(e) => setLlmSettings({ ...llmSettings, max_tokens: parseInt(e.target.value) })}
                />
            </div>

            <div className="modal-input">
                <label>System Prompt</label>
                <textarea
                    rows={7}
                    value={systemMessage.content}
                    onChange={(e) => setLlmSettings({
                        ...llmSettings, systemMessage: {
                            ...systemMessage,
                            content: e.target.value
                        }
                    })}
                />
            </div>
        </Modal>
    )

}