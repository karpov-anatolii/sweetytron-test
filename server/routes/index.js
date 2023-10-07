const Router = require("express");
const router = new Router();
const deviceRouter = require("./deviceRouter");
const userRouter = require("./userRouter");
const orderRouter = require("./orderRouter");
const categoryRouter = require("./categoryRouter");
const sectionRouter = require("./sectionRouter");
const slideShowRouter = require("./slideShowRouter");
const articleRouter = require("./articleRouter");
const infoRouter = require("./infoRouter");

router.use("/user", userRouter);
router.use("/device", deviceRouter);
router.use("/order", orderRouter);
router.use("/category", categoryRouter);
router.use("/section", sectionRouter);
router.use("/slideshow", slideShowRouter);
router.use("/article", articleRouter);
router.use("/info", infoRouter);

module.exports = router;
