# DHL运费计算器 - 快速入门指南

欢迎使用DHL运费计算器！本指南将帮助你快速上手本项目。

## 📋 项目概览

这是一个**全栈Web应用**，用于快速计算DHL Express国际快递运费。

**主要特性：**
- ✅ 支持100+国家查询
- ✅ 9个分区的完整价格表
- ✅ 实时燃油附加费计算
- ✅ 可选冬季附加费
- ✅ 体积重量自动计算
- ✅ 偏远地区提示
- ✅ 响应式设计，支持桌面和移动

## 🚀 5分钟快速启动

### 第一步：准备环境

**前置条件：**
- Node.js 16+ 或 npm/pnpm/yarn
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### 第二步：启动前端

```bash
# 进入项目目录
cd c:\Users\Administrator\WorkBuddy\20260331142200\dhl-shipping-calc

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run dev
```

**输出应该显示：**
```
> dhl-shipping-calc@0.1.0 dev
> vite

  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

打开浏览器访问 http://localhost:5173 ✅

### 第三步（可选）：启动后端

如果想使用后端API：

```bash
# 进入后端目录
cd server

# 安装依赖（首次）
npm install

# 复制环境配置
cp .env.example .env

# 启动后端服务
npm run dev
```

**输出应该显示：**
```
[2026-03-31T14:22:00.000Z] DHL Shipping Calculator API Server
Server running on http://localhost:3001
Health check: http://localhost:3001/health
```

## 💡 使用示例

### 示例1：计算美国5kg的运费

1. **国家选择**：搜索并选择 "美国"（分区6）
2. **输入重量**：输入 "5"
3. **查看结果**：系统自动显示：
   - 基础运费：¥587.70
   - 燃油费（18%）：¥105.79
   - 冬季费（可选）：¥17.50
   - **总计**：¥710.99

### 示例2：计算欧洲15kg的运费（含体积重量）

1. **国家选择**：选择 "英国"（分区7）
2. **输入重量**：输入 "15"
3. **计算体积重量**：
   - 点击 "计算体积重量" 展开
   - 输入 长:50cm, 宽:40cm, 高:30cm
   - 系统自动计算体积重量：12kg
   - 因为 12kg < 15kg，采用实际重量15kg
4. **查看结果**：总运费自动更新

## 📖 功能详解

### 国家选择

- 支持中英文搜索
- 显示分区编号
- 标记偏远地区

### 重量输入

- 范围：0.5kg - 99,999kg
- 粒度：0.5kg向上取整
- 支持小数点输入

### 体积重量

- 计算公式：长×宽×高÷5000
- 自动取较大值（实际重量 vs 体积重量）
- 用于计算运费

### 燃油附加费

- 当前费率：18%（2026-01-08至2026-02-16）
- 支持手动调整
- 一键恢复默认值

### 冬季附加费

- 时间段：1月-3月
- 费率：每公斤3.5元
- 可选勾选

### 结果展示

- 分项费用清单
- 费用来源说明
- 一键复制
- 偏远地区警告

## 🏗️ 项目结构详解

### 前端 (React + TypeScript)

```
src/
├── components/         # React组件
│   ├── Header.tsx     # 页头
│   ├── InputForm.tsx  # 输入表单
│   └── ResultDisplay.tsx # 结果展示
├── pages/
│   └── ShippingCalculator.tsx # 主页面
├── data/              # 数据和逻辑
│   ├── countries.ts   # 国家数据（100+国家）
│   ├── prices.ts      # 价格表（完整DHL数据）
│   └── calculator.ts  # 计算逻辑
├── types/
│   └── index.ts       # TypeScript类型
├── App.tsx            # 主应用
├── main.tsx           # 入口
└── index.css          # 全局样式
```

### 后端 (Node.js + Express)

```
server/src/
├── data/
│   ├── countries.ts   # 国家数据（与前端同步）
│   ├── prices.ts      # 价格表
│   └── calculator.ts  # 计算逻辑
└── index.ts           # Express服务器
```

## 🔌 API接口

### 1. 获取国家列表

```bash
curl http://localhost:3001/api/countries
```

### 2. 计算运费

```bash
curl -X POST http://localhost:3001/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "country": "英国",
    "weight": 5.5,
    "fuelSurchargeRate": 0.18,
    "applySeasonal": false
  }'
