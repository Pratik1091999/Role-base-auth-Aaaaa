const recordsModel = require("../model/records");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var validator = require("email-validator"); //npm i email-validator for email Validation

//userOperation class is a parent of all members/static method
class userOperation {
  //signup api code
  static recordSignUp = async (req, res) => {
    const { name, email, role, password, message } = req.body;
    let roleId;
    let doc;
    if (name && email && role && password && message) {
      if (validator.validate(email)) {
        //Now dataRecord is database
        let user = await recordsModel.findOne({ email: email });
        if (user) {
          res.status(400).json({ message: "Email is already Exists" });
        } else {
          //checking Valid Rollname
          if (role == "Super Admin" || role == "super admin") {
            roleId = 1;
          } else if (role == "Admin" || role == "admin") {
            roleId = 2;
          } else if (role == "User" || role == "user") {
            roleId = 3;
          }
          //checking role
          if (roleId) {
            //checking superAdmin is already exists or not
            if (roleId === 1) {
              let superAdmin = await recordsModel.findOne({
                roleTypeId: roleId,
              });
              if (superAdmin) {
                return res.send(
                  "Super Admin Is already Exists ,You Cant Set Role as Super Admin "
                );
              }
            }
            let salt = await bcrypt.genSalt(10);
            let hashPassword = await bcrypt.hash(password, salt);
            try {
              doc = new recordsModel({
                name: name,
                email: email,
                role: role,
                roleTypeId: roleId,
                pass: hashPassword,
                message: message,
              });
              res.status(200).json({ message: "Registeration Successful" });
              return doc.save();
            } catch (error) {
              res.send(error);
              console.log(error);
            }
          } else {
            res
              .status(400)
              .json({ message: "Please Enter Valid Role ex.:Admin, User" });
          }
        }
      } else {
        res.send("Invalid EmailID, Enter Valid Email");
      }
    } else {
      res.status(400).json({ message: "All Fields are required" });
    }
  };

  //Login API
  static userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      if (validator.validate(email)) {
        let user = await recordsModel.findOne({ email: email });
        let checkLoginSuccess = await bcrypt.compare(password, user.pass);
        if (checkLoginSuccess) {
          let token = jwt.sign({ userID: user._id }, process.env.SecretKey, {
            expiresIn: "20m",
          });
          res
            .status(200)
            .json({ Status: "Login Successful", "Your Token": token });
        } else {
          res.status(401).json({
            message: "Incorrect Password, Please Enter valid Password",
          });
        }
      } else {
        res
          .status(400)
          .json({ message: "Invalid Email, Please Enter Valid EmailId!" });
      }
    } else {
      res.status(400).json({ message: "All Fileds are required!!" });
    }
  };
  //view all Message and account
  static viewAll = async (req, res) => {
    try {
      let data = await recordsModel.find();
      res.status(200).json({ data });
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  };
  //update through middleware
  static messageUpdate = async (req, res) => {
    const { email, updateMessage } = req.body;
    if (email && updateMessage) {
      if (validator.validate(email)) {
        let user = await recordsModel
          .findOne({ email: email })
          .select("name message");
        if (user) {
          try {
            await recordsModel.findByIdAndUpdate(user._id, {
              $set: { message: updateMessage },
            });
            res.json({ message: " Message Updated" });
          } catch (error) {
            res.send(error);
          }
        } else {
          res.send("Your Email Doesn't Exists!");
        }
      } else {
        res.send("You Entered Invalid Email! Please Enter valid Email ");
      }
    } else {
      res.send("All Fields are required!!");
    }
  };
  static deleteAccount = async (req, res) => {
    const { email } = req.body;
    if (email) {
      if (validator.validate(email)) {
        let user = await recordsModel.findOne({ email: email });
        if (user) {
          try {
            await recordsModel.findByIdAndDelete(user._id);

            res.status(200).json({ Status: " Deleted Successfully" });
          } catch (error) {
            console.log(error);
            res.send("Unable to delete");
          }
        } else {
          res.send("Email Doesn't Exists!!");
        }
      } else {
        res.send("Invalid Email, Enter Valid Email");
      }
    } else {
      res.status(400).json({ message: "Email field is required!!" });
    }
  };

  static deleteAdminOrUser = async (req, res) => {
    const { email } = req.body;
    if (email) {
      if (validator.validate(email)) {
        let user = await recordsModel.findOne({ email: email });
        if (user) {
          if (user.roleTypeId === 1) {
            return res.send("You Can't Delete Super Admin");
          }
          try {
            await recordsModel.findByIdAndDelete(user._id);

            res.status(200).json({ Status: " Deleted Successfully" });
          } catch (error) {
            console.log(error);
            res.send("Unable to delete");
          }
        } else {
          res.send("Email Doesn't Exists!!");
        }
      } else {
        res.send("Invalid Email, Enter valid Email");
      }
    } else {
      res.send("Email is required!");
    }
  };
}
module.exports = userOperation;
