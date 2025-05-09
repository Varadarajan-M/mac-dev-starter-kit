# 🛠️ Mac Dev Starter Kit
A modern CLI tool to automate and bootstrap your macOS development environment in minutes. 
> Installs Git, Node (via NVM), code editors, terminal apps, browser tools, and more — all with one command.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Varadarajan-M/mac-dev-starter-kit)


## ⚡ Quickstart

If you already have **Homebrew** and **XCode Command Line Tools** installed, bootstrap your dev setup with:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Varadarajan-M/mac-dev-starter-kit/main/bootstrap.sh)"
```

This will:

* Install NVM and the latest **LTS** version of Node.js
* Clone the `mac-dev-starter-kit` project
* Install dependencies
* Launch the interactive CLI setup

---

## 🧱 Prerequisites

Before running the setup, make sure the following are installed on your system:

* ✅ **Xcode Command Line Tools**
  Install using:

  ```bash
  xcode-select --install
  ```

  Verify that you've successfully installed Xcode Command Line Tools:

  ```bash
  $ xcode-select -p
  ```
  You should see the following:
  ```bash  
  /Library/Developer/CommandLineTools
  ```
  
* ✅ **Homebrew**
  Install using:

  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```

---

## 🚀 Features

* 🔧 Sets up Node.js using NVM
* 🧶 Installs JS Package Managers like yarn and pnpm
* 🗂️ Installs, configures, and sets up Git with SSH keys
* 💬 Installs your preferred communication apps (Slack, Discord, Microsoft Teams, etc.)
* 🖥️ Installs your preferred code editor (VSCode, Cursor, IntelliJ, etc.)
* ✨ Installs AI tools (ChatGPT, Claude, etc.)
* 🌐 Installs browser tools (Chrome, Firefox, Brave, etc.)
* 🖥️ Installs terminal apps (Warp, iTerm2, Alacritty, etc.)
* 🎨 Installs design tools (Figma, Sketch, Zeplin, etc.)
* 📁 Installs productivity tools (Notion, Todoist, Evernote, etc.)
* 🔧 Installs backend tools (Postman, DBeaver, pgAdmin, MongoDB Compass etc.)
* ⚙️ Updates your `.zshrc` config with aliases, plugins, and productivity tweaks
* 🖥️ Installs essential macOS utilities (Loop, Rectangle, Raycast, etc.)

> ✅ Requires Homebrew to be installed beforehand.

---

## 🧰 Usage (after cloning)

If you cloned the repo manually:

```bash
npm install
npm start
```

---

## 📁 Folder Structure

```
.
├── bootstrap.sh       # Kickstarts setup for fresh systems
├── index.ts           # CLI entry point
├── scripts/           # Modular scripts (Node, Git, Editors, etc.)
│   ├── git.ts         # Git setup logic
│   ├── node.ts        # Node.js + NVM installation
│   ├── editor.ts      # Installs code editors
│   └── browser.ts     # Installs browsers
├── utils/             # Helpers (logger, OS checks, prompts, etc.)
│   ├── logger.ts
│   └── index.ts
└── README.md          # You're here 🚀
```

## 📄 License
This project is licensed under the MIT License.
