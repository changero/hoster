const fs = require("fs")

const { isIp } = require("./isIp")
const { hostsPath, getHostsContent, delDomainRecord } = require("./getHost")



/**
 * 
 * @param {*} oldHosts 
 * @param {*} ipobj 
 * @param {*} flag 添加还是删除
 */
const getNewHosts = function getNewHosts(ipobj, flag) {
    const oldHosts = getHostsContent()
    const ips = Object.keys(ipobj).filter(isIp)
    const ipSet = new Set(ips)
    const hosts = []
    if (ipSet.size > 0) {
        for (let line of oldHosts) {
            if (line) {
                const isAnnotation = line.match(/(\s+)?#/)
                for (const ip of ipSet.values()) {
                    if (line.includes(ip)) {
                        // 注释行
                        if (isAnnotation && flag) {
                            line = line.replace("#", '')
                        }
                        ipobj[ip].forEach(addr => {
                            if (flag) {
                                // 需要设置但没有记录
                                if (!line.includes(addr)) {
                                    line = line + ',' + addr
                                }
                            } else {
                                // 删除域名记录
                                line = delDomainRecord(line, addr)
                            }

                        })
                        // 防止地址前面的错误逗号
                        line = line.replace(new RegExp(`(${ip}\\s+),`), "$1")
                        ipSet.delete(ip)
                        break
                    } else if (flag) {
                        // 在设置的记录的情况下，删除掉某个域名以前的hosts记录
                        ipobj[ip].forEach(addr => {
                            line = delDomainRecord(line, addr)
                        })
                    }
                }
            }
            // 所有域名被删除的行不再被添加
            if (line && !isIp(line.trim())) {
                hosts.push(line)
            }
        }
        if (flag && ipSet.size > 0) {
            // 还有没有被设置的ip
            for (const ip of ipSet.values()) {
                hosts.push(`${ip}   ${ipobj[ip].join(',')}`)
            }
        }
        return hosts
    }
    return oldHosts
}

exports.update = function update(ipObj, flag = true, callback) {
    if (flag && typeof flag === 'function') {
        callback = flag
        flag = true
    }
    const newHosts = getNewHosts(ipObj, flag)
    fs.writeFile(hostsPath, newHosts.join('\n') + "\n", 'utf-8', function (err) {
        if (err) {
            throw err
        } else if (typeof callback === 'function') {
            callback()
        }
    })
}