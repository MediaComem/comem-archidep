const chalk = require('chalk');
const commander = require('commander');
const { writeFile } = require('fs-extra');
const { safeDump: dumpYaml } = require('js-yaml');
const { difference, includes, isArray, isEmpty, isPlainObject, isString, times, uniq } = require('lodash');
const ora = require('ora');
const { join: joinPath, relative: relativePath, resolve: resolvePath } = require('path');
const { table } = require('table');

const { allocateAddress, associateAddress, createTags, getRegionName, listAddresses, listInstances, loadRegionImage, loadRegionLimit, loadRegions, loadRegionSecurityGroup, rebootInstances, releaseAddress, runInstance, startInstances, stopInstances, terminateInstances, waitForInstances } = require('./aws-ec2');
const { confirm, loadConfigProperty, loadProcessedData, sendMail } = require('./utils');

const SELECTED = Symbol('selected');

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
  .command('status [student...]')
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

async function displayStatus(studentUsernames) {
  console.log();

  const state = await loadState();
  selectStudentsByUsername(state.students, studentUsernames);

  console.log();
  printStatusTableData(state);
}

async function generateInventory() {
  console.log();

  const state = await loadState();
  console.log();

  const baseDomain = await loadConfigProperty('aws_base_domain');
  const alicePassword = await loadConfigProperty('aws_alice_password');

  const inventory = {
    all: {
      hosts: state.students.reduce((memo, student) => {

        const instance = getStudentInstance(student, state.instances);
        if (!instance) {
          return memo;
        }

        const address = getInstanceAddress(instance, state.addresses);
        if (!address) {
          return memo;
        }

        memo[student.username] = {
          alice_password: alicePassword,
          ansible_become: true,
          ansible_host: address.PublicIp,
          ansible_ssh_private_key_file: sshPrivateKeyFile,
          ansible_user: 'ubuntu',
          base_domain: baseDomain,
          student_email: student.email,
          student_name: student.name,
          student_password: student.password,
          student_username: student.username
        };

        return memo;
      }, {})
    }
  };

  if (isEmpty(inventory.all.hosts)) {
    throw new Error('No student has an instance with an associated elastic IP address');
  }

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

  const danglingAddresses = getDanglingAddresses(state);
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

async function runStudentInstances(studentUsernames) {
  console.log();

  const state = await loadState();
  console.log();

  const selectedStudents = selectStudentsByUsername(state.students, studentUsernames);

  const missingAddresses = selectedStudents.filter(student => !getInstanceAddress(getStudentInstance(student, state.instances), state.addresses));
  const missingAddressesCount = missingAddresses.length;

  const missingInstances = selectedStudents.filter(student => !getStudentInstance(student, state.instances));
  const missingInstancesCount = missingInstances.length;

  const regions = await loadRegions();
  const nextRegions = await getNextInstanceRegions(missingInstances.length, state.instances);

  const danglingAddresses = getDanglingAddresses(state);
  const addressesToAssociate = regions.reduce((memo, region) => {

    const instancesWithMissingAddressCount = state.students.map(student => getStudentInstance(student, state.instances)).filter(instance => instance && instance.Region === region && !getInstanceAddress(instance, state.addresses)).length;

    const newInstancesCount = nextRegions.filter(nextRegion => nextRegion === region).length;

    memo.push(...danglingAddresses.filter(address => address.Region === region && !address.AssociationId).slice(0, instancesWithMissingAddressCount + newInstancesCount));

    return memo;
  }, []);
  const addressesToAssociateCount = addressesToAssociate.length;

  const newAddressesCount = Math.max(0, missingAddressesCount - addressesToAssociateCount);

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
  for (const student of missingInstances) {
    const region = nextRegions.shift();
    const params = await getInstanceRunParams(region, student);
    const instance = await loading(runInstance(region, params), `Running new AWS EC2 instance in region ${getRegionName(region)} for student ${student.username}`);
    state.instances.push(instance);
  }

  if (missingInstances.length) {
    await loading(
      waitForInstances(state.instances.slice(state.instances.length - missingInstances.length)),
      `Waiting for ${missingInstances.length} instances to run`
    );
  }

  for (const address of addressesToAssociate) {

    const student = state.students.find(student => {
      const instance = getStudentInstance(student, state.instances);
      return instance.Region === address.Region && !getInstanceAddress(instance, state.addresses);
    });

    const instance = getStudentInstance(student, state.instances);

    await loading(
      createTags(address.Region, [ address.AllocationId ], getAddressTags(student)),
      `Tagging elastic IP address ${address.AllocationId} for student ${student.username}`
    );

    await loading(
      associateAddress(address, instance),
      `Associating elastic IP address ${address.AllocationId} with instance ${instance.InstanceId} for student ${student.username}`
    );

    missingAddresses.splice(missingAddresses.indexOf(student), 1);
  }

  for (const student of missingAddresses) {

    const instance = getStudentInstance(student, state.instances);

    const address = await loading(
      allocateAddress(instance.Region),
      `Allocating new elastic IP address in region ${getRegionName(instance.Region)} for student ${student.username}`
    );

    await loading(
      createTags(instance.Region, [ address.AllocationId ], getAddressTags(student)),
      `Tagging elastic IP address ${address.AllocationId} for student ${student.username}`
    );

    await loading(
      associateAddress(address, instance),
      `Associating elastic IP address ${address.AllocationId} with instance ${instance.InstanceId} for student ${student.username}`
    );

    state.addresses.push(address);
  }

  console.log();
}

async function sendStudentMails(studentUsernames) {
  console.log();

  const state = await loadState();
  console.log();

  const selectedStudents = selectStudentsByUsername(state.students, studentUsernames);

  const missingAddresses = selectedStudents.filter(student => !getInstanceAddress(getStudentInstance(student, state.instances), state.addresses));
  if (missingAddresses.length) {
    throw new Error(`Students ${missingAddresses.map(student => `"${student.username}"`).join(', ')} have no corresponding instance or associated elastic IP address`);
  } else if (!selectedStudents.length) {
    console.log(chalk.green('No elastic IP addresses available'));
    console.log();
    return;
  } else if (!(await confirm(`${selectedStudents.length} emails will be sent`))) {
    throw new Error('Emails canceled by user');
  }

  console.log();
  for (const student of selectedStudents) {

    const instance = getStudentInstance(student, state.instances);
    const address = getInstanceAddress(instance, state.addresses);

    const mail = {
      to: student.email,
      subject: 'ArchiDep 2018 Virtual Server',
      text: [
        `IP address: ${address.PublicIp}`,
        `Username: ${student.username}`,
        `Password: ${student.password}`
      ].join('\n')
    };

    await loading(
      sendMail(mail),
      `Sending email to ${student.email}`
    );
  }

  console.log();
}

function actionRunner(func) {
  return (...args) => action = () => func(...[ ...args, commander ]);
}

function getAddressDescription(address) {
  if (!address) {
    return chalk.gray('-');
  }

  return address.PublicIp;
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

function getDanglingAddresses(state) {
  const instanceIds = state.instances.map(instance => instance.InstanceId);
  return state.addresses.filter(address => !includes(instanceIds, address.InstanceId));
}

function getExtraInstances(state) {
  const studentUsernames = state.students.map(student => student.username);
  return state.instances.filter(instance => instance.Tags.every(tag => tag.Key !== 'Student' || !includes(studentUsernames, tag.Value)));
}

function getInstanceAddress(instance, addresses) {
  if (instance === undefined) {
    return;
  } else if (!isPlainObject(instance)) {
    throw new Error('Instance must be an object');
  } else if (!isString(instance.InstanceId)) {
    throw new Error('Instance must have an "InstanceId" property that is a string');
  } else if (!isArray(addresses)) {
    throw new Error('Addresses must be an array');
  }

  return addresses.find(address => address.InstanceId === instance.InstanceId);
}

async function getInstanceRunParams(region, student) {
  return {
    ImageId: await loadRegionImage(region),
    InstanceType: await loadConfigProperty('aws_instance_type'),
    KeyName: await loadConfigProperty('aws_key_name'),
    SecurityGroupIds: [
      await loadRegionSecurityGroup(region)
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

function getInstanceDescription(instance) {
  if (!instance) {
    return chalk.gray('-');
  }

  return `${instance.InstanceId} (${instance.InstanceType})`;
}

function getInstanceName(instance) {
  if (!instance) {
    return '-';
  }

  const nameTag = instance.Tags.find(tag => tag.Key === 'Name');
  return nameTag ? nameTag.Value : '-';
}

function getInstanceStatus(instance) {
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

function getItemRegion(item) {
  return getRegionName(item.Region);
}

async function getNextInstanceRegions(count, instances) {

  const regions = await loadRegions();
  const instanceCountByRegion = regions.reduce((memo, region) => ({
    ...memo,
    [region]: instances.filter(instance => instance.Region === region).length
  }), {});

  const nextRegions = [];

  do {

    const region = regions[0];
    if (!region) {
      throw new Error(`The instance limits have been reached in all regions (${(await loadRegions()).join(', ')})`);
    }

    const limit = await loadRegionLimit(region);
    if (limit <= 0 || instanceCountByRegion[region] >= limit) {
      regions.shift();
      continue;
    }

    nextRegions.push(region);
    instanceCountByRegion[region]++;
  } while (nextRegions.length < count);

  return nextRegions;
}

function getStudentDescription(student) {
  return student.name;
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

  return { addresses, instances, students };
}

function printStatusTableData(state) {

  const tableData = state.students.map(student => {

    const instance = getStudentInstance(student, state.instances);
    const address = getInstanceAddress(instance, state.addresses);

    return [
      ...styleSelection(student, [
        getStudentDescription(student),
        getInstanceDescription(instance),
        getInstanceName(instance),
        getAddressDescription(address)
      ]),
      getInstanceStatus(instance)
    ];
  });

  tableData.unshift([ `Students (${state.students.length})`, 'Instance', 'Name', 'Address', 'Status' ].map(title => chalk.bold(title)));

  console.log(table(tableData));

  const danglingAddresses = getDanglingAddresses(state);
  if (danglingAddresses.length) {

    const danglingAddressesTableData = danglingAddresses.map(address => [
      address.AllocationId,
      address.PublicIp,
      getRegionName(address.Region),
      chalk.red('dangling')
    ]);

    danglingAddressesTableData.unshift([ 'Elastic IP', 'Address', 'Region', 'Status' ].map(title => chalk.bold(title)));

    console.log(chalk.red('The following elastic IP addresses are billed for nothing'));
    console.log(chalk.red('because they are not associated with a running instance.'));
    console.log(chalk.red('Run "npm run ec2 -- release" to release them.'))
    console.log();
    console.log(table(danglingAddressesTableData));
  }

  const extraInstances = getExtraInstances(state);
  if (extraInstances.length) {

    const extraInstancesTableDate = extraInstances.map(instance => {

      const address = getInstanceAddress(instance, state.addresses);

      return [
        getInstanceDescription(instance),
        getInstanceName(instance),
        getAddressDescription(address),
        getItemRegion(instance),
        getInstanceStatus(instance)
      ];
    });

    extraInstancesTableDate.unshift([ 'Instance', 'Name', 'Address', 'Region', 'Status' ].map(title => chalk.bold(title)));

    console.log(chalk.yellow('The following other instances have been found.'));
    console.log();
    console.log(table(extraInstancesTableDate));
  }
}

function studentIs(student, searchTerm) {
  const term = searchTerm.toLowerCase();
  return [ student.name, student.email, student.username ].some(text => text.toLowerCase().indexOf(term) >= 0);
}

function selectStudentsByUsername(students, searchTerms) {
  if (!searchTerms || !searchTerms.length) {
    return students;
  }

  const selectedStudents = [];
  const knownSearchTerms = [];

  for (const student of students) {
    const matchingSearchTerms = searchTerms.filter(searchTerm => studentIs(student, searchTerm));
    student[SELECTED] = matchingSearchTerms.length >= 1;
    if (student[SELECTED]) {
      selectedStudents.push(student);
      knownSearchTerms.push(...matchingSearchTerms);
    }
  }

  if (!selectedStudents.length) {
    throw new Error(`Search terms ${searchTerms.map(term => `"${term}"`).join(', ')} match no students`);
  } else if (selectedStudents.length === students.length) {
    throw new Error(`Search terms ${searchTerms.map(term => `"${term}"`).join(', ')} match all students; use more precise search terms`);
  }

  const unknownSearchTerms = difference(searchTerms, knownSearchTerms);
  if (unknownSearchTerms.length) {
    throw new Error(`Unknown student usernames: ${unknownSearchTerms.join(', ')}`);
  }

  return selectedStudents;
}

function studentInstancesActionFactory(ec2Func, description) {
  return async studentUsernames => {

    console.log();

    const state = await loadState();
    console.log();

    const selectedStudents = studentUsernames.length ? selectStudentsByUsername(state.students, studentUsernames) : state.students.filter(student => getStudentInstance(student, state.instances));

    const missingInstances = selectedStudents.filter(student => !getStudentInstance(student, state.instances));
    if (missingInstances.length) {
      throw new Error(`Students ${missingInstances.map(student => `"${student.username}"`).join(', ')} have no corresponding instance`);
    } else if (!selectedStudents.length) {
      console.log(chalk.green('No instances available'));
      console.log();
      return;
    } else if (!(await confirm(`${selectedStudents.length} instances will be affected`))) {
      throw new Error('Instance action canceled by user');
    }

    console.log();

    await loading(
      ec2Func(selectedStudents.map(student => getStudentInstance(student, state.instances))),
      `${description} ${selectedStudents.map(student => `"${getStudentInstance(student, state.instances).InstanceId}"`).join(', ')} for students ${selectedStudents.map(student => `"${student.username}"`).join(', ')}`
    );

    console.log();
    printStatusTableData(state);
  };
}

function styleSelection(selectedItem, itemsToStyle) {
  if (selectedItem === true || selectedItem[SELECTED] === true) {
    return itemsToStyle.map(item => chalk.cyan(item));
  } else if (selectedItem === false || selectedItem[SELECTED] === false) {
    return itemsToStyle.map(item => chalk.gray(item));
  } else {
    return itemsToStyle;
  }
}
