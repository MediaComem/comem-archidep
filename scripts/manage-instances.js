const chalk = require('chalk');
const commander = require('commander');
const { writeFile } = require('fs-extra');
const inquirer = require('inquirer');
const { safeDump: dumpYaml } = require('js-yaml');
const { difference, isArray, isPlainObject, isString } = require('lodash');
const ora = require('ora');
const { join: joinPath, relative: relativePath, resolve: resolvePath } = require('path');
const { table } = require('table');

const { allocateAddress, associateAddress, createTags, listAddresses, listInstances, rebootInstances, releaseAddress, runInstance, startInstances, stopInstances, terminateInstances, waitForInstances } = require('./aws-ec2');
const { confirm, loadConfigProperty, loadProcessedData, sendMail, unixEncryptPassword } = require('./utils');

const root = resolvePath(joinPath(__dirname, '..'));
const inventoryFile = resolvePath(joinPath(root, 'ec2', 'inventory'));
const sshPrivateKeyFile = resolvePath(joinPath(root, 'id_rsa'));

const rebootStudentInstances = studentInstancesActionFactory(rebootInstances, 'Rebooting instances');
const startStudentInstances = studentInstancesActionFactory(startInstances, 'Starting instances');
const stopStudentInstances = studentInstancesActionFactory(stopInstances, 'Stopping instances');
const terminateStudentInstances = studentInstancesActionFactory(terminateInstances, 'Terminating instances');

let action = displayStatus;

commander
  .version('1.0.0');

commander
  .command('status')
  .description('Check status of AWS EC2 instances and elastic IP addresses')
  .action(actionRunner(displayStatus));

commander
  .command('inventory')
  .description('Generate Ansible inventory for students\' AWS EC2 instances')
  .action(actionRunner(generateInventory));

commander
  .command('mail [student...]')
  .description('Send AWS EC2 instance credentials to students by email')
  .action(actionRunner(sendStudentMails));

commander
  .command('up [student...]')
  .description('Make sure all AWS EC2 instances are running and associated with elastic IP addresses')
  .action(actionRunner(runStudentInstances));

commander
  .command('start [student...]')
  .description('Start AWS EC2 instances for students')
  .action(actionRunner(startStudentInstances))

commander
  .command('stop [student...]')
  .description('Stop AWS EC2 instances for students')
  .action(actionRunner(stopStudentInstances))

commander
  .command('reboot [student...]')
  .description('Reboot AWS EC2 instances for students')
  .action(actionRunner(rebootStudentInstances))

commander
  .command('terminate [student...]')
  .description('Terminate AWS EC2 instances for students')
  .action(actionRunner(terminateStudentInstances))

commander
  .command('release')
  .description('Release dangling elastic IP addresses')
  .action(actionRunner(releaseDanglingElasticIpAddresses));

commander.parse(process.argv);

Promise
  .resolve()
  .then(action)
  .catch(err => console.error(chalk.red(err.stack)));

async function displayStatus() {
  console.log();

  const state = await loadState();

  console.log();
  printStatusTableData(state);
}

async function generateInventory() {
  console.log();

  const state = await loadState();
  console.log();

  const selectedItems = state.items.filter(item => item.address);
  if (!selectedItems.length) {
    throw new Error('No student has an instance with an associated elastic IP address');
  }

  const baseDomain = await loadConfigProperty('aws_base_domain');
  const aliceHashedPassword = unixEncryptPassword(await loadConfigProperty('aws_alice_password'));

  const inventory = {
    all: {
      hosts: selectedItems.reduce((memo, item) => {

        memo[item.student.username] = {
          alice_hashed_password: aliceHashedPassword,
          ansible_become: true,
          ansible_host: item.address.PublicIp,
          ansible_ssh_private_key_file: sshPrivateKeyFile,
          ansible_user: 'ubuntu',
          base_domain: baseDomain,
          student_email: item.student.email,
          student_hashed_password: item.student.hashedPassword,
          student_name: item.student.name,
          student_username: item.student.username
        };

        return memo;
      }, {})
    }
  };

  await loading(
    writeFile(inventoryFile, `# vi: ft=yml\n${dumpYaml(inventory)}`, 'utf8'),
    `Saving inventory to ${relativePath(root, inventoryFile)}`
  );

  console.log();
}

