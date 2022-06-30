const jwt = require("jsonwebtoken");

const recordsModel = require("../model/records");


  
  // const verifyForUpdate = async (req, res, next) => {
    
  //     try {
  //      const token = req.headers.authorization.split(" ")[1];
  //      const { userID } = jwt.verify(token, process.env.SECRET)
  //      var user = await recordsModel.findById(userID);
  //      console.log(user.role)
  //      if(user.roleTypeId === 3 || user.roleTypeId === 2 || user.roleTypeId === 1){
  //        next();
  //      }else{
  //        res.send("You haven't Autority to Update")
  //      }
      
  //     } catch (error) {  
  //       res.status(401).json({"message":"UnAuthorized User"})
  //     }
     
  //  }
  const checkEditAuthorization = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        //Get Token from User
        token = authorization.split(" ")[1];
      
        const {userID}   = jwt.verify(token, process.env.SecretKey);
        console.log(userID);
        // after verification Get User from Token
        var user = await recordsModel.findById(userID)
        
      } catch (error) {
        console.log(error);
        res.status(401).json({ "message": "Unauthorized User !!" });
      }
    }

    if (!token) {
      res.send("Unauthorize user with No token!!");
    }
    if(user.roleTypeId == 1 || user.roleTypeId == 2 || user.roleTypeId == 3) {
      next();
    } else {
      console.log(user.role)
      res.status(401).json({ "message": "You haven't authority " });
    }
  };

  const checkAdmin = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        //Get Token from User
        token = authorization.split(" ")[1];
        
        const {userID}   = jwt.verify(token, process.env.SecretKey);
        console.log(userID);
        var user = await recordsModel.findById(userID)
        // after verification Get User from Token
       
      } catch (error) {
        console.log(error);
        res.status(401).json({ "message": "Unauthorized User !!" });
      }
    }

    if (!token) {
      res.send("Unauthorize user with No token!!");
    }
    if(user.roleTypeId == 1 || user.roleTypeId == 2) {
      next();
    } else {
      console.log(user.role)
      res.status(401).json({ "message": "You haven't authority " });
    }
  };

  const checkSuperAdmin = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        //Get Token from User
        token = authorization.split(" ")[1];
      
        const {userID}   = jwt.verify(token, process.env.SecretKey);
        console.log(userID);
        var user = await recordsModel.findById(userID)
        // after verification Get User from Token
      } catch (error) {
        console.log(error);
        res.status(401).json({ "message": "Unauthorized User !!" });
      }
    }

    if (!token) {
      res.send("Unauthorize user with No token!!");
    }
    if(user.roleTypeId == 1) {
      next();
    } else {
      console.log(user.role)
      res.status(401).json({ "message": "You haven't authority " });
    }
  };


module.exports = {
  checkSuperAdmin,
  checkAdmin,
  checkEditAuthorization
};