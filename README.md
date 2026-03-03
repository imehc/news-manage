# 新闻管理系统

基于 React 的新闻管理后台，支持新闻发布、审核、用户权限管理等功能。

## 技术栈迁移

本项目从 CRA + JavaScript 迁移至 Vite + TypeScript 现代技术栈。

### 构建与语言

| 项目 | 迁移前 | 迁移后 |
|------|--------|--------|
| 构建工具 | Create React App (Webpack) | Vite 7 |
| 语言 | JavaScript | TypeScript 5.9 |
| 代码规范 | ESLint + Prettier | Biome 2.4 |
| 包管理器 | npm | pnpm |

### 核心依赖

| 依赖 | 迁移前 | 迁移后 |
|------|--------|--------|
| React | 17 | 19 |
| React Router | v5 (`react-router-dom`) | v7 (`react-router`) |
| 状态管理 | Redux + react-redux | Zustand 5 |
| UI 框架 | Ant Design 4 | Ant Design 6 |
| 图标库 | `@ant-design/icons` 4 | `@ant-design/icons` 6 |
| 富文本编辑器 | Draft.js (`react-draft-wysiwyg`) | Lexical 0.41 |
| HTTP 请求 | Axios | 原生 Fetch (封装) |
| 日期处理 | Moment.js | date-fns 4 |
| 图表 | ECharts 5 | ECharts 6 |
| 粒子动画 | `react-particles-js` | `@tsparticles/react` 3 |

### 新增依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| `@lexical/html` | 0.41 | Lexical HTML 导入/导出 |
| `@lexical/link` | 0.41 | Lexical 链接支持 |
| `@lexical/list` | 0.41 | Lexical 列表支持 |
| `@lexical/react` | 0.41 | Lexical React 绑定 |
| `@lexical/rich-text` | 0.41 | Lexical 富文本支持 |
| `@lexical/selection` | 0.41 | Lexical 选区操作 |
| `@lexical/utils` | 0.41 | Lexical 工具函数 |
| `concurrently` | 9 | 并行运行开发服务器与 json-server |

### 移除依赖

| 依赖 | 说明 |
|------|------|
| `react-router-dom` | 替换为 `react-router` v7 |
| `redux` / `react-redux` | 替换为 Zustand |
| `draft-js` / `react-draft-wysiwyg` | 替换为 Lexical |
| `axios` | 替换为原生 Fetch 封装 |
| `moment` | 替换为 date-fns |
| `react-particles-js` | 替换为 `@tsparticles/react` |
| `eslint` / `prettier` 相关 | 替换为 Biome |

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (Vite + json-server)
pnpm run dev

# 类型检查
pnpm run typecheck

# 代码检查与格式化
pnpm run check

# 构建
pnpm run build
```

## 项目结构

```
src/
├── components/          # 公共组件 (SideMenu, TopHeader, NewsEditor 等)
├── lib/                 # 工具库 (http 封装, 类型定义)
├── store/               # Zustand 状态管理
├── styles/              # CSS Modules 样式
└── views/               # 页面
    ├── login/           # 登录页
    ├── news/            # 前台新闻页
    └── sandbox/         # 后台管理
        ├── home/        # 首页 (ECharts 图表)
        ├── user-manage/ # 用户管理
        ├── right-manage/# 权限管理 (角色/权限)
        ├── news-manage/ # 新闻管理 (撰写/草稿/分类/预览/更新)
        ├── audit-manage/# 审核管理
        └── publish-manage/ # 发布管理
```
