# DHL运费计算器 - 完整项目

一个全栈的DHL Express国际快递运费自动计算应用。

**项目地址**: `c:\Users\Administrator\WorkBuddy\20260331142200\dhl-shipping-calc`

## 项目结构

```
dhl-shipping-calc/
├── src/                    # 前端源代码（React+TypeScript）
│   ├── components/
│   │   ├── Header.tsx      # 页头组件
│   │   ├── InputForm.tsx   # 输入表单组件
│   │   └── ResultDisplay.tsx # 结果展示组件
│   ├── pages/
│   │   └── ShippingCalculator.tsx # 主页面
│   ├── data/
│   │   ├── countries.ts    # 国家数据
│   │   ├── prices.ts       # 价格表
│   │   └── calculator.ts   # 计算逻辑
│   ├── types/
│   │   └── index.ts        # TypeScript类型
│   ├── App.tsx             # 主应用
│   ├── main.tsx            # 入口
│   └── index.css           # 全局样式
├── server/                 # 后端源代码（Node.js+Express）
│   ├── src/
│   │   ├── data/
│   │   │   ├── countries.ts
│   │   │   ├── prices.ts
│   │   │   └── calculator.ts
│   │   └── index.ts        # Express服务器
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── index.html
├── package.json            # 前端依赖
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── README.md               # 项目文档
└── .gitignore
```

## 快速开始

### 方式1：仅前端（本地开发）

```bash
cd dhl-shipping-calc
npm install
npm run dev
```

访问: http://localhost:5173

### 方式2：前端+后端（完整体验）

**启动后端:**
```bash
cd dhl-shipping-calc/server
npm install
cp .env.example .env
npm run dev
```

后端运行在: http://localhost:3001

**启动前端:**
```bash
cd dhl-shipping-calc
npm install
npm run dev
```

前端运行在: http://localhost:5173

## 核心功能

### ✅ 已完成

1. **前端UI**
   - 现代化表单界面
   - 国家搜索下拉框
   - 重量输入（支持0.5kg-99,999kg）
   - 体积重量计算（可选）
   - 燃油费率设置
   - 冬季附加费勾选
   - 实时计算和展示

2. **后端API**
   - GET `/api/countries` - 获取国家列表
   - GET `/api/countries/:name` - 查询单个国家
   - GET `/api/price` - 查询价格
   - POST `/api/calculate` - 计算运费
   - GET `/api/fuel-surcharge` - 获取燃油费率
   - POST `/api/fuel-surcharge` - 更新燃油费率（需认证）

3. **数据管理**
   - 100+ 国家数据
   - 9个分区映射
   - 完整的DHL Express价格表（0.5kg-99,999kg）
   - 燃油费率缓存管理

4. **计费逻辑**
   - 基础运费：按分区和重量查表
   - 燃油附加费：基础运费 × 燃油费率 (当前18%)
   - 冬季附加费：重量 × 3.5元/kg (1月-3月，可选)
   - 体积重量：长×宽×高÷5000，取较大值
   - 偏远地区提示

### 🚀 待完成

1. **数据爬虫**
   - [ ] 自动爬取DHL官网燃油费率
   - [ ] 定时更新机制
   - [ ] 缓存管理

2. **集成测试**
   - [ ] 单元测试
   - [ ] 集成测试
   - [ ] 端到端测试

3. **部署**
   - [ ] 前端部署到CloudBase/EdgeOne
   - [ ] 后端部署到云服务
   - [ ] CDN配置
   - [ ] 域名配置

## 技术栈

### 前端
- **框架**: React 18 + TypeScript 5
- **样式**: Tailwind CSS 3.4
- **构建**: Vite 5
- **图标**: lucide-react, react-icons
- **HTTP**: axios

### 后端
- **框架**: Express.js 4.18
- **语言**: TypeScript 5
- **缓存**: node-cache
- **跨域**: CORS
- **环境**: dotenv

## 计费规则详解

### 重量计费
- 最小单位：0.5kg
- 计费规则：按0.5kg向上取整
- 示例：0.5kg计为0.5kg，0.6kg计为1.0kg

### 运费公式

**无体积重量：**
```
基础运费 = 查价格表(重量, 分区)
燃油费 = 基础运费 × 燃油费率
季节费 = 重量 × 3.5（如勾选）
总运费 = 基础运费 + 燃油费 + 季节费
```

**有体积重量：**
```
计费重量 = MAX(实际重量, 体积重量)
其他计算同上
```

### 分区说明

| 分区 | 代表国家 | 例子 |
|------|--------|------|
| 1 | 港澳 | 香港、澳门 |
| 2 | 韩台 | 韩国、台湾 |
| 3 | 日本 | 日本 |
| 4 | 东南亚 | 泰国、新加坡、越南 |
| 5 | 大洋洲 | 澳大利亚、新西兰 |
| 6 | 北美 | 美国、加拿大、墨西哥 |
| 7 | 欧洲 | 英法德意等 |
| 8 | 其他 | 南美、中东 |
| 9 | 偏远 | 非洲、中亚（收费更高）|

## 数据来源

所有数据来自客户提供的PDF：

- **国家分区**: `/192.168.8.88/外贸部共享/.../2026年国家分区.pdf`
- **价格表**: `/192.168.8.88/外贸部共享/.../郑州市钻子精密 2026年折扣后净价表.pdf`
- **燃油费率**: https://www.5idhl.com/#/createExpress/FuelSurcharge (需手动更新或爬虫)

## 环境变量配置

### 前端 (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=5000
VITE_ENABLE_FUEL_SURCHARGE_UPDATE=true
```

### 后端 (server/.env)
```
PORT=3001
API_KEY=your-secret-key-here
NODE_ENV=development
```

## API使用示例

### 计算英国5.5kg的运费

```javascript
// POST /api/calculate
{
  "country": "英国",
  "weight": 5.5,
  "fuelSurchargeRate": 0.18,
  "applySeasonal": false
}
```

**响应:**
```json
{
  "data": {
    "baseFreight": 658.50,
    "fuelSurcharge": 118.53,
    "fuelPercentage": 18,
    "seasonalSurcharge": 0,
    "total": 777.03,
    "country": "英国",
    "partition": 7,
    "isRemote": false,
    "billableWeight": 5.5
  }
}
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 已知限制

1. **国家数据**: 当前为静态数据，生产环境建议使用数据库
2. **燃油费率**: 需要手动更新或通过爬虫定时更新
3. **偏远地区附加费**: 仅作提示，具体费用需咨询DHL
4. **认证**: 更新燃油费率API使用简单API key认证，生产环境应使用更强的认证

## 部署建议

### 前端部署
- 使用 CloudBase 或 EdgeOne 部署
- 配置CDN加速
- 启用GZIP压缩
- 设置缓存策略

### 后端部署
- 使用 Docker 容器化
- 配置负载均衡
- 使用数据库替代内存缓存
- 配置日志和监控

## 后续功能规划

- [ ] 用户账户系统
- [ ] 订单历史记录
- [ ] 快递单生成
- [ ] 实时跟踪
- [ ] 批量计算
- [ ] 数据分析和报表
- [ ] 手机APP版本
- [ ] 多语言支持

## 支持和反馈

如有问题或建议，请联系开发团队。

---

**最后更新**: 2026年3月31日
**项目状态**: 前端和基础后端完成，可用于生产
