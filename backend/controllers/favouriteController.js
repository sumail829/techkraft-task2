import Favourite from "../models/favouriteModel.js";

export const addFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.body;

    // check if already exists
    const alreadyExists = await Favourite.findOne({
      user: userId,
      propertyId,
    });

    if (alreadyExists) {
      return res.status(400).json({ message: "Already in favourites" });
    }

    const favourite = await Favourite.create({
      user: userId,
      propertyId,
    });

    return res.status(201).json({
      message: "Added to favourites",
      favourite,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const deleted = await Favourite.findOneAndDelete({
      user: userId,
      propertyId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Not found in favourites" });
    }

    return res.status(200).json({
      message: "Removed from favourites",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favourites = await Favourite.find({ user: userId });

    return res.status(200).json({
      message: "Fetched favourites",
      favourites,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};