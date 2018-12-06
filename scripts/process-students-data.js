const chalk = require('chalk');
const { writeFile } = require('fs-extra');
const { safeDump: dumpYaml } = require('js-yaml');
const { join: joinPath } = require('path');

const { loadData, studentsFile, unixEncryptPassword } = require('./utils');

const targetDirs = [ '.', 'ssh' ];

Promise
  .resolve()
  .then(process)
  .catch(err => console.error(chalk.red(err.stack)));

async function process() {

  const data = await loadData();

  for (const targetDir of targetDirs) {
    const targetFile = joinPath(targetDir, 'data.yml');
    await writeFile(targetFile, dumpYaml(data), 'utf8');
    console.log(`${chalk.yellow(studentsFile)} -> ${chalk.green(targetFile)}`);
  }
}
