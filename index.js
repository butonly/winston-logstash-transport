
const dgram = require('dgram')
const os = require('os')

const winston = require('winston')

/* eslint-disable no-empty-function */
function noop() {}
/* eslint-enable no-empty-function */

class LogstashTransport extends winston.Transport {
  constructor(options) {
    options = options || {}

    super(options)

    this.name = 'LogstashTransport'

    this.host = options.host
    this.port = options.port
    this.trailingLineFeed = options.trailingLineFeed === true
    this.trailingLineFeedChar = options.trailingLineFeedChar || os.EOL
    this.silent = options.silent

    this.client = null

    this.connect()
  }

  connect() {
    this.client = dgram.createSocket('udp4')
    this.client.unref()
  }

  log(info, callback) {
    if (this.silent) {
      return callback(null, true)
    }

    this.send(info[Symbol.for('message')], (err) => {
      this.emit('logged', !err)
      callback(err, !err)
    })
  }

  send(message, callback) {
    if (this.trailingLineFeed === true) {
      message = message.replace(/\s+$/, '') + this.trailingLineFeedChar
    }

    const buf = Buffer.from(message)
    this.client.send(buf, 0, buf.length, this.port, this.host, (callback || noop))
  }
}

function createLogger(logType, config) {
  const appendMetaInfo = winston.format((info) => {
    return Object.assign(info, {
      application: logType || config.application,
      hostname: config.hostname || os.hostname(),
      pid: process.pid,
      time: new Date(),
    })
  })
  
  return winston.createLogger({
    level: config.level || 'info',
    format: winston.format.combine(
      appendMetaInfo(),
      winston.format.json(),
      winston.format.timestamp()
    ),
    transports: [
      new LogstashTransport(config.logstash)
    ].concat(config.transports || [])
  })
}

exports.LogstashTransport = LogstashTransport
exports.createLogger = createLogger
