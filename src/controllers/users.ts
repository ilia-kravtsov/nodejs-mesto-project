import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import StatusCodes from '../constants/status-codes';
import HttpError from '../errors/http-error';
import { RequestWithUser } from '../types/index';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      next(HttpError.notFound({ message: 'Пользователи не добавлены' }));
    } else {
      res.status(StatusCodes.OK).send(users);
    }
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .orFail(() => HttpError.notFound({ message: 'Пользователь по указанному _id не найден.' }));

    res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(HttpError.badRequest({ message: 'Передан некорректный _id пользователя.' }));
    } else {
      next(err);
    }
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  if (!name || !about || !avatar) {
    next(HttpError.badRequest({ message: 'Переданы некорректные данные при создании пользователя.' }));
    return;
  }

  try {
    const user = await User.create({
      name,
      about,
      avatar,
    });

    res.status(StatusCodes.CREATED).send(user);
  } catch (err) {
    if ((err as { code: number }).code === 11000) {
      next(HttpError.conflict({ message: 'Пользователь существует' }));
    } else if (err instanceof Error && err.name === 'ValidationError') {
      next(HttpError.badRequest({ message: 'Переданы некорректные данные при создании пользователя.' }));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
  } = req.body;

  if (!name || !about) {
    next(HttpError.badRequest({ message: 'Переданы некорректные данные при обновлении профиля.' }));
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      (req as RequestWithUser).user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => HttpError.notFound({ message: 'Пользователь с указанным _id не найден.' }));

    res.status(StatusCodes.OK).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(HttpError.badRequest({ message: 'Переданы некорректные данные при обновлении профиля.' }));
    } else {
      next(err);
    }
  }
};

const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (!avatar) {
    next(HttpError.badRequest({ message: 'Переданы некорректные данные при обновлении аватара.' }));
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      (req as RequestWithUser).user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => HttpError.notFound({ message: 'Пользователь с указанным _id не найден.' }));

    res.status(StatusCodes.OK)
      .send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      next(HttpError.badRequest({ message: 'Переданы некорректные данные при обновлении аватара.' }));
    } else {
      next(err);
    }
  }
};

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
