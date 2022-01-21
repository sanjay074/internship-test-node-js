import express from "express";
import  mongoose  from "mongoose";
import{APP_PORT} from "./config"
import errorHandler from "./middlewares/errorHandler";
import routes from "./routes";
import path from "path"
import cors from 'cors';
const app = express();
mongoose.connect("mongodb://localhost:27017/nodetext", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
}) 
global.appRoot = path.resolve(__dirname);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);
app.listen(APP_PORT,()=>console.log(`Listening on port ${APP_PORT}.`));
