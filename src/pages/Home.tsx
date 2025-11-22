import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Category, type Site, type Settings } from '../lib/supabase';
import MatrixRain from '../components/MatrixRain';
import { Search, LogOut, Settings as SettingsIcon, Loader2 } from 'lucide-react';

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
      if (user) {
        const { data: settingsData } = await supabase
          .from('settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setSettings(settingsData);
      } else {
        // 游客默认设置
        setSettings({
          id: '',
          user_id: '',
          site_title: '智能导航网站',
          logo_type: 'url',
          logo_content: '🌐',
          province: '北京市',
          city: '北京',
          temperature: '20°C',
          weather_condition: '晴',
          default_search_engine: 'google',
          created_at: '',
          updated_at: '',
        });
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

      {/* 导航栏 */}
      <nav className="relative z-10 bg-black/60 backdrop-blur-md border-b border-green-500/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{settings?.logo_content || '🌐'}</span>
            <h1 className="text-xl font-bold text-green-500">{settings?.site_title || '智能导航'}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* 天气和日期 */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-green-400">
              <span>{settings?.city}</span>
              <span className="text-green-500/50">|</span>
              <span>{settings?.temperature}</span>
              <span>{settings?.weather_condition}</span>
            </div>

            {user && (
              <>
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>管理</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors"
              >
                登录
              </button>
            )}
          </div>
        </div>

        {/* 分类导航标签 */}
        <div className="border-t border-green-500/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveCategory(null)}
                className="relative px-4 py-3 text-white/80 hover:text-white transition-colors whitespace-nowrap"
              >
                Home
                {activeCategory === null && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                )}
              </button>
              {getNonEmptyCategories().map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    const element = document.getElementById(`category-${category.id}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="relative px-4 py-3 text-white/80 hover:text-white transition-colors whitespace-nowrap"
                >
                  {category.name}
                  {activeCategory === category.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* 搜索框 */}
        <div className="max-w-3xl mx-auto mb-12">
          {/* 搜索引擎选择 */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {['Google', '百度', 'Bing', 'github'].map((engine) => (
              <button
                key={engine}
                onClick={() => setSearchEngine(engine)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all ${searchEngine === engine
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
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition-colors text-lg"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors"
            >
              <Search className="w-6 h-6 text-green-500" />
            </button>
          </form>
        </div>

        {/* 最近访问(按访问次数排序,不显示次数徽章) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-green-500 mb-6">
            {activeCategory ?
              categories.find(c => c.id === activeCategory)?.name || '最近访问' :
              '最近访问'
            }
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {(activeCategory
              ? getSitesByCategory(activeCategory).sort((a, b) => b.visits - a.visits)
              : getAllSitesSortedByVisits()
            ).map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteClick(site)}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-green-500/50 transition-all"
              >
                {/* 图标 */}
                <div className="flex items-center justify-center mb-3">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=64`}
                    alt={site.name}
                    className="w-12 h-12 group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const emojiSpan = e.currentTarget.nextElementSibling as HTMLElement;
                      if (emojiSpan) emojiSpan.style.display = 'block';
                    }}
                  />
                  <span className="hidden text-5xl">{site.logo}</span>
                </div>

                {/* 名称 */}
                <p className="text-sm text-white/80 text-center truncate group-hover:text-white transition-colors">
                  {site.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 空状态 */}
        {getNonEmptyCategories().length === 0 && (
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
        )}
      </main>
    </div>
  );
}
