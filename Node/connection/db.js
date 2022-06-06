//import required npm

const nano = require("nano");
const val = require("../config/config");

// configure cloudant database using URL,USERNAME,PASSWORD

const url = `https://${val.cloudantUsername}:${val.cloudantPassword}@${val.cloudantUrl}`;

const nanodb = nano(url);

//insert function

const insert = function (objectValue, databaseName) {
  return new Promise((resolve, reject) => {
    if (objectValue == undefined) {
      return reject(objectValue);
    } else {
      const dbResult = nanodb.use(databaseName).insert(objectValue);
      return resolve(dbResult);
    }
  });
};

//get details using find method this function from database

const get = function (query, databaseName) {
  return new Promise((resolve, reject) => {
    if (databaseName == undefined) {
      return reject(databaseName);
    } else {
      const dbResult = nanodb.use(databaseName).find(query);
      return resolve(dbResult);
    }
  });
};

//delete function using id and rev

const deleted = function (_id, _rev, databaseName) {
  return new Promise((resolve, reject) => {
    if (_id == undefined || _rev == undefined) {
      return reject(id);
    } else {
      const dbResult = nanodb.use(databaseName).destroy(_id, _rev);
      return resolve(dbResult);
    }
  });
};

//export the funtions

module.exports = {
  insert,
  get,
  deleted,
};
