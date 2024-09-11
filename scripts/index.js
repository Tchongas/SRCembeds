const express = require('express');
const app = express();

app.get('/:id', async (req, res) => {
  const runId = req.params.id;
  const apiUrl = `https://www.speedrun.com/api/v1/runs/${runId}`;

  try {
    const response = await fetch(apiUrl);
    const runData = await response.json();

    if (!runData || !runData.data) {
      return res.status(404).send('Run data not found');
    }

    const run = runData.data;

    const title = `Speedrun by Player ${run.players[0].id}`;
    const description = `${run.comment} - Time: ${run.times.primary}`;
    const videoUrl = run.videos?.links?.[0]?.uri || 'https://www.speedrun.com/static/user/863kp138/image.png?v=5d896ad';
    const runLink = run.weblink;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <!-- Dynamic Open Graph Meta Tags -->
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${videoUrl}" />
          <meta property="og:url" content="${runLink}" />
          <meta property="og:type" content="website" />
          
          <!-- Dynamic Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${videoUrl}" />

          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <p>${description}</p>
          <a href="${runLink}">View run on Speedrun.com</a>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching run data:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
