import { Mongoose } from "mongoose";

const mongoose = new Mongoose();

const uri = 'mongodb+srv://upnoingles:inglesnoup@upnoingles.y6dxv.mongodb.net/up_no_ingles?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  useCreateIndex: true,
  useFindAndModify: false
}).catch((err: any) => console.log(err.reason));

export default mongoose;