const { Article } = require("../models/models");
const ApiError = require("../error/ApiError");

class articleController {
  async create(req, res, next) {
    try {
      const { name, title, content, show_menu, show_footer, show_main } =
        req.body;

      const article = await Article.create({
        name,
        title,
        content,
        show_menu,
        show_footer,
        show_main,
      });
      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const article = await Article.findAll();
      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const article = await Article.findOne({
        where: { id },
      });
      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.body;
      await Article.destroy({ where: { id } });
      return res.json("Deleted article id=" + id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async edit(req, res, next) {
    try {
      const { id, name, title, content, show_menu, show_footer, show_main } =
        req.body;

      const article = await Article.update(
        {
          name,
          title,
          content,
          show_menu,
          show_footer,
          show_main,
        },
        { where: { id } }
      );

      return res.json(article);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new articleController();
