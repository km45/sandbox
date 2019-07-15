function main() {
    # Download script
    Invoke-WebRequest -Uri "https://gist.githubusercontent.com/km45/eea6c905a8f025cad1cdb37dd292568e/raw/b0120722200b701af2ce0f40ce4d1f7d8edf841f/install_vscode_plugins.sh" -OutFile "install_vscode_plugins.sh"

    # Run script
    & "${env:USERPROFILE}/scoop/apps/git-with-openssh/current/bin/bash.exe" install_vscode_plugins.sh
}

main
