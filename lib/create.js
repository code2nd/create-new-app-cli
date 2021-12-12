const { downloadTpl, updateCheck } = require("./actions");

const createCommands = (program) => {
  // 检查更新 update
  program
    .command("upgrade")
    .description("Check the cli-for-react version")
    .action(updateCheck);

  // 创建项目
  program
    .command("create <project> [options]")
    .description("clone a repository into a folder")
    .action(downloadTpl);
};

module.exports = createCommands;
