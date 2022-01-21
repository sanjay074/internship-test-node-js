const mongoose = require("mongoose");
import { APP_URL } from '../config';
const userSchema = new mongoose.Schema(
  {
      name:{
          type:String,
          required:true
      },
      email:{
          type:String,
          required:true,
          unique:true
      },
      password:{
          type:String,
          required:true,
          unique:true
      },
      image:{
          type:String,
          required:true,
          get: (image) => {
            // http://localhost:3000/uploads/1616443169266-52350494.png
            if (process.env.ON_HEROKU == 'true') {
                return `${image}`;
            }
            return `${APP_URL}/${image}`;
        },
      },
      orders:{
          type:String,
      },
  },
  { timestamps: true, toJSON: { getters: true }, id: false }
);

export default mongoose.model('User',userSchema);