# dsh-enter-lock

中文 | [English](README.en.md)

A **DeepSeek Harness plugin** that adds an **Enter-send lock** to the web chat composer.

DeepSeek Harness Web 插件：给聊天输入框增加一个 **Enter 发送锁**。

- 点击输入框旁的锁形按钮，或按 **`Ctrl+Alt+L`**（macOS：**`⌘+Option+L`**），即可锁定/解锁。
- 锁定后**仍然可以正常编辑草稿**，但按 Enter 不会发送消息。
- 再次点击按钮或再按一次快捷键即可解锁，恢复 Enter 发送。

## 功能起因

DeepSeek Harness Web 的输入框默认在按下 Enter 时立即发送消息。以下场景很容易误触：

- 使用中文输入法时，按 Enter 只是为了确认候选词，但消息被直接发送；
- 编辑长提示词、代码或结构化文本时，想继续编辑，却误按 Enter；
- 草稿还没有写完，就意外进入了发送流程。

该插件补上了“发送前先解锁”这一层保护。

## 聚焦的功能

- **锁形按钮**：注册在官方 `conversation.input.right` 槽位，显示在输入框右下角、发送按钮附近。
- **快捷键切换**：焦点位于输入框区域时，按一次锁定，再按一次解锁。
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

## 快捷键

| 平台 | 快捷键 | 作用 |
| --- | --- | --- |
| Windows / Linux | `Ctrl+Alt+L` | 在输入框区域内切换锁定 / 解锁 |
| macOS | `⌘+Option+L` | 在输入框区域内切换锁定 / 解锁 |

按住不放不会连续切换：插件会忽略 `keydown` 的自动重复。

## 环境要求

- DeepSeek Harness `0.1.0-rc.6` 或更新版本；
- `web` profile；
- 基于 Chromium 的现代浏览器（Chrome / Edge 均可）。

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

## 配置

插件默认零配置，不需要填写 API Key、设置项或 `settings.yaml`。锁状态仅保存在浏览器内存中。

## 功能与限制

- 锁定状态只保存在浏览器内存中，不写 `settings.yaml`，不发起网络请求。
- 快捷键只在焦点位于官方 `[data-composer-card]` 区域内时生效。
- 插件使用官方 `conversation.input.right` 槽位，不替换官方 composer。
- 不干扰其他输入框、按钮、浏览器快捷键或全局快捷键。

## 疑难排查

### 输入框旁边看不到锁按钮

1. 确认插件已挂载：

   ```sh
   dsh --profile web --dump-config | grep dsh-enter-lock
   ```

2. 重启 `dsh web` 并强制刷新页面（`Ctrl+F5`）。
3. 确认当前使用的是 `web` profile。

### 按快捷键没有反应

- 请先点击输入框，确保焦点位于输入框区域内。
- 输入法正在组合输入时，快捷键会被忽略，避免干扰候选词。
- 锁状态是按会话保存的：切换到新会话后，新会话默认是解锁状态。

### 锁定后仍然“发送”了

- `Shift+Enter` 是换行，不是发送。
- 鼠标点击官方发送按钮是刻意操作，锁不会阻止。
- 如果草稿意外提交，请检查锁按钮是否显示为锁定状态（高亮），以及是否使用了其他 Enter 组合键。

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
