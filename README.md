# Flask-Web-Portfolio  
> 实习期间完成的轻量级主题下载站，具备用户注册/登录、后台管理、主题上传与下载功能。

## ✨ 特性
- 前后端分离：Jinja2 + Bootstrap 5  
- 用户系统：注册、登录、个人中心、头像上传  
- 管理后台：主题审核、用户管理、数据统计  
- 主题市场：分类浏览、搜索、点赞、下载计数  
- 安全加固：CSRFToken、Flask-Login 会话保护、SQL 注入预防

## 🧰 技术栈
| 组件 | 版本 | 说明 |
|---|---|---|
| Flask | 3.1.0 | Web 框架 |
| Flask-SQLAlchemy | 3.0 | ORM |
| Flask-Login | 0.6 | 用户会话 |
| Flask-WTF | 1.1 | 表单 & CSRF |
| Bootstrap | 5.3 | UI 框架 |
| SQLite | — | 默认数据库（可替换 MySQL） |

## 🚀 快速开始
```bash
# 1. 克隆
git clone https://github.com/kuaira/flask-web-portfolio.git
cd flask-web-portfolio

# 2. 创建虚拟环境并安装依赖
python -m venv venv
source venv/bin/activate        # Windows 用 venv\Scripts\activate
pip install -r requirements.txt

# 3. 初始化数据库
python app.py db_create        # 已封装创建表+默认管理员

# 4. 运行
flask run
```
