const { readdir } = require("fs/promises");
const { resolve, basename } = require("path");
const { promisify } = require("util");
const chalk = require("chalk");
const download = promisify(require("download-git-repo"));
const { gitRepo } = require("../config");
const { copyFiles } = require("../utils");
const { commandSpawn } = require("../terminal");

const downloadTpl = async (project) => {
  // clone 项目
  const { exist, files } = await dirInfo(project);
  if (exist && files[0]) {
    console.log(
      `The directory ${chalk.green(
        project
      )} contains files that could conflict:`
    );
    console.log();
    for (const file of files) {
      console.log(`   ${file}`);
    }
    console.log();
    console.log(
      "Either try using a new directory name, or remove the files listed above."
    );
  } else {
    const dest = resolve(process.cwd(), project);
    console.log(`Creating a new project in ${chalk.green(dest)}`);
    /* console.log();
    console.log("Installing packages. This might take a couple of minutes...");
    console.log(); */

    /* try {
      const startTime = new Date().getTime();
      await download(gitRepo.reactAppWithWebpack.path, dest, {
        clone: true,
      });
      const endTime = new Date().getTime();
      console.log(`${chalk.green("success")} install packages`);
      console.log(`Done in ${(endTime - startTime) / 1000}s`);
    } catch (err) {
      console.log(`${chalk.red("Error:")}${err.toString().substring(6)}`);
      console.log(`Trying to copy local files...`);
      await copyLocalTpl(dest);
    } finally {
      runInstall(dest);
    } */

    try {
      await copyLocalTpl(dest);
      runInstall(dest);
    } catch (err) {
      console.log(`${chalk.red("Error:")}${err.toString().substring(6)}`);
    }
  }
};

async function dirInfo(project) {
  const destDir = process.cwd();
  const projectName = basename(project);
  const dirs = await readdir(destDir);
  const projectIndex = dirs.findIndex((dir) => dir === projectName);
  if (projectIndex > -1) {
    const files = await readdir(resolve(destDir, projectName));

    return {
      exist: true,
      files,
    };
  }

  return {
    exist: false,
    files: [],
  };
}

// 拷贝本地模板
async function copyLocalTpl(project) {
  try {
    const tplPath = resolve(__dirname, "../templates/react-webpack");
    await copyFiles(tplPath, project);
    console.log(`${chalk.green("Success!")}`);
  } catch (err) {
    console.log(`${chalk.red("Failed!")}`);
  }
}

// 执行 npm install
async function runInstall(dest) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  try {
    console.log();
    console.log(
      `${chalk.green(
        "Installing dependences. This might take a couple of minutes..."
      )}`
    );
    // 执行 npm install
    await commandSpawn(command, ["install"], { cwd: dest });

    // 执行npm run dev
    await commandSpawn(command, ["run", "dev"], { cwd: dest });
  } catch (err) {
    console.log(err);
  }
}

module.exports = downloadTpl;
