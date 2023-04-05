import { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import { AppDataSource } from '../utils/data-source';
import User from '../entities/User';
import Profile from '../entities/Profile';
import Payment from '../entities/Payment';
import Feedback from '../entities/Feedback';

class UserController {
  async store(req: Request, res: Response) {
    const {
      name,
      email,
      password,
      provider,
      confirmation_video,
      contato,
      plan_level,
    } = req.body;

    const userExists = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    async function hashPassword(password: string) {
      let cripty = await bcrypt.hash(password, 8);
      return cripty;
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = await hashPassword(password);
    user.provider = provider;
    user.confirmation_video = confirmation_video;
    user.contact = contato;
    user.plan_level = plan_level;

    const userSaved = await AppDataSource.getRepository(User).save(user);

    const profile = new Profile();
    profile.name = 'Digite o Nome do seu Perfil';
    profile.description = 'Sobre mim';
    profile.quotes = [];
    profile.services = [];
    profile.videos = [];
    profile.tags = [];
    profile.photos = [];
    profile.city = '';
    profile.state = '';
    profile.user = userSaved;

    const profileSaved = AppDataSource.getRepository(Profile).save(profile);

    const pagamento = new Payment();
    pagamento.receipt = '';
    pagamento.user = userSaved;
    pagamento.plan_level = plan_level;

    const pagamentoSaved = await AppDataSource.getRepository(Payment).save(
      pagamento
    );

    const feedback = new Feedback();
    feedback.nome = '';
    feedback.mensagem = '';
    feedback.profile = profile;

    const feedbackSaved = await AppDataSource.getRepository(Feedback).save(
      feedback
    );

    return res.json({
      id: userSaved.id,
      nome: userSaved.name,
      email: userSaved.email,
      provider: userSaved.provider,
      profile: profileSaved,
      pagamento: pagamentoSaved,
      feedback: feedbackSaved,
    });
  }

  async update(req: Request, res: Response) {
    const { email, oldPassword } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: email });

    if (email === user?.email) {
      const userExists = await userRepository.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user?.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    userRepository.merge(user!, req.body);

    const savedUser = await userRepository.save(user!);

    return res.json({
      id: savedUser.id,
      nome: savedUser.name,
      email: savedUser.email,
      provider: savedUser.provider,
    });
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await AppDataSource.getRepository(User).find({
        select: ['id', 'name', 'email', 'provider', 'plan_level'],
        relations: ['profiles', 'payments'],
      });

      // Encerra a conexão após finalizar a operação
      return res.json(users);
    } catch (error) {
      console.error(error); // Imprime a mensagem de erro no console
      // Encerra a conexão se ocorrer algum erro
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
