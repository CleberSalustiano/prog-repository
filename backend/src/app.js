const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");
const res = require("express/lib/response");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function existRepository(request, response, next) {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryValue = repositories.find(
    (repository) => repository.id === id
  );

  if (!repositoryValue) {
    return response.status(400).json({ error: "Don't found this repository" });
  }

  const repository = {
    id,
    title,
    url,
    techs,
  };

  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", existRepository, (request, response) => {
  const { id } = request.repository;

  index = repositories.findIndex((repository) => repository.id === id);

  const repository = request.repository;
  repository.likes = repositories[index].likes;

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", existRepository, (request, response) => {
  const { id } = request.repository;

  index = repositories.findIndex((repository) => repository.id === id);

  repositories.splice(index, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", existRepository, (request, response) => {
  const { id } = request.repository;

  index = repositories.findIndex((repository) => repository.id === id);

  repositories[index].likes++;

  return response.status(204).json();
});

module.exports = app;
