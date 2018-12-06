const aws = require('aws-sdk');
const { isFunction, keys, pick, uniq } = require('lodash');

const { loadAwsCredentials, loadConfigProperty } = require('./utils');

let cachedRegions;
const cachedEc2ByRegion = {};

const regionNames = {
  'us-east-2': 'Ohio',
  'us-east-1': 'North Virginia',
  'us-west-1': 'North California',
  'us-west-2': 'Oregon',
  'ap-south-1': 'Mumbai',
  'ap-northeast-3': 'Osaka',
  'ap-northeast-2': 'Seoul',
  'ap-southeast-1': 'Singapore',
  'ap-southeast-2': 'Sydney',
  'ap-northeast-1': 'Tokyo',
  'ca-central-1': 'Canada',
  'cn-north-1': 'Beijing',
  'cn-northwest-1': 'Ningxia',
  'eu-central-1': 'Frankfurt',
  'eu-west-1': 'Ireland',
  'eu-west-2': 'London',
  'eu-west-3': 'Paris',
  'sa-east-1': 'Sao Paulo'
};

exports.allocateAddress = async function(region) {

  const ec2 = await loadClient(region);

  const params = {
    Domain: 'vpc'
  };

  const address = await ec2.allocateAddress(params).promise();
  return {
    ...address,
    Region: region
  };
};

exports.associateAddress = async function(address, instance) {
  if (!address.Region) {
    throw new Error('Address must have a region', address);
  } else if (!instance.Region) {
    throw new Error('Instance must have a region', instance);
  } else if (address.Region !== instance.Region) {
    throw new Error('Address and instance must have the same region', address, instance);
  }

  const ec2 = await loadClient(address.Region);

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

exports.createTags = async function(region, resources, tags) {

  const ec2 = await loadClient(region);

  const params = {
    Resources: resources,
    Tags: tags
  };

  await ec2.createTags(params).promise();
};

exports.getRegionName = function(region) {
  return regionNames[region] ? `${region} - ${regionNames[region]}` : region;
};

exports.listAddresses = async function() {

  const addresses = [];
  for (const region of await exports.loadRegions()) {

    const ec2 = await loadClient(region);

    const params = {};
    const result = await ec2.describeAddresses(params).promise();

    addresses.push(...result.Addresses.map(address => ({ ...address, Region: region })));
  }

  return addresses;
};

exports.listInstances = async function() {

  const instances = [];
  for (const region of await exports.loadRegions()) {

    const ec2 = await loadClient(region);

    let nextToken;

    do {

      const params = {
        Filters: [
          {
            Name: 'instance-state-name',
            Values: [ 'pending', 'running', 'shutting-down', 'stopping', 'stopped' ]
          }
        ],
        NextToken: nextToken
      };

      const result = await ec2.describeInstances(params).promise();
      nextToken = result.NextToken;

      const currentInstances = result.Reservations.reduce((memo, reservation) => [ ...memo, ...reservation.Instances ], []);
      instances.push(...currentInstances.map(instance => ({ ...instance, Region: region })));
    } while (nextToken);
  }

  return instances;
};

exports.releaseAddress = async function(address) {
  if (!address.Region) {
    throw new Error('Address must have a region', address);
  }

  const ec2 = await loadClient(address.Region);

  const result = await ec2.releaseAddress(pick(address, 'AllocationId')).promise();

  delete address.AssociationId;
  delete address.InstanceId;

  return address;
};

exports.runInstance = async function(region, params) {

  const ec2 = await loadClient(region);

  const result = await ec2.runInstances({
    ...params,
    MaxCount: 1,
    MinCount: 1
  }).promise();

  return {
    ...result.Instances[0],
    Region: region
  };
};

exports.rebootInstances = instancesActionFactory('rebootInstances');
exports.startInstances = instancesActionFactory('startInstances', 'StartingInstances');
exports.stopInstances = instancesActionFactory('stopInstances', 'StoppingInstances');
exports.terminateInstances = instancesActionFactory('terminateInstances', 'TerminatingInstances');

exports.waitForInstances = async function(instances) {
  if (instances.some(instance => !instance.Region)) {
    throw new Error('All instances must have a region', instances);
  }

  const regions = uniq(instances.map(instance => instance.Region));

  for (const region of regions) {

    const ec2 = await loadClient(region);

    const params = {
      InstanceIds: instances.filter(instance => instance.Region === region).map(instance => instance.InstanceId)
    };

    await ec2.waitFor('instanceRunning', params).promise();
  }
};

async function loadClient(region) {
  if (!cachedEc2ByRegion[region]) {

    await loadAwsCredentials();

    cachedEc2ByRegion[region] = new aws.EC2({
      apiVersion: '2016-11-15',
      region
    });
  }

  return cachedEc2ByRegion[region];
}

exports.loadRegionImage = async function(region) {
  return (await loadRegionsConfig())[region].image || await loadConfigProperty('aws_image');
};

exports.loadRegionLimit = async function(region) {
  const limit = (await loadRegionsConfig())[region].limit;
  return limit !== undefined ? limit : 5;
};

exports.loadRegionSecurityGroup = async function(region) {
  return (await loadRegionsConfig())[region].security_group;
};

exports.loadRegions = async function() {
  return keys(await loadRegionsConfig());
};

async function loadRegionsConfig() {
  if (!cachedRegions) {
    cachedRegions = await loadConfigProperty('aws_regions');
  }

  return cachedRegions;
}

function instancesActionFactory(action, statusKey) {
  return async instances => {
    if (instances.some(instance => !instance.Region)) {
      throw new Error('All instances must have a region', instances);
    }

    const regions = uniq(instances.map(instance => instance.Region));
    for (const region of regions) {

      const ec2 = await loadClient(region);
      if (!isFunction(ec2[action])) {
        throw new Error(`AWS SDK EC2 has no "${action}" function`);
      }

      const params = {
        InstanceIds: instances.filter(instance => instance.Region === region).map(instance => instance.InstanceId)
      };

      const result = await ec2[action](params).promise();

      const status = result[statusKey];
      if (status) {
        for (const change of status) {
          const instance = instances.find(i => i.InstanceId === change.InstanceId);
          instance.State = change.CurrentState;
        }
      }
    }

    return instances;
  };
}
