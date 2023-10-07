const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  surName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  delivery: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  payment: { type: DataTypes.STRING, allowNull: false },
  itemQuan: { type: DataTypes.TEXT, allowNull: false },
  sum: { type: DataTypes.STRING, allowNull: false },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'В наявності' },
  badge: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Article = sequelize.define('article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  show_menu: { type: DataTypes.BOOLEAN },
  show_footer: { type: DataTypes.BOOLEAN },
  show_main: { type: DataTypes.BOOLEAN },
});

const Info = sequelize.define('info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: false },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const SlideShow = sequelize.define('slideshow', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.TEXT },
  text: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING, allowNull: false },
  show: { type: DataTypes.BOOLEAN },
});

const Section = sequelize.define('section', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'fon-magazina-vnutri-17.jpg',
  },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false },
  advantage: { type: DataTypes.TEXT },
  flaw: { type: DataTypes.TEXT },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Rating);
Rating.belongsTo(User);

Device.hasMany(Rating);
Rating.belongsTo(Device);

User.hasMany(Order);
Order.belongsTo(User);

Device.hasMany(DeviceInfo, { as: 'info', onDelete: 'cascade' }); //Внешний ключ определен в виде синонима info. Т.е. в таблице device_info будет автоматически добавлено поле deviceId в которое мы будем записывать id девайса которое имеет эту строку характеристики(info). А потом мы сможем получить все зависимые строки характеристик по номеру девайса используя св-во include
DeviceInfo.belongsTo(Device);

Device.hasMany(Comment, { onDelete: 'cascade' });
Comment.belongsTo(Device);

Category.hasMany(Section, { onDelete: 'cascade' });
Section.belongsTo(Category);

Section.hasMany(Device, { onDelete: 'cascade' });
Device.belongsTo(Section);

Category.hasMany(Device, { onDelete: 'cascade' });
Device.belongsTo(Category);

module.exports = {
  User,
  Device,
  Rating,
  DeviceInfo,
  Order,
  Category,
  Section,
  SlideShow,
  Article,
  Info,
  Comment,
};
