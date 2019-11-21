// from https://codeburst.io/node-js-best-practices-smarter-ways-to-manage-config-files-and-variables-893eef56cbef

import appRoot from 'app-root-path';
// module variables
import config from './config.json';
const environment = process.env.NODE_ENV || 'production';
const environmentConfig = config[environment];

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = environmentConfig;
global.gConfig.APP_ROOT = appRoot;
