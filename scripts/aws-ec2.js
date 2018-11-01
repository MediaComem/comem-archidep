const aws = require('aws-sdk');
const { isFunction, pick } = require('lodash');

const { loadAwsCredentials, loadConfigProperty } = require('./utils');

let cachedEc2;

exports.allocateAddress = async function() {

  const ec2 = await loadEc2();

  const params = {
    Domain: 'vpc'
  };

  const result = await ec2.allocateAddress(params).promise();
  return result;
};

exports.associateAddress = async function(address, instance) {

  const ec2 = await loadEc2();

  const params = {
    AllocationId: address.AllocationId,
    AllowReassociation: false,
    InstanceId: instance.InstanceId
  };

  const result = await ec2.associateAddress(params).promise();
  address.AssociationId = result.AssociationId;
  address.InstanceId = instance.InstanceId;

  return address;
};

exports.createTags = async function(resources, tags) {

  const ec2 = await loadEc2();

  const params = {
    Resources: resources,
    Tags: tags
  };

  await ec2.createTags(params).promise();
};

exports.listAddresses = async function() {

  const ec2 = await loadEc2();

  const params = {};
  const result = await ec2.describeAddresses(params).promise();

  return result.Addresses;
};

exports.listInstances = async function() {

  const ec2 = await loadEc2();

  const instances = [];
  let nextToken;

  do {

    const params = {
      Filters: [
        {
          Name: 'instance-state-name',
          Values: [ 'pending', 'running', 'shutting-down', 'stopping', 'stopped' ]
        },
        {
          Name: 'tag:Project',
          Values: [ 'comem-archidep' ]
        }
      ],
      NextToken: nextToken
    };

    const result = await ec2.describeInstances(params).promise();
    nextToken = result.NextToken;

    instances.push(...result.Reservations.reduce((memo, reservation) => [ ...memo, ...reservation.Instances ], []));
  } while (nextToken);

  return instances;
};

exports.releaseAddress = async function(address) {

  const ec2 = await loadEc2();

  const result = await ec2.releaseAddress(pick(address, 'AllocationId')).promise();

  delete address.AssociationId;
  delete address.InstanceId;

  return address;
};

exports.runInstance = async function(params) {

  const ec2 = await loadEc2();

  const result = await ec2.runInstances({
    ...params,
    MaxCount: 1,
    MinCount: 1
  }).promise();

  return result.Instances[0];
};

exports.rebootInstances = instancesActionFactory('rebootInstances');
exports.startInstances = instancesActionFactory('startInstances', 'StartingInstances');
exports.stopInstances = instancesActionFactory('stopInstances', 'StoppingInstances');
exports.terminateInstances = instancesActionFactory('terminateInstances', 'TerminatingInstances');

exports.waitForInstances = async function(instances) {

  const ec2 = await loadEc2();

  const params = {
    InstanceIds: instances.map(instance => instance.InstanceId)
  };

  await ec2.waitFor('instanceRunning', params).promise();
};

async function loadEc2() {
  if (!cachedEc2) {

    await loadAwsCredentials();

    cachedEc2 = new aws.EC2({
      apiVersion: '2016-11-15',
      region: await loadConfigProperty('aws_region')
    });
  }

  return cachedEc2;
}

function instancesActionFactory(action, statusKey) {
  return async instances => {

    const ec2 = await loadEc2();
    if (!isFunction(ec2[action])) {
      throw new Error(`AWS SDK EC2 has no "${action}" function`);
    }

    const params = {
      InstanceIds: instances.map(instance => instance.InstanceId)
    };

    const result = await ec2[action](params).promise();

    const status = result[statusKey];
    if (status) {
      for (const change of status) {
        const instance = instances.find(i => i.InstanceId === change.InstanceId);
        instance.State = change.CurrentState;
      }
    }

    return instances;
  };
}
