export interface getMessage extends proto.IWebMessageInfo {
    id?: string;
    isSelf?: boolean;
    user?: string;  
    isGroup?: boolean;
    sender?: string;
    type?: string;
    messageTypes?: (type: string) => boolean;
    quoted?: QuotedMessage | null;
    body?: string;
    reply?: (text: string) => Promise<void>;
    mentions?: string[];
    download?: () => Promise<Buffer>;
    isAdmin?: boolean;
    isBotAdmin?: boolean;
}
