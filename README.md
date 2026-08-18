# dsh-enter-lock

DeepSeek Harness Web 插件：给聊天输入框增加一个 **Enter 发送锁**。

- 点击输入框旁的锁形按钮，或按 **`Ctrl+Alt+L`**（macOS：**`⌘+Option+L`**），即可锁定/解锁。
- 锁定后**仍然可以正常编辑草稿**，但按 Enter 不会发送消息。
- 再次点击按钮或再按一次快捷键即可解锁，恢复 Enter 发送。

## 功能起因

DeepSeek Harness Web 的输入框默认在按下 Enter 时立即发送消息。以下场景很容易误触：

- 使用中文输入法时，按 Enter 只是为了确认候选词，但消息被直接发送；
- 编辑长提示词、代码或结构化文本时，想换行或继续编辑，却误按 Enter；
- 草稿还没有写完，就意外进入了发送流程，打断当前思路。

该插件补上了“发送前先解锁”这一层保护。

## 聚焦的功能

- **锁形按钮**：注册在官方 `conversation.input.right` 槽位，显示在输入框右下角、发送按钮附近。
- **快捷键切换**：输入框区域聚焦时按 `Ctrl+Alt+L`（macOS 为 `⌘+Option+L`）锁定或解锁。
- **按会话隔离**：每个会话独立保存锁状态，切换会话互不影响。
- **不替换官方输入框**：只拦截键盘提交路径，保留官方草稿状态机、命令菜单、队列、附件等能力。
- **中文输入法友好**：IME 组合期间的 Enter 永远放行。

## 可以防止什么行为

锁定状态下，以下键盘发送行为都会被阻止：

- 普通 `Enter` 发送；
- `Ctrl+Enter` / `Cmd+Enter` 发送；
- 其他会触发官方提交路径的 Enter 组合；
- 未编辑完的草稿被意外提交。

同时保留这些正常行为：

- `Shift+Enter` 仍然插入换行；
- 输入法候选词确认的 Enter 不受影响；
- 草稿编辑、复制、粘贴、附件操作不受影响；
- 鼠标点击官方发送按钮仍然可以发送——锁只防键盘误触。

## 如何获得 AI 的回答

1. 在输入框正常编辑草稿。
2. 如需防误触，按 `Ctrl+Alt+L` 或点击锁按钮锁定。
3. 确认草稿已经完整后，再次按 `Ctrl+Alt+L` 或点击锁按钮解锁。
4. 按 Enter，或点击官方发送按钮发送消息。
5. Agent 收到消息后开始回答；锁定期间被阻止的草稿会原样保留在输入框中。

## 为什么使用 Ctrl+Alt+L

| 快捷键 | Chrome | Edge | 结论 |
| --- | --- | --- | --- |
| `Ctrl+L` | 聚焦地址栏 | 聚焦地址栏 | 浏览器占用，网页无法可靠拦截，不采用 |
| `Ctrl+Shift+L` | 无默认占用 | “粘贴并搜索 / 粘贴并转到” | Edge 占用，不采用 |
| **`Ctrl+Alt+L`** | 官方表中未占用 | 官方表中未占用 | **采用**；macOS 对应 `⌘+Option+L` |

参考资料：

- [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179)
- [Keyboard shortcuts in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/keyboard-shortcuts-in-microsoft-edge-50d3edab-30d9-c7e4-21ce-37fe2713cfad)

## 安装

### 方式一：从本仓库 GitHub 安装

```sh
dsh plugin --profile web add github:AIFireForAll/dsh-enter-lock
```

也可以显式使用 Git URL：

```sh
dsh plugin --profile web add https://github.com/AIFireForAll/dsh-enter-lock.git
```

建议锁定到某个 commit 以保证可重复安装：

```sh
dsh plugin --profile web add 'github:AIFireForAll/dsh-enter-lock#<commit-sha>'
```

### 方式二：从本地目录安装

```sh
git clone https://github.com/AIFireForAll/dsh-enter-lock.git
dsh plugin --profile web add ./dsh-enter-lock
```

### 验证安装

```sh
dsh --profile web --dump-config | grep dsh-enter-lock
```

应能看到类似输出：

```yaml
# == dsh-enter-lock
- id: dsh-enter-lock
  name: dsh-enter-lock
```

安装完成后重启 `dsh web` 并刷新页面。

## 使用方法

1. 启动 DeepSeek Harness Web：

   ```sh
   dsh web
   ```

2. 在聊天输入框右下角、模型选择器和发送按钮附近找到锁形按钮。

3. 锁定 / 解锁有两种方式：

   - **鼠标**：点击锁形按钮。
   - **键盘**：焦点在输入框区域时，按 `Ctrl+Alt+L`（macOS 为 `⌘+Option+L`）。

4. 锁定状态下：

   - 普通 `Enter`：不发送。
   - `Ctrl+Enter` / `Cmd+Enter`：不发送。
   - `Shift+Enter`：仍然插入换行。
   - 输入法组合期间的 Enter：正常用于候选词确认，不受影响。
   - 点击官方发送按钮：仍可发送，锁只防键盘误触。

5. 锁状态按会话独立保存，刷新页面或重启后自动清除。

## 功能与限制

- 锁定状态只保存在浏览器内存中，不写 `settings.yaml`，不发起网络请求。
- 快捷键只在焦点位于官方 `[data-composer-card]` 区域内时生效。
- 插件使用官方 `conversation.input.right` 槽位，不替换官方 composer。
- 不干扰其他输入框、按钮、浏览器快捷键或全局快捷键。

## 卸载

```sh
dsh plugin --profile web remove dsh-enter-lock
```

## 开发与构建

安装本仓库不需要构建：`lib/` 已提交预构建产物，且没有 `prepare` / `postinstall` 脚本。

如需修改源码后重新生成构建产物：

```sh
npm run build   # 生成 lib/index.js 与 lib/client.js
npm run check   # 结构检查
```

## 目录结构

```text
dsh-enter-lock/
├── package.json          # dsh.bundle + dsh.client 插件声明
├── cordis.patch.yml      # profile bundle patch
├── src/
│   ├── index.js          # Host 半部（无依赖 no-op）
│   └── client.js         # Web 半部：按钮、快捷键、Enter 拦截
├── lib/                  # 构建产物
├── scripts/
│   ├── build.mjs
│   └── check.mjs
├── README.md
├── README.en.md
└── LICENSE
```

## License

[MIT](./LICENSE)
