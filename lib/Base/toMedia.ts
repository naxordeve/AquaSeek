export default function downloadMedia = async (_msg: Message): Promise<Buffer | null> => {
    try {
        let type = Object.keys(_msg || {})[0];
        let media = _msg?.[type];
        if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
            media = _msg.viewOnceMessageV2?.message || media;
            type = Object.keys(media || {})[0];
            media = media?.[type];}
        if (!media) throw new Error('No media');
        const stream = await downloadContentFromMessage(media, type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (error) {
        console.error(error);
        return null;
    }
};
