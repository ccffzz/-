/**
 * 心理空间：网络与"我" - 交互脚本
 */

// ============================================
// 角色数据
// ============================================
const characters = [
  { id: 1,  name: '观星者小黄', text: '网络是我探索世界的窗口，也是安放自我的方寸天地。' },
  { id: 2,  name: '改造者小肖', text: '网络之于我，它给了一个接触世界契机，让我汲取了许多知识，改造自我。' },
  { id: 3,  name: '求知者小李', text: '网络之于我，它给了一场跨越山海的相遇，让我学到多样本领，不断突破自我。' },
  { id: 4,  name: '探索者小韩', text: '网络之于我，它给了一片无边无际的天地，让我见识万千世界，一步步拓宽眼界与格局。' },
  { id: 5,  name: '学习者小张', text: '网络之于我，它为我开辟了一个新世界，让我可以自由的探索未知，在无尽的世界中自由的学习。' },
  { id: 6,  name: '娱乐者小于', text: '网络之于我，它给了我超越现实、虚拟的快乐，让我可以暂时逃出现实生活，获得纯粹的愉悦。' },
  { id: 7,  name: '观世界小庞', text: '网络之于我，让我看见世界，也让世界看见我。' },
  { id: 8,  name: '自由创作者小刘', text: '网络之于我，网络让我与世界时刻相连，也时刻提醒我别忽略身边触手可及的温暖与人间烟火。' },
  { id: 11, name: '修行者小于', text: '网络之于我，它是万千思想的渡口，它让我在哲学思辨与追求真理中，不断探求世界的本质。' },
  { id: 12, name: '勇敢者小王', text: '网络之于我，它给了一个连接世界的通道，在交流与学习中不断完善自我、遇见更好的自己。' },
  { id: 13, name: '观光客小袁', text: '网络之于我，是看世界的窗，也是连接彼此的桥。' },
  { id: 14, name: '懒惰者小王', text: 'AI制图是网络给我的光，它让我看见自己的创造力，也让我越来越自信。' },
  { id: 15, name: '开拓者小邹', text: '网络之于我，它增长了我的见识，看到各种各样的活法，让我自信地活成自己的样子。' },
  { id: 16, name: '觅知者小汤', text: '我在网络里获取新知，也在屏幕另一端遇见同频的人。' },
  { id: 17, name: '观察者小徐', text: '网络之于我，它给了一扇眺望远方的窗口，让我知晓世间万象，拓宽人生眼界。' },
];

// ============================================
// DOM 元素引用
// ============================================
const overlay = document.getElementById('popup-overlay');
const popupContainer = document.getElementById('popup-container');
const popupTitle = document.getElementById('popup-title');
const popupText = document.getElementById('popup-text');
const popupClose = document.getElementById('popup-close');
const characterElements = document.querySelectorAll('.pixel-character, .seated-character');

// 已交互角色集合（用于巨幕闭幕触发）
const interactedSet = new Set();

// ============================================
// 弹窗定位算法
// ============================================
function positionPopup(characterEl) {
  const rect = characterEl.getBoundingClientRect();
  const popupWidth = Math.min(580, window.innerWidth * 0.88);
  const popupHeight = popupContainer.offsetHeight || 200;

  // 角色中心点
  const charCenterX = rect.left + rect.width / 2;
  const charCenterY = rect.top + rect.height / 2;

  // 默认显示在角色右侧
  let left = charCenterX + 50;
  let top = charCenterY - 60;

  // 边界检测：右侧空间不足则显示在左侧
  if (left + popupWidth > window.innerWidth - 20) {
    left = charCenterX - popupWidth - 50;
  }

  // 上方空间不足则显示在下方
  if (top < 20) {
    top = charCenterY + 50;
  }

  // 限制不超出视口
  top = Math.max(20, Math.min(top, window.innerHeight - popupHeight - 20));
  left = Math.max(20, Math.min(left, window.innerWidth - popupWidth - 20));

  popupContainer.style.left = left + 'px';
  popupContainer.style.top = top + 'px';
}

