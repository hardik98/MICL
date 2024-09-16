const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for all origins (for development purposes)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Use default middlewares (logger, static, etc.)
server.use(middlewares);
server.use(router);

// Start the JSON Server
const port = 5000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
