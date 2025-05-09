import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import databaseTools from '../config/database.json';

import type { BackgroundTask } from '../types';

export default class DatabaseClient extends AbstractToolInstallationScript {
    private static readonly tools = databaseTools;

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing database clients...');

        const notInstalled = await this.findNotInstalledTools(this.tools);
        if (notInstalled.length === 0) {
            Logger.log('No database clients to install');
            return;
        }

        const selectedDatabaseClients = await this.promptCheckbox(
            'Select the database clients you want to install',
            notInstalled
        );

        const databaseClientMap = new Map(
            notInstalled.map((tool) => [tool.value, tool])
        );

        for (const tool of selectedDatabaseClients) {
            const databaseClient = databaseClientMap.get(tool);

            if (!databaseClient) {
                Logger.error(`Invalid database client selected: ${tool}`);
                continue;
            }

            backgroundTasks.push({
                name: `Installing ${databaseClient.name}`,
                description: `${databaseClient.name} Installation`,
                getPromise: () =>
                    this.installTool(
                        databaseClient.installCmd,
                        databaseClient.name
                    ),
            });
        }
    }
}
