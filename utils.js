var CONFIG = require(process.cwd() + '/config.json');

//Init logger
var log4js = require('log4js');
log4js.configure({
  appenders: {
    out: { type: 'console' }, 
    info: { type: 'file', filename: './log/' + CONFIG.logFileName + '.log' },
    debug: { type: 'file', filename: './log/' + CONFIG.logFileName + '_debug.log' }
  },
  categories: {
    default: { appenders: ['out','info'], level: 'info' },
    debug: { appenders: ['out','debug'], level: 'info' }
  }
  });    
module.exports.logger = log4js.getLogger('default'); 
module.exports.loggerDebug = log4js.getLogger('debug'); 

//Init nodemailer
const nodemailer = require('nodemailer');
module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.emailSender,
      pass: CONFIG.passEmailSender
    }
  });  

module.exports.sleep = function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000), rejected => {});
}

module.exports.getDate = function getDate() {
    return Date.now()/1000;
}

function readLogFile() {
    var fs = require('fs');

    return new Promise(function(resolve, reject) {
        fs.readFile('./log/' + CONFIG.logFileName + '.log', 'utf8', function(err, data) {
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
    
module.exports.sendEmail = async function sendEmail(message) {
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
  
module.exports.saveGraphData = function saveGraphData(monitoredDevice) {  
    let fs = require('fs');
        
    let start = monitoredDevice.lastStartedTime;    
    let stop = utils.getDate();
    let running = stop-start;
    let startDate = new Date(start*1000);
    let stopDate = new Date(stop*1000);

    fs.appendFile('./log/' + CONFIG.logFileName + '_graph.csv', startDate.toLocaleDateString() + " " + startDate.toLocaleTimeString() + " , " +
    stopDate.toLocaleDateString() + " " + stopDate.toLocaleTimeString() + " , " +
    running + "\n", function (err) {
        if (err) throw err;
    });
}