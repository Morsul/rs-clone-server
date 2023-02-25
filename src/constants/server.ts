export const port = <number>(process.env.PORT || 3000);
export const dbName = 'mmData';

export const responseStatus = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
  error: 500,

};