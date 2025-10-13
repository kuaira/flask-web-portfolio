// 要操作的画布
const cvs=document.querySelector('canvas');
// 画布上下文
const ctx=cvs.getContext('2d');

// 初始化画布宽高
function init(){
    cvs.width=window.innerWidth * devicePixelRatio;
    cvs.height=window.innerHeight * devicePixelRatio;
}
init();

// 根据DPR计算字体的大小（devicePixelRatio 设备像素比）
const fontSize=20 * devicePixelRatio;
// 设置字体、字体大小（和CSS设置字体一样）
ctx.font=`${fontSize}px "Consolas"`;
// 计算总列数（fontSize相当于每列的宽度）
const columnCount=Math.floor(cvs.width / fontSize);
// 根据列数创建数组并填充为0
const charIndex=new Array(columnCount).fill(100);


// 绘制代码雨
function draw(){
    // 加个渐隐效果
    ctx.fillStyle='rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    // 设置字体颜色
    ctx.fillStyle='#6be445';
    // 设置文本基线为顶部
    ctx.textBaseline='top';
    for(let i=0;i<columnCount;i++){
        // 获取随机字符
        const text=getRandomChar();
        // 计算文字的x、y坐标
        const x=i*fontSize;
        const y=charIndex[i]*fontSize;
        // 绘制文本
        ctx.fillText(text,x,y);
        // 超出画布归零
        // 这里需要再加个判断，使之错开归零的时间点（Math.random()>0.99）
        if(y>cvs.height && Math.random()>0.99){
            charIndex[i]=0;
        }else{
            charIndex[i]++;
        }
    }
}
// 开始绘制
draw();
// 每个50毫秒绘制一次
setInterval(draw,50);

// 获取随机字符
function getRandomChar(){
    const str='0123456789abcdefghijklmnopqrstuvwxyz@#$%^&*';
    return str[Math.floor(Math.random() * str.length)];
}