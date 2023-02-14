import { RSCloneServer } from "./src/server";

const app = new RSCloneServer();

process.on('SIGINT', () => {
  app.closeConnection()
})