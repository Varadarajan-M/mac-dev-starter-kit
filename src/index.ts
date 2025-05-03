import Logger from './utils/logger';
import { isMacOs } from './utils';

import Git from './scripts/git';
import Zshrc from './scripts/zshrc';
import Editor from './scripts/editor';
import Design from './scripts/design';
import Browser from './scripts/browser';
import NodeRuntime from './scripts/node';
import Homebrew from './scripts/homebrew';
import Terminal from './scripts/terminal';
import Communication from './scripts/communication';
import JsPackageManager from './scripts/js-package-manager';
import AbstractToolInstallationScript from './scripts/base-script';
import ApiClient from './scripts/api';

import type { BackgroundTask } from './types';
import DatabaseClient from './scripts/database';
import ProductivityTools from './scripts/productivity';
import AITools from './scripts/ai';

export default class Setup extends AbstractToolInstallationScript {
    private static backgroundTasks: BackgroundTask[] = [];

    private static readonly SETUP_STEPS = [
        {
            name: '🍺 Check Homebrew',
            value: 'homebrew',
            description: '\n🔍 Verify if Homebrew is installed on your system.',
        },
        {
            name: '🟢 Check Node.js',
            value: 'node',
            description: '\n🔍 Verify if Node.js and npm are installed.',
        },
        {
            name: '🔐 Setup Git and Configure SSH Key',
            value: 'git',
            description:
                '\n🛠️ Install Git, configure Git user, and generate an SSH key.',
        },
        {
            name: '⚡ Terminal Productivity Shortcuts',
            value: 'zshrc',
            description:
                '\n🚀 Add aliases, plugins, and shortcuts via an optimized .zshrc.',
        },
        {
            name: '🌐 Install Browsers',
            value: 'browsers',
            description: '\n🌍 Install Chrome, Firefox, Brave, and more.',
        },
        {
            name: '📝 Install Code Editors',
            value: 'editors',
            description:
                '\n🧠 Choose from editors like VS Code, Cursor, IntelliJ, and more.',
        },
        {
            name: '🖥️  Install AI Tools',
            value: 'ai',
            description:
                '\n🧠 Choose from AI tools like ChatGPT, Claude, etc.',
        },
        {
            name: '🖥️  Install Terminals',
            value: 'terminals',
            description:
                '\n💻 Install terminal apps like Warp, Alacritty, iTerm2, etc.',
        },
        {
            name: '💬 Install Communication Apps',
            value: 'communication',
            description:
                '\n💬 Install communication apps like Slack, Discord, Microsoft Teams, and more.',
        },
        {
            name: '📂 Install Productivity & Workspace Tools',
            value: 'productivity',
            description:
                '\n📋 Install tools like Notion, Obsidian, Todoist, Loop, Raycast, and others that boost daily productivity.',
        },
        {
            name: '🎨 Install Design Tools',
            value: 'design',
            description:
                '\n🎨 Install design tools like Figma, Sketch, and more.',
        },
        {
            name: '🛠️ Install Backend & API Tools',
            value: 'api-clients',
            description:
                '\n🧪 Install tools like Postman, Insomnia, and HTTPie for API testing and backend workflows.',
        },
        {
            name: '🗄️ Install Database Clients',
            value: 'database-clients',
            description:
                '\n🗃️ Install database tools like DBeaver, pgAdmin, TablePlus, MongoDB Compass, and more.',
        },
        {
            name: '🔍 Install JavaScript Package Managers',
            value: 'js-package-manager',
            description:
                '\n🔍 Install JavaScript package managers like yarn and pnpm. (Optional) npm is already installed.',
        },
    ];

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
    Logger.error('Unhandled error during setup:', err);
    process.exit(0);
});
