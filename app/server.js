const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 5000;

const dataPath = path.join(__dirname, 'modules', 'users', 'userlist.json');

const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    fs.readFile(dataPath, 'utf8', (err, jsonData) => {
      if (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
      } else {
        res.statusCode = 200;
        res.end(jsonData);
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
