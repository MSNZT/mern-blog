import jwt from "jsonwebtoken";

export default (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.status(403).json({message: 'Пользователь не авторизован'})
    }

    const decodedData = jwt.verify(token, 'secret123');
    req.userId = decodedData._id;
    next();
  } catch (e) {
    return res.status(403).json({ message: 'Нет доступа' });
  }
}