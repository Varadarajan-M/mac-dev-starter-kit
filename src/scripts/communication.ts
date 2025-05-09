import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import communicationTools from '../config/communication.json';

import type { BackgroundTask } from '../types';

export default class Communication extends AbstractToolInstallationScript {
    private static readonly tools = communicationTools;

    public static async process(backgroundTasks: BackgroundTask[]) {
        Logger.info('💬 Installing communication apps...');

        const appsForInstallation = await this.findNotInstalledTools(this.tools);

        if (appsForInstallation.length === 0) {
            Logger.log(
                '✅ All available communication apps are already installed.'
            );
            return;
        }

        const selected = await this.promptCheckbox(
            'Select the communication apps you want to install',
            appsForInstallation
        );

        const appMap = new Map(
            appsForInstallation.map((app) => [app.value, app])
        );

        for (const appValue of selected) {
            const app = appMap.get(appValue);
            if (!app) {
                Logger.error(`Invalid app selected: ${appValue}`);
                continue;
            }
            backgroundTasks.push({
                name: app.name,
                description: `${app.name} Installation`,
                getPromise: () =>
                    this.installTool(app.installCmd, app.name),
            });
        }
    }
}
