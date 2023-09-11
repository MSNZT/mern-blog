import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user', ['fullName', 'avatarUrl', '_id']).exec();
    if (!comments) {
      return res.status(404).json({message: 'Комментарии не найдены'})
    }
    res.json(comments);
  } catch (e) {
    console.log(e);
    return res.status(404).json('Произошла ошибка при запросе комментариев')
  }
}

// export const create = async(req, res) => {
//   try {
//     const {text, id} = req.body;
//     const post = await new CommentModel({
//       text
//     }, PostModel.findByIdAndUpdate(
//         {id: id},
//         {$push: {doc}},
//         {new: true}
//       )
//     )
//     const doc = new CommentModel({text
//       // user: req.userId
//     });
//     // console.log(doc)
//     await PostModel.findByIdAndUpdate(
//       {id: id},
//       {$push: {doc}},
//       {new: true}
//     )
//     const comment = await post.save();
//     res.json(comment);
//     // const {text, id} = req.body;
//     // // const doc = new CommentModel({text, user: req.userId});
//     // CommentModel.create(req.body).then((comment) => {
//     //   PostModel.findByIdAndUpdate(
//     //     {_id: id},
//     //     {$push: {comment: comment._id}},
//     //     {new: true}
//     //   )
//     // })
//     //   .then(post => {
//     //     res.json(post)
//     //   })
//     // // const comment = await doc.save();
//     // // res.json(comment);
//   } catch (e) {
//     console.log(e);
//     return res.status(404).json('Произошла ошибка при создание комментария')
//   }
// }

export const create =  async(req, res) => {
  try {
    const {text, _id} = req.body
    const obj = {
      text,
      user: req.userId
    }
    const doc = new Comment(obj);
    const comments = await doc.save();
    const postUpdate = await Post.findOneAndUpdate(
      {_id: _id},
      {$push: {comments: [{_id: doc._id, text: text, user: req.userId}]}},
      {new: true}
    )
    res.json(comments)
  } catch (e) {
    console.log(e);
    return res.status(400).json({message: 'Произошла ошибка при добавлении комментария'})
  }
}