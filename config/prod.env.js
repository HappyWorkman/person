'use strict';
console.log('BASE_API', process.env.BASE_API);
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: process.env.BASE_API || '"http://api.beta.d.yjiayun.com/admin/"',
  UPLOAD_URL: process.env.UPLOAD_URL || '"http://beta.s.yjiayun.com/api/fileupload"'
};
