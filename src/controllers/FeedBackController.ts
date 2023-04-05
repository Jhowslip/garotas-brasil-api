import Feedback from '../entities/Feedback';
import Profile from '../entities/Profile';
import { AppDataSource } from '../utils/data-source';
import { Request, Response } from 'express';

class FeedBackController {
  async getAll(req: Request, res: Response) {
    try {
      const feedback = await AppDataSource.createQueryBuilder(
        Feedback,
        'feedback'
      )
        .leftJoinAndSelect('feedback.profile', 'profile')
        .getMany();

      return res.json(feedback);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  async store(req: any, res: any) {
    const { nome, mensagem, profile_id } = req.body;
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: profile_id },
    });

    if (!profile) {
      return res.status(401).json({ error: 'Profile not found' });
    }
    const feedback = await AppDataSource.getRepository(Feedback).save({
      nome: nome,
      mensagem: mensagem,
      profile: profile,
    });

    return res.json(feedback);
  }
}

export default new FeedBackController();
