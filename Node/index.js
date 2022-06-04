//import the reqiured files and npm

const express = require("express");
const controller = require("./controllers/controller");
const bodyparser = require("body-parser");
const app = express();
const logger = require("./config/logger");
const port = 8000;
const cors = require("cors");
app.use(bodyparser.json());

//validator import statement
const userValidator = require("./controllers/validators/user_validator/user.schema");
const driverValidator = require("./controllers/validators/driver_validator/driver.schema");
const vehicleValidator = require("./controllers/validators/vehicle_validator/vehicle.schema");
const tripValidator = require("./controllers/validators/trip_validator/trip.schema");
const fuelValidator = require("./controllers/validators/fuel_validator/fuel.schema");
const maintanenceValidator = require("./controllers/validators/maintanence_validator/maintanence.schema");
const insuranceValidator = require("./controllers/validators/insurance_validator/insurance.schema");

//allow the given origin port in node

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

//admin user login using username and password---------------

app.get("/get_login_user/:username/:password", (request, response) => {
  const data = {
    selector: {
      type: "user",
      username: request.params.username,
      password: request.params.password,
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_login_user  response of the user's  username and password send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get_login_id of users");
      logger.logger.error("error", `can not get_login_id of users data ${err}`);
    });
});

//User--------------------------------------------------------
//To post the user data to the database from node

app.post("/postUser", (request, response) => {
  const object = {
    name: request.body.name,
    username: request.body.username,
    password: request.body.pwd,
    mobile: request.body.mobile,
    dob: request.body.dob,
    city: request.body.city,
    state: request.body.state,
    type: "user",
  };
  const value = userValidator.userSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_user response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post the user's details from node ");
        logger.logger.error(
          "error",
          `can not post the user's details from node ${err}`
        );
      });
  }
});

//To get details using query with type from database

app.get("/getUser", (_request, response) => {
  const data = {
    selector: {
      type: "user",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_user list response of the user's  _id & _rev send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of users");
      logger.logger.error("error", `can not get _id of users data ${err}`);
    });
});

//To get the all user data value using id from database

app.get("/getUser/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "user",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_user details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of users data");
      logger.logger.error("error", `can not get details of users data ${err}`);
    });
});

//To delete particular user using id and rev from database

app.delete("/deleteUser/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_user details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of users data");
      logger.logger.error(
        "error",
        `can not delete details of users data ${err}`
      );
    });
});

// To update the particular user data using id

app.put("/updateUser", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    name: request.body.name,
    username: request.body.username,
    password: request.body.pwd,
    mobile: request.body.mobile,
    dob: request.body.dob,
    city: request.body.city,
    state: request.body.state,
    type: "user",
  };
  const value = userValidator.userSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_user response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not delete details of users data ");
        logger.logger.error(
          "error",
          `can not delete details of users data ${err}`
        );
      });
  }
});

// Driver-----------------------------------------------------------
// To post the driver data to the database

app.post("/postDriver", (request, response) => {
  const object = {
    drivername: request.body.drivername,
    mobile: request.body.mobile,
    licencenumber: request.body.licencenumber,
    licenceenddate: request.body.licenceenddate,
    city: request.body.city,
    state: request.body.state,
    userId: request.body.userId,
    type: "driver",
  };
  const value = driverValidator.driverPostSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_driver response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of drivers data ");
        logger.logger.error(
          "error",
          `can not post details of drivers data ${err}`
        );
      });
  }
});

//To get details using query with type from database

app.get("/getDriver", (_request, response) => {
  const data = {
    selector: {
      type: "driver",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_driver list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of driver data");
      logger.logger.error("error", `can not get _id of drivers data ${err}`);
    });
});

//To get the all driver data value using id from database

app.get("/getDriver/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "driver",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_driver details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of driver data");
      logger.logger.error("error", `can not get details of driver data ${err}`);
    });
});

//To delete particular driver details using id and rev from database

app.delete("/deleteDriver/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_driver details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of driver data");
      logger.logger.error(
        "error",
        `can not delete details of diver data ${err}`
      );
    });
});

// To update the particular driver data using id

app.put("/updateDriver", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    drivername: request.body.drivername,
    mobile: request.body.mobile,
    licencenumber: request.body.licencenumber,
    licenceenddate: request.body.licenceenddate,
    city: request.body.city,
    state: request.body.state,
    userId: request.body.userId,
    type: "driver",
  };
  const value = driverValidator.driverUpdateSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
    console.log("err", value.error);
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_driver response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not update details of driver data");
        logger.logger.error(
          "error",
          `can not update details of driver data ${err}`
        );
      });
  }
});

//----------------------------------------------------------------

//Vehicle---------------------------------------------------------
//To post the vehicle data to the database
app.post("/postVehicle", (request, response) => {
  const object = {
    vehiclenumber: request.body.vehiclenumber,
    vehicletype: request.body.vehicletype,
    color: request.body.color,
    registerdate: request.body.registerdate,
    chasisno: request.body.chasisno,
    cost: request.body.cost,
    userId: request.body.userId,
    type: "vehicle",
  };
  const value = vehicleValidator.vehiclePostSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_vehicle response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the vehicle");
        logger.logger.error(
          "error",
          `can not post details of the vehicle ${err}`
        );
      });
  }
});

