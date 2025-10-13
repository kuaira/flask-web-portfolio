import os
from flask import Flask, render_template, request, redirect, session, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask_login import LoginManager, login_required, current_user,UserMixin,login_user

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)          # 把 login_manager 绑到 app
login_manager.login_view = 'login'   # 未登录时自动跳转到登录页

class User(db.Model, UserMixin):      # 加上 UserMixin
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='user')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# 主页
@app.route('/')
def index():
    return render_template('index.html')

# 登录页面
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username'].strip()
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            # ① 关键：让 Flask-Login 记住登录状态
            login_user(user)
            # ② 跳转到用户中心（或其他你想去的页面）
            return redirect(url_for('user_center'))
        
        flash('Invalid username or password', 'error')
        return redirect(url_for('login'))
    
    return render_template('login.html')

# 注册页面
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists')
            return redirect(url_for('register'))
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please login.')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# 管理员权限装饰器
def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        user = User.query.filter_by(username=session['username']).first()
        if user.role != 'admin':
            flash('You do not have permission to access this page')
            return redirect(url_for('index'))
        return func(*args, **kwargs)
    return wrapper

# 新增管理页面路由
@app.route('/admin', methods=['GET', 'POST'])
@admin_required
def admin():
    users = User.query.all()
    edit_user = None
    edit_id = request.args.get('edit_id')
    
    if edit_id:
        edit_user = User.query.get(edit_id)
    
    if request.method == 'POST':
        action = request.form.get('action')
        
        # 处理添加用户
        if action == 'add':
            username = request.form.get('username')
            password = request.form.get('password')
            
            if User.query.filter_by(username=username).first():
                flash('用户名已存在', 'error')
            else:
                new_user = User(
                    username=username,
                    password=generate_password_hash(password)
                )
                db.session.add(new_user)
                db.session.commit()
                flash('用户添加成功', 'success')
        
        # 处理编辑用户
        elif action == 'edit':
            user_id = request.form.get('user_id')
            user = User.query.get(user_id)
            
            if user:
                new_username = request.form.get('edit_username')
                new_password = request.form.get('edit_password')
                
                if new_username != user.username and User.query.filter_by(username=new_username).first():
                    flash('用户名已存在', 'error')
                else:
                    user.username = new_username
                    if new_password:
                        user.password = generate_password_hash(new_password)
                    db.session.commit()
                    flash('用户信息已更新', 'success')
        
        # 处理删除用户
        elif action == 'delete':
            user_id = request.form.get('user_id')
            user = User.query.get(user_id)
            
            if user:
                db.session.delete(user)
                db.session.commit()
                flash('用户删除成功', 'success')
        
        return redirect(url_for('admin'))
    
    return render_template('admin.html', users=users, edit_user=edit_user)

# # 用户中心页面
# @app.route('/user')
# @login_required
# def user():
#     return render_template('user.html', user_profile=current_user)

# # 会员页面
# @app.route('/membership')
# @login_required
# def membership():
#     return render_template('membership.html')

# # 收藏页面
# @app.route('/collections')
# @login_required
# def collections():
#     return render_template('collections.html')

# # 设置页面
# @app.route('/settings')
# @login_required
# def settings():
#     return render_template('settings.html')

# # 注销登录
# @app.route('/logout')
# def logout():
#     session.pop('username', None)
#     return redirect(url_for('home'))

# # 主题页面
# @app.route('/themes')
# def themes():
#     return render_template('themes.html')
    
# # 产品页面
# @app.route('/product')
# def product():
#     return render_template('product.html')

# 下载页面 
@app.route('/download')
def download():
    # 获取静态文件夹中的 files 子目录
    download_folder = os.path.join(app.static_folder, 'files')
    
    # 初始化文件列表
    files = []
    
    # 检查文件夹是否存在
    if os.path.exists(download_folder):
        print(f"Download folder exists: {download_folder}")
        for file in os.listdir(download_folder):
            file_path = os.path.join(download_folder, file)
            if os.path.isfile(file_path):
                # 生成文件的下载链接
                file_url = url_for('static', filename=f'files/{file}')
                files.append({
                    'name': file,
                    'url': file_url
                })
        print(f"Files found: {files}")
    else:
        print(f"Download folder does not exist: {download_folder}")
    
    # 渲染下载页面模板
    return render_template('download.html', files=files)

# 如果需要支持直接下载文件，可以添加以下路由
@app.route('/static/files/<filename>')
def send_download_file(filename):
    return send_from_directory(os.path.join(app.static_folder, 'files'), filename)





# ---------------- 账户相关 ----------------
@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('已退出登录')
    return redirect(url_for('index'))

# ---------------- 会员/用户中心 ----------------
@app.route('/user')
@login_required          # 未登录会跳到 login_manager.login_view
def user_center():
    return render_template('user.html', user=current_user)

@app.route('/membership')
@login_required
def membership():
    return render_template('membership.html')

@app.route('/collections')
@login_required
def collections():
    return render_template('collections.html')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

# ---------------- 主题/产品 ----------------
@app.route('/themes')
def themes():
    return render_template('themes.html')

@app.route('/product')
def product():
    return render_template('product.html')

# ---------------- 后台管理 ----------------
@app.route('/manage_themes')
@admin_required
def manage_themes():
    # 这里先传空列表，等你把 Theme 模型建好再查
    return render_template('manage_themes.html', themes=[])





# @app.route('/manage_themes')
# def manage_themes():
#     return render_template('manage_themes.html', themes=themes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8080)