// ============================================
// 显示弹窗
// ============================================
function showPopup(characterId) {
  const char = characters.find(c => c.id === characterId);
  if (!char) return;

  // 记录已交互角色
  interactedSet.add(characterId);
  console.log('[Curtain] 交互角色:', characterId, '当前总数:', interactedSet.size);

  // 更新弹窗内容
  popupTitle.textContent = char.name;
  popupText.textContent = char.text;

  // 移除关闭动画类
  popupContainer.classList.remove('closing');

  // 显示遮罩层
  overlay.classList.add('active');

  // 定位弹窗到角色附近
  const charEl = document.querySelector(`[data-id="${characterId}"]`);
  if (charEl) {
    positionPopup(charEl);
  }

  // 重新触发出现动画
  popupContainer.style.animation = 'none';
  popupContainer.offsetHeight; // 强制回流
  popupContainer.style.animation = '';
}

// ============================================
// 关闭弹窗（带颤动动画）
// ============================================
function closePopup() {
  popupContainer.classList.add('closing');

  setTimeout(() => {
    overlay.classList.remove('active');
    popupContainer.classList.remove('closing');

    // 检查是否全部15个角色都已交互
    if (interactedSet.size >= 15) {
      triggerCurtainClose();
    }
  }, 350);
}

// ============================================
// 事件绑定
// ============================================

// 角色点击事件
characterElements.forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(el.dataset.id);
    showPopup(id);
  });
});

// 关闭按钮
popupClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closePopup();
});

// 点击遮罩层关闭
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    closePopup();
  }
});

// ESC 键关闭
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) {
    closePopup();
  }
  // 调试：按 C 键直接触发帷幕动画
  if (e.key === 'c' || e.key === 'C') {
    if (!overlay.classList.contains('active')) {
      // 模拟所有角色已交互
      characters.forEach(c => interactedSet.add(c.id));
      console.log('[Curtain] 调试模式：模拟全部交互，总数:', interactedSet.size);
      triggerCurtainClose();
    }
  }
});

// ============================================
// 鼠标移开关闭弹窗
// ============================================
let mouseLeaveTimer = null;
const MOUSE_LEAVE_DISTANCE = 150; // 鼠标离开弹窗和角色的距离阈值

document.addEventListener('mousemove', (e) => {
  if (!overlay.classList.contains('active')) return;

  const popupRect = popupContainer.getBoundingClientRect();
  const popupCenterX = popupRect.left + popupRect.width / 2;
  const popupCenterY = popupRect.top + popupRect.height / 2;

  // 计算鼠标到弹窗中心的距离
  const dx = e.clientX - popupCenterX;
  const dy = e.clientY - popupCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 如果鼠标距离弹窗中心超过阈值，启动关闭计时
  if (distance > MOUSE_LEAVE_DISTANCE + Math.max(popupRect.width, popupRect.height) / 2) {
    if (!mouseLeaveTimer) {
      mouseLeaveTimer = setTimeout(() => {
        closePopup();
        mouseLeaveTimer = null;
      }, 600); // 600ms延迟，避免误触
    }
  } else {
    // 鼠标回到弹窗附近，取消关闭计时
    if (mouseLeaveTimer) {
      clearTimeout(mouseLeaveTimer);
      mouseLeaveTimer = null;
    }
  }
});

// ============================================
// 横屏提示黑幕 - 点击后消失并触发BGM
// ============================================
(function() {
  var hint = document.getElementById('rotate-hint');
  if (!hint) return;

  var dismissed = false;

  function dismissHint() {
    if (dismissed) return;
    dismissed = true;
    hint.classList.add('fade-out');
    setTimeout(function() {
      hint.classList.add('hidden');
    }, 500);
  }

  // 点击黑幕立即消失 + 触发BGM
  hint.addEventListener('click', function() {
    dismissHint();
    // 触发BGM播放
    var bgm = document.getElementById('bgm');
    if (bgm && bgm.paused) {
      bgm.play().catch(function() {});
    }
  });

  hint.addEventListener('touchstart', function() {
    dismissHint();
    var bgm = document.getElementById('bgm');
    if (bgm && bgm.paused) {
      bgm.play().catch(function() {});
    }
  }, { passive: true });

  // 1.5秒后也自动消失（兜底）
  setTimeout(function() {
    dismissHint();
  }, 1500);
})();

