const { Order, Device } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    try {
      const {
        name,
        surName,
        phone,
        city,
        delivery,
        department,
        payment,
        itemQuan,
        sum,
        userId,
      } = req.body;

      const orderDb = await Order.create({
        name,
        surName,
        phone,
        city,
        delivery,
        department,
        payment,
        itemQuan,
        sum,
        userId,
      });

      JSON.parse(itemQuan).map((obj) => {
        Device.findOne({
          where: { id: obj.id },
        }).then((data) => {
          Device.update(
            {
              rating: +data.rating + +obj.quan,
            },
            { where: { id: obj.id } }
          );
        });
      });

      return res.json(orderDb);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await Order.findAll();
      return res.json(orders);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const { id } = req.body;

      await Order.destroy({ where: { id } });
      return res.json("Deleted order id=" + id);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderController();
