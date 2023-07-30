import mongoose from 'mongoose';

const RegisterSchema = mongoose.Schema(
  {
    entrada: {
      type: String,
      required: true,
    },
    saida: {
      type: String,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pagamento: {
      type: String,
      required: true,
    },
    store_name: {
      type: String,
      required: true,
    },
    desconto: {
      type: Number,
      required: true,
    },
    desconto_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Register = mongoose.model('Register', RegisterSchema);
