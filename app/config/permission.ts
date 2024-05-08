export const ALL_PERMISSIONS = {
  PERMISSIONS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
      CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/:id', module: "PERMISSIONS" },
  },
  ROLES: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
      CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/roles/:id', module: "ROLES" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/roles/:id', module: "ROLES" },
  },
  USERS: {
      GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
      CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
      UPDATE: { method: "PATCH", apiPath: '/api/v1/users/:id', module: "USERS" },
      DELETE: { method: "DELETE", apiPath: '/api/v1/users/:id', module: "USERS" },
  },
  CINEMAS: {
    GET_PAGINATE: { method: "GET", apiPath: '/api/v1/cinemas', module: "CINEMAS" },
    CREATE: { method: "POST", apiPath: '/api/v1/cinemas', module: "CINEMAS" },
    UPDATE: { method: "PATCH", apiPath: '/api/v1/cinemas/:id', module: "CINEMAS" },
    DELETE: { method: "DELETE", apiPath: '/api/v1/cinemas/:id', module: "CINEMAS" },
  },
  ROOMS: {
    GET_PAGINATE: { method: "GET", apiPath: '/api/v1/rooms', module: "ROOMS" },
    CREATE: { method: "POST", apiPath: '/api/v1/rooms', module: "ROOMS" },
    UPDATE: { method: "PATCH", apiPath: '/api/v1/rooms/:id', module: "ROOMS" },
    DELETE: { method: "DELETE", apiPath: '/api/v1/rooms/:id', module: "ROOMS" },
  },
  MOVIES: {
    GET_PAGINATE: { method: "GET", apiPath: '/api/v1/movies', module: "MOVIES" },
    CREATE: { method: "POST", apiPath: '/api/v1/movies', module: "MOVIES" },
    UPDATE: { method: "PATCH", apiPath: '/api/v1/movies/:id', module: "MOVIES" },
    DELETE: { method: "DELETE", apiPath: '/api/v1/movies/:id', module: "MOVIES" },
  },
  SHOWTIME: {
    GET_PAGINATE: { method: "GET", apiPath: '/api/v1/showtime', module: "SHOWTIME" },
    CREATE: { method: "POST", apiPath: '/api/v1/showtime', module: "SHOWTIME" },
    UPDATE: { method: "PATCH", apiPath: '/api/v1/showtime/:id', module: "SHOWTIME" },
    DELETE: { method: "DELETE", apiPath: '/api/v1/showtime/:id', module: "SHOWTIME" },
  },
}

export const ALL_MODULES = {
  AUTH: 'AUTH',
  BOOKINGS: 'BOOKINGS',
  MOVIES: 'MOVIES',
  COMMENTS: 'COMMENTS',
  SHOWTIME: 'SHOWTIME',
  SEATS: 'SEATS',
  PERMISSIONS: 'PERMISSIONS',
  ROOMS: 'ROOMS',
  ROLES: 'ROLES',
  USERS: 'USERS',
  CINEMAS: 'CINEMAS'
}