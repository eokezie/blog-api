import { Schema, model, Types } from 'mongoose';

import { ILike } from '@/types/like.types';

const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<ILike>('Like', likeSchema);
