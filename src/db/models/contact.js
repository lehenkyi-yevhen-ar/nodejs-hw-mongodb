import { mongoose } from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    isFavourite: {
      type: Boolean,
      default: false
    },
    contactType: {
      type: String,
      enum: ['home', 'personal'],
      required: true,
      default: 'personal'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    photo: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Contact = mongoose.model('Contact', contactSchema);
