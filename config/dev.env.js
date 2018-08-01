'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://api.beta.d.yjiayun.com/admin/"',
  UPLOAD_URL:'"http://beta.s.yjiayun.com/api/fileupload"',
  // BASE_API: '"http://192.168.1.40:8098/admin"'
  // BASE_API: '"http://192.168.1.199:8080/admin"'
  // BASE_API: '"//localhost:9528/admin/"'
  // BASE_API: '"http://192.168.205.24:8087/admin"'  //zeng
  // BASE_API: '"http://192.168.205.222:8080/admin"' //wang
  // BASE_API: '"http://192.168.205.125:8080/admin"'
});
