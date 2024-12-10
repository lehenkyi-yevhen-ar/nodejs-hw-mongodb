import { mongoose } from 'mongoose';

const studentSchema = new mongoose.Schema(
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
    }
  },
  {
    timestamps: true
  }
);

export const Student = mongoose.model('Student', studentSchema);
