import { Schema, model } from 'mongoose';

import { IComment } from '@/types/blog.types';

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [1000, 'Content must be less than 1000 characters'],
  },
});

export default model<IComment>('Comment', commentSchema);
