require('dotenv').config()
const powerThreshold = process.env.POWER_THRESHOLD;
const aliasDevice = process.env.ALIAS_DEVICE;
const userTpLink = process.env.USER_TPLINK;
const passTpLink = process.env.PASS_TPLINK;
const emailSender = process.env.EMAIL_SENDER;
const passEmailSender = process.env.PASS_EMAIL_SENDER;
const emailReceiver = process.env.EMAIL_RECEIVER;
const waitBetweenRead = process.env.WAIT_BETWEEN_READ;
const logFileName = process.env.LOG_FILENAME;

//Init logger
var log4js = require('log4js');
log4js.configure({
    appenders: { monitor: { type: 'file', filename: './' + logFileName + '.log' } },
    categories: { default: { appenders: ['monitor'], level: 'info' } }
  });    
const logger = log4js.getLogger('monitor'); 

//Init nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailSender,
      pass: passEmailSender
    }
  });


async function main() {          
    const { login } = require("tplink-cloud-api");    
        
    try {
      var tplink = await login(userTpLink, passTpLink)
      let deviceList = await tplink.getDeviceList();
    }
    catch (err) {
      console.log(err); 
      return;
    } 
    
    let monitoring = true;
    let running = false;
    while (monitoring) {
        try {
          var device = tplink.getHS110(aliasDevice);
        }  
        catch(err) {
          console.log(aliasDevice + " " + err);
          break;
        }
      
        try {
          var usage = await device.getPowerUsage();
        }
        catch (err) {
          console.log(err);
          break; 
        }        
      
        console.log(usage);
        if (usage.power > powerThreshold) {            
            if (running == false) {
                running = true;
                deviceStarted();                
            }
        }
        else if (running == true) {
            deviceStopped();
            running = false;
        }
        await sleep(waitBetweenRead);        
    }    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms), rejected => {});
}

function deviceStarted() {
    logger.info(aliasDevice + " Started");
    sendEmail(aliasDevice + " Started");
    
}

function deviceStopped() {
    logger.info(aliasDevice + " Stopped");
    sendEmail(aliasDevice + " stopped");
}
  
function sendEmail(message) {
    var mailOptions = {
        from: emailSender,
        to: emailReceiver,
        subject: message,
        text: message
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(message + ' Email sent: ' + info.response);
        }
      });
}

main();