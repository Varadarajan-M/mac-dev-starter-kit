import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import aiTools from '../config/ai.json';

import type { BackgroundTask } from '../types';

export default class AITools extends AbstractToolInstallationScript {
    private static readonly tools = aiTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing AI tools...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.log('No AI tools to install');
            return;
        }

        const selectedAItools = await this.promptCheckbox(
            'Select the AI tools you want to install',
            notInstalled
        );

        const toolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const aiTool of selectedAItools) {
            const tool = toolMap.get(aiTool);

            if (!tool) {
                Logger.error(`Invalid AI tool selected: ${aiTool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${tool.name}`,
                description: `${tool.name} Installation`,
                getPromise: () => this.installTool(tool.installCmd, tool.name),
            });
        }
    }
}
