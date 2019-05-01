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
# Add buckets
# -----------------------------------------------------------------------------
scoop bucket add extras

# -----------------------------------------------------------------------------
# Update packages
# -----------------------------------------------------------------------------
LOGI("Update packages")
scoop update *

# -----------------------------------------------------------------------------
# Install packages
# -----------------------------------------------------------------------------
function IsInstalled($package) {
    return (scoop list 6>&1 | Select-String -SimpleMatch -Quiet $package)
}

$packages = @(
    'consolez',
    'git-with-openssh',
    'jq',
    'python',
    'vagrant',
    'winmerge'
)

foreach ($package in $packages) {
    $installed = IsInstalled($package)

    if ($installed) {
        LOGD("Already installed $package")
    }
    else {
        LOGI("Install $package")
        scoop install $package
    }
}

# -----------------------------------------------------------------------------
# Post processes
# -----------------------------------------------------------------------------
git config --global core.autocrlf false
LOGI("You need apply ssh config if newly install or update git.")
