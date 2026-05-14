#!/bin/bash
# Git 配置和推送脚本

echo "===== 步骤1: 配置 Git 身份 ====="
git config --global user.email "DearDoki@users.noreply.github.com"
git config --global user.name "DearDoki"
echo "身份配置完成"

echo ""
echo "===== 步骤2: 检查远程仓库 ====="
git remote -v

echo ""
echo "===== 步骤3: 添加所有文件 ====="
git add .
echo "文件添加完成"

echo ""
echo "===== 步骤4: 提交代码 ====="
git commit -m "初始部署"
echo "提交完成"

echo ""
echo "===== 步骤5: 推送到 GitHub ====="
git push -u origin master
echo "推送完成"

echo ""
echo "===== 全部完成！====="
read -p "按回车键关闭..."
