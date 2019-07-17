function main() {
    # Download list file
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/km45/linux-devenv/master/src/playbooks/roles/vscode/vars/main.yml" -OutFile "vscode_extensions.yml"

    # Construct environment
    & pipenv sync

    # Install plugins
    & pipenv run -- python install_vscode_extensions.py vscode_extensions.yml
}

main