// ============================================
// 巨幕闭幕动画 - 全部交互完成后触发
// 时序：短帘落下(0.6s) → 主帷幕合拢(3s) → 停留(1s) → 主帷幕消失 → 短帘消失
// ============================================
var curtainTriggered = false;
function triggerCurtainClose() {
  if (curtainTriggered) return;
  curtainTriggered = true;

  console.log('[Curtain] 触发闭幕动画，已交互角色数:', interactedSet.size);

  var curtainLeft = document.getElementById('curtain-left');
  var curtainRight = document.getElementById('curtain-right');
  var curtainTop = document.getElementById('curtain-top');
  var curtainOverlay = document.getElementById('curtain-overlay');
  if (!curtainLeft || !curtainRight || !curtainOverlay) {
    console.log('[Curtain] 错误：找不到帷幕DOM元素');
    return;
  }

  // 阻止交互穿透
  curtainOverlay.style.pointerEvents = 'all';

  // 第1步：短帘先落下（0.6s过渡）
  if (curtainTop) {
    curtainTop.style.transform = 'translateY(0)';
    curtainTop.style.opacity = '1';
    console.log('[Curtain] 短帘落下');
  }

  // 第2步：短帘落完后，主帷幕开始合拢（3s）
  setTimeout(function() {
    requestAnimationFrame(function() {
      curtainLeft.style.transform = 'translateX(0)';
      curtainRight.style.transform = 'translateX(0)';
      console.log('[Curtain] 主帷幕合拢');
    });
  }, 700); // 短帘0.6s + 0.1s缓冲

  // 第3步：合拢后停留1秒，然后主帷幕先消失
  setTimeout(function() {
    console.log('[Curtain] 主帷幕消失');
    curtainLeft.style.transition = 'opacity 0.3s';
    curtainRight.style.transition = 'opacity 0.3s';
    curtainLeft.style.opacity = '0';
    curtainRight.style.opacity = '0';
  }, 4100); // 0.7s等待 + 3s合拢 + 0.4s缓冲

  // 第4步：主帷幕消失后，短帘再消失
  setTimeout(function() {
    console.log('[Curtain] 短帘消失');
    if (curtainTop) {
      curtainTop.style.opacity = '0';
    }
  }, 4500); // 主帷幕消失0.3s后

  // 第5步：全部消失后重置
  setTimeout(function() {
    curtainOverlay.style.display = 'none';
    curtainOverlay.style.pointerEvents = 'none';
    curtainLeft.style.transform = '';
    curtainLeft.style.opacity = '';
    curtainLeft.style.transition = '';
    curtainRight.style.transform = '';
    curtainRight.style.opacity = '';
    curtainRight.style.transition = '';
    if (curtainTop) {
      curtainTop.style.transform = '';
      curtainTop.style.opacity = '';
    }
    curtainTriggered = false;
    console.log('[Curtain] 动画完成，已重置');
  }, 4900);
}

// ============================================
// 背景音乐 BGM - 自动循环播放
// ============================================
(function() {
  var bgm = document.getElementById('bgm');
  if (!bgm) return;
  bgm.volume = 0.3; // 柔和音量30%

  function tryPlay() {
    if (bgm.paused) {
      bgm.play().catch(function() {});
    }
  }

  // 首次尝试播放（部分浏览器允许）
  tryPlay();

  // 浏览器阻止自动播放时，在用户首次交互后播放
  document.addEventListener('click', function playOnce() {
    tryPlay();
    document.removeEventListener('click', playOnce);
  }, { once: true });
  document.addEventListener('touchstart', function playOnce() {
    tryPlay();
    document.removeEventListener('touchstart', playOnce);
  }, { once: true });
})();

