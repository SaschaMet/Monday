import { countTokens } from "@/utils/countTokens";
import { ChatHistoryMessage } from "@/types";

export const countHistoryTokens = (history: ChatHistoryMessage[], setTokens: Function): void => {
    const allHistoryMessages = history.map((message) => message.content);
    const allHistoryMessagesText = allHistoryMessages.join(" ");
    const allHistoryMessagesTextTokens = countTokens(allHistoryMessagesText);
    setTokens(allHistoryMessagesTextTokens);
}