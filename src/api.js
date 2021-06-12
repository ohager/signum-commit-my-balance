const { composeApi } = require('@signumjs/core')

const ReliableNodeList = [
  'https://europe.signum.network',
  'https://europe1.signum.network',
  'https://europe2.signum.network',
  'https://europe3.signum.network',
  'https://australia.signum.network',
  'https://brazil.signum.network',
  'https://canada.signum.network',
  'https://uk.signum.network:8125'
]

async function createApi (nodeHost = '') {
  const api = composeApi({
    nodeHost: nodeHost || ReliableNodeList[0],
    reliableNodeHosts: ReliableNodeList
  })

  if (!nodeHost) {
    await api.service.selectBestHost(true)
  }

  console.info('Selected Peer:', api.service.settings.nodeHost)
  return Promise.resolve(api)
}

module.exports = {
  createApi
}
