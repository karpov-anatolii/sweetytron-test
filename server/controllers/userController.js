const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Некоректний email чи password!'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Користувач із таким email вже існує'));
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const admin = await User.findOne({ where: { role: 'ADMIN' } });
    let user;
    if (!admin) {
      user = await User.create({
        email,
        role: 'ADMIN',
        password: hashPassword,
      });
    } else {
      user = await User.create({ email, role, password: hashPassword });
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Користувач не знайдений'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password); // сравниваем захешированный пароль введенный юзером с уже захешированным паролем из базы данных
    if (!comparePassword) {
      return next(ApiError.internal('Користувач не знайдений'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res) {
    // check будет каждый раз генерировать новый токен, и отправлять его на клиент. Т.е. если пользователь будет долго использовать свой аккаунт, токен будет перезаписываться
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({
      token,
      res: 'Генерация нового токена',
      email: req.user.email,
    });
  }
}

module.exports = new UserController();
