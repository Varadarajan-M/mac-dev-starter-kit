import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import browserTools from '../config/browser.json';
import type { BackgroundTask } from '../types';

export default class Browser extends AbstractToolInstallationScript {
    private static readonly tools = browserTools;

    /** Main entry point */
    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking installed browsers...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All browsers are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the browsers you want to install',
            notInstalled
        );

        const browserMap = new Map(notInstalled.map((b) => [b.value, b]));

        for (const choice of selectedChoices) {
            const browser = browserMap.get(choice);
            if (browser) {
                backgroundTasks.push({
                    name: browser.name,
                    description: `${browser.name} Installation`,
                    getPromise: () =>
                        this.installTool(browser.installCmd, browser.name),
                });
            } else Logger.warn(`⚠️ Skipping unknown browser choice: ${choice}`);
        }
    }
}
