import { Mongoose } from "mongoose";

const mongoose = new Mongoose();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  useCreateIndex: true,
  useFindAndModify: false
}).catch((err: any) => console.log(err.reason));

export default mongoose;