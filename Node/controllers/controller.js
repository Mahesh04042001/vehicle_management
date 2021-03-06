//import required files

const database = require("../connection/db");
const logger = require("../config/logger");

//controller post method

const post = async (object) => {
  try {
    return await database
      .insert(object, "project_db")
      .then((data) => {
        const postStatus = {
          status: 201,
          message: "Data was post successfully into database",
          data: data,
        };
        logger.logger.log(
          "info",
          `status_code:${postStatus.status} message:${postStatus.message}`
        );
        return postStatus;
      })
      .catch((err) => {
        const errStatus = {
          status: err.statusCode,
          message: err.error,
          reason: err.reason,
        };
        logger.logger.error(
          "error",
          `status_code:${errStatus.status} message:${errStatus.message} reason${errStatus.reason}`
        );
        return errStatus;
      });
  } catch (error) {
    logger.logger.error("error", `error  occured in post catch block ${error}`);
  }
};

//controller get method for getting detail using type and also id

const get = async (query) => {
  try {
    return await database
      .get(query, "project_db")
      .then((data) => {
        if (data.bookmark == "nil") {
          const getStatus = {
            status: 404,
            message: "Data was not found in database",
            data: data,
          };
          logger.logger.error(
            "error",
            `status_code:${getStatus.status} message:${getStatus.message}`
          );
          return getStatus;
        }
        const status = {
          status: 200,
          message: "Data was get successfully form database",
          data: data,
        };
        logger.logger.log(
          "info",
          `status_code:${status.status} message:${status.message}`
        );
        return status;
      })
      .catch((err) => {
        const errStatus = {
          status: err.statusCode,
          message: err.error,
          reason: err.reason,
        };
        logger.logger.log(
          "info",
          `status_code:${errStatus.status} message:${errStatus.message} reason:${errStatus.reason}`
        );
        return errStatus;
      });
  } catch (error) {
    logger.logger.error("error", `error occured in get catch block ${error}`);
  }
  return result;
};

//controller delete method

const deleteDetails = async (id, rev) => {
  try {
    return await database
      .deleted(id, rev, "project_db")
      .then((data) => {
        const status = {
          status: 200,
          message: "Data was deleted successfully from database",
          data: data,
        };
        logger.logger.log(
          "info",
          `status_code:${status.status} message:${status.message}`
        );
        return status;
      })
      .catch((err) => {
        const errStatus = {
          status: err.statusCode,
          message: err.error,
          reason: err.reason,
        };
        logger.logger.error(
          "error",
          `status_code:${errStatus.status} message:${errStatus.message} reason:${errStatus.reason}`
        );
        return errStatus;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `error  occured in delete catch block ${error}`
    );
  }
};

//export the methods

module.exports = {
  post,
  get,
  deleteDetails,
};
