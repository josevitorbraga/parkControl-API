import e, { Router } from 'express';
import { User } from '../schemas/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authVerification from '../middlewares/authVerification.js';
import { Store } from '../schemas/StoreSchema.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.post('/update', authVerification, async (req, res) => {
  try {
    const { user_id, user_data } = req.body;
    const hashedPassword = await bcrypt.hash(user_data.password, 12);
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        name: user_data.name,
        user: user_data.user,
        password: hashedPassword,
        isAdmin: user_data.isAdmin,
      }
    );

    res
      .status(200)
      .json({ type: 'success', message: 'Usuário atualizado com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
userRouter.post('/new', authVerification, async (req, res) => {
  try {
    const { name, user, password, isAdmin = false, stores } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      name,
      user,
      password: hashedPassword,
      stores,
      isAdmin,
    });

    res
      .status(200)
      .json({ type: 'success', message: 'Usuário criado com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { user, password, store_id } = req.body;

    const existingUser = await User.findOne({ user });

    if (!existingUser) {
      return res.status(400).json({
        type: 'error',
        message: 'Combinação de usuário e senha incorreta',
      });
    }
    const userWithoutPassword = {
      id: existingUser._id,
      name: existingUser.name,
      user: existingUser.user,
      isAdmin: existingUser.isAdmin,
    };

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({
        type: 'error',
        message: 'Combinação de usuário e senha incorreta',
      });
    }

    if (!existingUser.stores.includes(store_id)) {
      return res.status(400).json({
        type: 'error',
        message: 'Usuário não cadastrado nessa loja',
      });
    }

    const storeData = await Store.find({ _id: store_id });

    const token = jwt.sign(
      {
        id: existingUser._id,
        store_id: store_id,
        store_name: storeData[0].store_name,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      user: {
        ...userWithoutPassword,
        store_id: store_id,
        store_name: storeData[0].store_name,
      },
      token,
    });
  } catch (e) {
    return res.status(400).json({ type: 'error', message: e.message });
  }
});

userRouter.get('/auth', authVerification, async (req, res) => {
  const userData = await User.findById(req.user.id).select('-password');

  res.status(200).json({
    ...userData._doc,
    store_logged: req.user.store_id,
    store_name: req.user.store_name,
  });
});

export default userRouter;