// ============================================
// 自定义鼠标 - 卡通白手套（仅电脑端）
// ============================================
(function() {
  // 检测是否为触屏设备，触屏不启用
  if (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) return;

  var cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  var mouseX = -100, mouseY = -100;
  var cursorX = -100, cursorY = -100;
  var isPressed = false;
  var hasEntered = false;

  // 监听鼠标移动 - 首次移动时显示手套
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasEntered) {
      hasEntered = true;
      cursor.classList.add('visible');
    }
  });

  // 平滑跟随动画（使用 requestAnimationFrame）
  function animate() {
    // 缓动系数 0.15，平滑跟随
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // 鼠标按下 - 缩小
  document.addEventListener('mousedown', function(e) {
    if (e.button === 0) {
      isPressed = true;
      cursor.classList.add('pressing');
    }
  });

  // 鼠标松开 - 恢复
  document.addEventListener('mouseup', function(e) {
    if (e.button === 0) {
      isPressed = false;
      cursor.classList.remove('pressing');
    }
  });

  // 鼠标离开窗口时隐藏
  document.addEventListener('mouseleave', function() {
    cursor.classList.remove('visible');
  });
  document.addEventListener('mouseenter', function() {
    cursor.classList.add('visible');
  });
})();

// ============================================
// 粒子效果
// ============================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#6699FF', '#66FF99', '#FFFF66', '#CC99FF', '#aaffff', '#ffffff'];
  const glowColors = ['#00ccff', '#6699FF', '#CC99FF', '#66ffcc'];
  const count = 65;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    // 景深分类：前25%近景(亮大)，后25%远景(暗小)，中间默认
    const depthRand = Math.random();
    if (depthRand < 0.25) {
      p.classList.add('near');
    } else if (depthRand > 0.75) {
      p.classList.add('far');
    }

    // 15%概率为闪烁型粒子
    if (Math.random() < 0.15) {
      p.classList.add('twinkle');
    }

    const isNear = p.classList.contains('near');
    const isFar = p.classList.contains('far');
    const isTwinkle = p.classList.contains('twinkle');

    // 尺寸分层
    let baseSize;
    if (isFar) {
      baseSize = 1 + Math.random() * 1.5;
    } else if (isNear) {
      baseSize = 3 + Math.random() * 5;
    } else {
      baseSize = 2 + Math.random() * 3;
    }

    // 闪烁粒子更大更亮
    if (isTwinkle) {
      baseSize = Math.max(baseSize, 3 + Math.random() * 3);
    }

    p.style.width = baseSize + 'px';
    p.style.height = baseSize + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = (15 + Math.random() * 80) + '%';

    // 颜色选择
    const color = isTwinkle
      ? glowColors[Math.floor(Math.random() * glowColors.length)]
      : colors[Math.floor(Math.random() * colors.length)];

    p.style.background = color;

    // 闪烁粒子添加发光
    if (isTwinkle) {
      p.style.boxShadow = `0 0 ${baseSize * 2}px ${color}`;
    }

    // 远景粒子更淡
    if (isFar) {
      p.style.opacity = '0.3';
    }

    p.style.animationDuration = isTwinkle
      ? (2 + Math.random() * 4) + 's'
      : (6 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.borderRadius = Math.random() > 0.4 ? '50%' : '1px';

    container.appendChild(p);
  }
}

// ============================================
// 自适应缩放 - 房间铺满全屏
// ============================================
function autoScaleRoom() {
  const room = document.getElementById('room');
  if (!room) return;

  const ROOM_W = 960;
  const ROOM_H = 580;

  const availW = window.innerWidth;
  const availH = window.innerHeight;

  const scale = Math.min(availW / ROOM_W, availH / ROOM_H);

  if (typeof room.style.zoom !== 'undefined') {
    room.style.zoom = scale;
  } else {
    room.style.transform = 'scale(' + scale + ')';
    room.style.transformOrigin = 'center center';
    room.parentElement.style.height = Math.floor(ROOM_H * scale) + 'px';
  }
}

// ============================================
// 初始化
// ============================================
function init() {
  createParticles();
  autoScaleRoom();
}

// 使用 load 事件确保字体和布局已完成
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

window.addEventListener('resize', autoScaleRoom);
