import { getEncoding } from "js-tiktoken";

export const countTokens = (text: string) => {
    const enc = getEncoding("cl100k_base");
    const tokens = enc.encode(text);
    return tokens.length;
}