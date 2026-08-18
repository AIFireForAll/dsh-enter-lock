import { readFile } from 'node:fs/promises'

const [host, client] = await Promise.all([
  readFile('lib/index.js', 'utf8'),
  readFile('lib/client.js', 'utf8'),
])

for (const [name, content, required] of [
  ['Host', host, 'export function apply'],
  ['Client', client, "document.addEventListener('keydown', onKeyDown, true)"],
  ['Client', client, 'conversation.input.right'],
  ['Client', client, 'data-composer-card'],
  ['Client', client, 'data-dsh-enter-lock'],
  ['Client', client, 'event.stopImmediatePropagation'],
  ['Client', client, 'event.isComposing || event.keyCode === 229'],
  ['Client', client, 'event.altKey !== true'],
  ['Client', client, "event.code === 'KeyL'"],
]) {
  if (!content.includes(required)) {
    throw new Error(`${name} bundle is missing required fragment: ${required}`)
  }
}

if (client.includes('settingsScope') || client.includes('settings-not-exposed')) {
  throw new Error('Client bundle unexpectedly depends on the Host settings API')
}

console.log('dsh-enter-lock bundle artifacts passed structural checks.')
