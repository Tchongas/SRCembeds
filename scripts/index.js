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
      const userId = run.players[0].id;
  
      // Fetch category and game data
      const categoryApiUrl = `https://www.speedrun.com/api/v1/categories/${categoryId}`;
      const gameApiUrl = `https://www.speedrun.com/api/v1/games/${gameId}`;
      const userApiUrl = `https://www.speedrun.com/api/v1/users/${userId}`;
  
      const [categoryData, gameData, userData] = await Promise.all([
        fetchApiData(categoryApiUrl),
        fetchApiData(gameApiUrl),
        fetchApiData(userApiUrl)
      ]);
  
      if (!categoryData || !gameData || !userData) {
        return res.status(404).send('Category or game data not found');
      }
  
      // Extract data for meta tags
      const title = `Speedrun in ${categoryData.data.name} by ${userData.data.names.international}`;
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
<!doctype html>
<html lang="en">
<head prefix="og: http://ogp.me/ns#">
<meta charset="utf-8">
<title>Structured video array</title>
<meta property="og:title" content="Structured video array">
<meta property="og:site_name" content="Open Graph protocol examples">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<link rel="canonical" href="http://examples.opengraphprotocol.us/video-array.html">
<meta property="og:url" content="http://examples.opengraphprotocol.us/video-array.html">
<meta property="og:image" content="http://examples.opengraphprotocol.us/media/images/50.png">
<meta property="og:image:secure_url" content="https://d72cgtgi6hvvl.cloudfront.net/media/images/50.png">
<meta property="og:image:width" content="50">
<meta property="og:image:height" content="50">
<meta property="og:image:type" content="image/png">
<meta property="og:video" content="http://fpdownload.adobe.com/strobe/FlashMediaPlayback.swf?src=http%3A%2F%2Fexamples.opengraphprotocol.us%2Fmedia%2Fvideo%2Ftrain.mp4">
<meta property="og:video:secure_url" content="https://fpdownload.adobe.com/strobe/FlashMediaPlayback.swf?src=https%3A%2F%2Fd72cgtgi6hvvl.cloudfront.net%2Fmedia%2Fvideo%2Ftrain.mp4">
<meta property="og:video:type" content="application/x-shockwave-flash">
<meta property="og:video:width" content="472">
<meta property="og:video:height" content="296">
<meta property="og:video" content="http://examples.opengraphprotocol.us/media/video/train.mp4">
<meta property="og:video:secure_url" content="https://d72cgtgi6hvvl.cloudfront.net/media/video/train.mp4">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="472">
<meta property="og:video:height" content="296">
<meta property="og:video" content="http://examples.opengraphprotocol.us/media/video/train.webm">
<meta property="og:video:secure_url" content="https://d72cgtgi6hvvl.cloudfront.net/media/video/train.webm">
<meta property="og:video:type" content="video/webm">
<meta property="og:video:width" content="480">
<meta property="og:video:height" content="320">
</head>
<body>
<p>Example of basic properties with <a href="http://ogp.me/#structured">structured</a> videos in a SWF wrapper, MP4, and WebM format.</p>
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