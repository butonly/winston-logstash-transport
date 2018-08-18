# winston-logstash-transport

## Example

```js
const logger = require('winston-logstash-transport').createLogger(null, {
  application: 'website-ssr-prod',
  logstash: {host: 'logstash-host', port: 12345},
  transports: [
    new winston.transports.Console(),
  ]
})
```

```js
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.json(),
      winston.format.timestamp()
    ),
    transports: [
      new winston.transports.Console(),
      new LogstashTransport({host: 'logstash-host', port: 12345})
    ]
  })
```

## API

* `class LogstashTransport`

  * `options`
  * `options.host`, logstash host
  * `options.port`, logstash UDP port

* `createLogger()`

  * `application`, The name of application
  * `hostname=os.hostname()`, The host where application run on.
  * `level='info'`, log level
  * `transports=[]`, others transports for winston
  * `logstash`, options for LogstashTransport
