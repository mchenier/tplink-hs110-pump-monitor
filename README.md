# TPLink HS110 Pump Monitor
Monitor a HS110 power so you can get notification on device start and stop.
Usefull for a sump pump but could serve other needs.

Written in Node.js using https://www.npmjs.com/package/tplink-cloud-api

# Usage 

You will need node.js to run this. https://nodejs.org/en/download/

```sh
$ git clone https://github.com/MasterMartbob/tplink-hs110-pump-monitor.git && cd tplink-hs110-pump-monitor
$ npm install
```

Rename example.env to .env
Edit the .env to match your needs every parameter is explained in the file.

Just run this command after to start the app.
```
npm start
```
# Improvement

If you want to contribute or have a good idea please let me know.
You can change how you are alerted in the deviceStarted() and deviceStopped() function.
