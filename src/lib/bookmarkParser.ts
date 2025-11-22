// 书签解析工具函数

export interface ParsedBookmark {
    name: string;
    url: string;
    category?: string;
}

export interface ParsedBookmarkData {
    categories: Map<string, ParsedBookmark[]>;
    uncategorized: ParsedBookmark[];
}

/**
 * 解析 HTML 格式的书签文件 (Chrome, Firefox, Edge 等浏览器导出的格式)
 */
export function parseHTMLBookmarks(htmlContent: string): ParsedBookmarkData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const result: ParsedBookmarkData = {
        categories: new Map(),
        uncategorized: [],
    };

    // 递归解析书签文件夹和链接
    function parseFolder(element: Element, categoryName: string = '') {
        const dt = element.querySelectorAll(':scope > DT');

        dt.forEach((item) => {
            // 检查是否是文件夹
            const h3 = item.querySelector('H3');
            if (h3) {
                const folderName = h3.textContent?.trim() || '未命名分类';
                const dl = item.querySelector('DL');
                if (dl) {
                    parseFolder(dl, folderName);
                }
            } else {
                // 这是一个书签链接
                const a = item.querySelector('A') as HTMLAnchorElement;
                if (a && a.href) {
                    const bookmark: ParsedBookmark = {
                        name: a.textContent?.trim() || '未命名',
                        url: a.href,
                        category: categoryName,
                    };

                    if (categoryName) {
                        if (!result.categories.has(categoryName)) {
                            result.categories.set(categoryName, []);
                        }
                        result.categories.get(categoryName)!.push(bookmark);
                    } else {
                        result.uncategorized.push(bookmark);
                    }
                }
            }
        });
    }

    // 从根 DL 元素开始解析
    const rootDL = doc.querySelector('DL');
    if (rootDL) {
        parseFolder(rootDL);
    }

    return result;
}

/**
 * 解析 JSON 格式的书签文件
 * 支持多种 JSON 格式:
 * 1. 本系统导出的格式
 * 2. 简单的 {categories: [], bookmarks: []} 格式
 */
export function parseJSONBookmarks(jsonContent: string): ParsedBookmarkData {
    try {
        const data = JSON.parse(jsonContent);
        const result: ParsedBookmarkData = {
            categories: new Map(),
            uncategorized: [],
        };

        // 格式1: 本系统导出的格式
        if (data.categories && data.sites) {
            // 创建分类映射
            const categoryMap = new Map<string, string>();
            data.categories.forEach((cat: any) => {
                categoryMap.set(cat.id, cat.name);
            });

            // 按分类组织网站
            data.sites.forEach((site: any) => {
                const categoryName = categoryMap.get(site.category_id) || '默认分类';
                const bookmark: ParsedBookmark = {
                    name: site.name,
                    url: site.url,
                    category: categoryName,
                };

                if (!result.categories.has(categoryName)) {
                    result.categories.set(categoryName, []);
                }
                result.categories.get(categoryName)!.push(bookmark);
            });
        }
        // 格式2: 简单的分类+书签格式
        else if (Array.isArray(data.bookmarks) || Array.isArray(data)) {
            const bookmarks = Array.isArray(data) ? data : data.bookmarks;

            bookmarks.forEach((bookmark: any) => {
                const item: ParsedBookmark = {
                    name: bookmark.name || bookmark.title || '未命名',
                    url: bookmark.url || bookmark.link || '',
                    category: bookmark.category || bookmark.folder || '',
                };

                if (item.category) {
                    if (!result.categories.has(item.category)) {
                        result.categories.set(item.category, []);
                    }
                    result.categories.get(item.category)!.push(item);
                } else {
                    result.uncategorized.push(item);
                }
            });
        }

        return result;
    } catch (error) {
        console.error('解析 JSON 书签失败:', error);
        throw new Error('无效的 JSON 格式');
    }
}

/**
 * 从 URL 提取网站图标 emoji
 * 根据域名返回合适的 emoji
 */
export function getEmojiForUrl(url: string): string {
    try {
        const hostname = new URL(url).hostname.toLowerCase();

        // 常见网站的 emoji 映射
        const emojiMap: Record<string, string> = {
            'github.com': '🐙',
            'google.com': '🔍',
            'youtube.com': '📺',
            'twitter.com': '🐦',
            'x.com': '❌',
            'facebook.com': '📘',
            'instagram.com': '📷',
            'linkedin.com': '💼',
            'reddit.com': '🤖',
            'stackoverflow.com': '💻',
            'medium.com': '📝',
            'dev.to': '👨‍💻',
            'notion.so': '📋',
            'figma.com': '🎨',
            'dribbble.com': '🏀',
            'behance.net': '🎭',
            'amazon.com': '📦',
            'netflix.com': '🎬',
            'spotify.com': '🎵',
            'apple.com': '🍎',
            'microsoft.com': '🪟',
            'wikipedia.org': '📚',
            'bilibili.com': '📺',
            'zhihu.com': '🤔',
            'weibo.com': '📱',
            'baidu.com': '🔍',
            'taobao.com': '🛒',
            'jd.com': '🛍️',
        };

        // 检查是否匹配已知网站
        for (const [domain, emoji] of Object.entries(emojiMap)) {
            if (hostname.includes(domain)) {
                return emoji;
            }
        }

        // 根据域名后缀返回默认 emoji
        if (hostname.endsWith('.gov')) return '🏛️';
        if (hostname.endsWith('.edu')) return '🎓';
        if (hostname.endsWith('.org')) return '🌐';
        if (hostname.endsWith('.io')) return '💾';

        // 默认返回链接图标
        return '🔗';
    } catch {
        return '🔗';
    }
}

/**
 * 获取网站的 favicon URL
 * 使用 Google Favicon Service
 */
export function getFaviconUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        // 使用 Google Favicon Service,64x64 尺寸
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return '';
    }
}
