const path = require("path");
const { Device, DeviceInfo, Comment } = require("../models/models");
const ApiError = require("../error/ApiError");
const fs = require("fs/promises");
const { Op } = require("sequelize");
const { imageSaver } = require("./imageSaver");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, status, badge, info, categoryId, sectionId } =
        req.body;

      let info_obj = JSON.parse(info);
      if (!info_obj.filter((el) => el.title == "Вага")[0])
        info_obj = [...info_obj, { title: "Вага", description: "0 гр." }];

      let imgArr = [];
      if (req.files) {
        for (let key in req.files) {
          let img = req.files[key];

          let fileName = imageSaver(img, "images", 600, "thumbs", 250);
          imgArr.push(fileName);
        }
      }

      const device = await Device.create({
        name,
        price,
        status,
        badge,
        categoryId,
        sectionId,
        img: JSON.stringify(imgArr),
      });

      info_obj.forEach((i) =>
        DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        })
      );

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { categoryId, sectionId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    if (!categoryId && !sectionId) {
      devices = await Device.findAndCountAll({
        include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
        limit,
        offset,
      });
    }
    if (categoryId && !sectionId) {
      devices = await Device.findAndCountAll({
        where: { categoryId },
        include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
        limit,
        offset,
      });
    }
    if (!categoryId && sectionId) {
      devices = await Device.findAndCountAll({
        where: { sectionId },
        include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
        limit,
        offset,
      });
    }
    if (categoryId && sectionId) {
      devices = await Device.findAndCountAll({
        where: { sectionId, categoryId },
        include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
        limit,
        offset,
      });
    }
    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [
        { model: DeviceInfo, as: "info" },
        { model: Comment, as: "comments" },
      ], //добавится массив info с объектами из таблицы device_info связанные асоциативно с Device в поле deviceId
    });
    return res.json(device);
  }

  async getActionItems(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    const actionItems = await Device.findAndCountAll({
      where: { badge: { [Op.regexp]: `%` } },
      include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
    });
    return res.json(actionItems);
  }

  async getTopItems(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    const topItems = await Device.findAndCountAll({
      include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
      order: [["rating", "DESC"]],
      limit,
      offset,
    });
    return res.json(topItems);
  }

  async getHotItems(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    const hotItems = await Device.findAndCountAll({
      include: [{ model: DeviceInfo, as: "info", where: { title: "Вага" } }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    return res.json(hotItems);
  }

  async editOne(req, res, next) {
    try {
      const {
        name,
        id,
        price,
        categoryId,
        sectionId,
        file,
        info,
        status,
        badge,
      } = req.body;
      let device;
      let imgArr = JSON.parse(file);
      if (req.files) {
        for (let key in req.files) {
          let img = req.files[key];
          let numImg = key.slice(-1);

          let fileName = imageSaver(img, "images", 600, "thumbs", 250);
          imgArr = imgArr.map((el, index) =>
            index == numImg - 1 ? fileName : el
          );

          //delete old images
          Device.findOne({
            where: { id },
          }).then((device) => {
            let fileName = JSON.parse(device.img)[numImg - 1];
            if (fileName) {
              let filePathName = path.resolve(
                __dirname,
                "../static/images",
                fileName
              );
              let thumbFilePathName = path.resolve(
                __dirname,
                "../static/images/thumbs",
                fileName
              );
              fs.unlink(filePathName).catch((er) => console.log(er));
              fs.unlink(thumbFilePathName).catch((er) => console.log(er));

              device = Device.update(
                {
                  img: JSON.stringify(imgArr),
                },
                { where: { id } }
              );
            } else {
              device = Device.update(
                {
                  name,
                  price,
                  categoryId,
                  sectionId,
                  status,
                  badge,
                  img: JSON.stringify(imgArr),
                },
                { where: { id } }
              );
            }
          });
        }
      } else {
        device = await Device.update(
          {
            name,
            price,
            categoryId,
            sectionId,
            status,
            badge,
            img: JSON.stringify(imgArr),
          },
          { where: { id } }
        );
      }

      if (info) {
        await DeviceInfo.destroy({
          where: { deviceId: id },
        }).then((res) => {
          let info_obj = JSON.parse(info);
          info_obj.forEach((i) =>
            DeviceInfo.create({
              title: i.title,
              description: i.description,
              deviceId: id,
            })
          );
        });
      }
      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteOne(req, res, next) {
    try {
      const { id } = req.body;
      //delete images
      await Device.findOne({
        where: { id },
      }).then((device) => {
        for (let fileName of JSON.parse(device.img)) {
          let filePathName = path.resolve(
            __dirname,
            "..",
            "static",
            "images",
            fileName
          );
          let thumbFilePathName = path.resolve(
            __dirname,
            "..",
            "static",
            "images",
            "thumbs",
            fileName
          );

          fs.unlink(filePathName).catch((err) => console.log(err));
          fs.unlink(thumbFilePathName).catch((err) => console.log(err));
        }
      });

      await Device.destroy({ where: { id } }).catch((err) => console.log(err));

      return res.json(id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async searchOne(req, res) {
    const { word } = req.query;
    if (isFinite(word)) {
      const devices = await Device.findAll({
        where: {
          id: Number(word),
        },
      })
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => console.log(err));
    } else {
      const devices = await Device.findAll({
        where: {
          name: { [Op.iRegexp]: `${word}` },
        },
      })
        .then((data) => {
          return res.json(data);
        })
        .catch((err) => console.log(err));
    }
  }

  async comment(req, res) {
    const { id, name, comment, advantage, flaw } = req.body;
    const commentDb = await Comment.create({
      name,
      comment,
      advantage,
      flaw,
      deviceId: id,
    });
    return res.json(commentDb);
  }

  async delComment(req, res) {
    const { id } = req.body;
    const commentDb = await Comment.destroy({ where: { id } }).catch((err) =>
      console.log(err)
    );
    return res.json(commentDb);
  }

  async commentsAll(req, res) {
    const { commentsDate } = req.body;
    let year = parseInt(commentsDate.split("T")[0].split("-")[0]);
    let month = parseInt(commentsDate.split("T")[0].split("-")[1]);
    let day = parseInt(commentsDate.split("T")[0].split("-")[2]);

    console.log("=======commentsDate====", year, month, day);
    let endDate = new Date(year, month - 1, day + 1);
    let startDate = new Date(year, month - 1, day);
    console.log(startDate, endDate);
    try {
      const commentDb = await Comment.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [{ model: Device, as: "device" }],
      });
      if (commentDb.length == 0) console.log("NOOOOOOOOO!!!!!!");
      return res.json(commentDb);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new DeviceController();
