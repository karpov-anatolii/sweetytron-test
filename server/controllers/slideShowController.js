const { SlideShow } = require("../models/models");
const ApiError = require("../error/ApiError");
const path = require("path");
const fs = require("fs/promises");
const { imageSaver } = require("./imageSaver");

class slideShowController {
  async create(req, res, next) {
    try {
      const { title, text, show } = req.body;
      let fileName = "";
      if (req.files) {
        const { img } = req.files;
        fileName = imageSaver(img, "images", 250, null, null);
      }

      const slideshow = await SlideShow.create({
        title,
        text,
        img: fileName,
        show,
      });
      return res.json(slideshow);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const slideshow = await SlideShow.findAll();
      return res.json(slideshow);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;

      //delete images
      await SlideShow.findOne({
        where: { id },
      }).then((slide) => {
        let filePathName = path.resolve(
          __dirname,
          "../static/images",
          slide.img
        );
        fs.unlink(filePathName).catch((err) => console.log(err));
      });

      await SlideShow.destroy({ where: { id } });

      return res.json("Deleted id=" + id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async edit(req, res, next) {
    try {
      const { title, text, show, id, oldFileName } = req.body;
      let fileName;
      if (req.files) {
        const { img } = req.files;
        fileName = imageSaver(img, "images", 250, null, null);

        //delete old images
        await SlideShow.findOne({
          where: { id },
        }).then((slide) => {
          let filePathName = path.resolve(
            __dirname,
            "../static/images",
            slide.img
          );
          fs.unlink(filePathName).catch((err) => console.log(err));
        });
      }

      const slideshow = await SlideShow.update(
        {
          title,
          text,
          show,
          img: fileName ? fileName : oldFileName,
        },
        { where: { id } }
      );
      return res.json(fileName ? fileName : oldFileName);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new slideShowController();
