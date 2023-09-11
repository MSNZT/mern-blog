import PostModel from "../models/Post.js";

class PostService {
  async getAll(req) {
    // const {sort} = req.query;
    // let querySort = '';
    // if (sort === 'views') {
    //    querySort = {viewsCount: -1}
    // } else if (sort === '-views') {
    //   querySort = {viewsCount: 1}
    // } else {
    //   querySort = '';
    // }
    // // if (sort) {
    // //   const posts = await PostModel.find().sort(querySort).populate('user', 'fullName').exec();
    // //   return posts;
    // // }
    const posts = await PostModel.find().populate('user').exec();
    if (!posts) {
      throw new Error('Неудалось получить статьи')
    }
    return posts;
  }
}

export default new PostService();