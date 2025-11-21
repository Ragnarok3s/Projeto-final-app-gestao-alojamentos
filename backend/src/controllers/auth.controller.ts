import { Request, Response, NextFunction } from 'express';
import { authenticateUser } from '../services/auth.service';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios' });
    }

    const result = await authenticateUser(email, password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}
