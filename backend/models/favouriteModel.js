import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,ref: "User",
      required: true,
    },
    propertyId: {
      type: String,required: true,
    },
  },
  { timestamps: true }
);

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;