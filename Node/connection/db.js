//import required npm

const nano = require("nano");
const val = require("../config/config");

// configure cloudant database using URL,USERNAME,PASSWORD

const url = `https://${val.CLOUDANT_USERNAME}:${val.CLOUDANT_PASSWORD}@${val.CLOUDANT_URL}`;

const nanodb = nano(url);

//insert function

const insert = function (objectValue, dbname) {
  return new Promise((resolve, reject) => {
    if (objectValue == undefined) {
      return reject(objectValue);
    } else {
      const dbresult = nanodb.use(dbname).insert(objectValue);
      return resolve(dbresult);
    }
  });
};

//get details using find method this function from database

const get = function (query, database_name) {
  return new Promise((resolve, reject) => {
    if (database_name == undefined) {
      return reject(database_name);
    } else {
      const dbresult = nanodb.use(database_name).find(query);
      return resolve(dbresult);
    }
  });
};

//delete function using id and rev

const deleted = function (_id, _rev, database_name) {
  return new Promise((resolve, reject) => {
    if (_id == undefined || _rev == undefined) {
      return reject(id);
    } else {
      const dbresult = nanodb.use(database_name).destroy(_id, _rev);
      return resolve(dbresult);
    }
  });
};

//export the funtions

module.exports = {
  insert,
  get,
  deleted,
};
