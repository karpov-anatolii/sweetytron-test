const { Info } = require("../models/models");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs/promises");

class infoController {
  async create(req, res, next) {
    try {
      const { siteName, masterCard, masterPhone } = req.body;
      let logoRow;

      const handlerInfo = async (key, value) => {
        await Info.findOne({
          where: { key },
        }).then((row) => {
          if (row) {
            Info.update(
              {
                value,
              },
              { where: { key } }
            );
          } else {
            Info.create({
              key,
              value,
            });
          }
        });
      };

      handlerInfo("siteName", siteName);
      handlerInfo("masterCard", masterCard);
      handlerInfo("masterPhone", masterPhone);

      if (req.files) {
        const { logo } = req.files;
        let tmpPathName = logo.tempFilePath;
        let logoName = uuid.v4() + ".png";
        let filePathName = path.resolve(
          __dirname,
          "../static/images",
          logoName
        );
        logo.mv(tmpPathName, async (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          const metadata = await sharp(tmpPathName).metadata();
          await sharp(tmpPathName)
            .resize({
              width: parseInt((200 * metadata.width) / metadata.height),
              height: 200,
            })
            .toFile(filePathName)
            .then(() => fs.unlink(tmpPathName).catch((er) => console.log(er)));
        });

        logoRow = await Info.findOne({
          where: { key: "logo" },
        });
        if (logoRow) {
          await Info.update({ value: logoName }, { where: { key: "logo" } });
          fs.unlink(
            path.resolve(__dirname, "..", "static/images", logoRow.value)
          ).catch((er) => console.log(er));
        } else {
          await Info.create({ key: "logo", value: logoName });
        }
      }

      return res.json(logoRow);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const info = await Info.findAll();
      return res.json(info);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new infoController();
