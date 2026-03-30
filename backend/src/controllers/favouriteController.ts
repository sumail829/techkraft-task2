import { Request, Response,RequestHandler } from "express";
import Favourite from "../models/favouriteModel";


interface FavouriteBody {
  propertyId: string;
}

interface FavouriteParams {
  propertyId: string;
}



export const addFavourite = async (
  req: Request<{}, {}, FavouriteBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id; 

    const { propertyId } = req.body;

    const alreadyExists = await Favourite.findOne({
      user: userId,
      propertyId,
    });

    if (alreadyExists) {
      res.status(400).json({ message: "Already in favourites" });
      return;
    }

    const favourite = await Favourite.create({
       user: req.user!.id,
      propertyId,
    });

    res.status(201).json({
      message: "Added to favourites",
      favourite,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 REMOVE FAVOURITE
export const removeFavourite = async (
  req: Request<{ propertyId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { propertyId } = req.params;

    const deleted = await Favourite.findOneAndDelete({
      user: userId,
      propertyId,
    });

    if (!deleted) {
      res.status(404).json({ message: "Not found in favourites" });
      return;
    }

    res.status(200).json({
      message: "Removed from favourites",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyFavourites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const favourites = await Favourite.find({ user: userId });

    res.status(200).json({
      message: "Fetched favourites",
      favourites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};