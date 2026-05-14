# DHL Shipping Calculator - Setup Guide

## 项目初始化

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器访问：`http://localhost:5173`

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
dhl-shipping-calc/
├── src/
│   ├── components/          # React组件
│   │   ├── Header.tsx       # 页头组件
│   │   ├── InputForm.tsx    # 输入表单
│   │   └── ResultDisplay.tsx # 结果展示
│   ├── pages/               # 页面组件
│   │   └── ShippingCalculator.tsx
│   ├── data/                # 数据和逻辑
│   │   ├── countries.ts     # 国家列表和分区
│   │   ├── prices.ts        # 价格表
│   │   └── calculator.ts    # 运费计算逻辑
│   ├── types/               # TypeScript类型定义
│   │   └── index.ts
│   ├── App.tsx              # 主App组件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── package.json
├── vite.config.ts           # Vite配置
├── tsconfig.json            # TypeScript配置
├── tailwind.config.ts       # Tailwind配置
└── postcss.config.js        # PostCSS配置
```

## 功能说明

### 核心功能
- ✅ 国家和分区选择
- ✅ 重量输入和自动计费
- ✅ 体积重量计算
- ✅ 燃油附加费动态计算
- ✅ 冬季附加费可选勾选
- ✅ 偏远地区提示
- ✅ 费用明细展示
- ✅ 结果复制功能

### 计费规则
- **基础运费**：按分区和重量查询价格表
- **燃油附加费**：基础运费 × 燃油费率 (当前18%)
- **冬季附加费**（可选）：重量 × 3.5元/kg (1-3月)
- **体积重量**：长×宽×高÷5000，取较大值计费

## 后续扩展计划

### 第2阶段：后端API
- [ ] Node.js + Express 后端服务
- [ ] 国家查询API
- [ ] 价格查询API
- [ ] 运费计算API
- [ ] 燃油费率定时更新机制

### 第3阶段：数据爬虫
- [ ] DHL官网燃油费率自动爬取
- [ ] 缓存管理
- [ ] 定时更新任务

### 第4阶段：测试和优化
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 浏览器兼容性测试

### 第5阶段：部署
- [ ] 前端部署到CloudBase/EdgeOne
- [ ] 后端部署到云服务
- [ ] CDN配置
- [ ] 域名配置

## 环境变量配置

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 配置API地址和其他参数。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS 3.4
- **构建工具**: Vite 5
- **图标库**: lucide-react, react-icons
- **HTTP客户端**: axios (预留，暂未使用)

## 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 已知限制

- 目前国家和价格数据是静态的，后续将通过API获取
- 燃油费率需要手动更新，或通过后端爬虫自动更新
- 偏远地区附加费仅作提示，具体费用需咨询DHL

## 问题排查

### npm install 失败
- 检查Node.js版本 (建议 v16+)
- 尝试清除npm缓存: `npm cache clean --force`

### 开发服务器无法启动
- 确保5173端口未被占用
- 检查是否有语法错误: `npm run build`

### 样式不显示
- 检查Tailwind CSS是否正确编译
- 查看浏览器控制台的错误信息

## 联系支持

如有问题或建议，请反馈给开发团队。
