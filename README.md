# @westh/serial-commander

Send commands to a serial port, e.g. AT commands to a modem, with predefined success criteria such as response message and delay. It also provides an easy way to log correspondence to the console.

This has been done before, but here's yet another way to do it.

## Installation

```
npm install @westh/serial-commander
```

## Usage

```javascript
const SerialCommander = require('@westh/serial-commander') // or use import ... from ...

const serialCommander = new SerialCommander({
  port: '/dev/ttySOMETHINGCOOL', // defaults to /dev/modem
  baudrate: 9600, // defaults to 115200
  readDelimiter = '\r', // defaults to '/n'
  writeDelimiter = '\n', // defaults to '/r/n'
  disableLog: false, // defaults to false
  defaultDelay: 50, // delay [ms] before the command is issued defaults to 100
  log: string => console.log(`[${new Date().toISOString()}] ${string}`) // default logging function
})

async function main () {
  const options = {
    expectedResponses: ['OK', 'YEAH'], // defaults to ['OK']
    timeout: 500,  // defaults to 1000
    delay: 100 // defaults to defaultDelay set in the constructor
  }
  const response = await serialCommander.send('AT', options)
  console.log(response)
  serialCommander.close()
}

main()
```

Something like this will appear in the terminal if you are connected to a modem:

```
[2021-03-14T12:05:25.555Z] >> AT
[2021-03-14T12:05:25.561Z] AT
[2021-03-14T12:05:25.562Z] << OK
{
  command: 'AT',
  startTime: 2021-03-14T12:05:25.555Z,
  endTime: 2021-03-14T12:05:25.562Z,
  executionTime: 7,
  response: 'AT\r\rOK\r'
}
```

The message starting with `>>` is what your machine has sent to the serial port, everything else is what is received on the connection, and the message starting with `<<` is the line which contains the expected response.

## Testing

Running `yarn test` will first run `yarn build` and then test both the CommonJS and ESM version. You have to specify which port you wish to test before running the test(s), this is done by setting the environment variable `TEST_PORT`, e.g.:

```bash
export TEST_PORT=/dev/ttyUSB0
```

The tests sends `AT` to the `TEST_PORT`, so if that port is a cellular modem of some sorts it should respond `OK`.

## License

MIT

<a href="https://www.buymeacoffee.com/westh" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg" alt="Buy Me A Coffee" style="height: 40px;"></a>
