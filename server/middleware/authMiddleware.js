const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    // Проверяем чтобы в запросе в Header в authorization у каждого юзера был токен
    const token = req.headers.authorization.split(" ")[1]; // Bearer tokennjkclAHDKJnwegWYECGW5254R32FFD

    if (token == "null" || token == "undefined") {
      return res.status(401).json({ message: "Не авторизован Нет токена" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //тут будет проверка базы данных на такого юзера или он есть
    const user = await User.findOne({
      where: { email: decoded.email },
    });
    if (!user) {
      return res.status(401).json({ message: "Нет такого пользователя" });
    }
    req.user = decoded;
    next();
  } catch (e) {
    console.log("Ошибка authMiddleware");
    res.status(401).json({ message: "Ошибка authMiddleware" });
  }
};
