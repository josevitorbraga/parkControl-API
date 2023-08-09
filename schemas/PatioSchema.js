import mongoose from 'mongoose';

const PatioSchema = new mongoose.Schema(
  {
    nome_crianca: {
      type: String,
      required: true,
    },
    nome_resp: {
      type: String,
      required: true,
    },
    telefone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    idade: {
      type: String,
      required: true,
    },
    parentesco: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
    index: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

PatioSchema.pre('save', async function (next) {
  try {
    // Verifica se é um novo documento ou uma atualização
    if (this.isNew) {
      // Consulta o banco de dados para obter o último índice disponível
      const ultimoExemplo = await this.constructor.findOne(
        {},
        {},
        { sort: { index: -1 } }
      );

      // Se existir algum registro, incrementa o índice em 1; caso contrário, define como 1
      this.index = ultimoExemplo ? ultimoExemplo.index + 1 : 1;
    }

    next();
  } catch (err) {
    next(err);
  }
});

export const Patio = mongoose.model('Patio', PatioSchema);
