const { ApolloServer, PubSub } = require("apollo-server");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://peoplemedia.netlify.app/",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

server.applyMiddleware({ app });

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.log(err);
  });
