import PostModel from "../models/Post.js";
import PostServices from "../services/PostServices.js";

export const getAll = async (req, res) => {
  try {
    const sort = req.query.sort;
    const posts = await PostModel.find().sort(sort ? {viewsCount: -1} : {createdAt: -1}).populate('user', ['fullName', '_id', 'avatarUrl']).exec();
    if (!posts) {
      throw new Error('Неудалось получить статьи')
    }
    res.json(posts);
  } catch (e) {
    return res.status(500).json({message: 'Неудалось получить статьи'})
  }
}

export const getTagsAll = async(req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
    res.json(tags);
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: 'Неудалось получить тэги'})
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      {
      _id: postId
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after'
      }
    )
      .populate({
        path: 'user',
        select: ['fullName', 'avatarUrl']
        })
      .populate({
        path: 'comments',
        populate: {path: 'user', select: ['fullName', 'avatarUrl']}
      }).exec()
    if (!post) {
      return res.status(404).json({message: 'Статья не найдена'})
    }
    res.json(post);
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: 'Неудалось получить статью'})
  }
}

export const create = async (req, res) => {
  try {
    const {title, text, image, tags} = req.body;
    const data = {
      title, text, user: req.userId
    };
    if (image) {
      data.imageUrl = image
    }
    if (!tags) {
      delete data.tags
    } else {
      data.tags = tags.split(',')
    }
    const doc = new PostModel(data);
    const post = await doc.save();
    res.json(post)
  } catch (e) {
    console.log(e);
    res.status(500).json({message: 'Не удалось создать статью'})
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete({_id: postId});
    if (!post) {
      return res.status(404).json({message: 'Статья не найдена'})
    }
    res.json({
      success: true
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: 'Неудалось удалить статью'})
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const {title, text, imageUrl, tags} = req.body;
    const obj = {
      title, text, imageUrl, tags: tags.split(','), user: req.userId
    }
    if (!imageUrl) {
      obj.imageUrl = ''
    }
    const post = await PostModel.updateOne(
      {_id: postId},
      obj
    );
    if (!post) {
      return res.status(404).json({message: 'Статья не найдена'})
    }
    res.json(post);
  } catch (e) {
    console.log(e)
    return res.status(500).json({message: 'Неудалось обновить статью'})
  }
}

export const getAllWithTags = async(req, res) => {
  try {
    const posts = await PostModel.find({tags: req.params.id});
    if (!posts) {
      return res.status(404).json({message: 'Статьи не найдены'})
    }
    res.json(posts)
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: 'Неудалось получить статьи'})
  }
}