import Logger from '../utils/logger';
import { execAsync } from '../utils';
import AbstractToolInstallationScript from './base-script';
import javaTools from '../config/java.json';

import type { BackgroundTask } from '../types';

export default class Java extends AbstractToolInstallationScript {
    private static readonly JAVA_VERSION = '17';
    private static readonly tools = javaTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for Java tools installation...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.log('🔍 No Java tools to install');
            return;
        }

        const selectedJavaTools = await this.promptCheckbox(
            'Select the Java tools you want to install',
            notInstalled
        );

        const toolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const javaTool of selectedJavaTools) {
            const tool = toolMap.get(javaTool);

            if (!tool) {
                Logger.error(`Invalid Java tool selected: ${javaTool}`);
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
