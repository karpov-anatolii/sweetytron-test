const jwt = require("jsonwebtoken");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      // Проверяем чтобы в запросе в Header в authorization у каждого юзера был токен
      const token = req.headers.authorization.split(" ")[1]; // Bearer tokennjkclAHDKJnwegWYECGW5254R32FFD
      if (!token) {
        return res.status(401).json({ message: "Не авторизован Нет токена" });
      }
      ("Не авторизован");
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Нет доступа. Только ADMIN" });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "Ошибка checkRoleMiddleware" });
    }
  };
};
