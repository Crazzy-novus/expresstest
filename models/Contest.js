import mongoose, { Schema } from 'mongoose';

const contestSchema = new Schema({
  contestname: { type: String, required: true },
  clubevent: { type: String, required: true },
  studentevent: { type: String, required: true },
  contestvenue: { type: String, required: true },
  contestdate: { type: Date, required: true },
  contesttime: { type: String, required: true },
  contestshortdescription: { type: String, required: true, maxlength: 100 },
  contestdescripition: { type: String, required: false, maxlength: 1000 },
  img: { type: String, required: true }, // This assumes the image is stored as a URL or file path
},
{
  timestamps: true  // To store creared or modifiesd time of the record
}
);

export default mongoose.model('Contest', contestSchema);