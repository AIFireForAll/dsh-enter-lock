import { cp, mkdir } from 'node:fs/promises'

await mkdir('lib', { recursive: true })
await cp('src/index.js', 'lib/index.js')
await cp('src/client.js', 'lib/client.js')
console.log('Built lib/index.js and lib/client.js')
