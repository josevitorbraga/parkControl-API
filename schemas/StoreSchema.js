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
    minutagem_min: {
      type: Number,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    valor_exced: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model('Store', StoreSchema);
