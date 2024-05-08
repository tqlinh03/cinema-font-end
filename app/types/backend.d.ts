export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  satusCode: number | string;
  data?: T;
}

export interface IAccount {
  access_token: any;
  user: {
    _id: string;
    email: string;
    name: string;
    role: {
      _id: string;
      name: string;
      permissions: {
        _id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }[];
    };
    bookings: {
      _id: string;
      ma_GD: string;
      total_price: string;
      movie: {
        name: string;
      };
      seats: string[];
      isPayment: boolean;
    }[];
  };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IPermission {
  _id?: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICinema {
  _id?: string;
  name: string;
  area: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRoom {
  _id?: string;
  name: string;
  isActive: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMovie {
  _id?: any;
  name: string;
  description: string;
  genre: string;
  time: number;
  director: string;
  cast: string;
  ReleaseDate: Date | null;
  videoURL: string;
  img: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBooking {
  _id?: any;
  ma_GD: string;
  seats: string;
  total_price: number;
  isPayment: boolean;
  user: IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IShowtime {
  _id?: any;
  date: Date;
  start_time: Date;
  end_time: Date;
  movie: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email?: string;
  password?: string;
  // age: number;
  gender: string;
  address: string;
  role?: {
    _id: string;
    name: string;
  };

  company?: {
    _id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  _id?: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: IPermission[] | number[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILikeComment {
  _id?: number;
  user: IUser | number;
  comment: IComment | number;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReplyComment {
  _id?: number;
  user: IUser | number;
  comment: IComment | number;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ICommentProps {
  _id: number;
  content: string;
  user: {
    _id: number;
    name: string;
  };
  movie: {
    _id: number;
  };
  createdAt: Date;
  replies?: {
    _id: number;
    content: string;
    user: {
      _id: number;
      name: string;
    };
    createdAt: Date;
  };
}

export interface IComment {
  _id?: number;
  content: string;
  user?: IUser[] | number | { _id: number; name: string };

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPermission {
  _id?: string;
  name?: string;
  path?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}
