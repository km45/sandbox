@echo off

:Main
setlocal
    set WORKDIR=%~dp0
    cd /d %WORKDIR%

    call :DownloadFile %WORKDIR% "https://raw.githubusercontent.com/km45/linux-devenv/master/src/playbooks/roles/vscode/vars/main.yml" "vscode_extensions.yml"

    pipenv sync
    pipenv run -- python install_vscode_extensions.py vscode_extensions.yml

    exit /b
endlocal

:DownloadFile
setlocal
    set WORKDIR=%1
    set REMOTE_URL=%2
    set LOCAL_FILE=%~3

    set LOCAL_NAME=%WORKDIR%%LOCAL_FILE%

    bitsadmin /transfer "DownloadFile" %REMOTE_URL% %LOCAL_NAME%

    exit /b
endlocal
