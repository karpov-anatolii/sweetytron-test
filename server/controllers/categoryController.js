const { Category } = require("../models/models");
const ApiError = require("../error/ApiError");
const path = require("path");
const fs = require("fs/promises");
const { imageSaver } = require("./imageSaver");

class CategoryController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      let fileName = "";
      if (req.files) {
        const { img } = req.files;
        fileName = imageSaver(img, "images", 200, null, null);
      }
      const category = await Category.create({ name, img: fileName });
      return res.json(category);
    } catch (e) {
      next(ApiError.badRequest("ОШИБКА ", e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
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
        await Category.findOne({
          where: { id },
        }).then((category) => {
          let oldFileName = category.img;
          let filePathNameOld = path.resolve(
            __dirname,
            "../static/images",
            oldFileName
          );

          fs.unlink(filePathNameOld).catch((er) => console.log(er));

          Category.update(
            {
              img: fileName,
              name,
            },
            { where: { id } }
          );

          return res.json(fileName);
        });
      } else {
        Category.update(
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

  async delete(req, res, next) {
    try {
      const { id } = req.body;

      await Category.destroy({ where: { id } }).catch((err) =>
        console.log(err)
      );

      return res.json(id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new CategoryController();
