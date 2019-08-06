# Install packages with scoop

## Install and setup scoop

1. Install [scoop]
1. Add bucket extras

```cmd
scoop bucket add extras
```

[scoop]: https://github.com/lukesampson/scoop

## Install packages

1. Install `git-with-openssh` and configure `git`
1. Install `aria2`
1. Install other packages

```cmd
scoop install git-with-openssh
git config --global core.autocrlf false
scoop install aria2
scoop install consolez jq libreoffice-fresh msys2 python vagrant vscode-portable winmerge
```

## Update scoop and packages

1. Update scoop itself and buckets
1. Update packages

```cmd
scoop update
scoop update *
```
