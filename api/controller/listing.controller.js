import ListingModel from '../models/listing.models.js';

export const createListing = async (req, res) => {
  try {
    
    const listing = new ListingModel(req.body);
    await listing.save();

    
    res.status(201).json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};