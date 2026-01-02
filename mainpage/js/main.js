// ============================================
// 【主页导航系统】
// ============================================

const NavSystem = {
    // 配置路径
    paths: {
        navItems: './mainpage/data/navItems.json',
        theme: './mainpage/data/theme.json'
    },

    // 缓存数据
    data: {
        navItems: null,
        theme: null,
        settings: null
    },

    // 初始化
    async init() {
        try {
            // 并行加载数据
            await Promise.all([
                this.loadTheme(),
                this.loadNavItems()
            ]);
            
            // 应用主题
            this.applyTheme();
            
            // 渲染导航项
            this.renderNavItems();
            
            console.log('✅ 导航系统初始化完成');
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            this.showError('加载失败，请刷新页面重试');
        }
    },

    // 加载主题配置
    async loadTheme() {
        try {
            const response = await fetch(this.paths.theme);
            if (!response.ok) throw new Error('主题配置加载失败');
            this.data.theme = await response.json();
        } catch (error) {
            console.warn('⚠️ 主题配置加载失败，使用默认主题');
            this.data.theme = null;
        }
    },

    // 加载导航项数据
    async loadNavItems() {
        const response = await fetch(this.paths.navItems);
        if (!response.ok) throw new Error('导航数据加载失败');
        const data = await response.json();
        this.data.navItems = data.items || [];
        this.data.settings = data.settings || {};
    },

    // 应用主题到CSS变量
    applyTheme() {
        if (!this.data.theme) return;

        const root = document.documentElement;
        const { theme, typography, layout } = this.data.theme;

        // 应用主题色
        if (theme) {
            this.setCSSVar(root, '--primary-color', theme.primaryColor);
            this.setCSSVar(root, '--bg-color', theme.bgColor);
            this.setCSSVar(root, '--card-bg', theme.cardBg);
            this.setCSSVar(root, '--card-hover-bg', theme.cardHoverBg);
            this.setCSSVar(root, '--border-color', theme.borderColor);
            this.setCSSVar(root, '--text-color', theme.textColor);
            this.setCSSVar(root, '--text-secondary', theme.textSecondary);
            this.setCSSVar(root, '--accent-color', theme.accentColor);
            this.setCSSVar(root, '--shadow', theme.shadow);
            this.setCSSVar(root, '--shadow-hover', theme.shadowHover);
            this.setCSSVar(root, '--transition-duration', theme.transitionDuration);
            this.setCSSVar(root, '--border-radius', theme.borderRadius);
        }

        // 应用字体设置
        if (typography) {
            this.setCSSVar(root, '--font-family', typography.fontFamily);
            this.setCSSVar(root, '--header-size', typography.headerSize);
            this.setCSSVar(root, '--header-size-mobile', typography.headerSizeMobile);
            this.setCSSVar(root, '--title-size', typography.titleSize);
            this.setCSSVar(root, '--desc-size', typography.descSize);
            this.setCSSVar(root, '--tag-size', typography.tagSize);
            this.setCSSVar(root, '--badge-size', typography.badgeSize);
        }

        // 应用布局设置
        if (layout) {
            this.setCSSVar(root, '--container-max-width', layout.containerMaxWidth);
            this.setCSSVar(root, '--container-padding', layout.containerPadding);
            this.setCSSVar(root, '--container-padding-mobile', layout.containerPaddingMobile);
            this.setCSSVar(root, '--card-padding', layout.cardPadding);
            this.setCSSVar(root, '--card-padding-mobile', layout.cardPaddingMobile);
            this.setCSSVar(root, '--card-gap', layout.cardGap);
            this.setCSSVar(root, '--icon-size', layout.iconSize);
            this.setCSSVar(root, '--icon-size-mobile', layout.iconSizeMobile);
        }
    },

    // 设置CSS变量
    setCSSVar(element, property, value) {
        if (value !== undefined && value !== null) {
            element.style.setProperty(property, value);
        }
    },

    // 渲染导航项
    renderNavItems() {
        const navList = document.getElementById('navList');
        if (!navList) return;

        // 清空加载提示
        navList.innerHTML = '';

        // 排序：active 在前，inactive 在后
        const sortedItems = [...this.data.navItems].sort((a, b) => {
            const aActive = a.status !== 'inactive' ? 0 : 1;
            const bActive = b.status !== 'inactive' ? 0 : 1;
            return aActive - bActive;
        });

        // 渲染每个导航项
        sortedItems.forEach(item => {
            const navItem = this.createNavItem(item);
            navList.appendChild(navItem);
        });
    },

    // 创建单个导航项DOM
    createNavItem(item) {
        const {
            id = '',
            href = '#',
            icon = '📄',
            title = '未命名',
            desc = '',
            tags = [],
            badge = '',
            badgeColor = '', // 新增徽章颜色
            status = 'active',
            updateTime = '',
            banMsg = '该功能暂不可用' // 新增禁用提示
        } = item;

        const settings = this.data.settings;
        const navItem = document.createElement('a');
        navItem.href = status === 'inactive' ? 'javascript:void(0);' : href;
        navItem.className = 'nav-item';
        navItem.dataset.id = id;
        navItem.dataset.status = status;

        // 禁用状态点击弹窗
        if (status === 'inactive') {
            navItem.addEventListener('click', function(e) {
                e.preventDefault();
                alert(banMsg || '该功能暂不可用');
            });
        }

        // 构建标签HTML
        let tagsHtml = '';
        if (settings.showTags && tags.length > 0) {
            const displayTags = tags.slice(0, settings.maxTagsDisplay || 3);
            tagsHtml = `
                <div class="nav-tags">
                    ${displayTags.map(tag => `<span class="nav-tag">${tag}</span>`).join('')}
                </div>
            `;
        }

        // 构建徽章HTML，支持自定义颜色
        let badgeHtml = '';
        if (settings.showBadge && badge) {
            const badgeClass = this.getBadgeClass(badge);
            const style = badgeColor ? `background:${this.resolveBadgeColor(badgeColor)};` : '';
            badgeHtml = `<span class="nav-badge ${badgeClass}" style="${style}">${badge}</span>`;
        }

        // 构建元信息HTML
        let metaHtml = '';
        if (settings.showUpdateTime && updateTime) {
            metaHtml = `
                <div class="nav-meta">
                    <span class="nav-meta-item">
                        <span>🕐</span>
                        <span>更新于 ${updateTime}</span>
                    </span>
                </div>
            `;
        }

        navItem.innerHTML = `
            <div class="nav-icon">${icon}</div>
            <div class="nav-content">
                <div class="nav-header">
                    <span class="nav-title">${title}</span>
                    ${badgeHtml}
                </div>
                <div class="nav-desc">${desc}</div>
                ${tagsHtml}
                ${metaHtml}
            </div>
            <span class="nav-arrow">→</span>
        `;

        return navItem;
    },

    // 解析徽章颜色
    resolveBadgeColor(color) {
        if (!color) return '';
        if (color.startsWith('#') && (color.length === 7 || color.length === 4)) return color;
        // 单字母缩写
        const map = {
            G: '#52c41a', // green
            R: '#ff4d4f', // red
            B: '#1890ff', // blue
            Y: '#faad14', // yellow
            O: '#fa541c', // orange
            P: '#722ed1', // purple
            A: 'var(--accent-color)'
        };
        return map[color.toUpperCase()] || color;
    },

    // 获取徽章样式类
    getBadgeClass(badge) {
        const badgeMap = {
            '新': 'new',
            'NEW': 'new',
            '热': 'hot',
            'HOT': 'hot',
            '更新': 'update',
            'UPDATE': 'update'
        };
        return badgeMap[badge.toUpperCase()] || '';
    },

    // 显示错误信息
    showError(message) {
        const navList = document.getElementById('navList');
        if (navList) {
            navList.innerHTML = `<div class="loading" style="color: #ff4d4f;">${message}</div>`;
        }
    },

    // ============================================
    // 【公共API接口】
    // ============================================

    // 动态添加导航项
    addNavItem(config) {
        this.data.navItems.push(config);
        const navList = document.getElementById('navList');
        if (navList) {
            navList.appendChild(this.createNavItem(config));
        }
    },

    // 更新主题
    updateTheme(themeConfig) {
        this.data.theme = { ...this.data.theme, ...themeConfig };
        this.applyTheme();
    },

    // 更新单个CSS变量
    setThemeVar(property, value) {
        document.documentElement.style.setProperty(property, value);
    },

    // 获取当前主题配置
    getTheme() {
        return this.data.theme;
    },

    // 获取导航项数据
    getNavItems() {
        return this.data.navItems;
    }
};

// ============================================
// 页面加载完成后初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    NavSystem.init();
});

// 导出到全局，方便外部调用
window.NavSystem = NavSystem;