async function releaseDanglingElasticIpAddresses() {
  console.log();

  const state = await loadState();
  console.log();

  const danglingAddresses = state.danglingAddresses;
  if (!danglingAddresses.length) {
    console.log(chalk.green('No dangling elastic IP addresses found'));
    console.log();
    return;
  } else if (!(await confirm(`${danglingAddresses.length} dangling elastic IP addresses will be released`))) {
    throw new Error('Release of elastic IP addresses canceled by user');
  }

  console.log();
  for (const address of danglingAddresses) {
    await loading(
      releaseAddress(address),
      `Releasing dangling elastic IP address ${address.AllocationId} (${address.PublicIp})`
    );
  }

  console.log();
  console.log(chalk.green('All dangling elastic IP addresses have been successfully released'));
  console.log();
}

async function runStudentInstances(students) {
  console.log();

  const state = await loadState();
  console.log();

  const selectedItems = selectItemsByStudentUsername(state.items, students);

  const missingAddresses = selectedItems.filter(item => !item.address);
  const missingAddressesCount = missingAddresses.length;

  const missingInstances = selectedItems.filter(item => !item.instance);
  const missingInstancesCount = missingInstances.length;

  const unassociatedAddresses = state.danglingAddresses.filter(address => !address.AssociationId);

  const addressesToAssociate = unassociatedAddresses.slice(0, Math.min(missingAddressesCount, unassociatedAddresses.length));
  const addressesToAssociateCount = addressesToAssociate.length;

  const newAddressesCount = Math.max(0, missingAddressesCount - unassociatedAddresses.length);

  if (!missingAddressesCount && !missingInstancesCount) {
    printStatusTableData(state);
    console.log(chalk.green('All selected students have an instance running. Nothing to do.'));
    console.log();
    return;
  }

  if (missingInstancesCount && !(await confirm(`${missingInstancesCount} new EC2 instances will be run`))) {
    throw new Error('AWS EC2 instance creation canceled by user');
  }

  if (addressesToAssociateCount) {
    if (!(await confirm(`${addressesToAssociateCount} existing elastic IP addresses will be associated to instances`))) {
      throw new Error(`AWS elastic IP address association canceled by user`);
    }
  }

  if (newAddressesCount && !(await confirm(`${newAddressesCount} new elastic IP addresses will be allocated and associated to instances`))) {
    throw new Error(`AWS elastic IP address allocation canceled by user`);
  }

  console.log();
  for (const item of missingInstances) {
    const params = await getInstanceRunParams(item.student);
    item.instance = await loading(runInstance(params), `Running new AWS EC2 instance for student ${item.student.username}`);
  }

  if (missingInstances.length) {
    await loading(
      waitForInstances(missingInstances.map(item => item.instance)),
      `Waiting for ${missingInstances.length} instances to run`
    );
  }

  for (const address of addressesToAssociate) {

    const item = missingAddresses.pop();
    const instance = item.instance;

    await loading(
      createTags([ address.AllocationId ], getAddressTags(item.student)),
      `Tagging elastic IP address ${address.AllocationId} for student ${item.student.username}`
    );

    instance.address = await loading(
      associateAddress(address, instance),
      `Associating elastic IP address ${address.AllocationId} with instance ${instance.InstanceId} for student ${item.student.username}`
    );
  }

  for (const item of missingAddresses) {

    const address = await loading(allocateAddress(), `Allocating new elastic IP address for student ${item.student.username}`);
    await loading(
      createTags([ address.AllocationId ], getAddressTags(item.student)),
      `Tagging elastic IP address ${address.AllocationId} for student ${item.student.username}`
    );

    const instance = item.instance;
    instance.address = await loading(
      associateAddress(address, instance),
      `Associating elastic IP address ${address.AllocationId} with instance ${instance.InstanceId} for student ${item.student.username}`
    );
  }

  console.log();
}

