const express = require("express");
const router = express.Router();
const userOperation = require("../control/userController");
const byMiddleware = require("../middleware/authMilleware");

router.post("/signup", userOperation.recordSignUp);
router.get("/viewall", userOperation.viewAll);

//Login api code
router.post("/login", userOperation.userLogin);

// protected route to special authorizer
router.put("/messageupdate", byMiddleware.checkEditAuthorization, userOperation.messageUpdate);
// //protected routes only admin can access
router.delete(
  "/superadmin/delete",
  byMiddleware.checkSuperAdmin,
  userOperation.deleteAccount
);
router.delete(
  "/admin/delete",
  byMiddleware.checkAdmin,
  userOperation.deleteAdminOrUser
);
// router.put(
//   "/admin/changeadmin",
//   middleAuth.checkAdminAuth,
//   userOperation.changeAdmin
// );

module.exports = router;
