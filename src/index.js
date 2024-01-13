const express = require("express");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");
const errorHandler = require("./utils/errors");
const redis = require("redis");
const client = redis.createClient({
  socket: {
    port: 6379,
    host: "redis-ms",
  },
});

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel, client);

  errorHandler(app);
  client.connect();
  client.on("connect", (err) => {
    if (err) throw err;
    else console.log("Redis Connected..!");
  });

  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    })
    .on("close", () => {
      channel.close();
      client.quit();
    });
};

StartServer();
