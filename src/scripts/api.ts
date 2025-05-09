import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import apiTools from '../config/api.json';

import type { BackgroundTask } from '../types';
export default class ApiClient extends AbstractToolInstallationScript {
    private static readonly tools = apiTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing API tools...');

        const notInstalled = await this.findNotInstalledTools(this.tools);
        if (notInstalled.length === 0) {
            Logger.log('No API tools to install');
            return;
        }

        const selectedApiTools = await this.promptCheckbox(
            'Select the API tools you want to install',
            notInstalled
        );

        const apiToolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedApiTools) {
            const apiTool = apiToolMap.get(tool);

            if (!apiTool) {
                Logger.error(`Invalid API tool selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${apiTool.name}`,
                description: `${apiTool.name} Installation`,
                getPromise: () =>
                    this.installTool(apiTool.installCmd, apiTool.name),
            });
        }
    }
}
