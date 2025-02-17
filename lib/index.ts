export function extractUrlFromText(text: string): string[] {
    const urlRegex: RegExp = /https?:\/\/[^\s]+/g;
    const matches: string[] | null = text.match(urlRegex);
    return matches || [];
}
