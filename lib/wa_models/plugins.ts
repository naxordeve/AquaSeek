import * as fs from 'fs';
import * as path from 'path';

async function getPlugins(): Promise<string[]> {
    const commands: string[] = [];
    const dir: string = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    console.log('Loading plugins...');
    fs.readdirSync(dir)
        .filter((f) => f.endsWith('.js'))
        .forEach((file) => {
            try {
                import(path.join(dir, file)); 
                commands.push(file);
            } catch (err) {
                console.error(`${file}: ${(err as Error).message}`);
            }
        });

    console.log(`Plugins loaded ✅\nTotal Plugins: ${commands.length}`);
    return commands;
}

export default { getPlugins };
