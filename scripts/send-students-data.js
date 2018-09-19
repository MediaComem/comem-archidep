const chalk = require('chalk');
const { join: joinPath } = require('path');

const { loadData, sendMail } = require('./utils');

Promise
  .resolve()
  .then(send)
  .catch(err => console.error(chalk.red(err.stack)));

async function send() {

  const data = await loadData();

  for (const student of data.students) {

    const mail = {
      to: student.email,
      subject: 'ArchiDep 2018 Credentials',
      text: `Hello, your username is ${student.username} and your password is ${student.password}`
    };

    await sendMail(mail);
    console.log(`Sent credentials to ${chalk.green(student.email)}`);
  }
}
