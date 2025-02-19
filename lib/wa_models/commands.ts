type ExecuteFunc = (message: any, conn: any, match: string) => Promise<void>;
type Command = {
  command: string;
  category: string;
  desc: string;
  execute: ExecuteFunc; 
  on?: string;
};

const commands: Command[] = [];
function CreatePlug({ command, category, desc, execute, on }: Command): void {
  const commandData: Command = { command, category, desc, execute, on };
  commands.push(commandData);
}

export default { commands, CreatePlug };
