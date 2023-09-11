import {body} from "express-validator";

export const commentCreateValidation = [
  body('text', 'Введите комментарий к статье').isLength({min: 5}).isString(),
]