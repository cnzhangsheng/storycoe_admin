# StoryCoe Admin

儿童绘本阅读应用管理后台，基于 Vue 3 + Vite + Ant Design Vue 构建。

## 技术栈

- **Vue 3** - 前端框架
- **Vite** - 构建工具
- **Ant Design Vue** - UI 组件库
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Axios** - HTTP 请求
- **ECharts** - 数据可视化

## 功能模块

- 🔐 **登录认证** - JWT Token 认证
- 📊 **仪表盘** - 统计概览卡片
- 👥 **用户管理** - 列表、搜索、封禁、解封、删除、角色修改
- 📚 **绘本管理** - 列表、搜索、状态筛选、分享类型设置、删除、详情页
- 📈 **数据统计** - 每日用户/绘本增长图表
- ⚙️ **系统配置** - 配置列表、编辑配置
- 🏆 **排行榜管理** - 绘本榜、作者榜

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

## 项目结构

```
src/
├── api/                  # API 请求
│   ├── admin/            # 管理端 API
│   │   ├── auth.ts       # 认证
│   │   ├── user.ts       # 用户管理
│   │   ├── book.ts       # 绘本管理
│   │   ├── stats.ts      # 数据统计
│   │   ├── config.ts     # 系统配置
│   │   └── leaderboard.ts # 排行榜
│   └── request.ts        # Axios 配置
├── components/           # 公共组件
│   └── Layout.vue        # 页面布局
├── router/               # 路由配置
├── stores/               # Pinia 状态管理
├── styles/               # 全局样式
├── views/                # 页面组件
│   ├── login/            # 登录页
│   ├── dashboard/        # 仪表盘
│   ├── user/             # 用户管理
│   ├── book/             # 绘本管理
│   ├── stats/            # 数据统计
│   ├── config/           # 系统配置
│   └── leaderboard/      # 排行榜
└── main.ts               # 入口文件
```

## 后端 API

后端服务地址配置在 `.env.development`:

```
VITE_API_BASE_URL=http://47.85.201.118:8000
```

API 接口文档参考后端项目 [storycoe_backend](https://github.com/cnzhangsheng/storycoe_backend)

## 相关项目

- [storycoe_backend](https://github.com/cnzhangsheng/storycoe_backend) - FastAPI 后端
- [storycoe_flutter](https://github.com/cnzhangsheng/storycoe_flutter) - Flutter 移动端
- [storycoe_miniapp](https://github.com/cnzhangsheng/storycoe_miniapp) - 微信小程序

## License

MIT