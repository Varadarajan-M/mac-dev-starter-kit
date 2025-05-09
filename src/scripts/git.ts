import Logger from '../utils/logger';
import input from '@inquirer/input';
import AbstractToolInstallationScript from './base-script';
import gitTools from '../config/git.json';

export default class Git extends AbstractToolInstallationScript {

    private static readonly tools = gitTools;

    /** Configures Git username and email */
    private static async configureGit(): Promise<string> {
        Logger.log('🔧 Configuring Git username and email...');

        const name = await input({
            message: 'Enter your Git username:',
            validate: (v) =>
                v?.trim()?.length > 2 ||
                'Name must be at least 3 characters long',
        });

        const email = await input({
            message: 'Enter your Git email:',
            validate: (v) =>
                (v?.trim()?.length > 0 && v.includes('@')) ||
                'Invalid email address',
        });

        await this.runCommand(`git config --global user.name "${name}"`, true);
        await this.runCommand(
            `git config --global user.email "${email}"`,
            true
        );

        Logger.log('✅ Git configuration complete');
        return email;
    }

    /** Configures SSH key for GitHub */
    private static async configureSSH(email: string): Promise<void> {
        Logger.log('🔧 Setting up SSH for GitHub...');

        const fileName = `id_ed25519_${email.replace(
            /[^a-zA-Z0-9]/g,
            '_'
        )}_${Date.now()}`;
        const sshPath = `~/.ssh/${fileName}`;

        await this.runCommand(
            `ssh-keygen -t ed25519 -C "${email}" -f ${sshPath} -N ""`,
            true
        );

        const publicKey = await this.runCommand(`cat ${sshPath}.pub`);
        if (publicKey) {
            Logger.info(
                '📝 Copy the following SSH key and paste it into your GitHub account:'
            );
            Logger.msg(publicKey);
        }

        await this.runCommand(`eval "$(ssh-agent -s)"`, true);
        await this.runCommand(`ssh-add ${sshPath}`, true);

        Logger.log('✅ SSH configuration complete');
    }

    /** Main orchestrator */
    public static async process(): Promise<void> {
        Logger.log('🔧 Starting Git setup...');

        const notInstalled = await this.findNotInstalledTools(this.tools);

        if (notInstalled.length > 0) {
            Logger.warn('🚫 Git is not installed.');
            await this.installTool(
                notInstalled[0].installCmd,
                notInstalled[0].name
            );
        }

        const shouldConfigureGit = await this.promptConfirm(
            'Do you want to configure Git?'
        );

        let email: string | null = null;

        if (shouldConfigureGit) email = await this.configureGit();
        else Logger.log('ℹ️ Skipping Git configuration.');

        if (email) {
            const shouldConfigureSSH = await this.promptConfirm(
                'Do you want to configure Git SSH?'
            );
            if (shouldConfigureSSH) await this.configureSSH(email);
            else Logger.log('ℹ️ Skipping SSH configuration.');
        }

        Logger.log('🎉 Git setup complete!');
    }
}
