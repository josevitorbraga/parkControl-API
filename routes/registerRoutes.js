import { Router } from 'express';
import { Register } from '../schemas/RegisterSchema.js';
import authVerification from '../middlewares/authVerification.js';
import moment from 'moment';

const registerRouter = Router();

const getTotalAmount = arr => {
  let amount = 0;

  for (let i in arr) {
    amount += arr[i].valor;
  }

  return amount;
};

const getTotalAmountByPayment = (arr, string) => {
  let amount = 0;

  for (let i in arr) {
    if (arr[i].pagamento == string) {
      amount += arr[i].valor;
    }
  }

  return amount;
};

const filtrarItensPorIntervaloDeDatas = (itens, dataInicial, dataFinal) => {
  const start = moment(dataInicial);
  const end = moment(dataFinal).endOf('day');

  return itens.filter(item => {
    const dataItem = moment(item.createdAt);
    return dataItem.isAfter(start) && dataItem.isBefore(end);
  });
};

registerRouter.post('/', authVerification, async (req, res) => {
  try {
    const { page, filter = false, start_date, end_data } = req.body;

    const totalItens = await Register.countDocuments({
      store_name: req.user.store_name,
    });

    // const registers = await Register.find({ store_name: req.user.store_name })
    //   .skip((page - 1) * process.env.MAX_ITEM_COUNT)
    //   .limit(process.env.MAX_ITEM_COUNT);

    const registers = await Register.find({ store_name: req.user.store_name });
    const filteredResponse = filter
      ? filtrarItensPorIntervaloDeDatas(
          registers,
          new Date(start_date),
          new Date(end_data)
        )
      : registers;

    const response = {
      registers: filteredResponse,

      faturamento_total: getTotalAmount(registers),
      entradas_totais: totalItens,

      section_pix: getTotalAmountByPayment(filteredResponse, 'PIX'),
      section_dinheiro: getTotalAmountByPayment(filteredResponse, 'Dinheiro'),
      section_debito: getTotalAmountByPayment(filteredResponse, 'Debito'),
      section_credito: getTotalAmountByPayment(filteredResponse, 'Credito'),
      section_total: getTotalAmount(filteredResponse),
      section_entries: filteredResponse.length,
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

registerRouter.post('/new', async (req, res) => {
  try {
    const {
      entrada,
      saida,
      valor,
      pagamento,
      store_name,
      desconto,
      desconto_description,
      client_id,
    } = req.body;

    const createdRegister = await Register.create({
      entrada,
      saida,
      valor,
      pagamento,
      store_name,
      desconto,
      desconto_description,
      client_id,
    });

    res.status(200).json(createdRegister);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default registerRouter;
