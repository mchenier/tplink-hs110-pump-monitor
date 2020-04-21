var CONFIG = require(process.cwd() + '/config.json');

const utils = require("./utils.js");
const logger = utils.logger;
const loggerDebug = utils.loggerDebug;
const tplinkAPI = require('./tplinkAPI.js');

var api;
if(CONFIG.apiSelection == "cloud") {
  api = new tplinkAPI.cloudAPI();    
} 
else {
  api = new tplinkAPI.lanAPI();
}    

var monitoredDevice = {
  started: false,
  lastStartedTime: undefined,
  lastTimeIdleAlert: undefined,
  lastTimeRunningAlert: undefined,
  usage: undefined,
  getPower: function() {
    return ('power' in monitoredDevice.usage ? monitoredDevice.usage.power : monitoredDevice.usage.power_mw/1000);
  },
  init: function() {
    this.started = false;
    this.lastStartedTime = utils.getDate();
    this.lastTimeIdleAlert = utils.getDate();
    this.lastTimeRunningAlert = utils.getDate();
    this.usage = undefined;    
  },
  isDeviceStarted: function() { return this.started; },
  isDeviceStopped: function() { return !this.started; },
  getTimeSinceLastStart: function() { utils.getDate() - monitoredDevice.lastStartedTime; },
  getTimeFromLastRunningAlert: function() { utils.getDate() - monitoredDevice.lastTimeRunningAlert; },
  getTimeFromLastIdleAlert: function() { utils.getDate() - monitoredDevice.lastTimeIdleAlert; },
  startDevice: function() { 
    this.started = true;
    this.lastStartedTime = utils.getDate();
  },
  stopDevice: function() {    
    this.started = false;
    utils.saveGraphData(this); 
  }   
}

async function main() {     
  loggerDebug.info("-----Monitoring started!-----");   
  loggerDebug.info("Acceptable Idle             : " + (CONFIG.idleThreshold/60).toFixed(2) + " minutes");
  loggerDebug.info("Alert for  Idle every       : " + (CONFIG.repeatIdleAlertEvery/60).toFixed(2) + " minutes");
  loggerDebug.info("Acceptable Activity               : " + (CONFIG.deviceRunningTimeThreshold/60).toFixed(2) + " minutes");
  loggerDebug.info("Alert for Excessive activity every: " + (CONFIG.repeatRunningAlertEvery/60).toFixed(2) + " minutes"); 
  monitoredDevice.init();
  
  await api.initDevice();

  while (true) {
    try {              
      monitoredDevice.usage = await api.getUsage();   
      
      monitoring(monitoredDevice.usage);
      
      await utils.sleep(CONFIG.waitBetweenRead);  
    }
    catch (err) {
      loggerDebug.info(err);      
    }      
  } 
}

const monitoring = function(usage) {
  try {
    monitoredDevice.usage = usage;   
    
    loggerDebug.info(JSON.stringify(usage));
    verifyStartStop();
    verifyIdleTime();
    verifyRunningTime();
  }
  catch (err) {
    loggerDebug.info(err);
  } 
}

function verifyStartStop() {
  if (monitoredDevice.getPower() > CONFIG.powerThreshold) {            
    if (monitoredDevice.isDeviceStopped()) {
      monitoredDevice.startDevice();    
      if(CONFIG.enableStartAlert == "on") {
        logger.info(CONFIG.aliasDevice + " Started");
        utils.sendEmail(CONFIG.aliasDevice + " Started", api);
      }      
    }
  }
  else if (monitoredDevice.isDeviceStarted()) {    
    monitoredDevice.stopDevice();
    if(CONFIG.enableStopAlert == "on") {
      logger.info(CONFIG.aliasDevice + " Stopped");
      utils.sendEmail(CONFIG.aliasDevice + " stopped", api);
    }         
  }
}

function verifyIdleTime() {    
  if (CONFIG.enableIdleAlert == "on" &&
    monitoredDevice.getTimeFromLastIdleAlert() >= CONFIG.repeatIdleAlertEvery &&
    monitoredDevice.isDeviceStopped && monitoredDevice.getTimeSinceLastStart() >= CONFIG.idleThreshold) {      
    utils.sendEmail(CONFIG.aliasDevice + " didn't start for the last " + (monitoredDevice.getTimeSinceLastStart())/60 + " minutes", api);    
    monitoredDevice.lastTimeIdleAlert = utils.getDate();
  }
}

function verifyRunningTime() {
  if (CONFIG.enableRunningAlert == "on" && 
    monitoredDevice.getTimeFromLastRunningAlert() >= CONFIG.repeatRunningAlertEvery &&
    monitoredDevice.isDeviceStarted() && monitoredDevice.getTimeSinceLastStart() >= CONFIG.deviceRunningTimeThreshold) {
    utils.sendEmail(CONFIG.aliasDevice + " running for more then " + (monitoredDevice.getTimeSinceLastStart())/60 + " minutes", api);    
    monitoredDevice.lastTimeRunningAlert = utils.getDate();
  }
}

main();
