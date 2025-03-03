import { monospace } from "./fancy";
import madann from "../../maradan/madan.json" assert { type: "json" };

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
        time: now.toLocaleTimeString("en-ZA", { timeZone: "Africa/Johannesburg" })
    };
};  //var madann = toSt

export const getSystemList = (
    botName: string,
    prefix: string,
    pushName: string,
    mode: string,
    version: string
): string => {
    const { date, time } = getCurrentDateTime();
    const memory = toUsage();

    let _CXL_MENU = madann.systemListTemp;
    _CXL_MENU = _CXL_MENU
        .replace("{BOT_NAME}", monospace(botName.toUpperCase()))
        .replace("{PREFIX}", prefix)
        .replace("{USER}", pushName)
        .replace("{MODE}", mode)
        .replace("{DATE}", date)
        .replace("{TIME}", time)
        .replace("{VERSION}", version)
        .replace("{MEMORY}", memory);

    return _CXL_MENU;
};
