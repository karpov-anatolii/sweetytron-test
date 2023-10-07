const Router = require("express");
const router = new Router();
const slideShowController = require("../controllers/slideShowController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), slideShowController.create); // вторым параметром вызываем middleware c role = ADMIN
router.get("/", slideShowController.getAll);
router.post("/delete", checkRole("ADMIN"), slideShowController.delete);
router.post("/edit", checkRole("ADMIN"), slideShowController.edit);

module.exports = router;
