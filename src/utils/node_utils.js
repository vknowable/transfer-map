function randomColor() {
  // Generate random values closer to the upper limit (255)
  const red = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0');

  return `#${red}${green}${blue}`;
}

// function randomXY() {

// }

export function genNodesEdges(txData, width, height) {
  const uniqueAddresses = new Set()
  const uniqueSrcDest = new Set()

  txData.forEach(tx => {
    // unique addresses = nodes
    uniqueAddresses.add(tx.source)
    uniqueAddresses.add(tx.destination)

    //unique SrcDest = edges
    const srcDest = {
      source: tx.source,
      dest: tx.destination
    }
    uniqueSrcDest.add(JSON.stringify(srcDest))
  })

  const nodes = genNodes(Array.from(uniqueAddresses), width, height)
  const edges = genEdges(nodes, Array.from(uniqueSrcDest).map(str => JSON.parse(str)))
  return { nodes, edges }
}

function genNodes(addresses, width, height) {
  if (!width) width = 100
  if (!height) height = 100
  const nodes = []
  addresses.map((addr, index) => {
    const randX = (Math.random() * width) - width/2
    const randY = (Math.random() * height) - height/2
    nodes.push({
      id: index, label: addr, color: randomColor(), x: randX, y: randY
    })
  })
  return nodes
}

export function genEdges(nodes, mappings) {
  const edges = []
  mappings.map(mapping => {

    edges.push({
      from: nodes.findIndex(node => node.label === mapping.source),
      to: nodes.findIndex(node => node.label === mapping.dest)
    })
  })
  return edges
}