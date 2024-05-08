import axios from '@/app/config/axios-customize';
import { IAccount, IBackendRes, ICinema, IComment, ILikeComment, IMovie, IPermission, IReplyComment, IRole, IRoom, IShowtime, IUser } from '../types/backend';


// Module Auth
export const callLogin = (username: string, password: string) => {
  return axios.post('/api/v1/auth/login', { username, password })
}

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout")
}

export const callRefreshToken = () => {
  return axios.get('/api/v1/auth/refresh')
}

export const callFetchAccount = () => {
  return axios.get("/api/v1/auth/account")
}

// Module Cinema
export const callCreateRoom = (room: IRoom) => {
  return axios.post('/api/v1/rooms', {...room})
}

export const callFetchRoom= (query: string) => {
  return axios.get(`/api/v1/rooms?${query}`)
}

export const callDeleteRoom = (id: number) => {
  return axios.delete(`/api/v1/rooms/${id}`)
}

export const callUpdateRoom = (id: number, room: ICinema) => {
  return axios.patch(`/api/v1/rooms/${id}`, {...room})
}

// Module Cinemas
export const callCreateCinema = (cinema: ICinema) => {
  return axios.post('/api/v1/cinemas', {...cinema})
}

export const callFetchCinema = (query: string) => {
  return axios.get(`/api/v1/cinemas?${query}`)
}

export const callDeleteCinema = (id: number) => {
  return axios.delete(`/api/v1/cinemas/${id}`)
}

export const callUpdateCinema = (id: number, cinema: ICinema) => {
  return axios.patch(`/api/v1/cinemas/${id}`, {...cinema})
}

//Module User
export const callCreateUser = (user: IUser) => {
  return axios.post('/api/v1/users', { ...user})
}

export const callFetchUser = (query: string) => {
  return axios.get(`/api/v1/users?${query}`)
}

export const callDeleteUser = (id: number) => {
  return axios.delete(`/api/v1/users/${id}`)
}

export const callUpdateUser = (id: number, user: IUser) => {
  return axios.patch(`/api/v1/users/${id}`, {...user})
}

// Module Role
export const callFetchRole = (query: string) => {
  return axios.get(`/api/v1/roles?${query}`)
}

export const callCreateRole = (role: IRole) => {
  return axios.post('/api/v1/roles', { ...role})
}

export const callFetchRoleByID = (id: number) => {
  return axios.get(`/api/v1/roles/${id}`);
}
export const callDeleteRole = (id: number) => {
  return axios.delete(`/api/v1/roles/${id}`)
}

export const callUpdateRole = (role: IRole, id: number) => {
  return axios.patch(`/api/v1/roles/${id}`, {...role})
}

//Module permission 
export const callCreatePermission = (permission: IPermission) => {
  return axios.post(`/api/v1/permissions`, {...permission})
}

export const callFetchPermission = (query: string) => {
  return axios.get(`/api/v1/permissions?${query}`)
}
export const callDeletePermission = (id: number) => {
  return axios.delete(`/api/v1/permissions/${id}`)
}

export const callUpdatePermission = (id: number, permission: IPermission) => {
  return axios.patch(`/api/v1/permissions/${id}`, {...permission})
}

//Module Movie 
export const callCreateMovie = (movie: IMovie) => {
  return axios.post(`/api/v1/movies`, {...movie})
}

export const callFetchMovie = (query: string) => {
  return axios.get(`/api/v1/movies?${query}`)
}

export const callFetchMovieById = (id: number) => {
  return axios.get(`/api/v1/movies/${id}`)
}

export const callDeleteMovie = (id: number) => {
  return axios.delete(`/api/v1/movies/${id}`)
}

export const callUpdateMovie = (id: number, movie: IMovie) => {
  return axios.patch(`/api/v1/movies/${id}`, {...movie})
}

//Module Comment 
export const callCreateComment = (comment: IComment) => {
  return axios.post(`/api/v1/comments`, {...comment})
}
export const callCreateReplyComment = (id: number, replyComment: IComment) => {
  return axios.post(`/api/v1/comments/${id}`, {...replyComment})
}

export const callFetchComment = (movieId: number, query: string) => {
  return axios.get(`/api/v1/comments/${movieId}?${query}`)
}

export const callFetchCommentByMovieId = (id: number) => {
  return axios.get(`/api/v1/comments/${id}`)
}
export const callDeleteComment = (id: number) => {
  return axios.delete(`/api/v1/comments/${id}`)
}

export const callUpdateComment = (id: number, comment: IComment) => {
  return axios.patch(`/api/v1/comments/${id}`, {...comment})
}

//Module Like_Comment 
export const callCreateLikeComment = (like: ILikeComment) => {
  return axios.post(`/api/v1/like-comments`, {...like})
}

export const callFetchLikeComment = (commentId: number, query: string) => {
  return axios.get(`/api/v1/like-comments/${commentId}?${query}`)
}

export const callFetchLikeCommentById = (id: number) => {
  return axios.get(`/api/v1/like-comments/${id}`)
}
export const callDeleteLikeComment = (id: number) => {
  return axios.delete(`/api/v1/like-comments/${id}`)
}

export const callUpdateLikeComment = (id: number, like: ILikeComment) => {
  return axios.patch(`/api/v1/like-comments/${id}`, {...like})
}

//Module Showtime 
export const callCreateShowtime = (showtime: IShowtime) => {
  return axios.post(`/api/v1/showtimes`, {...showtime})
}

export const callFetchShowtime = (query: string) => {
  return axios.get(`/api/v1/showtimes?${query}`)
}

export const callFetchShowtimeByDate = (date: Date) => {
  return axios.get(`/api/v1/showtimes/${date}`)
}

export const callFetchMovieByIdAndDate = (id: number, date: Date) => {
  return axios.get(`/api/v1/showtimes/detail/${id}/${date}`)
}

export const callDeleteShowtime = (id: number) => {
  return axios.delete(`/api/v1/showtimes/${id}`)
}

export const callUpdateShowtime = (id: number, showtime: IShowtime) => {
  return axios.patch(`/api/v1/showtimes/${id}`, {...showtime})
}

//Module Seat 
export const callBookingSeats = (booking: any) => {
  return axios.post(`/api/v1/seats`, {...booking})
}

//Module BookingTicket 
export const callBookingTicket = (ticket: any) => {
  return axios.post(`/api/v1/bookings`, {...ticket})
}
export const callUpdateBookingTicket = (ticketId: number) => {
  return axios.patch(`/api/v1/bookings/${ticketId}`)
}

