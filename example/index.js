const updateHosts = require("../index")
const config = require("./config")
const exec = require("child_process").exec

const set = process.argv[2] === 'set'
// set IP
updateHosts(config, set, () => {
    console.log("操作成功")
})
