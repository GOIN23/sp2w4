export type FieldError = {
  message: string;
  field: string;
};

export type APIErrorResult = {
  errorsMessages: FieldError[];
};

export enum SortDirectionsstring {
  asc = 1,
  desc = 0,
}

export type qureT = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
};

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type LoginSuccessViewModel = {
  accessToken: string;
  refreshToken: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type Paginator<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export type CustomRateLimitT = {
  IP: string | undefined;
  URL: string;
  date: Date;
};

export type userSessionT = {
  userId: string;
  DeviceId: string;
  lat: string;
  exp: string;
};

export type DeviceViewModel = {
  userId:string
  ip: string | undefined;
  title: string | undefined;
  lastActiveDate: string;
  deviceId: string;
};
