function LOGD($message) {
    Write-Output("[debug] $message")
}
function LOGI($message) {
    Write-Output("[info] $message")
}

# -----------------------------------------------------------------------------
# Install / Update scoop
# -----------------------------------------------------------------------------
if (Get-Command scoop -ErrorAction SilentlyContinue) {
    LOGI("Scoop is already installed, so try updating.")
    scoop update
}
else {
    # Run below command if needed:
    # `set-executionpolicy remotesigned -s currentuser`.
    LOGI("Scoop is not installed, so install it.")
    Invoke-Expression (New-Object Net.WebClient).DownloadString('https://get.scoop.sh')
}

# -----------------------------------------------------------------------------
# Install packages
# -----------------------------------------------------------------------------
$packages = @(
    'git-with-openssh',
    'jq',
    'python',
    'vagrant'
)
foreach ($package in $packages) {
    LOGD("Check whether $package is already installed or not.")
    $installed = (scoop list 6>&1 | Select-String -SimpleMatch -Quiet $package)
    LOGD("--> $installed")

    if ($installed) {
        echo "Update $package"
        scoop update $package
    }
    else {
        echo "Install $package"
        scoop install $package
    }
}

# -----------------------------------------------------------------------------
# Post processes
# -----------------------------------------------------------------------------
git config --global core.autocrlf false
LOGI("You need apply ssh config if newly install or update git.")
