import { Router } from 'express';
import { Store } from '../schemas/StoreSchema.js';

const storeRouter = Router();

storeRouter.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

storeRouter.post('/new', async (req, res) => {
  try {
    const { store_name, cnpj, valor_hora } = req.body;

    await Store.create({
      store_name,
      cnpj,
      valor_hora,
    });

    res
      .status(200)
      .json({ type: 'success', message: 'Loja adicionada com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default storeRouter;
