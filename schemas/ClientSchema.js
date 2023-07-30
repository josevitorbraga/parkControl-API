import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  nome_crianca: {
    type: String,
    required: true,
  },
  nome_resp: {
    type: Sting,
    required: true,
  },
  cpf: {
    type: Number,
    required: false,
  },
  endereco: {
    type: String,
    required: false,
  },
  telefone: {
    type: Number,
    required: false,
  },
  email: {
    type: Number,
    required: false,
  },
  idade: {
    type: Number,
    required: false,
  },
  parentesco: {
    type: String,
    required: false,
  },
  index: {
    type: Number,
    required: false,
  },
});

ClientSchema.pre('save', async function (next) {
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

export const Client = mongoose.model('Client', ClientSchema);
