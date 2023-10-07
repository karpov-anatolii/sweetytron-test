require('dotenv').config();
const express = require('express');
const sequelize = require('../postgres/db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

// app.use(cors({ credentials: true, origin: "http://31.131.20.153:8080" }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static'))); //указываем серверу, что файлы из папки static раздаем как статику. После этого все файлы из этой папки доступные http://31.131.20.153:5000/имя файла в static.jpg

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.resolve(__dirname, 'tmp'),
  })
); //для загрузки файлов, картинок
app.use('/api', router);

//Обработка ошибок, последний Middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (err) {
    console.log('Ошибка подключения к БД', err);
  }
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.log('Ошибка запуска сервера', err);
  }
};

start();
