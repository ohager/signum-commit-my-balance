# signum-commit-my-balance

<img src="./img/signum_logo.svg" alt="Signum Logo" height="64" />

Commits part or entire balance for mining in Signum

To boost your mining capacity you need to add so called `commitment' to your mining account.
Think of it as kind of stake, signalizing that you not only leech the chain, but also are committed to Signum.

Read also: [Optimizing Mining Income on Signum](https://signum-network.medium.com/optimizing-mining-income-with-poc-b3948172d47d)

This small tool makes adding commitment easy. Together with scheduled jobs of your OS you can automate the process.

# Install

> Prerequisites: Need NodeJS 14+ installed

To install just type:  `npm i signum-commit-my-balance -g`

The tool will be installed as command line tool `signumcmb`

# Usage

`signumcmb --help` to show the help options.

```bash
Usage: signumcmb [options]

Options:
  -V, --version              output the version number
  -s, --secret <yoursecret>  Your Signum accounts passphrase
  -a, --amount <amount>      Commit only amount, can be absolute in Signa, or percentage of balance, i.e. 50% (default: "100%")
  -n, --node <url>           Signum Node Host. Default: selects best node of reliable node list (default: "")
  -x, --exec                 Executes the command. If not set, the commitment will be only simulated (default: false)
  -f --fee <type>            Sets fee type by category (choices: "minimum", "cheap", "standard", "priority", default: "standard")
  -os, --onsuccess <script>  Executes a script on successful execution
  -oe, --onerror <script>    Executes a script on failed execution
  -h, --help                 display help for command

```

## Examples

### Running a test run

The following script runs a test (no commit at all) on committing _all_ balance 

```bash
$ signumcmb -s "<your very secret passphrase>"

Output: 

Selected Peer: https://brazil.signum.network
Address: S-K37B-9V85-FB95-793HN - (id: 6502115112683865257)
Available Balance: Ꞩ 1465170.08802094
Locked Balance: Ꞩ 41005
Current Commitment: Ꞩ 1005
Total Balance: Ꞩ 1506175.08802094
Fee: Ꞩ 0.0147
New Commitment: Ꞩ 1466175.07332094
Available Balance After Commitment: Ꞩ 0
🧪 Test Run: Commitment not applied (Run with -x to apply)
✅ Yay, all fine!
```

### Running a balance commitment for real (Using `-x`)

The following script actually commits _50%_ of the accounts available balance as commitment

```bash
$ signumcmb -s "<your very secret passphrase>" -x -a "50%"

Output:

Selected Peer: https://brazil.signum.network
Address: S-K37B-9V85-FB95-793HN - (id: 6502115112683865257)
Available Balance: Ꞩ 1465170.08802094
Locked Balance: Ꞩ 41005
Current Commitment: Ꞩ 1005
Total Balance: Ꞩ 1506175.08802094
Fee: Ꞩ 0.0147
New Commitment: Ꞩ 733590.03666047
Available Balance After Commitment: Ꞩ 732585.03666047
Committing...
✅ Successfully committed
✅ Yay, all fine!
```

### Adding additional run scripts (in case of success or failure)

`signumcmb` supports exit points for success or failures.
This way you can add further processing, like sending emails, or other notifications (telegram, discord etc) in case of success or failure

Use the `-os` or `--onsuccess` option for successful commitments
Use the `-oe` or `--onerror` option for failures

```bash
$ signumcmb -s "<your very secret passphrase>" -a "50%" -os ./onsuccess.sh -oe ./onerror.sh 
```

#### Script examples


__./onerror.sh__
```bash
#!/bin/bash
ERR="$1"
echo "Failed: ${ERR}"
```

__./onsuccess.sh__
```bash
#!/bin/bash
ACCOUNT="$1"
COMMITTED="$2"
echo "Committed ${COMMITTED} for ${ACCOUNT}"
```
