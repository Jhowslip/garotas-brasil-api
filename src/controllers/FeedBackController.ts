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

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id; // pega o id da URL
  
      const feedback = await AppDataSource.createQueryBuilder(
        Feedback,
        'feedback'
      )
        .leftJoinAndSelect('feedback.profile', 'profile')
        .where('feedback.id = :id', { id }) // adiciona uma cláusula "where" para buscar pelo id
        .getOne(); // usa o método "getOne" para retornar apenas um registro
  
      if (!feedback) { // verifica se não encontrou nenhum registro
        return res.status(404).json({ error: 'Feedback not found' });
      }
  
      return res.json(feedback);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }  

  async getByProfileId(req: Request, res: Response) {
    try {
      const profileId = req.params.id;
  
      const feedbacks = await AppDataSource.createQueryBuilder(
        Feedback,
        'feedback'
      )
        .where('feedback.profile = :profileId', { profileId }) // adiciona uma cláusula "where" para buscar pelos feedbacks do profile
        .getMany(); // usa o método "getMany" para retornar vários registros
  
      return res.json(feedbacks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  
  async store(req: any, res: any) {
    const { nome, mensagem, profile_id, rank } = req.body;
    const profile = await AppDataSource.getRepository(Profile).findOne({
      where: { id: profile_id },
    });

    if (!profile) {
      return res.status(401).json({ error: 'Profile not found' });
    }
    const feedback = await AppDataSource.getRepository(Feedback).save({
      nome: nome,
      mensagem: mensagem,
      rank: rank,
      profile: profile,
    });

    return res.json(feedback);
  }
}

export default new FeedBackController();
