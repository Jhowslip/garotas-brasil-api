import { Request, Response } from "express";
import { AppDataSource } from "../utils/data-source";
import Profile from "../entities/Profile";
import aws from "aws-sdk";
import User from "../entities/User";

class ProfileController {
  async getAll(req: Request, res: Response) {
    try {
      const planLevel = req.query.plan_level; // obtém o valor do parâmetro de consulta
      const city = req.query.city; // obtém o valor do parâmetro de consulta
      const state = req.query.state; // obtém o valor do parâmetro de consulta

      const profiles = await AppDataSource.getRepository(Profile).find({
        where: {
          user: {
            provider: true,
            plan_level: planLevel?.toString(),
            cidade: city?.toString(),
            estado: state?.toString(),
          }, // filtra os perfis com base no valor do parâmetro de consulta
        },
      });

      // Encerra a conexão após finalizar a operação
      return res.json(profiles);
    } catch (error) {
      console.error(error); // Imprime a mensagem de erro no console
      // Encerra a conexão se ocorrer algum erro
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const profile = await AppDataSource.getRepository(Profile).findOne({
        relations: ["user"],
        where: { id: id },
      });

      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      const response = {
        id: profile?.id,
        name: profile?.name,
        description: profile?.description,
        quotes: profile?.quotes,
        services: profile?.services,
        tags: profile?.tags,
        photos: profile?.photos,
        city: profile?.city,
        state: profile?.state,
        videos: profile?.videos,
        contact: profile?.user?.contact,
        plan_level: profile?.user?.plan_level,
        created_at: profile?.created_at,
        updated_at: profile?.updated_at,
      };
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
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
        return res.status(404).json({ error: "Profile not found" });
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
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ProfileController();
