const os = require("os")
const fs = require("fs")


function getHostsPath() {
    const processPlatform = 'npm_config_platform'
    const platform = process.env[processPlatform] ||
        process.env[processPlatform.toUpperCase()] ||
        process.platform ||
        os.platform()
    switch (platform) {
        case "darwin":
        case "linux":
        case "freebsd":
        case "openbsd":
            return "/etc/hosts"
        case "win32": return "C:\\Windows\\System32\\drivers\\etc\\hosts"

        default: throw new Error("不能在" + platform + "平台运行")
    }
}
const hostsPath = getHostsPath()

module.exports.hostsPath = hostsPath

exports.getHostsContent = function getHostsContent() {
    let oldHosts = fs.readFileSync(hostsPath).toString()
    if (oldHosts.trim()) {
        oldHosts = oldHosts.split("\n")
    }
    return oldHosts
}

exports.delDomainRecord = function (line, addr) {
    if (line.includes(addr)) {
        line = line.replace(new RegExp(`,?(${addr})`), '')
    }
    return line
}