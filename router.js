import {Router} from "express";
import {loginValidation, registerValidation} from "./validations/auth.js";
import handleValidationErrors from "./middleware/handleValidationErrors.js";
import checkAuth from "./middleware/checkAuth.js";
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import {postCreateValidation} from "./validations/post.js";
import {upload} from "./utils.js";
import {remove} from "./controllers/PostController.js";
import fs from "fs";
import * as CommentController from "./controllers/CommentController.js";
import {commentCreateValidation} from "./validations/comment.js";
import {validationResult} from "express-validator";
import Comment from "./models/Comment.js";
import Post from "./models/Post.js";

export const router = new Router();

router.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
router.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
router.get('/auth/me', checkAuth, UserController.getMe);

router.post('/upload', upload, (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

router.post('/remove', (req, res) => {
  fs.unlink(req.body.path, (err) => {
    if (err) {
      console.log(err)
      return 'Неудалось удалить файл'
    }
  })
  res.json({success: true})
})

router.get('/posts', PostController.getAll);
router.get('/posts/tags', PostController.getTagsAll);
router.get('/post/:id', PostController.getOne);
router.post('/post/create', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
router.delete('/post/:id', checkAuth, PostController.remove);
router.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

router.get('/comments', CommentController.getAll);

router.post('/comments/create', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create)

router.get('/tags/:id', PostController.getAllWithTags)

