//import required

const database = require("../connection/db");
const logger = require("../config/logger");

//controller post method for driver

var Post = async (object) => {
  try {
    var result = await database
      .insert(object, "project_db")
      .then((data) => {
        logger.logger.log(
          "info",
          `diver controller ,success response from insert database ${data}`
        );
        return data;
      })
      .catch((err) => {
        logger.logger.error(
          "error",
          `diver controller ,error response from insert database ${err}`
        );
        return err;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `diver controller ,error  occured in catch block ${error}`
    );
  }
  return result;
};

//controller get method for getting detail using type for driver

var Get = async (query) => {
  try {
    var result = await database
      .get(query, "project_db")
      .then((data) => {
        logger.logger.log(
          "info",
          `diver controller ,success response from database from get database method ${data}`
        );
        return data;
      })
      .catch((err) => {
        logger.logger.error(
          "error",
          `diver controller ,error response from get method of database ${err}`
        );
        return err;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `diver controller ,error occured in catch block ${error}`
    );
  }
  return result;
};

//controller get method for getting details for driver

var GetParticularDetails = async (id) => {
  try {
    var result = await database
      .getAll(id, "project_db")
      .then((data) => {
        logger.logger.log(
          "info",
          `diver controller ,success response from database from getall database method ${data}`
        );
        return data;
      })
      .catch((err) => {
        logger.logger.error(
          "error",
          `diver controller ,error response from getall method of database ${err}`
        );
        return err;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `diver controller ,error occured in catch block ${error}`
    );
  }
  return result;
};

//controller delete method for driver

var DeleteDetails = async (id, rev) => {
  try {
    var result = await database
      .deleted(id, rev, "project_db")
      .then((data) => {
        logger.logger.log(
          "info",
          `diver controller ,success response from database from delete details database method ${data}`
        );
        return data;
      })
      .catch((err) => {
        logger.logger.error(
          "error",
          `diver controller ,error response from delete details method of database ${err}`
        );
        return err;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `diver controller ,error  occured in catch block ${error}`
    );
  }
  return result;
};

//controller update method for driver

var UpdateDetails = async (objectValue) => {
  try {
    var result = await database
      .update(objectValue, "project_db")
      .then((data) => {
        logger.logger.log(
          "info",
          `diver controller ,success response from database from update  database method ${data}`
        );
        return data;
      })
      .catch((err) => {
        logger.logger.error(
          "error",
          `diver controller ,error response from update details method of database ${err}`
        );
        return err;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `diver controller ,error  occured in catch block ${error}`
    );
  }
  return result;
};

//export the methods

module.exports = {
  Post,
  Get,
  GetParticularDetails,
  DeleteDetails,
  UpdateDetails,
};
