import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import chalk from 'chalk';
import { createHmac } from 'crypto';
import { parse as parseCsvNode } from 'csv-parse';
import { readFile as readFileNative } from 'fs/promises';
import inquirer from 'inquirer';
import { load as loadYaml } from 'js-yaml';
import isFunction from 'lodash/isFunction.js';
import mapValues from 'lodash/mapValues.js';
import { dirname, join as joinPath, resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';

let dataCache;
let processedDataCache;

const contentCache = {};
const fileCache = {};
const processedDataFile = 'data.yml';

export const root = resolvePath(
  joinPath(dirname(fileURLToPath(import.meta.url)), '..')
);
export const configFile = joinPath(root, 'config.yml');
export const secretFile = 'secret.txt';
export const studentsFile = joinPath(root, 'students.csv');

const awsSesPromise = loadSesClient();

export async function confirm(message) {
  const answers = await inquirer.prompt([
    {
      name: 'result',
      type: 'confirm',
      message
    }
  ]);

  return answers.result;
}

export function executeScript(func) {
  Promise.resolve()
    .then(func)
    .catch(err => {
      console.error(chalk.red(err.stack));
      process.exit(1);
    });
}

export async function loadConfigProperty(name) {
  const config = await loadConfig();
  if (!config[name]) {
    throw new Error(`Missing property "${name}" in config file ${configFile}`);
  }

  return config[name];
}

export async function loadData() {
  if (!dataCache) {
    let secret;
    try {
      secret = (await readFileNative(secretFile, 'utf8')).trim();
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Secret file "${secretFile}" not found; read SETUP.md`);
      } else {
        throw err;
      }
    }

    const students = await parseCsv(
      await readFileNative(studentsFile, 'utf8'),
      {
        columns: [
          'class',
          'name',
          'email',
          'ip',
          'username',
          'ansibleUser',
          'comment'
        ],
        from: 2
      }
    );

    const passwords = [];
    const usernames = new Map();

    for (const student of students) {
      student.defaultUsername = getDefaultStudentUsername(student);
      if (!student.username) {
        student.username = student.defaultUsername;
      }

      if (usernames.has(student.username)) {
        throw new Error(
          `Username ${JSON.stringify(
            student.username
          )} for email ${JSON.stringify(
            student.email
          )} is the same as for email ${JSON.stringify(
            usernames.get(student.username).email
          )}`
        );
      } else {
        usernames.set(student.username, student);
      }

      // The goal is not to generate a secure password, or to have a good
      // quality random distribution, but just to set an initial password for
      // each student that looks random and is different from the others.
      student.password = createHmac('sha1', secret)
        .update(student.username)
        .digest('hex')
        .slice(0, 10);

      const i = passwords.indexOf(student.password);
      if (i >= 0) {
        throw new Error(
          `Generated password for student ${student.name} matches password for student ${students[i].name}; use a different secret`
        );
      } else {
        passwords.push(student.password);
      }
    }

    students.sort((a, b) => a.name.localeCompare(b.name));

    dataCache = {
      students: students.map(student =>
        mapValues(student, value => (value !== '' ? value : null))
      )
    };
  }

  return dataCache;
}

export async function loadProcessedData() {
  if (!processedDataCache) {
    try {
      processedDataCache = loadYaml(
        await readFileNative(processedDataFile, 'utf8')
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(
          `Processed data file ${resolvePath(
            processedDataFile
          )} not found; run "npm start" to create it`
        );
      } else {
        throw err;
      }
    }
  }

  return processedDataCache;
}

export async function loading(promise, ...args) {
  const ora = await import('ora');
  return ora.oraPromise(promise, ...args);
}

export async function readContent(absolutePath, parser) {
  if (!isFunction(parser)) {
    throw new Error('Parser must be a function');
  }

  if (!contentCache[absolutePath]) {
    const rawContent = await readFileNative(absolutePath);
    const content = await parser(rawContent);
    contentCache[absolutePath] = { content, parser };
  } else if (contentCache[absolutePath].parser !== parser) {
    throw new Error(
      `Cannot read content in file ${JSON.stringify(
        absolutePath
      )} with different parsers`
    );
  }

  return contentCache[absolutePath].content;
}

export async function readFile(absolutePath, options = 'utf8') {
  if (resolvePath(absolutePath) !== absolutePath) {
    throw new Error(
      `File path ${JSON.stringify(absolutePath)} is not absolute`
    );
  }

  if (!fileCache[absolutePath]) {
    fileCache[absolutePath] = await readFileNative(absolutePath, options);
  }

  return fileCache[absolutePath];
}

export async function sendMail(options) {
  const [client, from, bcc] = await Promise.all([
    awsSesPromise,
    loadConfigProperty('from'),
    loadConfigProperty('bcc')
  ]);

  await delay(250);
  await client.send(
    new SendEmailCommand({
      Source: options.from ?? from,
      Destination: {
        ToAddresses: [options.to],
        CcAddresses: (options.cc ?? []).filter(email => email !== options.to),
        BccAddresses: (options.bcc ?? toArray(bcc)).filter(
          email => email !== options.to
        )
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: options.subject
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: options.text
          }
        }
      },
      ReplyToAddresses: toArray(options.replyTo)
    })
  );
}

function getDefaultStudentUsername({ email }) {
  const parts = email.toLowerCase().replace(/@.*/, '').split('.');
  if (parts.length !== 2) {
    throw new Error(
      `Unsupported email ${JSON.stringify(
        email
      )} (splitting the username on dot "." produces more than two parts)`
    );
  }

  const [firstName, lastName] = parts;

  const username = `${firstName[0]}${lastName[0]}${
    lastName[lastName.length - 1]
  }`;
  if (!username.match(/^[a-z]{3}$/)) {
    throw new Error(
      `Unsupported default username ${JSON.stringify(
        username
      )} for email ${JSON.stringify(
        email
      )}; specify a custom username in the CSV file`
    );
  }

  return username;
}

async function loadSesClient() {
  const [accessKeyId, secretAccessKey] = await Promise.all([
    loadConfigProperty('aws_access_key_id'),
    loadConfigProperty('aws_secret_access_key')
  ]);

  return new SESClient({
    region: 'eu-central-1',
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

async function loadConfig() {
  return readContent(configFile, loadYaml);
}

async function parseCsv(...args) {
  return new Promise((resolve, reject) =>
    parseCsvNode(...args, (err, data) => (err ? reject(err) : resolve(data)))
  );
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function toArray(value) {
  if (value === undefined || value == null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
