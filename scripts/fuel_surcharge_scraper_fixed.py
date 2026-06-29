#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DHL 燃油附加费自动爬虫（修复增强版）
修复问题：
1. Windows Unicode编码问题（emoji显示错误）
2. 跨月日期解析逻辑错误
3. Cookie弹窗处理
4. 页面滚动加载更多内容
5. 增强错误处理和日志

使用：python fuel_surcharge_scraper_fixed.py
"""

import asyncio
import json
import re
import sys
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, Any, List
import calendar

# 修复Windows Unicode编码问题
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

try:
    from playwright.async_api import async_playwright
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"错误: 缺少依赖: {e}")
    print("请运行: pip install playwright beautifulsoup4")
    sys.exit(1)


class DHL_FuelSurchargeScraperFixed:
    """DHL燃油费爬虫（修复增强版）"""
    
    def __init__(self):
        self.url = "https://mydhlplus.dhl.com/cn/zh/ship/surcharges.html#/fuel_surcharge"
        self.project_root = Path(__file__).parent.parent
        self.calculator_path = self.project_root / "src" / "data" / "calculator.ts"
        self.screenshot_path = self.project_root / "fuel-surcharge-page.png"
        self.debug_path = self.project_root / "fuel-surcharge-debug-fixed.txt"
        
        # 日志输出使用ASCII字符避免Unicode问题
        self.log_prefix = {
            "info": "[INFO] ",
            "success": "[SUCCESS] ",
            "warning": "[WARNING] ",
            "error": "[ERROR] ",
            "debug": "[DEBUG] "
        }
    
    def safe_print(self, level: str, message: str):
        """安全打印，避免Unicode编码问题"""
        prefix = self.log_prefix.get(level, "[INFO] ")
        print(f"{prefix}{message}")
    
    def parse_date_range_fixed(self, date_str: str) -> tuple[str, str]:
        """修复版日期范围解析，正确处理跨月情况"""
        self.safe_print("debug", f"解析日期范围: {date_str}")
        
        # 去除多余空格
        date_str = date_str.strip()
        
        # 模式0: 跨月格式 数字月 开始日-数字月 结束日, 年份 (如 "6月 29-7月 5, 2026")
        pattern0 = r'(\d+)\s*月\s*(\d+)\s*-\s*(\d+)\s*月\s*(\d+),\s*(\d{4})'
        match0 = re.search(pattern0, date_str)
        
        if match0:
            start_month = int(match0.group(1))
            start_day = int(match0.group(2))
            end_month = int(match0.group(3))
            end_day = int(match0.group(4))
            year = int(match0.group(5))
            
            # 处理跨年情况
            if end_month < start_month:
                end_year = year + 1
            else:
                end_year = year
            
            start_date = datetime(year, start_month, start_day)
            end_date = datetime(end_year, end_month, end_day)
            return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
        
        # 模式1: 数字月 开始日-结束日, 年份 (如 "4月13-19, 2026")
        pattern1 = r'(\d+)\s*月\s*(\d+)\s*-\s*(\d+),\s*(\d{4})'
        match1 = re.search(pattern1, date_str)
        
        if match1:
            month = int(match1.group(1))
            day_start = int(match1.group(2))
            day_end = int(match1.group(3))
            year = int(match1.group(4))
            
            # 检查是否跨月
            if day_end < day_start:
                # 跨月情况：结束日小于开始日，说明是跨到下个月
                # 例如：4月28-3, 2026 表示4月28日到5月3日
                self.safe_print("debug", f"检测到跨月: {date_str}")
                # 计算下个月的月份和年份
                if month == 12:
                    next_month = 1
                    next_year = year + 1
                else:
                    next_month = month + 1
                    next_year = year
                
                # 开始日期
                start_date = datetime(year, month, day_start)
                # 结束日期（下个月）
                end_date = datetime(next_year, next_month, day_end)
            else:
                # 同月情况
                start_date = datetime(year, month, day_start)
                end_date = datetime(year, month, day_end)
            
            return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
        
        # 模式2: 中文月份 开始日-结束日, 年份 (如 "四月13-19, 2026")
        month_map = {
            '一月': 1, '二月': 2, '三月': 3, '四月': 4, '五月': 5, '六月': 6,
            '七月': 7, '八月': 8, '九月': 9, '十月': 10, '十一月': 11, '十二月': 12,
            '1月': 1, '2月': 2, '3月': 3, '4月': 4, '5月': 5, '6月': 6,
            '7月': 7, '8月': 8, '9月': 9, '10月': 10, '11月': 11, '12月': 12
        }
        
        # 匹配中文月份
        pattern2 = r'([一-十二]+月|\d+月)\s*(\d+)\s*-\s*(\d+),\s*(\d{4})'
        match2 = re.search(pattern2, date_str)
        
        if match2:
            month_cn = match2.group(1)
            day_start = int(match2.group(2))
            day_end = int(match2.group(3))
            year = int(match2.group(4))
            
            month = month_map.get(month_cn, 1)
            
            # 检查是否跨月
            if day_end < day_start:
                # 跨月情况
                self.safe_print("debug", f"检测到跨月(中文): {date_str}")
                if month == 12:
                    next_month = 1
                    next_year = year + 1
                else:
                    next_month = month + 1
                    next_year = year
                
                start_date = datetime(year, month, day_start)
                end_date = datetime(next_year, next_month, day_end)
            else:
                # 同月情况
                start_date = datetime(year, month, day_start)
                end_date = datetime(year, month, day_end)
            
            return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')
        
        # 模式3: YYYY-MM-DD 至 YYYY-MM-DD 格式
        pattern3 = r'(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2})'
        match3 = re.search(pattern3, date_str)
        if match3:
            return match3.group(1), match3.group(2)
        
        # 备用方案：如果无法解析，返回默认值
        self.safe_print("warning", f"无法解析日期范围，使用默认值: {date_str}")
        today = datetime.now()
        return today.strftime('%Y-%m-%d'), (today + timedelta(days=7)).strftime('%Y-%m-%d')
    
    async def handle_cookie_popup(self, page):
        """处理Cookie弹窗"""
        try:
            # 等待页面加载
            await page.wait_for_timeout(2000)
            
            # 尝试点击"全部接受"或"接受所有"按钮
            cookie_selectors = [
                'button:has-text("全部接受")',
                'button:has-text("接受所有")',
                'button:has-text("Accept All")',
                'button:has-text("同意")',
                'button[aria-label*="cookie"]',
                'button[class*="cookie"]',
                '.cookie-consent button',
                '#cookie-consent button'
            ]
            
            for selector in cookie_selectors:
                try:
                    cookie_button = await page.wait_for_selector(selector, timeout=3000)
                    if cookie_button:
                        await cookie_button.click()
                        self.safe_print("info", "已处理Cookie弹窗")
                        await page.wait_for_timeout(1000)
                        return True
                except:
                    continue
            
            self.safe_print("debug", "未找到Cookie弹窗或已处理")
            return False
            
        except Exception as e:
            self.safe_print("warning", f"处理Cookie弹窗时出错: {e}")
            return False
    
    async def scroll_page(self, page):
        """滚动页面以加载更多内容"""
        try:
            # 多次滚动确保内容加载
            for i in range(3):
                # 滚动到页面底部
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(1500)
                
                # 滚动回顶部附近
                await page.evaluate("window.scrollTo(0, 200)")
                await page.wait_for_timeout(500)
            
            self.safe_print("debug", "页面滚动完成")
            return True
        except Exception as e:
            self.safe_print("warning", f"页面滚动时出错: {e}")
            return False
    
    async def scrape_with_playwright_fixed(self) -> Optional[Dict[str, Any]]:
        """修复版Playwright爬虫"""
        self.safe_print("info", "启动修复版爬虫...")
        self.safe_print("info", f"访问 {self.url}")
        
        async with async_playwright() as p:
            # 启动浏览器（使用已安装的 chromium-1208）
            chromium_path = r"C:\Users\Administrator\AppData\Local\ms-playwright\chromium-1208\chrome-win64\chrome.exe"
            self.safe_print("info", f"使用浏览器: {chromium_path}")
            browser = await p.chromium.launch(headless=True, executable_path=chromium_path)
            page = await browser.new_page()
            
            try:
                # 设置超时时间
                page.set_default_timeout(45000)
                
                # 访问页面
                self.safe_print("info", "等待页面加载...")
                await page.goto(self.url, wait_until="domcontentloaded")
                
                # 等待页面完全加载
                await page.wait_for_timeout(5000)
                
                # 处理Cookie弹窗
                await self.handle_cookie_popup(page)
                
                # 滚动页面以加载动态内容
                await self.scroll_page(page)
                
                # 等待燃油费表格加载
                try:
                    # 尝试等待表格或相关元素出现
                    await page.wait_for_selector('table, .table, [class*="fuel"], [class*="surcharge"]', timeout=10000)
                except:
                    self.safe_print("warning", "未找到表格元素，继续处理页面内容")
                
                # 获取页面内容
                content = await page.content()
                text = await page.evaluate("() => document.body.innerText")
                
                # 保存截图用于调试
                await page.screenshot(path=str(self.screenshot_path))
                self.safe_print("info", f"截图已保存: {self.screenshot_path}")
                
                await browser.close()
                
                # 解析数据
                return self._parse_enhanced_data_fixed(text, content)
                
            except Exception as e:
                self.safe_print("error", f"爬虫出错: {e}")
                try:
                    await browser.close()
                except:
                    pass
                return None
    
    def _parse_enhanced_data_fixed(self, text: str, html: str) -> Optional[Dict[str, Any]]:
        """修复版数据解析"""
        self.safe_print("info", "解析燃油费数据...")
        
        # 保存调试信息
        try:
            with open(self.debug_path, 'w', encoding='utf-8') as f:
                f.write("=== 页面文本内容 ===\n")
                f.write(text[:5000])  # 限制长度
                f.write("\n\n=== 页面HTML片段 ===\n")
                f.write(html[:2000])
            self.safe_print("info", f"调试信息已保存: {self.debug_path}")
        except Exception as e:
            self.safe_print("warning", f"保存调试信息失败: {e}")
        
        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(html, 'html.parser')
        
        # 查找所有表格
        tables = soup.find_all('table')
        self.safe_print("debug", f"找到 {len(tables)} 个表格")
        
        # 查找燃油费相关文本
        date_ranges = []
        
        # 方法1: 查找表格中的燃油费数据
        for table in tables:
            table_text = table.get_text()
            # 查找包含"燃油"、"附加费"、"fuel"、"surcharge"的表格
            if any(keyword in table_text.lower() for keyword in ['燃油', '附加费', 'fuel', 'surcharge']):
                self.safe_print("debug", "找到燃油费相关表格")
                # 提取表格行
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) >= 2:
                        cell_text = ' '.join([cell.get_text(strip=True) for cell in cells])
                        # 尝试提取日期范围和百分比
                        self._extract_date_range_from_text(cell_text, date_ranges)
        
        # 方法2: 从页面文本中提取
        if not date_ranges:
            self.safe_print("debug", "从页面文本中提取数据")
            # 分割文本行
            lines = text.split('\n')
            for line in lines:
                line = line.strip()
                if line and ('%' in line or '燃油' in line or '附加费' in line):
                    self._extract_date_range_from_text(line, date_ranges)
        
        # 方法3: 使用正则表达式匹配
        if not date_ranges:
            self.safe_print("debug", "使用正则表达式提取数据")
            # 匹配日期范围 + 百分比
            patterns = [
                r'(\d+\s*月\s*\d+\s*-\s*\d+\s*月\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%',  # 跨月: 6月 29-7月 5, 2026
                r'(\d+\s*月\s*\d+\s*-\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%',
                r'([一-十二]+\s*月\s*\d+\s*-\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%',
                r'(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2}).*?(\d+(?:\.\d+)?)\s*%'
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    if len(match) >= 2:
                        date_range = match[0]
                        percentage = match[1] if len(match) > 1 else match[1]
                        date_ranges.append({
                            'date_range': date_range.strip(),
                            'percentage': float(percentage),
                            'rate': float(percentage) / 100
                        })
        
        if not date_ranges:
            self.safe_print("warning", "未能提取多日期范围数据，尝试简单匹配...")
            # 回退到简单匹配
            percent_match = re.search(r'(\d+(?:\.\d+)?)\s*%', text)
            if percent_match:
                rate_str = percent_match.group(1)
                rate = float(rate_str) / 100
                today = datetime.now()
                next_week = today + timedelta(days=7)
                
                return {
                    'rate': rate,
                    'rate_percent': float(rate_str),
                    'validFrom': today.strftime('%Y-%m-%d'),
                    'validTo': next_week.strftime('%Y-%m-%d'),
                    'lastUpdated': datetime.now().isoformat(),
                    'date_range': f"{today.strftime('%Y-%m-%d')} 至 {next_week.strftime('%Y-%m-%d')}",
                    'percentage': float(rate_str)
                }
            
            self.safe_print("error", "完全无法提取燃油费数据")
            return None
        
        self.safe_print("info", f"找到 {len(date_ranges)} 个日期范围")
        for dr in date_ranges:
            self.safe_print("debug", f"  {dr['date_range']} → {dr['percentage']}%")
        
        # 根据当前日期选择正确的范围
        today = datetime.now()
        selected_range = None
        
        for dr in date_ranges:
            try:
                start_str, end_str = self.parse_date_range_fixed(dr['date_range'])
                start_date = datetime.strptime(start_str, '%Y-%m-%d')
                end_date = datetime.strptime(end_str, '%Y-%m-%d')
                
                if start_date <= today <= end_date:
                    selected_range = dr
                    selected_range['validFrom'] = start_str
                    selected_range['validTo'] = end_str
                    self.safe_print("info", f"当前日期匹配: {dr['date_range']}")
                    break
            except Exception as e:
                self.safe_print("warning", f"解析日期范围失败: {dr['date_range']} - {e}")
                continue
        
        if not selected_range:
            self.safe_print("warning", "当前日期不在任何范围内，选择最新范围")
            selected_range = date_ranges[0]
            try:
                start_str, end_str = self.parse_date_range_fixed(selected_range['date_range'])
                selected_range['validFrom'] = start_str
                selected_range['validTo'] = end_str
            except Exception as e:
                self.safe_print("error", f"无法解析最新范围的日期: {e}")
                # 使用默认日期
                today = datetime.now()
                selected_range['validFrom'] = today.strftime('%Y-%m-%d')
                selected_range['validTo'] = (today + timedelta(days=7)).strftime('%Y-%m-%d')
        
        selected_range['lastUpdated'] = datetime.now().isoformat()
        
        return selected_range
    
    def _extract_date_range_from_text(self, text: str, date_ranges: List[Dict]):
        """从文本中提取日期范围和百分比"""
        # 常见的日期范围格式
        patterns = [
            (r'(\d+\s*月\s*\d+\s*-\s*\d+\s*月\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%', '跨月数字'),
            (r'(\d+\s*月\s*\d+\s*-\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%', '数字月'),
            (r'([一-十二]+\s*月\s*\d+\s*-\s*\d+,\s*\d{4}).*?(\d+(?:\.\d+)?)\s*%', '中文月'),
            (r'(\d{4}-\d{2}-\d{2})\s*至\s*(\d{4}-\d{2}-\d{2}).*?(\d+(?:\.\d+)?)\s*%', 'YYYY-MM-DD格式')
        ]
        
        for pattern, pattern_type in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if len(match) >= 2:
                    date_range = match[0]
                    percentage = match[1]
                    
                    # 检查是否已存在相同日期范围
                    if not any(dr['date_range'] == date_range for dr in date_ranges):
                        date_ranges.append({
                            'date_range': date_range.strip(),
                            'percentage': float(percentage),
                            'rate': float(percentage) / 100,
                            'pattern_type': pattern_type
                        })
    
    def update_calculator_file_fixed(self, fuel_data: Dict[str, Any]) -> bool:
        """修复版更新calculator.ts文件"""
        self.safe_print("info", f"更新 {self.calculator_path}")
        
        try:
            if not self.calculator_path.exists():
                self.safe_print("error", f"文件不存在: {self.calculator_path}")
                return False
            
            # 读取原文件
            with open(self.calculator_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 构建新的配置
            new_config = f'''// 默认燃油费率（从DHL官网获取）
// 当前按 {fuel_data.get('date_range', '未知日期')} 费率自动更新
export const DEFAULT_FUEL_SURCHARGE: FuelSurcharge = {{
  rate: {fuel_data.get('rate', 0.46):.4f}, // {fuel_data.get('percentage', 46.0):.2f}% ({fuel_data.get('date_range', '未知')})
  validFrom: '{fuel_data.get('validFrom', '2026-04-13')}',
  validTo: '{fuel_data.get('validTo', '2026-04-19')}',
  lastUpdated: '{fuel_data.get('lastUpdated', datetime.now().isoformat())}'
}}'''
            
            # 替换原有配置
            # 匹配 export const DEFAULT_FUEL_SURCHARGE ... } 或 },（兼容两种结尾格式）
            import re
            # 先尝试精确匹配（包含注释行）
            pattern = r'// 默认燃油费率[\s\S]*?export const DEFAULT_FUEL_SURCHARGE: FuelSurcharge = \{[\s\S]*?\},?'
            
            if re.search(pattern, content):
                new_content = re.sub(pattern, new_config, content, flags=re.DOTALL)
                self.safe_print("debug", "使用正则表达式替换配置（含注释）")
            else:
                # 仅匹配 export const 块
                pattern2 = r'export const DEFAULT_FUEL_SURCHARGE: FuelSurcharge = \{[\s\S]*?\},?'
                if re.search(pattern2, content):
                    new_content = re.sub(pattern2, new_config, content, flags=re.DOTALL)
                    self.safe_print("debug", "使用正则表达式替换配置（仅配置块）")
                else:
                    # 最后兜底：在 import 语句后插入（而非文件开头）
                    self.safe_print("warning", "未找到原配置，在import语句后插入新配置")
                    # 找最后一个 import 行的位置
                    lines = content.split('\n')
                    last_import_idx = 0
                    for i, line in enumerate(lines):
                        if line.strip().startswith('import '):
                            last_import_idx = i
                    # 在最后一个 import 行之后插入
                    lines.insert(last_import_idx + 1, '\n' + new_config + '\n')
                    new_content = '\n'.join(lines)
            
            # 写回文件
            with open(self.calculator_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            self.safe_print("success", f"calculator.ts 已更新")
            self.safe_print("info", f"  新燃油费: {fuel_data.get('percentage', 46.0):.2f}%")
            self.safe_print("info", f"  有效期: {fuel_data.get('validFrom')} ~ {fuel_data.get('validTo')}")
            self.safe_print("info", f"  日期范围: {fuel_data.get('date_range', '未知')}")
            
            return True
            
        except Exception as e:
            self.safe_print("error", f"更新失败: {e}")
            return False
    
    def auto_git_push(self) -> bool:
        """自动 git commit + push 到 GitHub，触发 GitHub Actions 自动部署"""
        import subprocess
        
        self.safe_print("info", "=" * 60)
        self.safe_print("info", "Git Push - 自动推送到 GitHub")
        self.safe_print("info", "=" * 60)
        
        proxy = "http://127.0.0.1:10809"
        repo_dir = str(self.project_root)
        
        # 设置环境变量：代理 + git 身份（防万一）
        env = os.environ.copy()
        env["http_proxy"] = proxy
        env["https_proxy"] = proxy
        
        try:
            # 步骤1: git add（只添加 calculator.ts）
            self.safe_print("info", "git add calculator.ts ...")
            result = subprocess.run(
                ["git", "add", str(self.calculator_path)],
                cwd=repo_dir, capture_output=True, text=True, timeout=30, env=env
            )
            if result.returncode != 0:
                self.safe_print("warning", f"git add 警告: {result.stderr.strip()}")
            
            # 步骤2: git status 检查是否有变更
            self.safe_print("info", "检查是否有变更 ...")
            result = subprocess.run(
                ["git", "status", "--porcelain"],
                cwd=repo_dir, capture_output=True, text=True, timeout=30, env=env
            )
            if not result.stdout.strip():
                self.safe_print("info", "没有变更需要提交，跳过 push")
                return True
            
            # 步骤3: git commit
            commit_msg = f"自动更新燃油附加费 {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            self.safe_print("info", f"git commit: {commit_msg}")
            result = subprocess.run(
                ["git", "commit", "-m", commit_msg],
                cwd=repo_dir, capture_output=True, text=True, timeout=30, env=env
            )
            if result.returncode != 0:
                self.safe_print("error", f"git commit 失败: {result.stderr.strip()}")
                return False
            self.safe_print("success", "git commit 成功")
            
            # 步骤4: git push
            self.safe_print("info", "git push origin main ...")
            result = subprocess.run(
                ["git", "push", "origin", "main"],
                cwd=repo_dir, capture_output=True, text=True, timeout=60, env=env
            )
            if result.returncode != 0:
                self.safe_print("error", f"git push 失败: {result.stderr.strip()}")
                return False
            
            self.safe_print("success", "git push 成功！GitHub Actions 将自动构建部署")
            self.safe_print("info", "部署地址: https://deardoki.github.io/dhl-shipping-calc")
            return True
            
        except subprocess.TimeoutExpired:
            self.safe_print("error", "git 操作超时")
            return False
        except FileNotFoundError:
            self.safe_print("error", "git 命令未找到，请确认 git 已安装并在 PATH 中")
            return False
        except Exception as e:
            self.safe_print("error", f"git push 出错: {e}")
            return False

    async def run_fixed(self) -> bool:
        """执行修复版的完整爬虫流程"""
        self.safe_print("info", "=" * 60)
        self.safe_print("info", "DHL 燃油附加费自动爬虫（修复增强版）")
        self.safe_print("info", "=" * 60)
        self.safe_print("info", f"目标网址: {self.url}")
        self.safe_print("info", f"当前时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            # 1. 使用修复版爬虫
            fuel_data = await self.scrape_with_playwright_fixed()
            
            if not fuel_data:
                self.safe_print("error", "爬虫无法获取数据")
                self.safe_print("info", "\n手动更新步骤:")
                self.safe_print("info", "1. 访问 https://mydhlplus.dhl.com/cn/zh/ship/surcharges.html#/fuel_surcharge")
                self.safe_print("info", "2. 查看当前燃油附加费百分比和日期范围")
                self.safe_print("info", "3. 检查截图和调试文件")
                self.safe_print("info", "4. 告诉我具体数据，我来帮你手动更新")
                return False
            
            # 2. 更新calculator.ts
            success = self.update_calculator_file_fixed(fuel_data)
            
            if not success:
                return False
            
            # 3. 自动 git push 到 GitHub
            self.safe_print("info", "\n--- 推送到 GitHub ---")
            push_success = self.auto_git_push()
            
            if success and push_success:
                self.safe_print("success", "\n全部完成！燃油费已更新并推送到 GitHub")
                self.safe_print("success", "GitHub Actions 将在 1-2 分钟内自动构建部署")
                self.safe_print("info", "=" * 60)
            elif success and not push_success:
                self.safe_print("warning", "\n燃油费已更新到本地文件，但 push 到 GitHub 失败")
                self.safe_print("warning", "请手动执行: cd 项目目录 && git add src/data/calculator.ts && git commit -m 'update fuel' && git push origin main")
            
            return success and push_success
            
        except Exception as e:
            self.safe_print("error", f"执行过程中出错: {e}")
            return False


async def main():
    """主函数"""
    scraper = DHL_FuelSurchargeScraperFixed()
    success = await scraper.run_fixed()
    
    if success:
        print("[SUCCESS] 爬虫执行成功")
        sys.exit(0)
    else:
        print("[ERROR] 爬虫执行失败")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())