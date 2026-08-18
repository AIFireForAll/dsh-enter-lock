# dsh-enter-lock

DeepSeek Harness Web 插件：给聊天输入框增加一个 **Enter 发送锁**。

- 点击输入框旁的锁形按钮，或按 **`Ctrl+Alt+L`**（macOS：**`⌘+Option+L`**），即可锁定/解锁。
- 锁定后**仍然可以正常编辑草稿**，但按 Enter 不会发送消息，避免输入法确认候选词或编辑长文本时误触 Enter。
- 再次点击按钮或再按一次快捷键即可解锁，恢复 Enter 发送。

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
dsh plugin --profile web add github:zy200212/dsh-enter-lock
```

也可以显式使用 Git URL：

```sh
dsh plugin --profile web add https://github.com/zy200212/dsh-enter-lock.git
```

建议锁定到某个 commit 以保证可重复安装：

```sh
dsh plugin --profile web add 'github:zy200212/dsh-enter-lock#<commit-sha>'
```

### 方式二：从本地目录安装

```sh
git clone https://github.com/zy200212/dsh-enter-lock.git
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
   - 其他会触发官方提交路径的 Enter 组合：不发送。
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

## 开发

```sh
npm run build   # 生成 lib/index.js 与 lib/client.js
npm run check   # 结构检查
```

`lib/` 是已提交的构建产物，Git/本地安装不需要运行 `prepare` / `postinstall` 脚本。

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
└── LICENSE
```

## License

[MIT](./LICENSE)
