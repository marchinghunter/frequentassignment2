import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  country: String,
  states: [
    {
      state: String,
      cities: [String]
    }
  ]
});

const Country = mongoose.model('Country', countrySchema);
export default Country;
