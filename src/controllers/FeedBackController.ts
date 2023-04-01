import Feedback from '../entities/Feedback';
import { AppDataSource } from '../utils/data-source';

class FeedBackController {
  async store(req: any, res: any) {
    const { nome, mensagem, profile_id } = req.body;
    const feedback = await AppDataSource.getRepository(Feedback).save({
      nome: nome,
      mensagem: mensagem,
      profile: profile_id,
    });

    if (!feedback) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.json(feedback);
  }
}

export default new FeedBackController();
