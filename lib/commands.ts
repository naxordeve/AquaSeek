type ExecuteFunction = (message: any, conn: any, match: string) => Promise<void>;
type Command = {
  command: string;
  category: string;
  desc: string;
  execute: ExecuteFunction; 
  on?: string;
};

const commands: Command[] = [];
function CreatePlug({ command, category, desc, execute, on }: Command): void {
  const commandData: Command = { command, category, desc, execute, on };
  commands.push(commandData);
}

export { commands, CreatePlug };
