const commands = [];
function CreatePlug({ command, category, desc, execute, on }) {
    const commandData = { command, category, desc, execute, on };
    commands.push(commandData);
}

module.exports = {
    commands,
    CreatePlug
};