async function sendStudentMails(students) {
  console.log();

  const state = await loadState();
  console.log();

  const selectedItems = selectItemsByStudentUsername(state.items, students);

  const missingAddresses = selectedItems.filter(item => !item.address);
  if (missingAddresses.length) {
    throw new Error(`Students ${missingAddresses.map(item => `"${item.student.username}"`).join(', ')} have no corresponding instance or associated elastic IP address`);
  } else if (!selectedItems.length) {
    console.log(chalk.green('No elastic IP addresses available'));
    console.log();
    return;
  } else if (!(await confirm(`${selectedItems.length} emails will be sent`))) {
    throw new Error('Emails canceled by user');
  }

  console.log();
  for (const item of selectedItems) {

    const mail = {
      to: item.student.email,
      subject: 'ArchiDep 2018 Virtual Server',
      text: [
        `IP address: ${item.address.PublicIp}`,
        `Username: ${item.student.username}`,
        `Password: ${item.student.password}`
      ].join('\n')
    };

    await loading(
      sendMail(mail),
      `Sending email to ${item.student.email}`
    );
  }

  console.log();
}

function actionRunner(func) {
  return (...args) => action = () => func(...[ ...args, commander ]);
}

function getAddressTags(student) {
  return [
    {
      Key: 'Name',
      Value: `comem-archidep-${student.username.replace(/_/g, '-')}`
    },
    {
      Key: 'Project',
      Value: 'comem-archidep'
    },
    {
      Key: 'Student',
      Value: student.username
    }
  ];
}

function getInstanceAddress(instance, addresses) {
  if (!isPlainObject(instance)) {
    throw new Error('Instance must be an object');
  } else if (!isString(instance.InstanceId)) {
    throw new Error('Instance must have an "InstanceId" property that is a string');
  } else if (!isArray(addresses)) {
    throw new Error('Addresses must be an array');
  }

  return addresses.find(address => address.InstanceId === instance.InstanceId);
}

async function getInstanceRunParams(student) {
  return {
    ImageId: await loadConfigProperty('aws_image'),
    InstanceType: await loadConfigProperty('aws_instance_type'),
    KeyName: await loadConfigProperty('aws_key_name'),
    SecurityGroupIds: [
      await loadConfigProperty('aws_security_group')
    ],
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [
          {
            Key: 'Name',
            Value: `comem-archidep-${student.username.replace(/_/g, '-')}`
          },
          {
            Key: 'Project',
            Value: 'comem-archidep'
          },
          {
            Key: 'Student',
            Value: student.username
          }
        ]
      }
    ]
  };
}

function getItemAddressDescription(item) {

  const address = item.address;
  if (!address) {
    return chalk.gray('-');
  }

  return address.PublicIp;
}

function getItemDescription(item, descriptionFactory, ...args) {
  const description = descriptionFactory(item, ...args);
  if (item.selected === true) {
    return chalk.cyan(description);
  } else if (item.selected === false) {
    return chalk.gray(description);
  } else {
    return description;
  }
}

function getItemInstanceDescription(item) {

  const instance = item.instance;
  if (!instance) {
    return chalk.gray('-');
  }

  return `${instance.InstanceId} (${instance.InstanceType})`;
}

function getItemInstanceStatus(item) {

  const instance = item.instance;
  if (!instance) {
    return chalk.red('MISSING');
  }

  const state = instance.State.Name;
  switch (state) {
    case 'running':
      return chalk.green('running');
    case 'stopped':
      return chalk.red('stopped');
    default:
      return chalk.yellow(state);
  }
}

function getItemStudentDescription(item) {
  return item.student.name;
}

function getStudentInstance(student, instances) {
  if (!isPlainObject(student)) {
    throw new Error('Student must be an object');
  } else if (!isString(student.username)) {
    throw new Error('Student must have a "name" property that is a string');
  } else if (!isArray(instances)) {
    throw new Error('Instances must be an array');
  }

  return instances.find(instance => instance.Tags.some(tag => tag.Key === 'Student' && tag.Value === student.username));
}

function loading(promise, ...args) {
  ora.promise(promise, ...args);
  return promise;
}

