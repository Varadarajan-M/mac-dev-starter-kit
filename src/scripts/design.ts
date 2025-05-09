import Logger from "../utils/logger";
import AbstractToolInstallationScript from "./base-script";
import designTools from "../config/design.json";

import type { BackgroundTask } from "../types";

export default class Design extends AbstractToolInstallationScript {
    private static readonly tools = designTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing design tools...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.log('No design tools to install');
            return;
        }

        const selectedDesignTools = await this.promptCheckbox(
            'Select the design tools you want to install',
            notInstalled
        );

        const designToolMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedDesignTools) {
            const designTool = designToolMap.get(tool);

            if (!designTool) {
                Logger.error(`Invalid design tool selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${designTool.name}`,
                description: `${designTool.name} Installation`,
                getPromise: () => this.installTool(designTool.installCmd, designTool.name),
            });
        }
    }
}