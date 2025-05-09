#!/bin/bash

set -e

echo "🛠️ Mac Dev Starter Kit"
echo "======================="

# Check and install Xcode Command Line Tools if needed  
echo "🔍 Checking for Xcode Command Line Tools..."  
if ! xcode-select -p &>/dev/null; then  
  echo "📥 Installing Xcode Command Line Tools..."  
  xcode-select --install  
    
  # Wait for the installation to complete  
  echo "⏳ Waiting for Xcode Command Line Tools installation to complete..."  
  echo "⚠️ Please complete the installation prompt that appears."  
  echo "Press any key when the installation has completed..."  
  read -n 1  
else  
  echo "✅ Xcode Command Line Tools already installed"  
fi  
  
# Check and install Homebrew if needed  
echo "🔍 Checking for Homebrew..."  
if ! command -v brew &>/dev/null; then  
  echo "📥 Installing Homebrew..."  
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"  
    
  # Add Homebrew to PATH for the current session  
  if [[ $(uname -m) == "arm64" ]]; then  
    # For Apple Silicon Macs  
    eval "$(/opt/homebrew/bin/brew shellenv)"  
  else  
    # For Intel Macs  
    eval "$(/usr/local/bin/brew shellenv)"  
  fi  
else  
  echo "✅ Homebrew already installed"  
fi  
    
NVM_DIR="$HOME/.nvm"
REPO_URL="https://github.com/Varadarajan-M/mac-dev-starter-kit.git"
CLONE_DIR="$HOME/mac-dev-starter-kit"



# Step 1: Install NVM if missing
echo "🔍 Checking for NVM..."
echo

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "📥 Installing NVM..."
  echo
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi

# Step 2: Load NVM
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "✅ NVM loaded"
echo

# Step 3: Install latest LTS Node.js version if not already installed
echo "📦 Installing latest LTS Node.js..."
echo
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

echo

# Step 4: Remove existing clone and clone fresh
if [ -d "$CLONE_DIR" ]; then
  echo "🗑️ Removing existing repository..."
  echo
  rm -rf "$CLONE_DIR"
fi

echo "📁 Cloning project repo..."
echo
git clone "$REPO_URL" "$CLONE_DIR"
cd "$CLONE_DIR"

# Step 5: Install dependencies
echo "📦 Installing npm dependencies..."
echo
npm install

# Step 6: Run the CLI
echo "🚀 Running Mac Dev Starter Kit CLI..."
echo
npx ts-node src/index.ts