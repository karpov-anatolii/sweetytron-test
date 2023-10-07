const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/actionitems", deviceController.getActionItems);
router.get("/topitems", deviceController.getTopItems);
router.get("/hotitems", deviceController.getHotItems);
router.get("/search", deviceController.searchOne);
router.get("/:id", deviceController.getOne);
router.post("/edit", checkRole("ADMIN"), deviceController.editOne);
router.post("/delete", checkRole("ADMIN"), deviceController.deleteOne);
router.post("/comment", deviceController.comment);
router.post("/comments/all", deviceController.commentsAll);
router.post("/delcomment", checkRole("ADMIN"), deviceController.delComment);

module.exports = router;
