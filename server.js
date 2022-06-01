const
   express = require('express'),
   app = express(),
   PORT = process.env.PORT || 4321,
   mongoose = require("mongoose")

require("dotenv").config()
require("./db")()

app.use(express.json());

// schema
const UsersSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
})

const SchoolsSchema = new mongoose.Schema({
   name: String,
   address: String,
   students: [
      { type: mongoose.Types.ObjectId, ref: "Users" }
   ]
})

const PostsSchema = new mongoose.Schema({
   text: String,
   likes: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
   comments: [
      { type: mongoose.Types.ObjectId, ref: "Comments" }
   ],
   creator: { type: mongoose.Types.ObjectId, ref: "Users" }
})

const CommentsSchema = new mongoose.Schema({
   text: String,
   likes: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
   creator: { type: mongoose.Types.ObjectId, ref: "Users" }
})



// data
const
   user = { name: "avi", email: "a@a", password: "1234" },
   school = {
      name: "workin",
      address: "jerusalem",
      students: ["6295f7111031245a68c65582"]
   },
   comment = {
      text: "comment",
      likes: ["6295f7111031245a68c65582"],
      creator: "6295f7111031245a68c65582"
   },
   post = {
      text: "post",
      comments: ["629617158d03a0e2c5f288c6"],
      likes: ["6295f7111031245a68c65582"],
      creator: "6295f7111031245a68c65582"
   }

// models
const
   UserModel = new mongoose.model("Users", UsersSchema),
   SchoolsModel = new mongoose.model("Schools", SchoolsSchema),
   CommentsModel = new mongoose.model("Comments", CommentsSchema),
   PostsModel = new mongoose.model("Posts", PostsSchema)


// functions
const getUsers = async () => await UserModel.find()
const getComments = async () => await CommentsModel.find()

const getSchools = async () =>
   await SchoolsModel.find()
      .populate({ path: "students", select: ["name", "email"] })

const createUser = async (u) => await UserModel.create(u)
const createScools = async (s) => await SchoolsModel.create(s)
const createComments = async (c) => await CommentsModel.create(c)
const createPost = async (p) => await PostsModel.create(p)

const getPosts = async () =>
   await PostsModel.find()
      .populate("creator")
      .populate({ path: "comments", populate: { path: "creator" } })

// test area

// getUsers().then(res => console.log(res))
// createUser(user).then(res => console.log(res))
// createScools(school).then(res => console.log(res))
// getSchools().then(res => console.log(JSON.stringify(res)))
// createComments(comment).then(res => console.log(res))
// createPost(post).then(res => console.log(res))
// getComments().then(res => console.log(res))
getPosts().then(res => console.log(JSON.stringify(res)))

app.listen(PORT, () => console.log(`Connected to port ${PORT}`));