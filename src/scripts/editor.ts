import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import editorTools from '../config/editor.json';

import type { BackgroundTask } from '../types';

export default class Editor extends AbstractToolInstallationScript {
    private static readonly tools = editorTools;

    /** Public entry point */
    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing code editors...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length === 0) {
            Logger.info('🎉 All code editors are already installed.');
            return;
        }

        const selectedChoices = await this.promptCheckbox(
            'Select the code editors you want to install',
            notInstalled
        );

        for (const choice of selectedChoices) {
            const editor = notInstalled.find((e) => e.value === choice);
            if (editor) {
                backgroundTasks.push({
                    name: editor.name,
                    description: `${editor.name} Installation`,
                    getPromise: () =>
                        this.installTool(editor.installCmd, editor.name),
                });
            } else {
                Logger.warn(`⚠️ Skipping unknown editor choice: ${choice}`);
            }
        }
    }
}

