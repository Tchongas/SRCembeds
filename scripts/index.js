const express = require('express');
const app = express();

// Mock database or data source for portfolio projects
const portfolioData = {
  "123": {
    title: "123",
    description: "test456",
  },
  "456": {
    title: "456",
    description: "test456",
  },
};

app.get('/:id', (req, res) => {
  const projectId = req.params.id;
  const project = portfolioData[projectId];

  if (project) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <!-- Dynamic Open Graph Meta Tags -->
          <meta property="og:title" content="${project.title}" />
          <meta property="og:description" content="${project.description}" />
          <meta property="og:image" content="${project.image}" />
          <meta property="og:url" content="http://localhost:3000/${projectId}" />
          <meta property="og:type" content="website" />
          
          <!-- Dynamic Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${project.title}" />
          <meta name="twitter:description" content="${project.description}" />

          <title>${project.title}</title>
        </head>
        <body>
          <h1>${project.title}</h1>
          <p>${project.description}</p>
        </body>
      </html>
    `);
  } else {
    // Handle 404 if project ID is not found
    res.status(404).send('Project not found');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.get('/', (req, res) => {
    res.send('hi!');
  });