const { commit } = require('./commit')
const { version } = require('../package.json')
const { program, Option } = require('commander')
const { execAsync } = require('./execAsync')

function validateUrl (url) {
  if (url) {
    // eslint-disable-next-line no-new
    new URL(url)
  }
  return url
}

function validateAmount (amount) {
  if (amount.endsWith('%')) {
    const i = parseInt(amount, 10)
    if (Number.isNaN(i) || i < 0 || i > 100) {
      throw new Error(`Invalid amount percentage: ${amount}`)
    }
  } else {
    const f = parseFloat(amount)
    if (Number.isNaN(f)) {
      throw new Error(`Invalid amount: ${amount}`)
    }
  }
  return amount
}

const app = program
  .version(version)
  .description(`
            @@@@@@@@  @@@@@@@           
         @@@@@    @@@@@    @@@@@        
           @@@  @@@  @@@ @@@@@          
    @@@      @@@@@     @@@@       @@@   
  @@@@@@@@ &@@@  @@@@@@@@ @@@@  @@@@@@@ 
 @@@    @@@@       @@@      @@@@@    @@@
 @@@  @@@ *@@@@           @@@  @@@  @@@@
   @@@@@     @@@         @@@     @@@@@  
 @@@@  @@@  @@@           @@@@  @@@  @@@
 @@@    @@@@@      @@@       @@@@    @@@
  @@@@@@@  @@@  @@@@@@@@  @@@  @@@@@@@@ 
    @@@       @@@@     @@@@@      @@@   
           @@@@  @@@  @@@  @@@          
         @@@@@    @@@@@    @@@@@        
            @@@@@@@  @@@@@@@@    
 
        Signum Commit My Balance            
    
  Easily commit your balance for Mining Signum
  
  Author: ohager
  Version: ${version}
  `)
  .requiredOption('-s, --secret <yoursecret>', 'Your Signum accounts passphrase')
  .option('-a, --amount <amount>', 'Commit only amount, can be absolute in Signa, or percentage of balance, i.e. 50%', validateAmount, '100%')
  .option('-n, --node <url>', 'Signum Node Host. Default: selects best node of reliable node list', validateUrl, '')
  .option('-x, --exec', 'Executes the command. If not set, the commitment will be only simulated', false)
  .addOption(
    new Option('-f --fee <type>', 'Sets fee type by category')
      .choices(['minimum', 'cheap', 'standard', 'priority'])
      .default('standard')
  )
  .option('-os, --onsuccess <script>', 'Executes a script on successful execution')
  .option('-oe, --onerror <script>', 'Executes a script on failed execution');

(async () => {
  let opts = {}
  try {
    opts = app.parse().opts()
    const { commitmentAmount, address } = await commit(opts)
    console.info('✅ Yay, all fine!')
    if (opts.onsuccess) {
      await execAsync(opts.onsuccess, [address.getReedSolomonAddress(), commitmentAmount.toString()])
    }
  } catch (e) {
    console.error('❌ Damn, something Failed:', e.message)
    if (opts.onerror) {
      await execAsync(opts.onerror, [e])
    }
  }
})()
