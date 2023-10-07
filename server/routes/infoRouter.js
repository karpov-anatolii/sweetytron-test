const Router = require("express");
const router = new Router();
const infoController = require("../controllers/infoController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/", infoController.getAll);
router.post("/edit", checkRole("ADMIN"), infoController.create); // вторым параметром вызываем middleware c role = ADMIN

module.exports = router;
