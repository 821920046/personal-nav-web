import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Category, type Site, type Settings } from '../lib/supabase';
import MatrixRain from '../components/MatrixRain';
import Sidebar from '../components/Sidebar';
import { Search, Menu, Loader2 } from 'lucide-react';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [searchEngine, setSearchEngine] = useState('Google');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 加载进度条动画
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [loading]);

  // 加载数据
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 加载设置（游客使用默认设置）
      // 加载设置（游客使用默认设置）
      const defaultSettings: Settings = {
        id: '',
        user_id: user?.id || '',
        site_title: '智能导航网站',
        logo_type: 'url',
        logo_content: '🌐',
        default_search_engine: 'google',
        created_at: '',
        updated_at: '',
      };

      if (user) {
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (settingsData) {
          setSettings(settingsData);
        } else {
          setSettings(defaultSettings);
        }
      } else {
        // 游客默认设置
        setSettings(defaultSettings);
      }

      // 加载分类和网站（显示所有公开数据或用户数据）
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      const { data: sitesData } = await supabase
        .from('sites')
        .select('*')
        .order('order_index', { ascending: true });

      setCategories(categoriesData || []);
      setSites(sitesData || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理网站点击（仅登录用户更新访问次数）
  const handleSiteClick = async (site: Site) => {
    if (user) {
      await supabase
        .from('sites')
        .update({ visits: site.visits + 1 })
        .eq('id', site.id);
    }
    window.open(site.url, '_blank');
  };

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const searchEngines: Record<string, string> = {
      'Google': `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
      '百度': `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
      'Bing': `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
      'github': `https://github.com/search?q=${encodeURIComponent(searchQuery)}`,
    };

    const url = searchEngines[searchEngine] || searchEngines['Google'];
    window.open(url, '_blank');
    setSearchQuery('');
  };

  // 获取最近访问的网站（仅登录用户）
  const getRecentSites = () => {
    if (!user) return [];
    return [...sites]
      .filter((site) => site.visits > 0)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 8);
  };

  // 获取所有网站,按访问次数排序
  const getAllSitesSortedByVisits = () => {
    return [...sites].sort((a, b) => b.visits - a.visits);
  };

  // 按分类分组网站
  const getSitesByCategory = (categoryId: string) => {
    return sites.filter((site) => site.category_id === categoryId);
  };

  // 获取非空分类
  const getNonEmptyCategories = () => {
    return categories.filter((cat) => getSitesByCategory(cat.id).length > 0);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <MatrixRain />
        <div className="relative z-10 w-full max-w-md px-4">
          <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <p className="text-green-500 text-sm font-mono">{Math.floor(progress)}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <MatrixRain />

      {/* 侧边栏 */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={(categoryId) => {
          setActiveCategory(categoryId);
          if (categoryId) {
            const element = document.getElementById(`category-${categoryId}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        siteLogo={settings?.logo_type !== 'emoji' ? settings?.logo_content : undefined}
        siteTitle={settings?.site_title}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* 顶部导航栏（仅移动端汉堡菜单） */}
      <nav className={`relative z-10 bg-black/60 backdrop-blur-md border-b border-green-500/20 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            {/* 移动端汉堡菜单 */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-green-500/10 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-white/80" />
            </button>

            <h1 className="text-lg md:text-xl font-bold text-green-500 truncate md:hidden">
              {settings?.site_title || '智能导航'}
            </h1>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className={`relative z-10 container mx-auto px-4 py-8 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}>
        {/* 搜索框 */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-12">
          {/* 搜索引擎选择 */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4 overflow-x-auto scrollbar-hide px-4">
            {['Google', '百度', 'Bing', 'github'].map((engine) => (
              <button
                key={engine}
                onClick={() => setSearchEngine(engine)}
                className={`px-3 md:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${searchEngine === engine
                  ? 'bg-green-500 text-black font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {engine}
              </button>
            ))}
          </div>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${searchEngine} 搜索...`}
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors text-base md:text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 md:p-2.5 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </button>
          </form>
        </div>

        {/* 最近访问(按访问次数排序,不显示次数徽章) */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-4 md:mb-6">
            {activeCategory ?
              categories.find(c => c.id === activeCategory)?.name || '最近访问' :
              '最近访问'
            }
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {(activeCategory
              ? getSitesByCategory(activeCategory).sort((a, b) => b.visits - a.visits)
              : getAllSitesSortedByVisits().filter(site => site.visits > 0)
            ).map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteClick(site)}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-white/10 hover:border-green-500/50 transition-all active:scale-95"
              >
                {/* 图标 */}
                <div className="flex items-center justify-center mb-2 md:mb-3">
                  <img
                    src={`https://unavatar.io/${(() => {
                      try {
                        return new URL(site.url).hostname;
                      } catch {
                        return 'localhost';
                      }
                    })()}?fallback=false`}
                    alt={site.name}
                    className="w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      const currentSrc = img.src;
                      let hostname = 'localhost';
                      try {
                        hostname = new URL(site.url).hostname;
                      } catch (e) {
                        // Invalid URL, fallback to emoji
                        img.style.display = 'none';
                        const emojiSpan = img.nextElementSibling as HTMLElement;
                        if (emojiSpan) {
                          emojiSpan.classList.remove('hidden');
                          emojiSpan.classList.add('flex');
                        }
                        return;
                      }

                      // 5-tier fallback chain: unavatar -> icon.horse -> direct favicon -> Google -> emoji
                      if (currentSrc.includes('unavatar.io')) {
                        img.src = `https://icon.horse/icon/${hostname}`;
                      } else if (currentSrc.includes('icon.horse')) {
                        img.src = `https://${hostname}/favicon.ico`;
                      } else if (currentSrc.includes('favicon.ico')) {
                        img.src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
                      } else if (currentSrc.includes('google.com')) {
                        img.src = `https://api.faviconkit.com/${hostname}/64`;
                      } else {
                        // All image sources failed - show emoji fallback
                        img.style.display = 'none';
                        const emojiSpan = img.nextElementSibling as HTMLElement;
                        if (emojiSpan) {
                          emojiSpan.classList.remove('hidden');
                          emojiSpan.classList.add('flex');
                        }
                      }
                    }}
                  />
                  <span className="hidden text-3xl md:text-4xl items-center justify-center">{site.logo || '🌐'}</span>
                </div>

                {/* 名称 */}
                <p className="text-xs md:text-sm text-white/80 text-center truncate group-hover:text-white transition-colors">
                  {site.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 空状态 */}
        {
          getNonEmptyCategories().length === 0 && (
            <div className="text-center py-20">
              <p className="text-green-500/50 text-lg">暂无导航数据</p>
              {user && (
                <button
                  onClick={() => navigate('/admin')}
                  className="mt-4 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors"
                >
                  前往管理后台添加
                </button>
              )}
            </div>
          )
        }
      </main>
    </div>
  );
}