//To get details using query with type from database
app.get("/getVehicle", (_request, response) => {
  const data = {
    selector: {
      type: "vehicle",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_vehicle list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of vehicel data");
      logger.logger.error("error", `can not get _id of vehicle data ${err}`);
    });
});

//To get the all vehicle's data using id from database
app.get("/getVehicle/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "vehicle",
    },
  };
  controller
    .Get(data)
    .then(async (res) => {
      let returnResponse = await res;
      returnResponse = returnResponse.data.docs[0];
      response.send(returnResponse);
      logger.logger.log(
        "info",
        `get_vehicle details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of vehicel data");
      logger.logger.error(
        "error",
        `can not get details of vehicel data ${err}`
      );
    });
});

//To delete particular vehicle data  using id and rev from database

app.delete("/deleteVehicle/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_vehicle details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of vehicle data");
      logger.logger.error(
        "error",
        `can not delete details of vehicle data ${err}`
      );
    });
});

// To update the particular vehicle data using id

app.put("/updateVehicle", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    vehiclenumber: request.body.vehiclenumber,
    vehicletype: request.body.vehicletype,
    color: request.body.color,
    registerdate: request.body.registerdate,
    chasisno: request.body.chasisno,
    cost: request.body.cost,
    userId: request.body.userId,
    type: "vehicle",
  };
  const value = vehicleValidator.vehicleUpdateSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_vehicle response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the vehicle ");
        logger.logger.error(
          "error",
          `can not update details of the vehicle ${err}`
        );
      });
  }
});

//-------------------------

//Fuel---------------------------------------------------------
//To post the fuel data to the database
app.post("/postFuel", (request, response) => {
  const object = {
    fuel: request.body.fuel,
    quantity: request.body.quantity,
    fillingdate: request.body.fillingdate,
    cost: request.body.cost,
    vehicle_Id: request.body.vehicle_Id,
    type: "fuel",
  };
  const value = fuelValidator.fuelPostSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_fuel response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the fuel");
        logger.logger.error("error", `can not post details of the fuel ${err}`);
      });
  }
});

//To get details using query with type from database
app.get("/getFuel", (_request, response) => {
  const data = {
    selector: {
      type: "fuel",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_fuel list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of fuel data");
      logger.logger.error("error", `can not get _id of fuel data ${err}`);
    });
});

//To get the all fuel's data using id from database

app.get("/getFuel/:id", (request, response) => {
  const data = {
    selector: {
      id: request.params.id,
      type: "fuel",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_fuel details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of fuel data");
      logger.logger.error("error", `can not get details of fuel data ${err}`);
    });
});

//To delete particular fuel data using id and rev from database

app.delete("/deleteFuel/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_fuel details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of fuel data");
      logger.logger.error(
        "error",
        `can not delete details of fuel data ${err}`
      );
    });
});

// To update the particular fuel data using id

app.put("/updateFuel", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    fuel: request.body.fuel,
    quantity: request.body.quantity,
    fillingdate: request.body.fillingdate,
    cost: request.body.cost,
    vehicle_Id: request.body.vehicle_Id,
    type: "fuel",
  };
  const value = fuelValidator.fuelUpdateSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
    console.log("user validation");
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_fuel response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not update details of the fuel");
        logger.logger.error("error", `can not post details of the fuel ${err}`);
      });
  }
});

//----------------------------------------------------------

//Insurance---------------------------------------------------------
//To post the insurance data to the database

app.post("/postInsurance", (request, response) => {
  const object = {
    company: request.body.company,
    startdate: request.body.startdate,
    enddate: request.body.enddate,
    cost: request.body.cost,
    vehicle: request.body.vehicle,
    type: "insurance",
  };
  const value = insuranceValidator.insurancePostSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
    console.log("user validation");
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_insurance response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the insurance");
        logger.logger.error(
          "error",
          `can not post details of the insurance ${err}`
        );
      });
  }
});

//To get details using query with type from database

app.get("/getInsurance", (_request, response) => {
  const data = {
    selector: {
      type: "insurance",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_insurance list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of insurance data");
      logger.logger.error("error", `can not get _id of insurance data ${err}`);
    });
});

//To get the all insurance's data using id from database

app.get("/getInsurance/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "insurance",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_insurance details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of insurance data");
      logger.logger.error(
        "error",
        `can not get details of insurance data ${err}`
      );
    });
});

//To delete particular insurance from database using id and rev

app.delete("/deleteInsurance/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_insurance details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of insurance data");
      logger.logger.error(
        "error",
        `can not delete details of insurance data ${err}`
      );
    });
});

// To update the particular insurance data using id

app.put("/updateInsurance", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    company: request.body.company,
    startdate: request.body.startdate,
    enddate: request.body.enddate,
    cost: request.body.cost,
    vehicle: request.body.vehicle,
    type: "insurance",
  };
  const value = insuranceValidator.insuranceUpdateSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_insurance response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not update details of the insurance");
        logger.logger.log(
          "info",
          `can not update details of the insurance ${err}`
        );
      });
  }
});

//----------------------------------------------------------

//Maintanence---------------------------------------------------------
//To post the maintanence data to the database

app.post("/postMaintanence", (request, response) => {
  const object = {
    date: request.body.date,
    cost: request.body.cost,
    description: request.body.description,
    vehicle: request.body.vehicle,
    type: "maintanence",
  };
  const value = maintanenceValidator.maintanencePostSchema.validate(
    request.body
  );
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_maintanence response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the maintanence");
        logger.logger.error(
          "error",
          `can not post details of the maintanence${err}`
        );
      });
  }
});

//To get details using query with type from database

app.get("/getMaintanence", (_request, response) => {
  const data = {
    selector: {
      type: "maintanence",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_maintanence list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of maintanence data");
      logger.logger.error(
        "error",
        `can not get _id of maintanence data ${err}`
      );
    });
});

//To get the all maintanence's data using id from database
app.get("/getMaintanence/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "maintanence",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_maintanence details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of maintanence data");
      logger.logger.error(
        "error",
        `can not get details of maintanence data ${err}`
      );
    });
});

//To delete particular maintanence data using id and rev from database

app.delete("/deleteMaintanence/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_maintanence details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of maintanence data");
      logger.logger.error(
        "error",
        `can not delete details of maintanence data from node ${err}`
      );
    });
});

// To update the particular maintanence data using id

app.put("/updateMaintanence", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    date: request.body.date,
    cost: request.body.cost,
    description: request.body.description,
    vehicle: request.body.vehicle,
    type: "maintanence",
  };
  const value = maintanenceValidator.maintanenceUpdateSchema.validate(
    request.body
  );
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_maintanence response send to the angular from node ${res}`
        );
      })
      .catch((err) => {
        response.send("can not update details of the maintanence");
        logger.logger.log(
          "error",
          `can not update details of the maintanence ${err}`
        );
      });
  }
});

