let proxyTypes = {
  'dc': 'proxies',
}
let proxies = {
  'dc': [],
}
let formattedProxies = {
  'dc': [],
}

for (let type of Object.entries(proxyTypes)) {
  let lines = require('fs').readFileSync(`./settings/${type[1]}`, 'utf-8')
    .split('\n')
    .filter(Boolean)

  for (let line of lines) {
    proxies[type[0]].push(line)

    let split = line.trim().split(':')
    if (split.length > 2) {
      formattedProxies[type[0]].push(`http://${split[2]}:${split[3]}@${split[0]}:${split[1]}`)
    } else {
      formattedProxies[type[0]].push(`http://${split[0]}:${split[1]}`)
    }
  }
}

module.exports = {
  randomProxy: (type) => {
    if (proxies[type]) {
      return proxies[type][Math.floor(Math.random() * proxies[type].length)];
    }
    return undefined
  },
  randomHttpProxy: (type) => {
    if (formattedProxies[type]) {
      return formattedProxies[type][Math.floor(Math.random() * formattedProxies[type].length)];
    }
    return undefined
  }
}