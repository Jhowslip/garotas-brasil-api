import { Request, Response } from 'express';
import { AppDataSource } from '../utils/data-source';
import Profile from '../entities/Profile';
import aws from 'aws-sdk';

class ProfileController {
  async getAll(req: Request, res: Response) {
    try {
      const profiles = await AppDataSource.getRepository(Profile).find();

      return res.json(profiles);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const profile = await AppDataSource.getRepository(Profile).findOne({
        where: { id: id },
      });

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json(profile);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const {
      city,
      description,
      id,
      name,
      photos,
      quotes,
      services,
      state,
      tags,
      videos,
    } = req.body;
    try {
      const profile = await AppDataSource.getRepository(Profile).findOne({
        where: { id: req.body?.id },
      });

      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      const profileUpdated = await AppDataSource.getRepository(Profile).merge(
        profile,
        {
          city,
          description,
          id,
          name,
          photos,
          quotes,
          services,
          state,
          tags,
          videos,
        }
      );
      const profileSaved = await AppDataSource.getRepository(Profile).save(
        profileUpdated
      );

      return res.json(profileSaved);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProfileController();
