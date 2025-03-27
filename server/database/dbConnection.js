import mongoose, { mongo } from "mongoose";
export const connection = ()=>{
  mongoose.connect(process.env.MONGO_URI, {
    dbName :"MERN_AUTHENTICATION"
}).then(() => {
  console.log("Connected to the database");
}).catch((error) => {
  console.log("Error connecting to the database: ", error);
});
}

