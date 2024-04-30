import { Modal } from "@/components/Modal";

export const PromptTemplateModal = ({
    setShowPromptTemplateModal,
    handleSave,
}: {
    setShowPromptTemplateModal: (value: boolean) => void,
    handleSave: () => void
}) => {

    return (
        <Modal headline={"Prompt Templates"} id="prompt-templates-modal" onClose={() => setShowPromptTemplateModal(false)}>
            <ul>
                <li>Select from a List of pre-defined prompts</li>
                <li>To be implemented ...</li>
            </ul>
        </Modal>
    )

}