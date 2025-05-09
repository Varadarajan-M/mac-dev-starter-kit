import Logger from './utils/logger';
import { isMacOs } from './utils';
import {
    AbstractToolInstallationScript,
    Homebrew,
    NodeRuntime,
    Git,
    Zshrc,
    JsPackageManager,
    Browser,
    Terminal,
    Communication,
    Editor,
    Design,
    ApiClient,
    DatabaseClient,
    ProductivityTools,
    AITools,
    Java,
} from './scripts';
import setup from './config/setup.json';


import type { BackgroundTask } from './types';

export default class Setup extends AbstractToolInstallationScript {
    private static backgroundTasks: BackgroundTask[] = [];

    private static readonly SETUP_STEPS = setup;

    private static async runBackgroundTasks(): Promise<void> {
        Logger.log('🔍 Running the following tasks...');
        this.backgroundTasks.forEach((task, index) => {
            Logger.info(`${index + 1}. ${task.description}`);
        });
        const promises = this.backgroundTasks.map((task) => task.getPromise());
        const results = await Promise.allSettled(promises);

        const success = results.filter(
            (result) => result.status === 'fulfilled'
        );
        const failed = results.filter((result) => result.status === 'rejected');

        if (success.length > 0) {
            Logger.log(`✅ ${success.length} tasks completed.`);
        }

        if (failed.length > 0) {
            Logger.log(`❌ ${failed.length} tasks failed.`);
        }
    }

    public static async process(): Promise<void> {
        Logger.info('🔍 Checking OS…');
        if (!isMacOs) {
            Logger.error('❌ This script only runs on macOS.');
            return;
        }
        Logger.info('✅ macOS detected.\n');

        Logger.log('🚀 Starting Mac setup…');

        const setupSteps = await this.promptCheckbox(
            'Select the steps you want to run',
            this.SETUP_STEPS
        );

        for (const step of setupSteps) {
            switch (step) {
                case 'homebrew':
                    await Homebrew.process();
                    break;
                case 'node':
                    await NodeRuntime.process();
                    break;
                case 'git':
                    await Git.process(); // Should be run sequentially
                    break;
                case 'zshrc':
                    await Zshrc.process(); // Should be run sequentially
                    break;
                case 'js-package-manager':
                    await JsPackageManager.process(this.backgroundTasks);
                    break;
                case 'browsers':
                    await Browser.process(this.backgroundTasks);
                    break;
                case 'terminals':
                    await Terminal.process(this.backgroundTasks);
                    break;
                case 'editors':
                    await Editor.process(this.backgroundTasks);
                    break;
                case 'communication':
                    await Communication.process(this.backgroundTasks);
                    break;
                case 'design':
                    await Design.process(this.backgroundTasks);
                    break;
                case 'api-clients':
                    await ApiClient.process(this.backgroundTasks);
                    break;
                case 'database-clients':
                    await DatabaseClient.process(this.backgroundTasks);
                    break;
                case 'productivity':
                    await ProductivityTools.process(this.backgroundTasks);
                    break;
                case 'ai':
                    await AITools.process(this.backgroundTasks);
                    break;
                case 'java':
                    await Java.process(this.backgroundTasks);
                    break;
                default:
                    Logger.warn(`No action for step: ${step}`);
                    break;
            }
        }

        console.log('\n');

        Logger.log(
            "🛠️ \tAlright! we've collected all the stuff you need, let's install them..."
        );
        // After all steps are executed, run background tasks
        await this.runBackgroundTasks();

        Logger.log('\n🎉 Setup complete!');

        Logger.log(
            '👋 Thanks for using the cli, if you like it, please give me a star on github!'
        );

        Logger.info(
            '👨🏻‍💻 Repository: https://github.com/Varadarajan-M/mac-dev-starter-kit'
        );
        process.exit(0);
    }
}

Setup.process().catch((err) => {
    Logger.error('Something went wrong during setup:', err?.message);
    process.exit(0);
});
