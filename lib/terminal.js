/**
 * 执行终端命令相关的代码
 */

const { spawn } = require("child_process");

const commandSpawn = (...args) => {
  return new Promise((resolve, reject) => {
    // 原来的进程执行代码
    // 新开一个子进程用于执行其他操作例如：npm install
    const childProcess = spawn(...args);
    childProcess.stdout.pipe(process.stdout); // 将子进程中的输出内容推到主进程中
    childProcess.stderr.pipe(process.stderr); // 将子进程中的错误信息推到主进程中
    childProcess.on("close", () => {
      // 监听关闭事件
      // 子进程执行完毕 或者 报错
      resolve();
    });
  });
};

module.exports = {
  commandSpawn,
};
