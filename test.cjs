const SerialCommander = require('./lib/cjs/index')

console.log('=== commonjs test ===')

const serialCommander = new SerialCommander({
  port: process.env.TEST_PORT,
  baudrate: process.env.TEST_BAUDRATE
})

async function main () {
  await serialCommander.send({ command: 'AT' })
  serialCommander.close()
}

main()
