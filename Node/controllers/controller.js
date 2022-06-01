//import required files

const database = require("../connection/db");
const logger = require("../config/logger");

//controller post method

var Post = async (object) => {
  try {
    var result = await database
      .insert(object, "project_db")
      .then((data) => {
        const status = {
          status: 201,
          message: "Data was post successfully into database",
          data: data,
        };
        logger.logger.log(
          "info",
          `status_code:${status.status} message:${status.message}`
        );
        return status;
      })
      .catch((err) => {
        const err_status = {
          status: 409,
          message: "Cannot post data into database",
          data: err,
        };
        logger.logger.error(
          "error",
          `status_code:${err_status.status} message:${err_status.message}`
        );
        return err_status;
      });
  } catch (error) {
    logger.logger.error("error", `error  occured in post catch block ${error}`);
  }
  return result;
};

//controller get method for getting detail using type

var Get = async (query) => {
  try {
    var result = await database
      .get(query, "project_db")
      .then((data) => {
        if (data.bookmark == "nil") {
          const status = {
            status: 404,
            message: "Data was not found in database",
            data: data,
          };
          logger.logger.error(
            "error",
            `status_code:${status.status} message:${status.message}`
          );
          return status;
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
        const err_status = {
          status: 404,
          message: "Data not found",
          data: err,
        };
        logger.logger.error(
          "error",
          `status_code:${err_status.status} message:${err_status.message}`
        );
        return err_status;
      });
  } catch (error) {
    logger.logger.error("error", `error occured in get catch block ${error}`);
  }
  return result;
};

//controller get method for getting details

var GetParticularDetails = async (id) => {
  try {
    var result = await database
      .getAll(id, "project_db")
      .then((data) => {
        if (data.bookmark == "nil") {
          const status = {
            status: 404,
            message: "Data was not found in database",
            data: data,
          };
          logger.logger.error(
            "error",
            `status_code:${status.status} message:${status.message}`
          );
          return status;
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
        const err_status = {
          status: 404,
          message: "Data not found",
          data: err,
        };
        logger.logger.error(
          "error",
          `status_code:${err_status.status} message:${err_status.message}`
        );
        return err_status;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `error occured in get particular catch block ${error}`
    );
  }
  return result;
};

//controller delete method

var DeleteDetails = async (id, rev) => {
  try {
    var result = await database
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
        const err_status = {
          status: 409,
          message: "Cannot delete data from database",
          data: err,
        };
        logger.logger.error(
          "error",
          `status_code:${err_status.status} message:${err_status.message}`
        );
        return err_status;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `error  occured in delete catch block ${error}`
    );
  }
  return result;
};

//controller update method

var UpdateDetails = async (objectValue) => {
  try {
    var result = await database
      .update(objectValue, "project_db")
      .then((data) => {
        const status = {
          status: 201,
          message: "Data was updated successfully in database",
          data: data,
        };
        logger.logger.log(
          "info",
          `status_code:${status.status} message:${status.message}`
        );
        return status;
      })
      .catch((err) => {
        const err_status = {
          status: 409,
          message: "Cannot update data in database",
          data: err,
        };
        logger.logger.error(
          "error",
          `status_code:${err_status.status} message:${err_status.message}`
        );
        return err_status;
      });
  } catch (error) {
    logger.logger.error(
      "error",
      `error  occured in update catch block ${error}`
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
