export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
  const app = express();
  const login = '336626';

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
    next();
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/login/', (req, res) => {
    res.send(login);
  });

  app.get('/code/', (req, res) => {
    const filePath = import.meta.url.substring(7);
    createReadStream(filePath).pipe(res);
  });

  app.get('/sha1/:input/', (req, res) => {
    const hash = crypto.createHash('sha1').update(req.params.input).digest('hex');
    res.send(hash);
  });

  app.all('/req/', (req, res) => {
    const addr = req.query.addr || req.body.addr;
    if (!addr) return res.status(400).send('addr required');
    http.get(addr, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => { res.send(data); });
    }).on('error', () => res.status(500).send('request failed'));
  });

  app.all('*', (req, res) => {
    res.send(login);
  });

  return app;
}