const Router = require("express");
const router = new Router();
const categoryController = require("../controllers/categoryController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), categoryController.create); // вторым параметром вызываем middleware c role = ADMIN
router.get("/", categoryController.getAll);
router.post("/delete", checkRole("ADMIN"), categoryController.delete); 
router.post("/edit", checkRole("ADMIN"), categoryController.edit);

module.exports = router;
