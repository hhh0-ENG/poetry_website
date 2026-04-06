# 古诗词文化网 - 前端项目

## 项目介绍

这是一个基于 Vue 3 的古诗词文化网站前端项目,与 Spring Boot 后端配合使用。

## 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 新一代前端构建工具
- **Vue Router**: Vue 官方路由管理器
- **Pinia**: Vue 官方状态管理库
- **Element Plus**: 基于 Vue 3 的组件库
- **Axios**: HTTP 客户端
- **SCSS**: CSS 预处理器

## 功能特性

### 前台功能
- **首页**: 展示每日一诗、热门诗词、功能导航
- **诗词浏览**: 搜索、分类筛选、分页浏览诗词
- **诗词详情**: 查看诗词全文、译文、赏析,支持收藏
- **诗词社区**: 发布帖子、浏览帖子、点赞
- **每日一诗**: 每日精选诗词推荐
- **AI 助手**: 智能诗词问答
- **诗词测试**: 填空题测试,检验学习成果
- **我的收藏**: 管理收藏的诗词
- **用户认证**: 登录、注册

### 后台功能
- **诗词管理**: 添加、编辑、删除诗词,批量导入
- **帖子管理**: 审核帖子、删除帖子
- **用户管理**: 查看用户列表、禁用/启用用户
- **反馈管理**: 查看用户反馈、回复反馈
- **数据统计**: 查看网站统计数据

## 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 接口定义
│   │   └── index.js       # 统一导出所有API
│   ├── assets/             # 资源文件
│   ├── components/         # 公共组件
│   │   ├── Header.vue     # 顶部导航
│   │   └── Footer.vue     # 底部信息
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── stores/             # Pinia 状态管理
│   │   ├── user.js        # 用户状态
│   │   └── index.js
│   ├── styles/             # 全局样式
│   │   ├── index.scss     # 主样式文件
│   │   └── variables.scss # 样式变量
│   ├── utils/              # 工具函数
│   │   └── request.js     # Axios 封装
│   ├── views/              # 页面组件
│   │   ├── admin/         # 管理后台
│   │   │   ├── Index.vue  # 后台主布局
│   │   │   ├── Poetry.vue # 诗词管理
│   │   │   ├── Post.vue   # 帖子管理
│   │   │   ├── User.vue   # 用户管理
│   │   │   ├── Feedback.vue # 反馈管理
│   │   │   └── Statistics.vue # 数据统计
│   │   ├── Home.vue       # 首页
│   │   ├── PoetryList.vue # 诗词列表
│   │   ├── PoetryDetail.vue # 诗词详情
│   │   ├── Community.vue  # 社区列表
│   │   ├── PostDetail.vue # 帖子详情
│   │   ├── DailyPoetry.vue # 每日一诗
│   │   ├── AIAssistant.vue # AI助手
│   │   ├── Quiz.vue       # 诗词测试
│   │   ├── Favorite.vue   # 我的收藏
│   │   ├── Login.vue      # 登录
│   │   └── Register.vue   # 注册
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── .gitignore             # Git 忽略配置
```

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看项目

### 3. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist` 目录

### 4. 预览生产构建

```bash
npm run preview
```

## 配置说明

### 后端 API 地址

在 `src/utils/request.js` 中配置:

```javascript
const request = axios.create({
  baseURL: '/api', // 开发环境通过 Vite 代理
  timeout: 10000
})
```

在 `vite.config.js` 中配置代理:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 后端服务地址
      changeOrigin: true
    }
  }
}
```

## 主要功能说明

### API 封装

所有 API 接口定义在 `src/api/index.js` 中,按模块分组:

- `userApi`: 用户相关接口
- `poetryApi`: 诗词相关接口
- `categoryApi`: 分类相关接口
- `postApi`: 帖子相关接口
- `favoriteApi`: 收藏相关接口
- `dailyPoetryApi`: 每日一诗接口
- `aiApi`: AI 助手接口
- `feedbackApi`: 反馈接口
- `quizApi`: 测试接口
- `statisticsApi`: 统计接口

### 状态管理

使用 Pinia 进行状态管理,主要存储:

- `userStore`: 用户登录状态、用户信息

### 路由守卫

路由守卫实现以下功能:

1. 自动设置页面标题
2. 检查是否需要登录
3. 检查是否需要管理员权限

### 请求拦截器

- 请求拦截: 自动添加 JWT token
- 响应拦截: 统一错误处理,401 自动跳转登录

## 默认账号

后台管理员账号:
- 用户名: `admin`
- 密码: `admin123`

## 注意事项

1. 确保后端服务已启动并运行在 `http://localhost:8080`
2. 首次运行需要先初始化数据库并导入初始数据
3. AI 助手功能需要配置通义千问 API Key
4. 语音朗读功能需要配置科大讯飞 TTS

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
