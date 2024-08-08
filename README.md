# Eternal Game

**简介**:
Eternal Game 是一个结合大模型技术的智能游戏开发平台。通过与大语言模型进行互动聊天，该引擎能够无限生成独特的游戏关卡，使游戏开发变得更加快速、有趣和富有创意。

KKPLAY 是一个基于 Kaboom.js 的 JavaScript 库，致力于让游戏开发变得快速且有趣。我们对 Kaboom.js 进行了扩展和优化，添加了更多现代化功能，使游戏开发更加便捷和智能。特别是，在 Kaboom.js 暂停维护的背景下，我们通过 KKPLAY 继续保持其简洁易用的传统，同时引入了 AIGC 技术，使游戏内容更加丰富和创意无限。

![intro](README.assets/intro.png)

## 安装和使用

1. 访问 `dify` 文件夹下的 `yml` 文件。这个是 Dify 的 DSL。可以导入 Dify 平台。导入之后拿到 API 密钥。

2. 克隆项目仓库

```bash
git clone https://github.com/kirklin/eternal-game.git
cd eternal-game
```

3. 拷贝项目的 `.env.example` 为 `.env`，并将 API 密钥填入 `VITE_DIFY_API_KEY`。

4. 安装依赖

```bash
pnpm install
```

5. 启动开发服务器

```bash
pnpm dev
```

6. 打开浏览器并访问 `http://localhost:8888` 以查看项目运行情况。

7. 生成关卡并在游戏中使用

通过与 AI 互动，生成新的关卡并在游戏中加载，享受无限创意的游戏体验。

### 在中国环境下的设置指南

如果你在中国设置这个项目，你可能会遇到从默认的 npm 注册表下载包的问题。按照以下步骤使用更快的镜像并设置所需的工具：

#### 1. 安装 nrm（Node Registry Manager）

nrm 是 npm 的注册表管理器，允许你在不同的 npm 注册表之间轻松切换。

```bash
npm install -g nrm
```

#### 2. 切换到淘宝注册表

淘宝注册表是中国用户使用的 npm 注册表的快速镜像。

```bash
nrm use taobao
```

#### 3. 安装 pnpm

pnpm 是这个项目中使用的包管理器。全局安装它：

```bash
npm install -g pnpm
```

#### 4. 验证安装

确保 pnpm 已正确安装：

```bash
pnpm --version
```

#### 5. 继续项目设置

现在你已经安装了必要的工具，你可以继续上面"安装"部分中概述的项目安装步骤。
