const { createHmac } = require('crypto');
const parseCsvNode = require('csv-parse');
const { readFile } = require('fs-extra');
const { safeLoad: loadYaml } = require('js-yaml');
const nodemailer = require('nodemailer');
const { sha512crypt } = require('sha512crypt-node');
const uuid = require('uuid/v4');

let configCache;
let mailTransporterCache;

exports.configFile = 'config.yml';
exports.secretFile = 'secret.txt';
exports.studentsFile = 'students.csv';

exports.loadData = async function() {

  const secret = (await readFile(exports.secretFile, 'utf8')).trim();
  const students = await parseCsv(await readFile(exports.studentsFile, 'utf8'), { columns: [ 'name', 'email' ], from: 2 });

  const passwords = [];

  for (const student of students) {

    student.username = student.email.replace(/@.*/, '').replace(/\./, '_');

    // The goal is not to generate a secure password, or to have a good quality random distribution,
    // but just to set an initial password for each student that looks random and is different from the others.
    student.password = createHmac('sha1', secret).update(student.username).digest('base64').slice(0, 10);
    student.hashedPassword = sha512crypt(student.password, uuid());

    const i = passwords.indexOf(student.password);
    if (i >= 0) {
      throw new Error(`Generated password for student ${student.name} matches password for student ${students[i].name}; use a different secret`);
    } else {
      passwords.push(student.password);
    }
  }

  return { students };
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

  if (!configCache) {
    configCache = loadYaml(await readFile(exports.configFile, 'utf8'));
  }

  return configCache;
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
