const Router = require("express");
const router = new Router();
const articleController = require("../controllers/articleController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), articleController.create); // вторым параметром вызываем middleware c role = ADMIN
router.get("/", articleController.getAll);
router.get("/:id", articleController.getOne);
router.post("/delete", checkRole("ADMIN"), articleController.delete); // вторым параметром вызываем middleware c role = ADMIN
router.post("/edit", checkRole("ADMIN"), articleController.edit); // вторым параметром вызываем middleware c role = ADMIN

module.exports = router;
