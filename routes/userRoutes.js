import { Router } from 'express';
import { User } from '../schemas/UserSchema.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.post('/new', async (req, res) => {
  try {
    const { name, user, password, isAdmin = false } = req.body;

    const createdUser = await User.create({
      name,
      user,
      password,
      isAdmin,
    });

    res.status(200).json(createdUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default userRouter;
