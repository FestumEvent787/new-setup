import mongoose from "mongoose";

/* development connection string */
const databaseUrl =
  "mongodb+srv://febackend0001:Ronak123456789@cluster0.yfxobqk.mongodb.net/dbAdlon"; //process.env.ATLAS_URL;

/* local development connection string */
console.log("DB URL:", databaseUrl);

// Mongoose setup with server
mongoose.connect(
  databaseUrl,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
    } else {
      console.log("database connected", new Date());
    }
  }
);

export default mongoose;
