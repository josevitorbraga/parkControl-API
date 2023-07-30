import { Router } from 'express';
import { Client } from '../schemas/ClientSchema';

const clientRouter = Router();

clientRouter.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

clientRouter.post('/new', async (req, res) => {
  try {
    const {
      nome_crianca,
      nome_resp,
      cpf,
      endereco,
      telefone,
      email,
      idade,
      parentesco,
    } = req.body;

    const createdClient = await Client.create({
      nome_crianca,
      nome_resp,
      cpf,
      endereco,
      telefone,
      email,
      idade,
      parentesco,
    });

    res.status(200).json(createdClient);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default clientRouter;
