const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middleware
const verifyValidIdandRepo = (req, res, next) => {
  if (! isUuid(req.params.id)) {
    return res.status(400).json({ error: 'Id not valid' })
  }

  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' })
  }
  
  req.repoIndex = repositoryIndex

  return next()
}

app.use('/repositories/:id', verifyValidIdandRepo)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { repoIndex } = request  

  const { title, url, techs } = request.body

  repositories[repoIndex] = { ...repositories[repoIndex], title, url,techs }

  return response.json(repositories[repoIndex])
  
});

app.delete("/repositories/:id", (request, response) => {
  const { repoIndex } = request  

  repositories.splice(repoIndex, 1)

  return response.sendStatus(204)
});

app.post("/repositories/:id/like", (request, response) => {
  const { repoIndex } = request  

  repositories[repoIndex].likes ++

  return response.json(repositories[repoIndex])
});

module.exports = app;
