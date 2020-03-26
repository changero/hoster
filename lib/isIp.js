exports.isIp = function isIp(ip) {
    let ipok = true
    if (ip.length > 16) ipok = false
    const iparr = ip.split(".")
    if (iparr.length !== 4) ipok = false

    const isnum = iparr.every(p => Number(p) === parseInt(p) && p <= 255)
    if (!isnum) ipok = false
    if ([0, 255].includes(parseInt(iparr[3]))) ipok = false

    return ipok
}