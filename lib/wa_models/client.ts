import { monospace } from "./fancy";

const toUsage = () => {
    const memoryUsage = process.memoryUsage();
    const usedMemoryMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const totalMemoryMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    return `${usedMemoryMB}MB / ${totalMemoryMB}MB`;
};

const getCurrentDateTime = () => {
    const now = new Date();
    return {
        date: now.toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg" }),
        time: now.toLocaleTimeString("en-ZA", { timeZone: "Africa/Johannesburg" }),
    };
};

export const getSystemList = (
    botName: string,
    prefix: string,
    pushName: string,
    mode: string,
    version: string
): string => {
    const { date, time } = getCurrentDateTime();
    const memory = toUsage();
    const toStar = "✧";

    return [
        `╭──╼【 ${monospace(botName.toUpperCase())} 】`,
        `┃ ${toStar} Prefix  : ${prefix}`,
        `┃ ${toStar} User    : ${pushName}`,
        `┃ ${toStar} Mode    : ${mode}`,
        `┃ ${toStar} Date    : ${date}`,
        `┃ ${toStar} Time    : ${time}`,
        `┃ ${toStar} Version : ${version}`,
        `┃ ${toStar} Memory  : ${memory}`,
        `╰──────────╼`
    ].join("\n");
};
