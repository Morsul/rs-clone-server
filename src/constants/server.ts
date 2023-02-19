export const port = <number>(process.env.PORT || 3000);
export const dbName = 'mmData';

export const responseStatus = {
  error: 500,
  created: 201,
  ok: 200,
  notFound: 404,
};