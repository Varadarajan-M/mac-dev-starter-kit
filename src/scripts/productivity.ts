import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import productivityTools from '../config/productivity.json';

import type { BackgroundTask } from '../types';

export default class ProductivityTools extends AbstractToolInstallationScript {
    private static readonly tools = productivityTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing productivity tools...');

        const notInstalled = await this.findNotInstalledTools(this.tools);
        if (notInstalled.length === 0) {
            Logger.log('No productivity tools to install');
            return;
        }

        const selectedProductivityTools = await this.promptCheckbox(
            'Select the productivity tools you want to install',
            notInstalled
        );

        const productivityToolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedProductivityTools) {
            const productivityTool = productivityToolMap.get(tool);

            if (!productivityTool) {
                Logger.error(`Invalid productivity tool selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${productivityTool.name}`,
                description: `${productivityTool.name} Installation`,
                getPromise: () =>
                    this.installTool(
                        productivityTool.installCmd,
                        productivityTool.name
                    ),
            });
        }
    }
}
