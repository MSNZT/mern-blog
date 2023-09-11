import {check} from 'express-validator'

export const loginValidation = [
  check('email', 'Неверный формат почты').isEmail(),
  check('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]
export const registerValidation = [
  check('fullName', 'Укажите полное имя').isLength({min: 3}),
  check('email', 'Неверный формат почты').isEmail(),
  check('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
  check('imageUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]