const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function valideRepositoryExistsRequests(request, response, next) {
  if (findRepositoryIndex(request.params.id) < 0)
    return response.status(400).json({ error: 'Repository does not exists.' });

  next();
}
app.use('/repositories/:id', valideRepositoryExistsRequests);

function findRepositoryIndex(id) {
  const findRepositoryIndex = repositories.findIndex(repository => 
    repository.id === id
  )

  return findRepositoryIndex;
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
    likes: 0
  }
  
  repositories.push(repository);
  
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  repositoryIndex = findRepositoryIndex(id);
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  repositories.splice(findRepositoryIndex(id), 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", valideRepositoryExistsRequests, (request, response) => {
  const { id } = request.params;
  
  repositoryIndex = findRepositoryIndex(id);

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;