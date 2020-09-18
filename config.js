const _ = require('lodash');
const fs = require('fs');

const config = {
  title: 'Media Engineering Architecture & Deployment',
  version: '2020-2021',
  repoUrl: 'https://github.com/MediaComem/comem-archidep',
  remark: {
    highlightLines: true,
    highlightSpans: true,
    countIncrementalSlides: false,
    navigation: {
      click: false,
      scroll: false,
      touch: false
    }
  },
  publish: {
    gitUrl: 'git@github.com:MediaComem/comem-archidep.git',
    baseUrl: 'https://mediacomem.github.io/comem-archidep',
    branch: 'gh-pages',
    version: '2020-2021'
  }
};

// Load `config.local.js` if it exists
if (fs.existsSync('./config.local.js')) {
  _.merge(config, require('./config.local'));
}

module.exports = config;
