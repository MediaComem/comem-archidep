import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { dump as dumpYaml } from 'js-yaml';
import { join as joinPath, relative as relativePath } from 'path';

import {
  executeScript,
  loadConfigProperty,
  loadData,
  loading,
  root,
  studentsFile
} from './utils.js';

const inventoryFile = joinPath(root, 'azure', 'inventory');
const sshPrivateKeyFile = joinPath(root, 'id_rsa');

executeScript(generateInventory);

async function generateInventory() {
  const { students } = await loading(
    loadData(),
    `Loading student data from ${chalk.yellow(
      relativePath(root, studentsFile)
    )}`
  );

  const baseDomain = await loadConfigProperty('vm_base_domain');

  const inventory = {
    all: {
      hosts: students.reduce((memo, student) => {
        if (!student.ip) {
          return memo;
        }

        memo[student.defaultUsername] = {
          ansible_become: true,
          ansible_host: student.ip,
          ansible_ssh_private_key_file: sshPrivateKeyFile,
          ansible_user: student.ansibleUser ?? student.username,
          base_domain: baseDomain,
          student_email: student.email,
          student_name: student.name,
          student_password: student.password,
          student_username: student.username
        };

        return memo;
      }, {}),
      vars: {
        course_ssh_public_key: sshPublicKey
      }
    }
  };

  if (inventory.all.hosts.length === 0) {
    throw new Error('No IP address configured for any student');
  }

  await loading(
    writeFile(inventoryFile, `# vi: ft=yml\n${dumpYaml(inventory)}`, 'utf8'),
    `Saving inventory to ${chalk.green(relativePath(root, inventoryFile))}`
  );

  console.warn();
}
