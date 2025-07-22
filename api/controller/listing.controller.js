import ListingModel from '../models/listing.models.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res) => {
  try {
    
    const listing = new ListingModel(req.body);
    await listing.save();

    
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteListing = async(req,res,next) =>{
  const listing = await ListingModel.findById(req.params.id);
  if(!listing) return next(errorHandler(404,'Listing not Found'));
  if(req.user.id !== listing.userRef){
    return next(errorHandler(404,'You can only delete your own listing'));
  }
  try {
    await ListingModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!')

  } catch (error) {
      next(error);
  }
  
};

export const updateListing = async(req,res,next) =>{
  const listing = await ListingModel.findById(req.params.id);
  if(!listing) return next(errorHandler(404,'Listing not Found'));
  if(req.user.id !== listing.userRef){
    return next(errorHandler(404,'You can only update your own listing'));
  }
  try {
      const updateListing = await ListingModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true }
      );
      res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }

}