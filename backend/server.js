/*
  @license https://github.com/t2ym/thin-hook/blob/master/LICENSE.md
  Copyright (c) 2018, 2019, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
/* 
  Example nginx configuration for HTTPS server:

  location / {
    proxy_pass http://localhost:8080/;
  }
*/
const package = require('../package.json');
const path = require('path');
const https = require('https');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const cluster = require('cluster');
const { integrityService, proxy, bodyParserRawOptions } = require('./integrityService.js');

const defaultWorkers = 1;
const defaultServerPort = 8080;
const defaultMode = 'debug';
const defaultProtocol = 'http';
const defaultHostName = 'localhost';
const defaultClientHints = 'default';
const defaultClientHintsForHelp = 'UA, UA-Arch, UA-Platform, UA-Full-Version';
const demoCAPath = 'keys/demoCA/';
const whitelistPath = path.join(__dirname, 'whitelist.json');
const blacklistPath = path.join(__dirname, 'blacklist.json');

const ArgumentParser = require('argparse').ArgumentParser;
var argParser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Serve component demo',
});
argParser.addArgument([ '-c', '--cluster' ], { help: 'Number of HTTP server workers. Default: ' + defaultWorkers });
argParser.addArgument([ '-p', '--port' ], { help: 'HTTP server port to listen. Default: ' + defaultServerPort });
argParser.addArgument([ '-m', '--mode' ], { help: 'Server mode "build" or "debug". Default: ' + defaultMode });
argParser.addArgument([ '-P', '--protocol'], { help: 'Server protocol. Default: ' + defaultProtocol });
argParser.addArgument([ '-H', '--host'], { help: 'Server host name. Default: ' + defaultHostName });
argParser.addArgument([ '--clientHints'], { help: 'Accept-CH header for User-Agent Client Hints. Default: ' + defaultClientHintsForHelp });
argParser.addArgument([ '--middleware'], { help: 'middleware to import. Default: null' });
const args = argParser.parseArgs();

const workers = parseInt(args.cluster || defaultWorkers);

if (workers > 1 && cluster.isMaster) {
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
}
else {
  const pid = workers > 1 ? `[PID:${process.pid}] ` : '';
  const serverPort = args.port || defaultServerPort;
  const middleware = args.middleware ? require(args.middleware) : null;
  const mode = args.mode || defaultMode;
  const protocol = args.protocol || defaultProtocol;
  const clientHints = typeof args.clientHints === 'string' ? args.clientHints : defaultClientHints;
  let hostname = args.host || defaultHostName;
  if (!hostname.split(':')[0]) {
    hostname = [defaultHostName, hostname.split(':')[1]].join(':');
  }
  console.log('hostname:', hostname);
  const httpsOptions = protocol === 'https'
    ? {
      key: fs.readFileSync(path.join(demoCAPath, (hostname.split(':')[0] || defaultHostName) + '.key')),
      cert: fs.readFileSync(path.join(demoCAPath, (hostname.split(':')[0] || defaultHostName) + '.crt')),
    }
    : null;

  const demoServerScriptPhysicalPath = __dirname;
  const componentsURLPath = '/node_modules';
  const componentsPhysicalPath = 'root/node_modules';
  const hookComponentsPhysicalPath = 'node_modules';
  const hookComponentPackageName = 'thin-hook';
  const frontendPath = 'frontend';
  const errorReportServiceOriginURL = 'http://localhost:8081/';
  const errorReportServiceURLPathRelative = 'errorReport.json';
  const demoPathRelative = 'root';

  let whitelist;
  let blacklist;
  if (mode !== 'build') {
    whitelist = JSON.parse(fs.readFileSync(whitelistPath));
    blacklist = JSON.parse(fs.readFileSync(blacklistPath));
  }

  const rootPhysicalPath = path.join(demoServerScriptPhysicalPath, '..');
  const errorReportServiceURLPath = path.join('/', errorReportServiceURLPathRelative);//path.join(componentsURLPath, package.name, demoPathRelative, errorReportServiceURLPathRelative);
  const entryPageURLPath = '/';//path.join(componentsURLPath, package.name, demoPathRelative, '/');
  const expressStaticOptions = {
    setHeaders: function (res, path, stat) {
      if (protocol !== 'http') {
        res.setHeader('service-worker-allowed', '/');
      }
      //res.set('link', '</components/thin-hook/demo/cache-bundle.json>; rel=preload, </components/thin-hook/demo/integrity.json>; rel=preload, </components/thin-hook/demo/my-view3.html>; rel=preload');
    }
  };

  let hacked = false;

  app
    .use(bodyParser.raw(bodyParserRawOptions)) // this must come first
    .use(bodyParser.json())
    .all('/*', integrityService({ mode, entryPageURLPath, authority: hostname, whitelist, blacklist, clientHints }))
    .use(errorReportServiceURLPath, proxy({
      target: errorReportServiceOriginURL, 
      changeOrigin: true,
      pathRewrite: {
        [errorReportServiceURLPath] : path.join('/', errorReportServiceURLPathRelative),
      }
    }));

  if (typeof middleware === 'function') {
    middleware(app);
  }

  switch (mode) {
  case 'server':
    app
      .use('/', expressStaticGzip(path.join(rootPhysicalPath, frontendPath), expressStaticOptions))
    break;
  case 'debug':
  case 'build':
  default:
    app
      .use('/', (mode !== 'build' ? expressStaticGzip : express.static)(path.resolve(rootPhysicalPath, demoPathRelative), expressStaticOptions))
      .use(path.join(componentsURLPath, hookComponentPackageName), express.static(path.resolve(rootPhysicalPath, hookComponentsPhysicalPath, hookComponentPackageName), expressStaticOptions))
    break;
  }

  app
    .all('*', (req, res) => {
      const aboutBlankRedirectorHTML = `<script no-hook>location = 'about:blank';</script>`;
      res.setHeader('content-type', 'text/html');
      res.status(404).send(aboutBlankRedirectorHTML);
      //res.redirect(307, aboutBlankURL);
    });
  switch (protocol) {
  case 'https':
    https.createServer(httpsOptions, app)
      .listen(serverPort, (error) => {
        if (error) {
          console.error(error)
          return process.exit(1)
        } else {
          console.log('Listening on port: ' + serverPort + '.')
        }
      });
    break;
  case 'http':
  default:
    app.listen(serverPort);
    break;
  }
}
