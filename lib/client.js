window.__ModuleLoader__.load({
  id: 'dsh-enter-lock',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    var React = require('react')

    var NS = 'dsh-enter-lock'
    var STYLE_ID = 'dsh-enter-lock-style'

    var zh = {
      lockLabel: '锁定 Enter 发送',
      unlockLabel: '解锁 Enter 发送',
      lockHint: '锁定：按 Enter 不会发送消息（Ctrl+Alt+L 或 ⌘⌥L 切换）',
      unlockHint: '解锁：按 Enter 恢复发送消息（Ctrl+Alt+L 或 ⌘⌥L 切换）',
    }

    var en = {
      lockLabel: 'Lock Enter-send',
      unlockLabel: 'Unlock Enter-send',
      lockHint: 'Locked: Enter will not send the message (Ctrl+Alt+L or ⌘⌥L toggles)',
      unlockHint: 'Unlocked: Enter sends the message again (Ctrl+Alt+L or ⌘⌥L toggles)',
    }

    /**
     * Tiny external store. One controller per plugin activation (HMR-safe),
     * holding per-session lock flags in memory only. Restarting DSH or
     * refreshing the page clears all locks by design: the lock is meant as a
     * temporary guard while editing a draft.
     */
    function createController() {
      var listeners = new Set()
      var snapshot = { sessions: {} }

      function publish(next) {
        snapshot = { sessions: next }
        listeners.forEach(function (listener) { listener() })
      }

      return {
        getSnapshot: function () { return snapshot },
        subscribe: function (listener) {
          listeners.add(listener)
          return function () { listeners.delete(listener) }
        },
        isLocked: function (sessionId) {
          return snapshot.sessions[sessionId] === true
        },
        toggle: function (sessionId) {
          var next = Object.assign({}, snapshot.sessions)
          if (snapshot.sessions[sessionId] === true) delete next[sessionId]
          else next[sessionId] = true
          publish(next)
        },
      }
    }

    /** Minimal React binding over the controller snapshot. */
    function useControllerSnapshot(controller) {
      var state = React.useState(controller.getSnapshot())
      var snapshot = state[0]
      var setSnapshot = state[1]
      React.useEffect(function () {
        return controller.subscribe(function () {
          setSnapshot(controller.getSnapshot())
        })
      }, [controller])
      return snapshot
    }

    function LockIcon(props) {
      var locked = props.locked
      var shackle = locked
        ? 'M5.5 7V5a2.5 2.5 0 0 1 5 0v2'
        : 'M5.5 7V5a2.5 2.5 0 0 1 5 0'
      return React.createElement('svg', {
        viewBox: '0 0 16 16',
        width: 14,
        height: 14,
        'aria-hidden': true,
        fill: 'none',
      },
        React.createElement('path', {
          d: shackle,
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
        }),
        React.createElement('rect', {
          x: 3.5,
          y: 7,
          width: 9,
          height: 6,
          rx: 1.5,
          fill: 'currentColor',
        }))
    }

    /**
     * The lock toggle rendered through the official
     * `conversation.input.right` slot: a small always-visible control in the
     * composer tool row, immediately before the model seat and the primary
     * send button.
     */
    function LockButton(props) {
      var controller = props.controller
      var sessionId = props.sessionId
      var t = props.t
      var snapshot = useControllerSnapshot(controller)
      var locked = sessionId !== undefined && snapshot.sessions[sessionId] === true
      var label = locked ? t('unlockLabel') : t('lockLabel')
      var hint = locked ? t('unlockHint') : t('lockHint')
      return React.createElement('button', {
        type: 'button',
        'data-dsh-enter-lock': '',
        'data-dsh-enter-lock-session': sessionId,
        'aria-pressed': locked,
        'aria-label': label,
        title: hint,
        onMouseDown: function (event) {
          // Keep focus in the composer textarea, matching DSH tool-row buttons.
          event.preventDefault()
        },
        onClick: function () {
          if (sessionId !== undefined) controller.toggle(sessionId)
        },
      }, React.createElement(LockIcon, { locked: locked }))
    }

    function adoptStyles() {
      if (typeof document === 'undefined') return function () {}
      if (document.getElementById(STYLE_ID) !== null) {
        return function () {}
      }
      var style = document.createElement('style')
      style.id = STYLE_ID
      style.setAttribute('data-plugin', NS)
      style.textContent = [
        '[data-dsh-enter-lock]{',
        'box-sizing:border-box;width:28px;height:28px;padding:0;border:0;border-radius:50%;',
        'display:inline-flex;align-items:center;justify-content:center;flex:none;cursor:pointer;',
        'color:var(--dsw-alias-label-secondary);background:transparent;',
        '}',
        '[data-dsh-enter-lock]:hover{',
        'color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover);',
        '}',
        '[data-dsh-enter-lock][aria-pressed="true"]{',
        'color:var(--dsw-alias-state-business-primary);',
        'background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 14%,transparent);',
        'border:1px solid color-mix(in srgb,var(--dsw-alias-state-business-primary) 35%,transparent);',
        '}',
        '[data-dsh-enter-lock]:focus-visible{',
        'outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;',
        '}',
      ].join('')
      document.head.appendChild(style)
      return function () { style.remove() }
    }

    function isComposerTextarea(target) {
      return target instanceof HTMLTextAreaElement
        && target.disabled !== true
        && target.readOnly !== true
        && target === document.activeElement
        && target.closest('[data-composer-card]') !== null
    }

    /**
     * Default shortcut: Ctrl+Alt+L on Windows/Linux, Cmd+Alt+L on macOS.
     *
     * Deliberately NOT Ctrl+L (Chrome and Edge both reserve it for the
     * address bar) and NOT Ctrl+Shift+L (Edge reserves it for Paste and
     * search / Paste and go). Ctrl+Alt+L is absent from both browsers'
     * published shortcut tables.
     */
    function isLockShortcut(event) {
      if (event.repeat) return false
      if (event.key.toLowerCase() !== 'l') return false
      if (event.shiftKey) return false
      if (event.altKey !== true) return false
      return event.ctrlKey === true || event.metaKey === true
    }

    /** Resolve the session id owned by the composer card containing target. */
    function sessionIdFromTarget(target) {
      if (!(target instanceof Element)) return undefined
      var card = target.closest('[data-composer-card]')
      if (card === null) return undefined
      var toggle = card.querySelector('[data-dsh-enter-lock]')
      if (toggle === null) return undefined
      return toggle.getAttribute('data-dsh-enter-lock-session')
    }

    var inject = ['slots', 'locale']

    function apply(ctx) {
      var controller = createController()

      ctx.effect(function () {
        return ctx.locale.register(NS, { zh: zh, en: en })
      }, 'dsh-enter-lock: dictionaries')

      ctx.effect(function () {
        return adoptStyles()
      }, 'dsh-enter-lock: styles')

      ctx.effect(function () {
        function onKeyDown(event) {
          // Global composer-scoped lock shortcut: only acts when the focused
          // element is inside a real composer card that owns a lock button.
          if (isLockShortcut(event)) {
            if (event.isComposing || event.keyCode === 229) return
            var shortcutSessionId = sessionIdFromTarget(event.target)
            if (shortcutSessionId === null || shortcutSessionId === undefined) return
            event.preventDefault()
            event.stopImmediatePropagation()
            controller.toggle(shortcutSessionId)
            return
          }

          if (event.key !== 'Enter') return
          // Shift+Enter is already a native newline in the official composer
          // and never sends, so leave it untouched.
          if (event.shiftKey) return
          // Never fight an IME: candidate confirmation belongs to the input
          // method, not to this guard.
          if (event.isComposing || event.keyCode === 229) return
          if (!isComposerTextarea(event.target)) return
          var sessionId = sessionIdFromTarget(event.target)
          if (sessionId === null || sessionId === undefined || !controller.isLocked(sessionId)) return
          event.preventDefault()
          // stopImmediatePropagation keeps the event from reaching the React
          // root's delegated composer onKeyDown, which would otherwise submit.
          event.stopImmediatePropagation()
        }
        document.addEventListener('keydown', onKeyDown, true)
        return function () {
          document.removeEventListener('keydown', onKeyDown, true)
        }
      }, 'dsh-enter-lock: capture composer keyboard')

      ctx.slots.inject('conversation.input.right', function () {
        return ctx.slots.register({
          name: 'conversation.input.right',
          id: 'dsh-enter-lock',
          order: 20,
          locale: NS,
          inject: function (sessionId) {
            return { controller: controller, sessionId: sessionId }
          },
        }, LockButton)
      })
    }

    module.exports = { name: 'dsh-enter-lock', inject: inject, apply: apply }
    return module.exports
  },
})
