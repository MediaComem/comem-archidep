import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { dump as dumpYaml } from 'js-yaml';
import { join as joinPath, relative as relativePath } from 'path';

import { loadData, root, studentsFile } from './utils.js';

const targetDirs = [root, joinPath(root, 'ssh-vm')];
const targetBasename = 'data.yml';

Promise.resolve()
  .then(process)
  .catch(err => console.error(chalk.red(err.stack)));

async function process() {
  const data = await loadData();

  for (const targetDir of targetDirs) {
    const targetFile = joinPath(targetDir, targetBasename);
    await writeFile(targetFile, dumpYaml(data), 'utf8');
    console.log(
      `${chalk.yellow(relativePath(root, studentsFile))} -> ${chalk.green(
        relativePath(root, targetFile)
      )}`
    );
  }
}
