import { AppDataSource } from '../utils/data-source';
import Plan from '../entities/Plan';

class SessionController {
  async store(req: any, res: any) {
    const { name, description, price, level } = req.body;

    const plan = new Plan();
    plan.name = name;
    plan.description = description;
    plan.price = price;
    plan.level = level;

    const planSaved = await AppDataSource.getRepository(Plan).save(plan);

    return res.json(planSaved);
  }

  async getAll(req: any, res: any) {
    try {
      const plans = await AppDataSource.getRepository(Plan).find();

      return res.json(plans);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new SessionController();
