import { Router } from 'express';
import authVerification from '../middlewares/authVerification.js';
import { Patio } from '../schemas/PatioSchema.js';
import moment from 'moment/moment.js';

const patioRouter = Router();

const calcularMinutos = createdAt => {
  // Obtém a data de criação em formato Moment.js
  const dataCriacao = moment(createdAt);

  // Obtém a data e hora atual em formato Moment.js
  const dataAtual = moment();

  // Calcula a diferença em minutos entre a data de criação e o momento atual
  const diferencaMinutos = dataAtual.diff(dataCriacao, 'minutes');

  // Calcula o valor arredondado em minutos
  const valorArredondado = Math.round(diferencaMinutos);

  return valorArredondado;
};

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
      store_id,
    } = req.body;

    await Patio.create({
      nome_crianca,
      nome_resp,
      telefone,
      email,
      idade,
      parentesco,
      user_id,
      store_id,
    });

    res.status(200).json({ type: 'success', message: 'Added to patio' });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

//Checar Valor
patioRouter.get('/time/:id', authVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const patioEntry = await Patio.findById(id);

    const valor = calcularMinutos(patioEntry.createdAt);

    res.status(200).json({ type: 'success', value: valor });
  } catch (e) {
    res.status(500).json({ type: 'error', message: e.message });
  }
});

//Saida do patio
patioRouter.get(
  '/register/:id/:minutes',
  authVerification,
  async (req, res) => {
    try {
      const { id, minutes } = req.params;

      const patioEntry = await Patio.findById(id);
    } catch (e) {
      res.status(500).json({ type: 'error', message: e.message });
    }
  }
);

export default patioRouter;
