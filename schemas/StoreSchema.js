import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema(
  {
    store_name: {
      type: String,
      required: true,
    },
    cnpj: {
      type: String,
    },
    valor_hora: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model('Store', StoreSchema);
