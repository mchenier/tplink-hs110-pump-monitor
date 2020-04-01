# TPLink HS110 Pump Monitor
Monitor a HS110 power so you can get notification on device start and stop.
There is also an alert if the device is idle for a long period of time.
Usefull for a sump pump but could serve other needs.

Written in Node.js using https://github.com/plasticrake/tplink-smarthome-api and https://www.npmjs.com/package/tplink-cloud-api.
You can select if you prefer using the cloud API or Lan API.

The cloud API has some limitation on the number of calls you can do per day so it may be best to use the LAN if possible.

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
# Alert / Log

Every time the device start or stop there will be an entry in a log file of the name you choose.
There will also an email sent to the email you choose. The entire log will be sent in the email.
There is also an alert if the device didn't start for a period of time.

# Improvement

I made this little project because the need of monitoring my pump is important for me and didn't find anything else that work like I wanted.
If you want to contribute or have a good idea please let me know.
You can change how you are alerted in the deviceStarted() and deviceStopped() function.
