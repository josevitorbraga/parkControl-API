import { Router } from 'express';
import { Register } from '../schemas/RegisterSchema.js';

const registerRouter = Router();

registerRouter.get('/', async (req, res) => {
  try {
    const registers = await Register.find();
    res.status(200).json(registers);
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
