const install = require('../lib/commands/install')
const program = require('../lib/utils/log-commander')
const properties = require('../lib/utils/properties')
const utils = require('../lib/utils/utils')
const log = require('../lib/utils/log')
const telnet = require('../lib/commands/telnet')

program
  .arguments('<roku> <zipPath>')
  .option(
    '-r, --roku <name|id|ip>',
    'Specify a roku. Ignored if passed as argument.'
  )
  .option('-a, --auth <user:pass>', 'Set username and password for roku.')
  .option('-c, --console', 'Launch the Roku Telnet console / debugger after installation')
  .parse(process.argv)

let args = program.args
let roku = args[0] || program.roku || properties.defaults.rok
const zipPath = args[1]

try {
  var auth = program.auth || properties.rokus[roku]['auth']
  if (typeof(auth) === 'string') {
    auth = {
      user: auth.split(':')[0],
      pass: auth.split(':')[1]
    }
  }
} catch (e) {
  log.error('no auth defined for roku: ' + roku)
  process.exit(-1)
}
let options = {
  roku,
  auth,
  name: '',
  zipPath
}

options.map(key => {
  if (!options[key] && key != 'name') {
    log.error('%s options is undefined')
    log.pretty('error', 'options:', options)
    process.exit(-1)
  }
})

if (program['verbose']) {
  log.level = 'verbose'
}
if (program['debug']) {
  log.level = 'debug'
}
upload.upload(options, function(ip, success) {
  if (success && program.console) {
    // launch the console
    telnet.console(ip)
  }
})
