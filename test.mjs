import SerialCommander from './lib/mjs/index.js'

console.log('=== esm test ===')

const serialCommander = new SerialCommander({
  port: process.env.TEST_PORT,
  baudrate: process.env.TEST_BAUDRATE
})

async function main () {
  await serialCommander.send({ command: 'AT' })
  serialCommander.close()
}

main()
