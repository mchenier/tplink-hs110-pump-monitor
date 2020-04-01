require('dotenv').config()
const powerThreshold = process.env.POWER_THRESHOLD;
const aliasDevice = process.env.ALIAS_DEVICE;
const emailSender = process.env.EMAIL_SENDER;
const passEmailSender = process.env.PASS_EMAIL_SENDER;
const emailReceiver = process.env.EMAIL_RECEIVER;
const logFileName = process.env.LOG_FILENAME;
const idleThreshold = process.env.IDLE_THRESHOLD;
const repeatAlertEvery = process.env.REPEAT_ALERT_EVERY;
const deviceRunningTimeThreshold = process.env.DEVICE_RUNNING_TIME_THRESHOLD;
const nbLineLogEmail = process.env.NB_LINE_LOG_EMAIL;

//Cloud Api specific params
const apiSelection = process.env.API_SELECTION;
const userTpLink = process.env.USER_TPLINK;
const passTpLink = process.env.PASS_TPLINK;
const waitBetweenRead = process.env.WAIT_BETWEEN_READ;

//Init logger
var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'console' }, 
    info: { type: 'file', filename: './' + logFileName + '.log' },
    debug: { type: 'file', filename: './' + logFileName + '_debug.log' }
  },
  categories: {
    default: { appenders: ['out','info'], level: 'info' },
    debug: { appenders: ['out','debug'], level: 'info' }
  }
  });    
const logger = log4js.getLogger('default'); 
const loggerDebug = log4js.getLogger('debug'); 

//Init nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailSender,
      pass: passEmailSender
    }
  });  

var monitoredDevice = {
  started: false,
  lastStartedTime: undefined,
  lastTimeInactivityAlert: undefined,
  lastTimeRunningAlert: undefined,
  usage: undefined,
  getPower: function() {
    return ('power' in monitoredDevice.usage ? monitoredDevice.usage.power : monitoredDevice.usage.power_mw/1000);
  },
  init: function() {
    this.started = false;
    this.lastStartedTime = getDate();
    this.lastTimeInactivityAlert = getDate();
    this.lastTimeRunningAlert = getDate();
    this.usage = undefined;
  },
  isDeviceStarted: function() { return this.started; },
  isDeviceStopped: function() { return !this.started; },
  startDevice: function() { 
    this.started = true;
    logger.info(aliasDevice + " Started");
    sendEmail(aliasDevice + " Started");
    this.lastStartedTime = getDate();  
  },
  stopDevice: function() {
    this.started = false;
    logger.info(aliasDevice + " Stopped");
    sendEmail(aliasDevice + " stopped");
  }   
}

async function main() {   
  loggerDebug.info("-----Monitoring started!-----");    
  monitoredDevice.init();

  if(apiSelection == "cloud") {
    cloudApi();
  } 
  else {
    lanApi();
  }    
}

function lanApi() {
  const { Client } = require('tplink-smarthome-api');
  const client = new Client();

  client.startDiscovery().on('device-new', (plug) => {
    if (plug.alias == aliasDevice) {
      plug.on('emeter-realtime-update', monitoring);
    }    
  });
}

async function cloudApi() {          
  const { login } = require("tplink-cloud-api");    
      
  try {
    var tplink = await login(userTpLink, passTpLink)
    await tplink.getDeviceList();
  }
  catch (err) {
    loggerDebug.info(err); 
    return;
  } 

  try {
    var device = tplink.getHS110(aliasDevice);
  }  
  catch(err) {
    loggerDebug.info(aliasDevice + " " + err);
    return;
  }
    
  while (true) {
    try {
      monitoredDevice.usage = await device.getPowerUsage();
      
      monitoring(monitoredDevice.usage)
      
      await sleep(waitBetweenRead);  
    }
    catch (err) {
      loggerDebug.info(err);
      break; 
    }      
  }    
}

const monitoring = function(usage) {
  try {
    monitoredDevice.usage = usage;   
    
    loggerDebug.info(JSON.stringify(usage));
    verifyStartStop();
    verifyLastTimeStarted();
    verifyRunningTime();
  }
  catch (err) {
    loggerDebug.info(err);
  } 
}

function verifyLastTimeStarted() {  
  if (getDate() - monitoredDevice.lastTimeInactivityAlert >= repeatAlertEvery &&
   getDate() - monitoredDevice.lastStartedTime >= idleThreshold) {      
    sendEmail(aliasDevice + " didn't start for the last " + (getDate() - monitoredDevice.lastStartedTime)/60 + " minutes");    
    monitoredDevice.lastTimeInactivityAlert = getDate();
  }
}

function verifyStartStop() {
  if (monitoredDevice.getPower() > powerThreshold) {            
    if (monitoredDevice.isDeviceStopped()) {
        monitoredDevice.startDevice();        
    }
  }
  else if (monitoredDevice.isDeviceStarted()) {    
      monitoredDevice.stopDevice();
  }
}

function verifyRunningTime() {
  if (getDate() - monitoredDevice.lastTimeRunningAlert >= repeatAlertEvery &&
    monitoredDevice.isDeviceStarted() && getDate() - monitoredDevice.lastStartedTime >= deviceRunningTimeThreshold) {
    sendEmail(aliasDevice + " running for more then " + (getDate() - monitoredDevice.lastStartedTime)/60 + " minutes");    
    monitoredDevice.lastTimeRunningAlert = getDate();
  }
}

function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s*1000), rejected => {});
}

function getDate() {
  return Date.now()/1000;
}

function readLogFile() {
  var fs = require('fs');

  return new Promise(function(resolve, reject) {
    fs.readFile(logFileName + '.log', 'utf8', function(err, data) {
        if(err) { 
            reject(err);  
        }
        else {              
            resolve(data);
        }
      });
  });
}
  
async function sendEmail(message) {

  let dataLog = await readLogFile()  
  .then(data => {
    return data.toString().split("\n");
  })
  .catch(err => {
    throw(err);
  });  

  dataLog = dataLog.slice(Math.max(dataLog.length - nbLineLogEmail, 0))
  console.log(dataLog);
  dataLog = dataLog.toString().replace(/,/g, "\n");  

  var mailOptions = {
      from: emailSender,
      to: emailReceiver,
      subject: message,
      text: dataLog
    };
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        loggerDebug.info(error);
      } else {
        loggerDebug.info(message + ' Email sent: ' + info.response);
      }
    });
}

main();
