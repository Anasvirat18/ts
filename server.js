const express = require('express');
const { spawn } = require('child_process');
const app = express();

// Use port provided by Render, fallback to 3000 locally
const port = process.env.PORT || 3000;

// ID to M3U8 channel mapping
const channels = {
  '1': 'https://mumt02.tangotv.in/MATHRUBHUMINEWS/index.m3u8',
  '2': 'https://list.iptvcat.com/my_list/s/19cf3fe809f36a164661b51e680a0f64.m3u8',
  '3': 'https://cdn-7.pishow.tv/live/1129/master.m3u8',
  '4': 'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/mazhavilmanorama_nim_https/050522/mazhavilmanorama/playlist.m3u8',
  '5': 'https://mmtvnews1.akamaized.net/v1/master/673630b269b766886555eebfddd4f27f3de3ab50/mmtvNewsCampaign1/index.m3u8',
  '6': 'http://103.157.248.140:8000/play/a00s/index.m3u8',
  '7': 'https://amg13737-amg13737c1-amgplt0016.playout.now3.amagi.tv/playlist/amg13737-amg13737c1-amgplt0016/playlist.m3u8',
  '8': 'https://mumt01.tangotv.in/KAIRALI/index.m3u8',
};

app.get('/box.ts', (req, res) => {
  const id = req.query.id;

  if (!channels[id]) {
    return res.status(404).send('Channel not found.');
  }

  const m3u8Url = channels[id];

  res.setHeader('Content-Type', 'video/MP2T');

  const ffmpeg = spawn('ffmpeg', [
    '-i', m3u8Url,
    '-c', 'copy',
    '-f', 'mpegts',
    'pipe:1'
  ]);

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
    res.end();
  });

  req.on('close', () => {
    ffmpeg.kill('SIGKILL');
  });
});

app.get('/', (req, res) => {
  res.send(`
    <h2>This is</h2>
    <p>Usage: <code>made by anas</code></p>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
