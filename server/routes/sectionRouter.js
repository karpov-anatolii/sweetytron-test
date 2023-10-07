const Router = require("express");
const router = new Router();
const sectionController = require("../controllers/sectionController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), sectionController.create); // вторым параметром вызываем middleware c role = ADMIN
router.get("/", sectionController.getAll);
router.post("/delete", checkRole("ADMIN"), sectionController.delete);
router.post("/edit", checkRole("ADMIN"), sectionController.edit);

module.exports = router;
