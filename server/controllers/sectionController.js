const { Section, Device } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs/promises");
const { imageSaver } = require("./imageSaver");

class SectionController {
  async create(req, res, next) {
    try {
      const { name, categoryId } = req.body;
      let fileName = "";
      if (req.files) {
        const { img } = req.files;
        fileName = imageSaver(img, "images", 200, null, null);
      }
      const section = await Section.create({ name, categoryId, img: fileName });
      return res.json(section);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      if (req.query.categoryId) {
        let { categoryId } = req.query;
        const sections = await Section.findAll({ where: { categoryId } });
        return res.json(sections);
      }
      const sections = await Section.findAll();
      return res.json(sections);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;

      await Section.destroy({ where: { id } }).catch((err) => console.log(err));

      return res.json(id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async edit(req, res, next) {
    try {
      const { name, id, file } = req.body;
      if (req.files) {
        const { img } = req.files;
        let fileName = imageSaver(img, "images", 200, null, null);

        //delete old images
        await Section.findOne({
          where: { id },
        }).then((section) => {
          let oldFileName = section.img;
          let filePathName = path.resolve(
            __dirname,
            "../static/images",
            oldFileName
          );

          fs.unlink(filePathName).catch((er) => console.log(er));

          Section.update(
            {
              img: fileName,
              name,
            },
            { where: { id } }
          );
          return res.json(fileName);
        });
      } else {
        Section.update(
          {
            name,
          },
          { where: { id } }
        );
        return res.json(file);
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new SectionController();
