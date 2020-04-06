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
$ git clone https://github.com/mchenier/tplink-hs110-pump-monitor.git && cd tplink-hs110-pump-monitor
$ npm install
```

Rename example.config.env to config.json
Edit the config.json to match your needs every parameter is explained in the config section.

Just run this command after to start the app.
```
npm start
```

# Config

+ powerThreshold
    + Power at witch the device is detected to be started (I think the unit is watt).

+ aliasDevice
    + Name of your device in the TPLink app.

+ emailSender
    + Gmail account you will be using to send email.
    I strongly recommend creating a new gmail account for this app since you will have to give permission to that account for unauthorized google app.
    https://hotter.io/docs/email-accounts/secure-app-gmail/

+ passEmailSender
    + Password for the sender email.

+ emailReceiver
    + Email to witch you will received the alerts. I use the same but it could be another one.

+ logFileName
    + Filename of the log. It will be appended with a .log.

+ idleThreshold
    + Number of time in second the pump can be idle before you get an alert.

+ repeatRunningAlertEvery
    + Time in second between each of running alert message in a period of alert threshold exceeded.

+ repeatIdleAlertEvery
    + Time in second between each of idle alert message in a period of alert threshold exceeded.

+ deviceRunningTimeThreshold
    + Alert if the device running for more that threshold in second each time it starts.

+ nbLineLogEmail
    + Number of line of the log to send in the email.


Cloud API related

+ apiSelection
    + Use tplink-cloud-api if set to cloud otherwise use tplink-smarthome-api. Other parameters below only usefull for cloud API.
    cloud and lan should be use

+ userTpLink
    + Username to connect in TPLink app.

+ passTpLink
    + Password to connect in TPLink app.

+ waitBetweenRead
    + Thats the time between each poll to the power of the device in second.

# Alert / Log

Every time the device start or stop there will be an entry in a log file of the name you choose.
There will also an email sent to the email you choose. The entire log will be sent in the email.
There is also an alert if the device didn't start for a period of time.

# Improvement

I made this little project because the need of monitoring my pump is important for me and didn't find anything else that work like I wanted.
If you want to contribute or have a good idea please let me know.
