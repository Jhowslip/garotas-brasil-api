import { Request, Response } from 'express';
import aws from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../utils/data-source';
import User from '../entities/User';
import Profile from '../entities/Profile';
import Payment from '../entities/Payment';
import Feedback from '../entities/Feedback';

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAWYB32RTBO4MER3VK',
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY ||
      'LXuDebvgsv0FlXSNewnLqNYJvPBOYA6hKcsL',
  },
});

class UserController {
  async store(req: Request, res: Response) {
    const {
      name,
      email,
      password,
      provider,
      contato,
      plan_level,
      rg,
      data_nascimento,
      cidade,
      estado,
      confirmation_video,
    } = req.body;

    const userExists = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.provider = provider;
    user.contact = contato;
    user.plan_level = plan_level;
    user.rg = rg;
    user.data_nascimento = data_nascimento;
    user.cidade = cidade;
    user.estado = estado;
    user.confirmation_video = confirmation_video;

    const profile = new Profile();
    profile.name = 'Digite o Nome do seu Perfil';
    profile.description = 'Sobre mim';
    profile.quotes = [];
    profile.services = [];
    profile.videos = [];
    profile.tags = [];
    profile.photos = [];
    profile.city = cidade;
    profile.state = estado;
    profile.user = user;

    const pagamento = new Payment();
    pagamento.receipt = '';
    pagamento.user = user;
    pagamento.plan_level = plan_level;

    const feedback = new Feedback();
    feedback.nome = '';
    feedback.mensagem = '';
    feedback.profile = profile;

    const [userSaved, profileSaved, pagamentoSaved, feedbackSaved] =
      await Promise.all([
        AppDataSource.getRepository(User).save(user),
        AppDataSource.getRepository(Profile).save(profile),
        AppDataSource.getRepository(Payment).save(pagamento),
        AppDataSource.getRepository(Feedback).save(feedback),
      ]);

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

  async upload(req: Request, res: Response) {
    const fileBuffer = Buffer.from(req?.body?.images, 'base64');

    const contentType = 'image/jpeg';
    const filename = `image-${Date.now().toString()}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'garotasbrasil',
      Key: filename,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      await s3.upload(params).promise();
      return res.json({
        url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  async uploadVideos(req: Request, res: Response) {
    const fileBuffer = Buffer.from(req?.body?.videos, 'base64');

    const contentType = 'video/mp4';
    const filename = `video-${Date.now().toString()}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'garotasbrasil',
      Key: filename,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      await s3.upload(params).promise();
      return res.json({
        url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new UserController();
