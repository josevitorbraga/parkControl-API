import { Router } from 'express';
import authVerification from '../middlewares/authVerification.js';
import { Patio } from '../schemas/PatioSchema.js';
import { Register } from '../schemas/RegisterSchema.js';
import { Store } from '../schemas/StoreSchema.js';
import moment from 'moment/moment.js';
import 'moment/locale/pt-br.js';

const patioRouter = Router();

const calcularMinutos = (createdAt, storeData, discount) => {
  // Obtém a data de criação em formato Moment.js
  const dataCriacao = moment(createdAt);

  // Obtém a data e hora atual em formato Moment.js
  const dataAtual = moment();

  // Calcula a diferença em minutos entre a data de criação e o momento atual
  const diferencaMinutos = dataAtual.diff(dataCriacao, 'minutes');

  // Calcula o valor arredondado em minutos
  const valorArredondado = diferencaMinutos;

  if (valorArredondado < storeData.minutagem_min) {
    return { tempo_minutos: valorArredondado, valor: storeData.valor };
  }

  const minutosExcedentes = valorArredondado - storeData.minutagem_min;

  if (discount == 0) {
    return {
      tempo_minutos: valorArredondado,
      valor: Number(storeData.valor + minutosExcedentes),
    };
  }

  return {
    tempo_minutos: valorArredondado,
    valor:
      Number(storeData.valor + minutosExcedentes * storeData.valor_exced) -
      (Number(storeData.valor + minutosExcedentes * storeData.valor_exced) *
        discount) /
        100,
  };
};

patioRouter.get('/', authVerification, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const registrosHoje = await Register.find({
      'client_data.createdAt': { $gte: today, $lt: tomorrow },
    });

    const patio = await Patio.find();
    const formatedResponse = patio.map(i => {
      return {
        ...i._doc,
        formated_entrada:
          moment(i._doc.createdAt).format('DD/MM/YY | HH:mm') + ' h',
      };
    });
    return res.status(200).json({
      total_today: formatedResponse.length + registrosHoje.length,
      active: formatedResponse.length,
      exits: registrosHoje.length,
      patio: formatedResponse,
    });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

//Insere no patio
patioRouter.post('/new', authVerification, async (req, res) => {
  try {
    const {
      nome_crianca,
      nome_resp,
      telefone,
      email,
      idade,
      parentesco,
      user_id,
      desconto,
      desconto_description,
    } = req.body;

    const patioData = await Patio.create({
      nome_crianca,
      nome_resp,
      telefone,
      email,
      idade,
      parentesco,
      user_id,
      store_id: req.user.store_id,
      desconto,
      desconto_description,
    });

    res
      .status(200)
      .json({
        type: 'success',
        message: 'Added to patio',
        patioData: patioData,
      });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

//Checar Valor
patioRouter.get('/time/:id', authVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const patioEntry = await Patio.findById(id);
    const storeData = await Store.findById(patioEntry.store_id);

    const detalhesEstadia = calcularMinutos(
      patioEntry.createdAt,
      storeData,
      patioEntry.desconto
    );

    res.status(200).json({
      type: 'success',
      saida: moment().format('DD/MM/YY | HH:mm') + ' h',
      ...detalhesEstadia,
    });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

//Saida do patio
patioRouter.post('/register/:id', authVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, forma_de_pagamento, store_name } = req.body;
    const patioEntry = await Patio.findById(id);

    await Register.create({
      entrada: patioEntry.createdAt,
      saida: new Date(),
      valor,
      pagamento: forma_de_pagamento,
      store_name,
      desconto: patioEntry.desconto,
      desconto_description:
        patioEntry.desconto_description == ''
          ? 'None'
          : patioEntry.desconto_description,
      client_data: patioEntry,
    });

    await Patio.findByIdAndDelete(id);

    res
      .status(200)
      .json({ type: 'success', message: 'Saida realizada com sucesso' });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

export default patioRouter;
