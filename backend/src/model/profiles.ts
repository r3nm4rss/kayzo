import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  username : String,
  email: String,
  profileImage: Buffer,
  backgroundMedia : Buffer,
  backgroundType: {type: String , enum:['image' , 'video']} ,

})

export const mediaModel  = mongoose.model('Media' , mediaSchema)