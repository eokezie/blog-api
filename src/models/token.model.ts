import { Schema, model } from 'mongoose';

import { IToken } from '@/types/token.types';

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

export default model<IToken>('Token', tokenSchema);