//Trip---------------------------------------------------------
//To post the Trip data to the database

app.post("/postTrip", (request, response) => {
  const object = {
    from: request.body.from,
    to: request.body.to,
    date: request.body.date,
    driver_id: request.body.driver_id,
    vehicle_id: request.body.vehicle_id,
    userId: request.body.userId,
    type: "trip",
  };
  const value = tripValidator.tripPostSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `post_trip response send to the angular ${res}`
        );
      })
      .catch((err) => {
        response.send("can not post details of the trip");
        logger.logger.error("error", `can not post details of the trip ${err}`);
      });
  }
});

//To get details using query with type from database
app.get("/getTrip", (_request, response) => {
  const data = {
    selector: {
      type: "trip",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_trip list of the user's  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get _id of trip data");
      logger.logger.error("error", `can not get _id of trip data ${err}`);
    });
});

//To get the all trip's data using id from database
app.get("/getTrip/:id", (request, response) => {
  const data = {
    selector: {
      _id: request.params.id,
      type: "vehicle",
    },
  };
  controller
    .Get(data)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `get_trip details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not get details of trip data");
      logger.logger.error("error", `can not get details of trip data ${err}`);
    });
});

//To delete particular trip data using id and rev from database

app.delete("/deleteTrip/:id/:rev", (request, response) => {
  controller
    .DeleteDetails(request.params.id, request.params.rev)
    .then((res) => {
      response.send(res);
      logger.logger.log(
        "info",
        `delete_trip details of the user's from  _id send to the angular ${res}`
      );
    })
    .catch((err) => {
      response.send("can not delete details of trip data");
      logger.logger.error(
        "error",
        `can not delete details of trip data from node ${err}`
      );
    });
});

// To update the particular trip data using id

app.put("/updateTrip", (request, response) => {
  const object = {
    _id: request.body._id,
    _rev: request.body._rev,
    from: request.body.from,
    to: request.body.to,
    date: request.body.date,
    driver_id: request.body.driver_id,
    vehicle_id: request.body.vehicle_id,
    userId: request.body.userId,
    type: "trip",
  };
  const value = tripValidator.tripUpdateSchema.validate(request.body);
  if (value.error) {
    response.json({
      success: 0,
      message: value.error.details[0].message,
    });
  } else {
    controller
      .Post(object)
      .then((res) => {
        response.send(res);
        logger.logger.log(
          "info",
          `update_trip response send to the angular from node ${res}`
        );
      })
      .catch((err) => {
        response.send("can not update details of the trip");
        logger.logger.log("error", `can not update details of the trip ${err}`);
      });
  }
});

//----------------------------------------------------------

//listing port----------------------------------------------

app.listen(port, (err) => {
  if (err) {
    logger.logger.error("error", `something bad happened ${err}`);
  }
  logger.logger.log("info", `server is listening on http://localhost:${port}`);
});
