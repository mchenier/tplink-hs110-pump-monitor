var CONFIG = require(process.cwd() + '/config.json');

//Init logger
var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'console' }, 
    info: { type: 'file', filename: './' + CONFIG.logFileName + '.log' },
    debug: { type: 'file', filename: './' + CONFIG.logFileName + '_debug.log' },
    graph: { type: 'file', filename: './' + CONFIG.logFileName + '_graph.log' }
  },
  categories: {
    default: { appenders: ['out','info'], level: 'info' },
    debug: { appenders: ['out','debug'], level: 'info' },
    graph: { appenders: ['graph'], level: 'info' },
  }
  });    
const logger = log4js.getLogger('default'); 
const loggerDebug = log4js.getLogger('debug'); 
const loggerGraph = log4js.getLogger('graph'); 

//Init nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.emailSender,
      pass: CONFIG.passEmailSender
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
    logger.info(CONFIG.aliasDevice + " Started");
    sendEmail(CONFIG.aliasDevice + " Started");
    this.lastStartedTime = getDate();  
  },
  stopDevice: function() {    
    this.started = false;
    logger.info(CONFIG.aliasDevice + " Stopped");
    sendEmail(CONFIG.aliasDevice + " stopped");
    saveGraphData();
  }   
}

async function main() {   
  loggerDebug.info("-----Monitoring started!-----");   
  loggerDebug.info("Acceptable Inactivity             : " + (CONFIG.idleThreshold/60).toFixed(2) + " minutes");
  loggerDebug.info("Alert for  Inactivity every       : " + (CONFIG.repeatIdleAlertEvery/60).toFixed(2) + " minutes");
  loggerDebug.info("Acceptable Activity               : " + (CONFIG.deviceRunningTimeThreshold/60).toFixed(2) + " minutes");
  loggerDebug.info("Alert for Excessive activity every: " + (CONFIG.repeatRunningAlertEvery/60).toFixed(2) + " minutes"); 
  monitoredDevice.init();

  if(CONFIG.apiSelection == "cloud") {
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
    if (plug.alias == CONFIG.aliasDevice) {
      plug.on('emeter-realtime-update', monitoring);
    }    
  });
}

async function cloudApi() {          
  const { login } = require("tplink-cloud-api");    
      
  try {
    var tplink = await login(CONFIG.userTpLink, CONFIG.passTpLink)
    await tplink.getDeviceList();
  }
  catch (err) {
    loggerDebug.info(err); 
    return;
  } 

  try {
    var device = tplink.getHS110(CONFIG.aliasDevice);
  }  
  catch(err) {
    loggerDebug.info(CONFIG.aliasDevice + " " + err);
    return;
  }
    
  while (true) {
    try {
      monitoredDevice.usage = await device.getPowerUsage();
      
      monitoring(monitoredDevice.usage)
      
      await sleep(CONFIG.waitBetweenRead);  
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
  if (getDate() - monitoredDevice.lastTimeInactivityAlert >= CONFIG.repeatIdleAlertEvery &&
   getDate() - monitoredDevice.lastStartedTime >= CONFIG.idleThreshold) {      
    sendEmail(CONFIG.aliasDevice + " didn't start for the last " + (getDate() - monitoredDevice.lastStartedTime)/60 + " minutes");    
    monitoredDevice.lastTimeInactivityAlert = getDate();
  }
}

function verifyStartStop() {
  if (monitoredDevice.getPower() > CONFIG.powerThreshold) {            
    if (monitoredDevice.isDeviceStopped()) {
        monitoredDevice.startDevice();        
    }
  }
  else if (monitoredDevice.isDeviceStarted()) {    
      monitoredDevice.stopDevice();
  }
}

function verifyRunningTime() {
  if (getDate() - monitoredDevice.lastTimeRunningAlert >= CONFIG.repeatRunningAlertEvery &&
    monitoredDevice.isDeviceStarted() && getDate() - monitoredDevice.lastStartedTime >= CONFIG.deviceRunningTimeThreshold) {
    sendEmail(CONFIG.aliasDevice + " running for more then " + (getDate() - monitoredDevice.lastStartedTime)/60 + " minutes");    
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
    fs.readFile(CONFIG.logFileName + '.log', 'utf8', function(err, data) {
        if(err) { 
            reject(err);  
        }
        else {              
            resolve(data);
        }
      });
  });
}

async function logToEmail() {
  let dataLog = await readLogFile()  
  .then(data => {
    return data.toString().split("\n");
  })
  .catch(err => {
    throw(err);
  });  

  dataLog = dataLog.slice(Math.max(dataLog.length - CONFIG.nbLineLogEmail, 0));  
  dataLog = dataLog.reverse();
  dataLog = dataLog.toString().replace(/,/g, "\n");  

  return dataLog;  
}
  
async function sendEmail(message) {

  let bodyMessage = await logToEmail();

  var mailOptions = {
      from: CONFIG.emailSender,
      to: CONFIG.emailReceiver,
      subject: message,
      text: bodyMessage
    };
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        loggerDebug.info(error);
      } else {
        loggerDebug.info(message + ' Email sent: ' + info.response);
      }
    });
}

function saveGraphData() {  
  let fs = require('fs');
    
  let start = monitoredDevice.lastStartedTime;    
  let stop = getDate();
  let running = stop-start;
  let startDate = new Date(start*1000);
  let stopDate = new Date(stop*1000);
  
  fs.appendFile('graph.csv', startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString() + " , " +
  stopDate.toLocaleDateString() + " " + stopDate.toLocaleTimeString() + " , " +
  running + "\n", function (err) {
    if (err) throw err;
  });
}

main();
