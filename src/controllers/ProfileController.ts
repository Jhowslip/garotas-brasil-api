import { Request, Response } from 'express';
import { AppDataSource } from '../utils/data-source';
import Profile from '../entities/Profile';
import User from '../entities/User';

class ProfileController {
  async getAll(req: Request, res: Response) {
    try {
      const profiles = await AppDataSource.createQueryBuilder(
        Profile,
        'profile'
      )
        .leftJoinAndSelect('profile.user', 'user')
        .getMany();

      return res.json(profiles);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const profile = await AppDataSource.createQueryBuilder(Profile, 'profile')
        .leftJoinAndSelect('profile.user', 'user')
        .where('profile.id = :id', { id: req.params.id })
        .getOne();

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json(profile);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProfileController();
