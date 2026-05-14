#!/bin/bash
# 修复远程仓库并推送

echo "===== 步骤1: 检查远程仓库 ====="
git remote -v

echo ""
echo "===== 步骤2: 删除旧的远程仓库（如果有） ====="
git remote remove origin 2>/dev/null
echo "已清理"

echo ""
echo "===== 步骤3: 添加远程仓库 ====="
git remote add origin https://github.com/DearDoki/dhl-shipping-calc.git
git remote -v

echo ""
echo "===== 步骤4: 推送到 GitHub ====="
git push -u origin master

echo ""
echo "===== 完成！====="
read -p "按回车键关闭..."
