document.addEventListener('DOMContentLoaded', function () {
    // 定义文件名到百度网盘和123网盘链接的映射
    const baiduLinks = {
        'ZTXZQ3.7z': 'https://pan.baidu.com/s/1Uj998bjyOHhhWbKSNl1ImQ?pwd=1234',
        'ZTXZQ3.zip': 'https://pan.baidu.com/s/1Uj998bjyOHhhWbKSNl1ImQ?pwd=1234',
        // 可以继续添加其他文件的映射
    };

    const oneTwoThreeLinks = {
        'ZTXZQ3.7z': 'https://www.123pan.com/s/3E76jv-25uWd.html',
        'ZTXZQ3.zip': 'https://www.123pan.com/s/3E76jv-25uWd.html',
        // 可以继续添加其他文件的映射
    };

    // 获取所有文件项
    const fileItems = document.querySelectorAll('.file-item');

    // 遍历文件项并添加网盘链接
    fileItems.forEach(item => {
        const fileName = item.getAttribute('data-file-name');
        const baiduUrl = baiduLinks[fileName];
        const oneTwoThreeUrl = oneTwoThreeLinks[fileName];

        if (baiduUrl) {
            // 创建百度网盘链接元素
            const baiduLink = document.createElement('a');
            baiduLink.href = baiduUrl;
            baiduLink.className = 'baidu-link';
            baiduLink.textContent = '百度网盘';
            baiduLink.target = '_blank'; // 在新窗口打开

            // 将百度网盘链接添加到文件项中
            item.appendChild(baiduLink);
        }

        if (oneTwoThreeUrl) {
            // 创建123网盘链接元素
            const oneTwoThreeLink = document.createElement('a');
            oneTwoThreeLink.href = oneTwoThreeUrl;
            oneTwoThreeLink.className = 'yes-link';
            oneTwoThreeLink.textContent = '123网盘';
            oneTwoThreeLink.target = '_blank'; // 在新窗口打开

            // 将123网盘链接添加到文件项中
            item.appendChild(oneTwoThreeLink);
        }
    });

    // 搜索框功能
    const searchBox = document.querySelector('.search-box');
    const downloadLinks = document.querySelectorAll('.download-link');

    searchBox.addEventListener('input', function () {
        const searchTerm = searchBox.value.toLowerCase();

        downloadLinks.forEach(link => {
            const fileName = link.textContent.toLowerCase();
            if (fileName.includes(searchTerm)) {
                link.style.display = 'block';
                // 同时显示对应的网盘链接
                const parentItem = link.parentElement;
                const baiduLink = parentItem.querySelector('.baidu-link');
                const oneTwoThreeLink = parentItem.querySelector('.yes-link');
                if (baiduLink) {
                    baiduLink.style.display = 'block';
                }
                if (oneTwoThreeLink) {
                    oneTwoThreeLink.style.display = 'block';
                }
            } else {
                link.style.display = 'none';
                // 同时隐藏对应的网盘链接
                const parentItem = link.parentElement;
                const baiduLink = parentItem.querySelector('.baidu-link');
                const oneTwoThreeLink = parentItem.querySelector('.yes-link');
                if (baiduLink) {
                    baiduLink.style.display = 'none';
                }
                if (oneTwoThreeLink) {
                    oneTwoThreeLink.style.display = 'none';
                }
            }
        });
    });
});