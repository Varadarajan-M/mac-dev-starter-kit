import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import terminalTools from '../config/terminal.json';
import type { BackgroundTask } from '../types';

export default class Terminal extends AbstractToolInstallationScript {
    private static readonly tools = terminalTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All terminals are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the terminals you want to install',
            notInstalled
        );

        for (const choice of selectedChoices) {
            const terminal = notInstalled.find((t) => t.value === choice);
            if (terminal) {
                backgroundTasks.push({
                    name: terminal.name,
                    description: `${terminal.name} Installation`,
                    getPromise: () =>
                        this.installTool(terminal.installCmd, terminal.name),
                });
            } else
                Logger.warn(`⚠️ Skipping unknown terminal choice: ${choice}`);
        }
    }
}
