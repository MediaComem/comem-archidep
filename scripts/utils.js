const chalk = require('chalk');
const { createHmac } = require('crypto');
const parseCsvNode = require('csv-parse');
const { readFile } = require('fs-extra');
const inquirer = require('inquirer');
const { load: loadYaml } = require('js-yaml');
const { isFunction, mapValues } = require('lodash');
const nodemailer = require('nodemailer');
const { join: joinPath, resolve: resolvePath } = require('path');

let dataCache;
let mailTransporterCache;
let processedDataCache;

const contentCache = {};
const fileCache = {};
const processedDataFile = 'data.yml';
const root = resolvePath(joinPath(__dirname, '..'));

exports.configFile = joinPath(root, 'config.yml');
exports.secretFile = 'secret.txt';
exports.studentsFile = joinPath(root, 'students.csv');
exports.root = root;

exports.confirm = async function(message) {

  const answers = await inquirer.prompt([
    {
      name: 'result',
      type: 'confirm',
      message
    }
  ]);

  return answers.result;
};

exports.executeScript = function(func) {
  Promise.resolve().then(func).catch(err => {
    console.error(chalk.red(err.stack));
    process.exit(1);
  });
};

exports.loadAwsCredentials = async function() {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = await exports.loadConfigProperty('aws_access_key_id');
  }

  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = await exports.loadConfigProperty('aws_secret_access_key');
  }
};

exports.loadConfigProperty = async function(name) {

  const config = await loadConfig();
  if (!config[name]) {
    throw new Error(`Missing property "${name}" in config file ${exports.configFile}`);
  }

  return config[name];
};

exports.loadData = async function() {
  if (!dataCache) {

    let secret;
    try {
      secret = (await readFile(exports.secretFile, 'utf8')).trim();
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Secret file "${exports.secretFile}" not found; read SETUP.md`);
      } else {
        throw err;
      }
    }

    const students = await parseCsv(await readFile(exports.studentsFile, 'utf8'), { columns: [ 'class', 'name', 'orientation', 'mode', 'email', 'ip', 'username', 'herokuEmail', 'herokuId', 'ansibleUser' ], from: 2 });

    const passwords = [];

    for (const student of students) {

      student.defaultUsername = student.email.toLowerCase().replace(/@.*/, '').replace(/[^a-z0-9]/g, '_');
      if (!student.username) {
        student.username = student.defaultUsername;
      }

      // The goal is not to generate a secure password, or to have a good quality random distribution,
      // but just to set an initial password for each student that looks random and is different from the others.
      student.password = createHmac('sha1', secret).update(student.username).digest('base64').slice(0, 10);

      const i = passwords.indexOf(student.password);
      if (i >= 0) {
        throw new Error(`Generated password for student ${student.name} matches password for student ${students[i].name}; use a different secret`);
      } else {
        passwords.push(student.password);
      }
    }

    students.sort((a, b) => a.name.localeCompare(b.name));

    dataCache = {
      students: students.map(student => mapValues(student, value => value !== '' ? value : null))
    };
  }

  return dataCache;
};

exports.loadProcessedData = async function() {
  if (!processedDataCache) {
    try {
      processedDataCache = loadYaml(await readFile(processedDataFile, 'utf8'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Processed data file ${resolvePath(processedDataFile)} not found; run "npm start" to create it`);
      } else {
        throw err;
      }
    }
  }

  return processedDataCache;
};

exports.loading = async function(promise, ...args) {
  const ora = await import('ora');
  return ora.oraPromise(promise, ...args);
};

exports.readContent = async function(absolutePath, parser) {
  if (!isFunction(parser)) {
    throw new Error('Parser must be a function');
  }

  if (!contentCache[absolutePath]) {
    const rawContent = await exports.readFile(absolutePath);
    const content = await parser(rawContent);
    contentCache[absolutePath] = { content, parser };
  } else if (contentCache[absolutePath].parser !== parser) {
    throw new Error(`Cannot read content in file ${JSON.stringify(absolutePath)} with different parsers`);
  }

  return contentCache[absolutePath].content;
};

exports.readFile = async function(absolutePath, options = 'utf8') {
  if (resolvePath(absolutePath) !== absolutePath) {
    throw new Error(`File path ${JSON.stringify(absolutePath)} is not absolute`);
  }

  if (!fileCache[absolutePath]) {
    fileCache[absolutePath] = await readFile(absolutePath, options);
  }

  return fileCache[absolutePath];
};

exports.sendMail = async function(options) {

  const config = await loadConfig();
  const transporter = await loadMailTransporter();

  const mailOptions = {
    from: config.smtp_address,
    ...options
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => err ? reject(err) : resolve(info));
  });
};

async function loadConfig() {
  return exports.readContent(exports.configFile, loadYaml);
}

async function loadMailTransporter() {
  if (!mailTransporterCache) {

    const config = await loadConfig();

    mailTransporterCache = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: config.smtp_secure,
      auth: {
        user: config.smtp_username,
        pass: config.smtp_password
      }
    });
  }

  return mailTransporterCache;
}

async function parseCsv(...args) {
  return new Promise((resolve, reject) => parseCsvNode(...args, (err, data) => err ? reject(err) : resolve(data)));
}
