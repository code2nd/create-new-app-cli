const chalk = require("chalk");
const { Command } = require("commander");
const createCommands = require("./create");

const pkg = require("../package.json");

const init = () => {
  const program = new Command(pkg.name)
    .version(pkg.version)
    .arguments("<project>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .allowUnknownOption()
    .on("--help", () => {
      console.log(`Only ${chalk.green("<project-directory>")} is required.`);
    });

  // 创建指令
  createCommands(program);

  program.parse(process.argv);
};

module.exports = {
  init,
};
