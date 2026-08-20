# dsh-enter-lock

中文 | [English](README.en.md)

A **DeepSeek Harness plugin** that adds an **Enter-send lock** to the web chat composer.

DeepSeek Harness Web 插件：给聊天输入框增加一个 **Enter 发送锁**。

- 点击输入框旁的锁形按钮，即可锁定/解锁。
- 锁定后**仍然可以正常编辑输入框中的内容**，但按 Enter 不会发送消息。
- 再次点击按钮即可解锁，恢复 Enter 发送。

## 功能起因

DeepSeek Harness Web 的输入框默认在按下 Enter 时立即发送消息。以下场景很容易误触：

- 使用中文输入法时，按 Enter 只是为了确认候选词，但消息被直接发送；
- 编辑长提示词、代码或结构化文本时，想继续编辑，却误按 Enter；
- 输入框中的内容还没有编辑完，就意外进入了发送流程。

该插件补上了“发送前先解锁”这一层保护。

## 聚焦的功能

- **锁形按钮**：注册在官方 `conversation.input.right` 槽位，显示在输入框右下角、发送按钮附近；锁定状态为醒目的红色填充。
- **按会话隔离**：每个会话独立保存锁状态，切换会话互不影响。
- **不替换官方输入框**：只拦截键盘提交路径，保留官方输入状态机、命令菜单、队列、附件等能力。
- **中文输入法友好**：IME 组合期间的 Enter 永远放行。
- **快捷键**：`Ctrl+Shift+K`（Windows / Linux）/ `Cmd+Shift+K`（macOS）锁定/解锁，焦点需位于输入框卡片内。
- **与 at file（@ 文件候选）兼容**：锁定状态下打开 `@` 文件/Session 候选菜单时，按 Enter 仍可正常确认选中的文件/会话——锁只拦截真正会发送的 Enter，不干扰候选选择。

## 状态样式说明

| 状态 | 锁图标样式 | 含义 |
| --- | --- | --- |
| 解锁（普通状态） | 灰色描边图标 | 当前 Enter 可正常发送消息 |
| 锁定（关锁状态） | **红色填充 + 白色锁图标** | 当前 Enter 无法发送消息 |

鼠标悬浮到锁图标上时，tooltip 会显示当前状态的提示：

- 解锁：`已解锁，当前 Enter 可正常发送消息`
- 锁定：`已锁定，当前 Enter 无法发送消息`

## 可以防止什么行为

锁定状态下，以下键盘发送行为都会被阻止：

- 普通 `Enter` 发送；
- `Ctrl+Enter` / `Cmd+Enter` 发送；
- 其他会触发官方提交路径的 Enter 组合；
- 尚未编辑完成的输入内容被意外提交。

同时保留这些正常行为：

- `Shift+Enter` 仍然插入换行；
- 输入法候选词确认的 Enter 不受影响；
- `@` 文件/Session 候选菜单（at file）、`/` 命令菜单打开时，Enter 确认候选不受影响；
- 输入框内容的编辑、复制、粘贴、附件操作不受影响；
- 鼠标点击官方发送按钮仍然可以发送——锁只防键盘误触。

## 快捷键

- **Windows / Linux**：`Ctrl+Shift+K`
- **macOS**：`Cmd+Shift+K`

仅在**焦点位于聊天输入框卡片内**时生效：处理器需要从当前焦点元素所在的输入框卡片解析会话 id，焦点在聊天区或侧边栏时不会切换。IME 组合期间不触发，长按的自动重复（key repeat）被忽略。

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

3. 锁定 / 解锁方式：

   - 点击输入框右下角的锁形按钮。
   - 快捷键：`Ctrl+Shift+K`（Windows / Linux）或 `Cmd+Shift+K`（macOS），焦点需位于输入框卡片内。

4. 锁定状态下：

   - 普通 `Enter`：不发送。
   - `Ctrl+Enter` / `Cmd+Enter`：不发送。
   - `Shift+Enter`：仍然插入换行。
   - 输入法组合期间的 Enter：正常用于候选词确认，不受影响。
   - `@` 文件/Session 候选菜单（at file）、`/` 命令菜单打开时：Enter 确认候选，不受影响。
   - 点击官方发送按钮：仍可发送，锁只防键盘误触。

5. 锁状态按会话独立保存，刷新页面或重启后自动清除。

## 配置

插件默认零配置，不需要填写 API Key、设置项或 `settings.yaml`。锁状态仅保存在浏览器内存中。

## 功能与限制

- 锁定状态只保存在浏览器内存中，不写 `settings.yaml`，不发起网络请求。
- 插件使用官方 `conversation.input.right` 槽位，不替换官方 composer。
- 锁定只拦截「真正会发送」的 Enter：候选菜单打开且已有高亮项时，Enter 归菜单用于确认候选，不做拦截。
- 不干扰其他输入框、按钮、浏览器快捷键或全局快捷键。

## 疑难排查

### 输入框旁边看不到锁按钮

1. 确认插件已挂载：

   ```sh
   dsh --profile web --dump-config | grep dsh-enter-lock
   ```

2. 重启 `dsh web` 并强制刷新页面（`Ctrl+F5`）。
3. 确认当前使用的是 `web` profile。

### 快捷键不生效

1. 确认焦点在聊天输入框卡片内（先点击输入框）：处理器需要从焦点元素解析会话 id，焦点在聊天区或侧边栏时不会切换。
2. 确认使用的是 `Ctrl+Shift+K`（macOS 为 `Cmd+Shift+K`）：旧版本的 `Ctrl+Alt+L` 组合在 Windows 输入法环境下会被系统消费，已不再使用。
3. IME 组合期间快捷键被有意忽略，先完成候选词确认再试。
4. 确认安装版本为 `0.4.0` 及以上（`0.3.x` 中快捷键被刻意禁用）。

### 锁定后仍然“发送”了

- `Shift+Enter` 是换行，不是发送。
- 鼠标点击官方发送按钮是刻意操作，锁不会阻止。
- 如果输入框中的内容意外发送，请检查锁按钮是否显示为红色填充的锁定状态，以及是否使用了其他 Enter 组合键。

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
│   └── client.js         # Web 半部：按钮与 Enter 拦截
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
