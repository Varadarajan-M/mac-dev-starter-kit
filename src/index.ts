import Logger from "./utils/logger";
import { isMacOs } from "./utils";

import Homebrew from "./scripts/homebrew";
import NodeRuntime from "./scripts/node";
import Zshrc from "./scripts/zshrc";
import Git from "./scripts/git";
import Editor from "./scripts/editor";
import Browser from "./scripts/browser";
import Terminal from "./scripts/terminal";
import Communication from "./scripts/communication";
import JsPackageManager from "./scripts/js-package-manager";

import checkbox from "@inquirer/checkbox";

import type { BackgroundTask } from "./types";

export default class Setup {
  private static backgroundTasks: BackgroundTask[] = [];

  private static async promptStepsToRun(): Promise<string[]> {
    const setupSteps = await checkbox({
      message: "🔧 Select the setup steps you want to run:",
      choices: [
        {
          name: "🍺 Check Homebrew",
          value: "homebrew",
          description: "\n🔍 Verify if Homebrew is installed on your system.",
        },
        {
          name: "🟢 Check Node.js",
          value: "node",
          description: "\n🔍 Verify if Node.js and npm are installed.",
        },
        {
          name: "🔐 Setup Git and Configure SSH Key",
          value: "git",
          description:
            "\n🛠️ Install Git, configure Git user, and generate an SSH key.",
        },
        {
          name: "⚡ Terminal Productivity Shortcuts",
          value: "zshrc",
          description:
            "\n🚀 Add aliases, plugins, and shortcuts via an optimized .zshrc.",
        },
        {
          name: "🌐 Install Browsers",
          value: "browsers",
          description: "\n🌍 Install Chrome, Firefox, Brave, and more.",
        },
        {
          name: "🔍 Install JavaScript Package Managers",
          value: "js-package-manager",
          description:
            "\n🔍 Install JavaScript package managers like yarn and pnpm. (Optional) npm is already installed.",
        },
        {
          name: "🖥️  Install Terminals",
          value: "terminals",
          description:
            "\n💻 Install terminal apps like Warp, Alacritty, iTerm2, etc.",
        },
        {
          name: "📝 Install Code Editors",
          value: "editors",
          description:
            "\n🧠 Choose from editors like VS Code, Cursor, IntelliJ, and more.",
        },
        {
          name: "💬 Install Communication Apps",
          value: "communication",
          description:
            "\n💬 Install communication apps like Slack, Discord, Microsoft Teams, and more.",
        },
      ],
      pageSize: 20,
    });

    return setupSteps;
  }

  private static async runBackgroundTasks(): Promise<void> {
    console.log("\n\n");
    Logger.log("🔍 Running the following tasks...");
    this.backgroundTasks.forEach((task, index) => {
      Logger.info(`${index + 1}. ${task.description}`);
    });
    const promises = this.backgroundTasks.map((task) => task.getPromise());
    const results = await Promise.allSettled(promises);

    console.log("\n\n");
    const success = results.filter((result) => result.status === "fulfilled");
    const failed = results.filter((result) => result.status === "rejected");

    if (success.length > 0) {
      Logger.log(`✅ ${success.length} tasks completed.`);
    }

    if (failed.length > 0) {
      Logger.log(`❌ ${failed.length} tasks failed.`);
    }

    process.exit(0);
  }

  public static async process(): Promise<void> {
    Logger.info("🔍 Checking OS…");
    if (!isMacOs) {
      Logger.error("❌ This script only runs on macOS.");
      return;
    }
    Logger.info("✅ macOS detected.\n");

    Logger.log("🚀 Starting Mac setup…");

    const setupSteps = await this.promptStepsToRun();

    for (const step of setupSteps) {
      switch (step) {
        case "homebrew":
          await Homebrew.process();
          break;
        case "node":
          await NodeRuntime.process();
          break;
        case "git":
          await Git.process(); // Should be run sequentially
          break;
        case "zshrc":
          await Zshrc.process(); // Should be run sequentially
          break;
        case "js-package-manager":
          await JsPackageManager.process(this.backgroundTasks);
          break;
        case "browsers":
          await Browser.process(this.backgroundTasks);
          break;
        case "terminals":
          await Terminal.process(this.backgroundTasks);
          break;
        case "editors":
          await Editor.process(this.backgroundTasks);
          break;
        case "communication":
          await Communication.process(this.backgroundTasks);
          break;
        default:
          Logger.warn(`No action for step: ${step}`);
          break;
      }
    }

    console.log("\n\n\n");

    Logger.log(
      "🛠️ Alright we've collected all the stuff you need, let's install them..."
    );
    // After all steps are executed, run background tasks
    await this.runBackgroundTasks();

    Logger.log("\n🎉 Setup complete!");
  }
}

Setup.process().catch((err) => {
  Logger.error("Unhandled error during setup:", err);
  process.exit(0);
});