```

### 3. 获取燃油费率

```bash
curl http://localhost:3001/api/fuel-surcharge
```

更多API详见 `server/README.md`

## 📊 分区对照表

| 分区 | 国家/地区 | 运费水平 |
|------|---------|--------|
| 1 | 香港、澳门 | 低 |
| 2 | 韩国、台湾 | 低 |
| 3 | 日本 | 中 |
| 4 | 东南亚（泰、新、越等） | 中 |
| 5 | 澳大利亚、新西兰 | 高 |
| 6 | 北美（美、加、墨） | 高 |
| 7 | 欧洲（英、法、德等） | 中高 |
| 8 | 其他（南美等） | 高 |
| 9 | 偏远地区（非洲、中亚等） | 特高 |

## 🔧 配置和自定义

### 修改燃油费率

编辑 `src/data/calculator.ts`:
```typescript
export const DEFAULT_FUEL_SURCHARGE: FuelSurchargeData = {
  rate: 0.20,  // 改为20%
  validFrom: '2026-03-15',
  validTo: '2026-05-15',
  lastUpdated: new Date().toISOString(),
}
```

### 修改冬季费率

编辑 `src/data/calculator.ts`:
```typescript
export const SEASONAL_SURCHARGE_CONFIG = {
  ...
  rate: 5.0,  // 改为5元/kg
  ...
}
```

### 添加新国家

编辑 `src/data/countries.ts`:
```typescript
export const COUNTRIES: Country[] = [
  ...
  { name: '新国家', partition: 7, isRemote: false, code: 'XX' },
  ...
]
```

## 🐛 常见问题

### Q1: 如何离线使用？
A: 不需要后端，前端可单独运行。所有数据已预装。

### Q2: 如何更新燃油费率？
A: 
- 前端：手动在UI中修改或编辑源代码
- 后端：调用 POST /api/fuel-surcharge 更新

### Q3: 价格表是最新的吗？
A: 当前数据来自2026年1月的PDF。如需更新，请联系数据团队或编辑源文件。

### Q4: 支持哪些国家？
A: 支持100+国家（见 `src/data/countries.ts`）

### Q5: 如何部署？
A: 参见 `server/README.md` 的部署章节

## 📚 更多资源

- **前端文档**: 查看 `README.md`
- **后端文档**: 查看 `server/README.md`
- **项目总结**: 查看 `PROJECT_SUMMARY.md`
- **计费规则**: 见本文档下方

## 💻 技术栈速查

**前端:**
- React 18, TypeScript 5
- Vite 5, Tailwind CSS 3.4
- lucide-react 图标

**后端:**
- Express.js 4.18
- TypeScript 5
- node-cache 缓存

**支持浏览器:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚢 部署

### 快速部署前端（使用CloudBase）

```bash
npm run build
# 上传 dist/ 目录到CloudBase
```

### 快速部署后端（使用云服务）

```bash
npm run build
# Docker化并推送到容器registry
docker build -t dhl-calc-server .
docker push <registry>/dhl-calc-server
```

## 📝 计费规则速查

```
基础运费 = 查价格表(重量, 分区)
燃油费 = 基础运费 × 0.18
季节费 = 重量 × 3.5（可选，1-3月）
────────────────────────────
总运费 = 基础运费 + 燃油费 + 季节费
```

**重量计费规则：**
- 最小单位：0.5kg
- 计费规则：0.5kg向上取整
- 0.6kg → 1.0kg，1.2kg → 1.5kg

**体积重量：**
- 公式：长×宽×高÷5000
- 计费：取较大值（实际 vs 体积）

## ✅ 检查清单

启动前检查：
- [ ] Node.js 版本 16+
- [ ] npm 可以正常运行
- [ ] 5173端口未被占用（前端）
- [ ] 3001端口未被占用（后端，可选）
- [ ] 浏览器已更新

## 🎓 学习路径

1. **快速试用** (5分钟)
   - 启动前端
   - 计算几个示例

2. **理解工作原理** (15分钟)
   - 阅读本指南的"功能详解"
   - 查看 `src/data/calculator.ts`

3. **深入探索** (30分钟)
   - 阅读React组件代码
   - 理解价格表结构
   - 查看后端API

4. **自定义开发** (1小时+)
   - 修改样式和主题
   - 添加新功能
   - 自己部署

## 📞 获取帮助

- 代码有问题：检查浏览器控制台错误
- API不工作：检查后端是否运行，查看 `server/README.md`
- 样式显示不对：检查Tailwind是否正确编译
- 其他问题：查看 `PROJECT_SUMMARY.md` 的"已知限制"部分

## 🎉 下一步

1. **立即试用**: 按上面"5分钟快速启动"操作
2. **探索功能**: 计算不同国家、重量、费用组合
3. **自定义修改**: 根据需要调整费率和配置
4. **部署上线**: 参考部署指南发布应用
5. **扩展功能**: 根据业务需求添加新特性

---

**祝你使用愉快！** 🚀

**有问题？** 查看项目文档或联系开发团队
