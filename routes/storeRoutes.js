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
    const { store_name, cnpj, minutagem_min, valor, valor_exced } = req.body;

    await Store.create({
      store_name,
      cnpj,
      minutagem_min,
      valor,
      valor_exced,
    });

    res
      .status(200)
      .json({ type: 'success', message: 'Loja adicionada com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

storeRouter.post('/update', async (req, res) => {
  try {
    const { store_id, store_data } = req.body;

    await Store.findOneAndUpdate({ _id: store_id }, store_data);
    res
      .status(200)
      .json({ type: 'success', message: 'Loja atualizada com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default storeRouter;
