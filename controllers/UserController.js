import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(403).json({message: 'Пользователь не найден'})
    }

    const {password, ...userData} = user._doc;
    res.json(userData);
  } catch (e) {
    res.status(400).json({message: 'Нет доступа'})
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});
    if (!user) {
      return res.status(404).json({message: 'Пользователь не найден'})
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({message: 'Неверный логин или пароль'})
    }

    const token = jwt.sign({
      _id: user._id
    }, 'secret123', {expiresIn: '30d'})
    const {password, ...userData} = user._doc;

    res.status(200).json({message: 'Пользователь успешно авторизирован', ...userData, token})

  } catch (e) {
    console.log(e);
    res.status(500).json({message: 'Ошибка авторизации'});
  }
}
export const register = async (req, res) => {
  try {
    const {fullName, email, password, avatarUrl} = req.body;
    const candidate = await UserModel.findOne({email});
    if (candidate) {
      return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
      // throw new Error('Пользователь существует')
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      fullName, email, password: passwordHash, avatarUrl
    });
    const user = await doc.save();

    const {password: hashPassword, ...userData} = user._doc;

    const token = jwt.sign({
      _id: user._id
    }, 'secret123', {expiresIn: '30d'});

    res.status(200).json({message: 'Пользователь успешно зарегистрирован', ...userData,token});

  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
}