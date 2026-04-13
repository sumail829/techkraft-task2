import mongoose, { Schema, InferSchemaType } from "mongoose";

const favouriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


type IFavourite = InferSchemaType<typeof favouriteSchema>;

const Favourite = mongoose.model<IFavourite>("Favourite", favouriteSchema);

export default Favourite;