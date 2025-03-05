type ExecuteFunc = (message: any, conn: any, match: string) => Promise<void>;
type Command = {
    command: string;
    category: string;
    desc: string;
    execute: ExecuteFunc;
    on?: string;
    permission: boolean;
};

const commands: Command[] = [];
function CreatePlug({ 
    category, 
    desc, 
    execute, 
    on, 
    fromMe = false, 
    command, 
}: Omit<Command, 'permission' | 'command'> & { fromMe?: boolean, command: string | string[] }): void {
    const irismd = typeof command === 'string' ? [command] : command;
    for (const cmd of irismd) {
        const commandData: Command = { 
            command: cmd,
            category, 
            desc, 
            execute, 
            on, 
            permission: fromMe 
        };
        commands.push(commandData);
    }
}

export default { commands, CreatePlug };
