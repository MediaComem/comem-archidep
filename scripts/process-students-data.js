const chalk = require('chalk');
const { writeFile } = require('fs-extra');
const { dump: dumpYaml } = require('js-yaml');
const { join: joinPath, relative: relativePath } = require('path');

const { loadData, root, studentsFile } = require('./utils');

const targetDirs = [ root, joinPath(root, 'ssh') ];
const targetBasename = 'data.yml';

Promise
  .resolve()
  .then(process)
  .catch(err => console.error(chalk.red(err.stack)));

async function process() {

  const data = await loadData();

  for (const targetDir of targetDirs) {
    const targetFile = joinPath(targetDir, targetBasename);
    await writeFile(targetFile, dumpYaml(data), 'utf8');
    console.log(`${chalk.yellow(relativePath(root, studentsFile))} -> ${chalk.green(relativePath(root, targetFile))}`);
  }
}
