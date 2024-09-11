const express = require('express');
const app = express();


// Function to fetch data from an API endpoint
async function fetchApiData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  
  app.get('/:id', async (req, res) => {
    const runId = req.params.id;
    const runApiUrl = `https://www.speedrun.com/api/v1/runs/${runId}`;
  
    try {
      // Fetch run data
      const runData = await fetchApiData(runApiUrl);
  
      if (!runData || !runData.data) {
        return res.status(404).send('Run data not found');
      }
  
      const run = runData.data;
  
      // Extract relevant IDs from run data
      const categoryId = run.category;
      const gameId = run.game;
  
      // Fetch category and game data
      const categoryApiUrl = `https://www.speedrun.com/api/v1/categories/${categoryId}`;
      const gameApiUrl = `https://www.speedrun.com/api/v1/games/${gameId}`;
  
      const [categoryData, gameData] = await Promise.all([
        fetchApiData(categoryApiUrl),
        fetchApiData(gameApiUrl)
      ]);
  
      if (!categoryData || !gameData) {
        return res.status(404).send('Category or game data not found');
      }
  
      // Extract data for meta tags
      const title = `Speedrun in ${categoryData.data.name} by Player ${run.players[0].id}`;
      const description = `${run.comment} - Time: ${run.times.primary} - Game: ${gameData.data.names.international}`;
      const videoUrl = run.videos?.links?.[0]?.uri || 'https://example.com/default-thumbnail.jpg';
      const runLink = run.weblink;
  
      // Extract YouTube video ID if applicable
      let youtubeEmbedUrl = '';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('v=')[1] || videoUrl.split('/')[3];
        youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
  
      // Respond with dynamic HTML containing the fetched meta tags
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
            <meta property="og:type" content="video.other" />
  
            <!-- Embed YouTube video in Open Graph -->
            ${youtubeEmbedUrl ? `<meta property="og:video" content="${youtubeEmbedUrl}" />
            <meta property="og:video:type" content="text/html" />
            <meta property="og:video:width" content="1280" />
            <meta property="og:video:height" content="720" />` : ''}
            
            <!-- Dynamic Twitter Card Meta Tags -->
            <meta name="twitter:card" content="player" />
            <meta name="twitter:title" content="${title}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${videoUrl}" />
            ${youtubeEmbedUrl ? `<meta name="twitter:player" content="${youtubeEmbedUrl}" />
            <meta name="twitter:player:width" content="1280" />
            <meta name="twitter:player:height" content="720" />` : ''}
  
            <title>${title}</title>
          </head>
          <body>
            <h1>${title}</h1>
            <p>${description}</p>
            <a href="${runLink}">View run on Speedrun.com</a>
            <br/>
            ${youtubeEmbedUrl ? `<iframe width="560" height="315" src="${youtubeEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : ''}
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });