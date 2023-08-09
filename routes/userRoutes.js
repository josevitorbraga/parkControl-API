import { Router } from 'express';
import { User } from '../schemas/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authVerification from '../middlewares/authVerification.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

userRouter.post('/new', authVerification, async (req, res) => {
  try {
    const { name, user, password, isAdmin = false } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      name,
      user,
      password: hashedPassword,
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
    const { user, password } = req.body;

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

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_KEY, {
      expiresIn: '1d',
    });

    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (e) {
    return res.status(400).json({ type: 'error', message: e.message });
  }
});

userRouter.get('/auth', authVerification, async (req, res) => {
  const userData = await User.findById(req.user.id).select('-password');

  res.status(200).json(userData);
});

export default userRouter;
