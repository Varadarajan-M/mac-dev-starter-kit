import Logger from '../utils/logger';
import AbstractToolInstallationScript from './base-script';
import type { BackgroundTask, InstallableItem } from '../types';

export default class ProductivityTools extends AbstractToolInstallationScript {
    private static readonly PRODUCTIVITY_TOOLS: InstallableItem[] = [
        {
            name: 'Notion',
            description:
                'Notion is an all-in-one workspace for notes, docs, tasks, and collaboration.',
            value: 'notion',
            installCmd: 'brew install --cask notion',
            checkCmd: `defaults read "/Applications/Notion.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Todoist',
            description:
                'Todoist helps you stay organized, manage tasks, and track productivity.',
            value: 'todoist',
            installCmd: 'brew install --cask todoist',
            checkCmd: `defaults read "/Applications/Todoist.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Obsidian',
            description:
                'Obsidian is a powerful knowledge base that works on top of a local folder of plain text Markdown files.',
            value: 'obsidian',
            installCmd: 'brew install --cask obsidian',
            checkCmd: `defaults read "/Applications/Obsidian.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Loop',
            description:
                'Loop is a minimal and smart window management tool for organizing your workspace with ease.',
            value: 'loop',
            installCmd: 'brew install --cask loop',
            checkCmd: `defaults read "/Applications/Loop.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Alfred',
            description:
                'Alfred is a productivity app for macOS, helping you search and launch apps faster with custom workflows.',
            value: 'alfred',
            installCmd: 'brew install --cask alfred',
            checkCmd: `defaults read "/Applications/Alfred 5.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Raycast',
            description:
                'Raycast is a blazing fast, extendable launcher that boosts your productivity.',
            value: 'raycast',
            installCmd: 'brew install --cask raycast',
            checkCmd: `defaults read "/Applications/Raycast.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Rectangle',
            description:
                'Rectangle is a window management app that lets you move and resize windows with shortcuts.',
            value: 'rectangle',
            installCmd: 'brew install --cask rectangle',
            checkCmd: `defaults read "/Applications/Rectangle.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: '1Password',
            description:
                '1Password is a secure, cross-platform password manager for individuals and teams.',
            value: '1password',
            installCmd: 'brew install --cask 1password',
            checkCmd: `defaults read "/Applications/1Password.app/Contents/Info.plist" CFBundleShortVersionString`,
        },

        {
            name: 'Evernote',
            description:
                'Evernote is a note-taking and task management app to help you stay organized.',
            value: 'evernote',
            installCmd: 'brew install --cask evernote',
            checkCmd: `defaults read "/Applications/Evernote.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
        {
            name: 'Bear',
            description:
                'Bear is a beautifully designed, markdown-based note-taking app for macOS and iOS.',
            value: 'bear',
            installCmd: 'brew install --cask bear',
            checkCmd: `defaults read "/Applications/Bear.app/Contents/Info.plist" CFBundleShortVersionString`,
        },
    ];

    public static async process(
        backgroundTasks: BackgroundTask[]
    ): Promise<void> {
        Logger.log('🔍 Checking for existing productivity tools...');

        const notInstalled = await this.findNotInstalledTools(
            this.PRODUCTIVITY_TOOLS
        );
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
