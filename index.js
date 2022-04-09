import Readline from '@serialport/parser-readline'
import SerialPort from 'serialport'

class SerialCommander {
  constructor ({
    port = '/dev/modem',
    baudrate = 115200,
    readDelimiter = '\n',
    writeDelimiter = '\r\n',
    disableLog = false,
    defaultDelay = 100,
    log = string => console.log(`[${new Date().toISOString()}] ${string}`)
  }) {
    this.log = log
    this.isLogEnabled = !disableLog
    this.defaultDelay = defaultDelay
    this.fallbackSerialDataHandler = line => log(`{answer given outside command scope} ${line}`)
    this.serialDataHandler = this.fallbackSerialDataHandler
    this.writeDelimiter = writeDelimiter

    this.port = new SerialPort(port, { baudRate: baudrate })
    this.parser = new Readline({ readDelimiter })
    this.port.pipe(this.parser)
    this.parser.on('data', line => this.serialDataHandler(line))
  }

  async send (command, {
    expectedResponses = ['OK'],
    timeout = 1000,
    delay = this.defaultDelay
  } = {}) {
    await new Promise(resolve => setTimeout(resolve, delay)) // eslint-disable-line

    const startTime = new Date()
    let response = ''

    return new Promise((resolve, reject) => {
      const errorTimeout = setTimeout(() => {
        this.serialDataHandler = this.fallbackSerialDataHandler
        reject(new Error('Request timed out before a satisfactory answer was given'))
      }, timeout)

      const escapedCommand = `${command}${this.writeDelimiter}`
      this.port.write(escapedCommand)
      if (this.isLogEnabled) this.log(`>> ${command}`)

      this.serialDataHandler = line => {
        response += line

        const isCommandSuccessfullyTerminated = expectedResponses.some(
          expectedResponse => line.includes(expectedResponse)
        )
        if (isCommandSuccessfullyTerminated) {
          if (this.isLogEnabled) this.log(`<< ${line}`)

          this.serialDataHandler = this.fallbackSerialDataHandler
          clearTimeout(errorTimeout)

          const endTime = new Date()

          resolve({
            command,
            startTime,
            endTime,
            executionTime: endTime - startTime,
            response
          })
        } else {
          if (this.isLogEnabled) this.log(line)
        }
      }
    })
  }

  close () {
    if (this.port.isOpen) this.port.close()
  }
}

export default SerialCommander
