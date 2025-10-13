// 导航栏滚动效果优化
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', (() => {
    const throttleTimeout = 80;
    let timeout = null;
    return () => {
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(() => {
            const scrollY = window.scrollY;
            if (scrollY > 0) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, throttleTimeout);
    };
    
})());

// 监听滚动事件
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) { // 当滚动距离超过100px时
        navbar.classList.add('scrolled'); // 添加scrolled类
    } else {
        navbar.classList.remove('scrolled'); // 移除scrolled类
    }
});

// 获取模态框和关闭按钮
const modal = document.getElementById("modal");
const close = document.querySelector(".close");
const modalMessage = document.getElementById("modal-message");

// 模态框显示逻辑优化
function showMessage(message) {
    modal.style.display = 'block';
    modalMessage.textContent = message;

    // 延迟 1 秒后跳转页面
    setTimeout(() => {
        if (message.includes('登录成功')) {
            window.location.href = "{{ url_for('index') }}";
        } else if (message.includes('已退出登录')) {
            window.location.href = "{{ url_for('login') }}";
        }
    }, 1000);
}

window.onload = function () {
    const messages = document.querySelectorAll('.message');
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        showMessage(lastMessage.textContent);
    }
};

// 关闭模态框
close.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// 编辑主题
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;
        const description = row.cells[2].textContent;

        document.getElementById('theme-id').value = id;
        document.getElementById('edit-theme-name').value = name;
        document.getElementById('edit-theme-description').value = description;
        document.getElementById('edit-theme-form').style.display = 'block';
    });
});

// 删除主题
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const id = row.cells[0].textContent;
        const name = row.cells[1].textContent;

        if (confirm(`确定要删除主题 "${name}" 吗？`)) {
            // 删除逻辑
            console.log(`删除主题 ID: ${id}`);
            // 这里可以添加删除主题的 AJAX 请求
        }
    });
});

// 保存修改
document.getElementById('save-edit-btn').addEventListener('click', function() {
    const id = document.getElementById('theme-id').value;
    const name = document.getElementById('edit-theme-name').value;
    const description = document.getElementById('edit-theme-description').value;

    console.log(`保存修改的主题 ID: ${id}, 名称: ${name}, 描述: ${description}`);
    // 这里可以添加保存修改的 AJAX 请求
    document.getElementById('edit-theme-form').style.display = 'none';
});