async function loadState() {

  const { students } = await loading(loadProcessedData(), 'Loading student data');
  const addresses = await loading(listAddresses(), 'Listing AWS EC2 elastic IP addresses');
  const instances = await loading(listInstances(), 'Listing AWS EC2 instances');

  const state = {
    items: students.map(student => {

      const instance = getStudentInstance(student, instances);

      return {
        instance,
        student,
        address: instance ? getInstanceAddress(instance, addresses) : undefined
      };
    })
  };

  state.danglingAddresses = addresses.filter(address => state.items.every(item => item.address !== address));
  state.extraInstances = instances.filter(instance => state.items.every(item => item.instance !== instance));

  return state;
}

function printStatusTableData(state) {

  const tableData = state.items.map(item => [
    getItemDescription(item, getItemStudentDescription),
    getItemDescription(item, getItemInstanceDescription),
    getItemDescription(item, getItemAddressDescription),
    getItemDescription(item, getItemInstanceStatus)
  ]);

  tableData.unshift([ `Students (${state.items.length})`, 'Instance', 'Address', 'Status' ].map(title => chalk.bold(title)));

  console.log(table(tableData));

  const danglingAddresses = state.danglingAddresses;
  if (danglingAddresses.length) {

    const danglingAddressesTableData = state.danglingAddresses.map(address => [
      address.AllocationId,
      address.PublicIp,
      chalk.red('dangling')
    ]);

    danglingAddressesTableData.unshift([ 'Elastic IP', 'Address', 'Status' ].map(title => chalk.bold(title)));

    console.log(chalk.red('The following elastic IP addresses are billed for nothing'));
    console.log(chalk.red('because they are not associated with a running instance.'));
    console.log(chalk.red('Run "npm run ec2 -- release" to release them.'))
    console.log();
    console.log(table(danglingAddressesTableData));
  }

  // FIXME: display dangling instances
}

function studentIs(student, searchTerm) {
  const term = searchTerm.toLowerCase();
  return [ student.name, student.email, student.username ].some(text => text.toLowerCase().indexOf(term) >= 0);
}

function selectItemsByStudentUsername(items, studentSearchTerms) {
  if (!studentSearchTerms.length) {
    return items;
  }

  const selectedItems = [];
  const knownSearchTerms = [];

  for (const item of items) {
    const matchingSearchTerms = studentSearchTerms.filter(searchTerm => studentIs(item.student, searchTerm));
    item.selected = matchingSearchTerms.length >= 1;
    if (item.selected) {
      selectedItems.push(item);
      knownSearchTerms.push(...matchingSearchTerms);
    }
  }

  if (!selectedItems.length) {
    throw new Error(`Search terms ${studentSearchTerms.map(term => `"${term}"`).join(', ')} match no students`);
  } else if (selectedItems.length === items.length) {
    throw new Error(`Search terms ${studentSearchTerms.map(term => `"${term}"`).join(', ')} match all students; use more precise search terms`);
  }

  const unknownSearchTerms = difference(studentSearchTerms, knownSearchTerms);
  if (unknownSearchTerms.length) {
    throw new Error(`Unknown student usernames: ${unknownSearchTerms.join(', ')}`);
  }

  return selectedItems;
}

function studentInstancesActionFactory(ec2Func, description) {
  return async students => {

    console.log();

    const state = await loadState();
    console.log();

    const selectedItems = students.length ? selectItemsByStudentUsername(state.items, students) : state.items.filter(item => item.instance);

    const missingInstances = selectedItems.filter(item => !item.instance);
    if (missingInstances.length) {
      throw new Error(`Students ${missingInstances.map(item => `"${item.student.username}"`).join(', ')} have no corresponding instance`);
    } else if (!selectedItems.length) {
      console.log(chalk.green('No instances available'));
      console.log();
      return;
    } else if (!(await confirm(`${selectedItems.length} instances will be affected`))) {
      throw new Error('Instance action canceled by user');
    }

    console.log();

    await loading(
      ec2Func(selectedItems.map(item => item.instance)),
      `${description} ${selectedItems.map(item => `"${item.instance.InstanceId}"`).join(', ')} for students ${selectedItems.map(item => `"${item.student.username}"`).join(', ')}`
    );

    console.log();
    printStatusTableData(state);
  };
}
