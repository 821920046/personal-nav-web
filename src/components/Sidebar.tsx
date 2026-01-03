import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, LogOut, X, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Category } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useIsMobile } from '../hooks/use-mobile';

interface SidebarProps {
    categories: Category[];
    activeCategory: string | null;
    onCategoryClick: (categoryId: string | null) => void;
    user: User | null;
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
    siteLogo?: string;
    siteTitle?: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export default function Sidebar({
    categories,
    activeCategory,
    onCategoryClick,
    user,
    onLogout,
    isOpen,
    onClose,
    siteLogo,
    siteTitle,
    isCollapsed,
    onToggleCollapse,
}: SidebarProps) {
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // 处理分类点击
    const handleCategoryClick = (categoryId: string | null) => {
        onCategoryClick(categoryId);
        if (isMobile) {
            onClose();
        }
    };

    // 获取非空分类
    const nonEmptyCategories = categories.filter((cat) => cat);

    return (
        <>
            {/* 移动端遮罩层 */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* 侧边栏 */}
            <aside
                className={`fixed top-0 left-0 h-full bg-black/90 backdrop-blur-md border-r border-green-500/20 z-50 flex flex-col transition-all duration-300 ${isCollapsed && !isMobile ? 'w-16' : 'w-64'
                    } ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
                    }`}
            >
                {/* 顶部 Logo & Title */}
                <div className={`flex items-center p-4 border-b border-green-500/20 ${isCollapsed ? 'flex-col gap-2' : 'justify-between'
                    }`}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {siteLogo ? (
                            <img
                                src={siteLogo}
                                alt="Logo"
                                className="w-8 h-8 object-contain rounded-sm flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <span className="text-2xl flex-shrink-0">🌐</span>
                        )}
                        {!isCollapsed && (
                            <h2 className="text-lg font-bold text-green-500 truncate">
                                {siteTitle || '智能导航'}
                            </h2>
                        )}
                    </div>

                    {/* 移动端关闭按钮 */}
                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors flex-shrink-0"
                            title="关闭"
                        >
                            <X className="w-5 h-5 text-white/80" />
                        </button>
                    )}

                    {/* 桌面端折叠按钮 */}
                    {!isMobile && (
                        <button
                            onClick={onToggleCollapse}
                            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors flex-shrink-0"
                            title={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-5 h-5 text-white/80" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 text-white/80" />
                            )}
                        </button>
                    )}
                </div>

                {/* 分类导航 */}
                <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
                    <nav className="space-y-1 px-2">
                        {/* Home 按钮 */}
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeCategory === null
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'text-white/80 hover:bg-green-500/10 hover:text-white'
                                }`}
                            title="首页"
                        >
                            <Home className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">首页</span>}
                        </button>

                        {/* 分类列表 */}
                        {nonEmptyCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeCategory === category.id
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'text-white/80 hover:bg-green-500/10 hover:text-white'
                                    }`}
                                title={category.name}
                            >
                                <span className="text-lg flex-shrink-0">
                                    {category.name.match(/[\u{1F300}-\u{1F9FF}]/u)?.[0] || '📁'}
                                </span>
                                {!isCollapsed && (
                                    <span className="text-sm font-medium truncate">
                                        {category.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() || category.name}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* 底部用户控制区 */}
                <div className="p-4 border-t border-green-500/20 space-y-2">
                    {user ? (
                        <>
                            <button
                                onClick={() => {
                                    navigate('/admin');
                                    if (isMobile) onClose();
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors"
                                title="管理后台"
                            >
                                <SettingsIcon className="w-4 h-4 flex-shrink-0" />
                                {!isCollapsed && <span className="text-sm">管理后台</span>}
                            </button>
                            <button
                                onClick={() => {
                                    onLogout();
                                    if (isMobile) onClose();
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                                title="退出登录"
                            >
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                                {!isCollapsed && <span className="text-sm">退出登录</span>}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                navigate('/login');
                                if (isMobile) onClose();
                            }}
                            className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors text-sm"
                            title="登录"
                        >
                            {isCollapsed ? '🔑' : '登录'}
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}
