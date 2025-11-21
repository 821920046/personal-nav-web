import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type Category, type Site, type Settings } from '../lib/supabase';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Home,
    Loader2,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    GripVertical,
    Download,
    Upload,
} from 'lucide-react';

// 可排序分类项组件
function SortableCategory({ category, onEdit, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: category.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center space-x-3 p-4 bg-black/60 border border-green-500/30 rounded-lg"
        >
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-green-500/50" />
            </button>
            <span className="flex-1 text-green-400">{category.name}</span>
            <button
                onClick={() => onEdit(category)}
                className="p-2 hover:bg-green-500/10 rounded transition-colors"
            >
                <Edit2 className="w-4 h-4 text-green-500" />
            </button>
            <button
                onClick={() => onDelete(category.id)}
                className="p-2 hover:bg-red-500/10 rounded transition-colors"
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}

// 可排序网站项组件
function SortableSite({ site, onEdit, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: site.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center space-x-3 p-4 bg-black/60 border border-green-500/30 rounded-lg"
        >
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-green-500/50" />
            </button>
            <span className="text-3xl">{site.logo}</span>
            <div className="flex-1">
                <p className="text-green-400 font-medium">{site.name}</p>
                <p className="text-green-500/50 text-sm truncate">{site.url}</p>
            </div>
            <span className="text-green-500 text-sm">访问: {site.visits}</span>
            <button
                onClick={() => onEdit(site)}
                className="p-2 hover:bg-green-500/10 rounded transition-colors"
            >
                <Edit2 className="w-4 h-4 text-green-500" />
            </button>
            <button
                onClick={() => onDelete(site.id)}
                className="p-2 hover:bg-red-500/10 rounded transition-colors"
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}

export default function Admin() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'categories' | 'sites' | 'settings' | 'data'>(
        'categories'
    );
    const [loading, setLoading] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);

    // 分类管理
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // 网站管理
    const [sites, setSites] = useState<Site[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [newSite, setNewSite] = useState({ name: '', url: '', logo: '🔗' });
    const [editingSite, setEditingSite] = useState<Site | null>(null);

    // 设置管理
    const [settings, setSettings] = useState<Settings | null>(null);
    const [settingsForm, setSettingsForm] = useState({
        site_title: '',
        logo_content: '',
        city: '',
        temperature: '',
        weather_condition: '',
        default_search_engine: 'google',
    });

    // 拖拽传感器
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        setGlobalLoading(true);
        try {
            // 加载分类
            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .eq('user_id', user.id)
                .order('order_index', { ascending: true });
            setCategories(categoriesData || []);

            // 加载网站
            const { data: sitesData } = await supabase
                .from('sites')
                .select('*')
                .eq('user_id', user.id)
                .order('order_index', { ascending: true });
            setSites(sitesData || []);

            // 加载设置
            const { data: settingsData } = await supabase
                .from('settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (settingsData) {
                setSettings(settingsData);
                setSettingsForm({
                    site_title: settingsData.site_title,
                    logo_content: settingsData.logo_content,
                    city: settingsData.city,
                    temperature: settingsData.temperature,
                    weather_condition: settingsData.weather_condition,
                    default_search_engine: settingsData.default_search_engine,
                });
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        } finally {
            setGlobalLoading(false);
        }
    };

    // 分类管理函数
    const handleAddCategory = async () => {
        if (!newCategoryName.trim() || !user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert({
                    user_id: user.id,
                    name: newCategoryName,
                    order_index: categories.length,
                })
                .select()
                .single();

            if (error) throw error;
            setCategories([...categories, data]);
            setNewCategoryName('');
        } catch (error) {
            console.error('添加分类失败:', error);
            alert('添加分类失败');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory || !user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('categories')
                .update({ name: editingCategory.name })
                .eq('id', editingCategory.id);

            if (error) throw error;
            setCategories(
                categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat))
            );
            setEditingCategory(null);
        } catch (error) {
            console.error('更新分类失败:', error);
            alert('更新分类失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('确定要删除此分类吗？分类下的所有网站也会被删除。')) return;

        setGlobalLoading(true);
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(categories.filter((cat) => cat.id !== id));
            setSites(sites.filter((site) => site.category_id !== id));
        } catch (error) {
            console.error('删除分类失败:', error);
            alert('删除分类失败');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleDragEndCategories = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = categories.findIndex((cat) => cat.id === active.id);
        const newIndex = categories.findIndex((cat) => cat.id === over.id);
        const newCategories = arrayMove(categories, oldIndex, newIndex);

        setCategories(newCategories);

        // 更新数据库
        setGlobalLoading(true);
        try {
            for (let i = 0; i < newCategories.length; i++) {
                await supabase
                    .from('categories')
                    .update({ order_index: i })
                    .eq('id', newCategories[i].id);
            }
        } catch (error) {
            console.error('更新排序失败:', error);
        } finally {
            setGlobalLoading(false);
        }
    };

    // 网站管理函数
    const handleAddSite = async () => {
        if (!newSite.name.trim() || !newSite.url.trim() || !selectedCategoryId || !user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('sites')
                .insert({
                    user_id: user.id,
                    category_id: selectedCategoryId,
                    name: newSite.name,
                    url: newSite.url,
                    logo: newSite.logo,
                    visits: 0,
                    order_index: sites.filter((s) => s.category_id === selectedCategoryId).length,
                })
                .select()
                .single();

            if (error) throw error;
            setSites([...sites, data]);
            setNewSite({ name: '', url: '', logo: '🔗' });
        } catch (error) {
            console.error('添加网站失败:', error);
            alert('添加网站失败');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSite = async () => {
        if (!editingSite || !user) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('sites')
                .update({
                    name: editingSite.name,
                    url: editingSite.url,
                    logo: editingSite.logo,
                })
                .eq('id', editingSite.id);

            if (error) throw error;
            setSites(sites.map((site) => (site.id === editingSite.id ? editingSite : site)));
            setEditingSite(null);
        } catch (error) {
            console.error('更新网站失败:', error);
            alert('更新网站失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSite = async (id: string) => {
        if (!confirm('确定要删除此网站吗？')) return;

        setGlobalLoading(true);
        try {
            const { error } = await supabase.from('sites').delete().eq('id', id);
            if (error) throw error;
            setSites(sites.filter((site) => site.id !== id));
        } catch (error) {
            console.error('删除网站失败:', error);
            alert('删除网站失败');
        } finally {
            setGlobalLoading(false);
        }
    };

    const handleDragEndSites = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const categorySites = sites.filter((s) => s.category_id === selectedCategoryId);
        const oldIndex = categorySites.findIndex((site) => site.id === active.id);
        const newIndex = categorySites.findIndex((site) => site.id === over.id);
        const newCategorySites = arrayMove(categorySites, oldIndex, newIndex);

        const otherSites = sites.filter((s) => s.category_id !== selectedCategoryId);
        setSites([...otherSites, ...newCategorySites]);

        // 更新数据库
        setGlobalLoading(true);
        try {
            for (let i = 0; i < newCategorySites.length; i++) {
                await supabase
                    .from('sites')
                    .update({ order_index: i })
                    .eq('id', newCategorySites[i].id);
            }
        } catch (error) {
            console.error('更新排序失败:', error);
        } finally {
            setGlobalLoading(false);
        }
    };

    // 设置管理
    const handleSaveSettings = async () => {
        if (!user || !settings) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('settings')
                .update({
                    site_title: settingsForm.site_title,
                    logo_content: settingsForm.logo_content,
                    city: settingsForm.city,
                    temperature: settingsForm.temperature,
                    weather_condition: settingsForm.weather_condition,
                    default_search_engine: settingsForm.default_search_engine,
                })
                .eq('user_id', user.id);

            if (error) throw error;
            alert('设置保存成功！');
        } catch (error) {
            console.error('保存设置失败:', error);
            alert('保存设置失败');
        } finally {
            setLoading(false);
        }
    };

    // 数据导入导出
    const handleExportData = () => {
        const exportData = {
            categories,
            sites,
            settings,
            exportDate: new Date().toISOString(),
            version: '1.0',
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `navigation-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        if (!confirm('导入数据将覆盖当前所有数据，确定继续吗？')) {
            e.target.value = '';
            return;
        }

        setGlobalLoading(true);
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // 删除现有数据
            await supabase.from('sites').delete().eq('user_id', user.id);
            await supabase.from('categories').delete().eq('user_id', user.id);

            // 导入分类
            if (data.categories) {
                for (const cat of data.categories) {
                    await supabase.from('categories').insert({
                        user_id: user.id,
                        name: cat.name,
                        order_index: cat.order_index,
                    });
                }
            }

            // 导入网站
            if (data.sites) {
                for (const site of data.sites) {
                    await supabase.from('sites').insert({
                        user_id: user.id,
                        category_id: site.category_id,
                        name: site.name,
                        url: site.url,
                        logo: site.logo,
                        visits: site.visits || 0,
                        order_index: site.order_index,
                    });
                }
            }

            // 导入设置
            if (data.settings) {
                await supabase
                    .from('settings')
                    .update({
                        site_title: data.settings.site_title,
                        logo_content: data.settings.logo_content,
                        city: data.settings.city,
                        temperature: data.settings.temperature,
                        weather_condition: data.settings.weather_condition,
                        default_search_engine: data.settings.default_search_engine,
                    })
                    .eq('user_id', user.id);
            }

            alert('数据导入成功！');
            window.location.reload();
        } catch (error) {
            console.error('导入数据失败:', error);
            alert('导入数据失败，请检查文件格式');
        } finally {
            setGlobalLoading(false);
            e.target.value = '';
        }
    };

    const filteredSites = sites.filter((site) => site.category_id === selectedCategoryId);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* 全局加载遮罩 */}
            {globalLoading && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                        <p className="text-green-500">处理中...</p>
                    </div>
                </div>
            )}

            {/* 导航栏 */}
            <nav className="bg-black/80 backdrop-blur-sm border-b border-green-500/30">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-green-500">管理后台</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span>返回首页</span>
                    </button>
                </div>
            </nav>

            {/* 标签页 */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex space-x-2 mb-6 border-b border-green-500/30">
                    {[
                        { id: 'categories', label: '分类管理' },
                        { id: 'sites', label: '网站管理' },
                        { id: 'settings', label: '设置' },
                        { id: 'data', label: '数据管理' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-green-500 border-b-2 border-green-500'
                                    : 'text-green-400/50 hover:text-green-400'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 分类管理 */}
                {activeTab === 'categories' && (
                    <div className="max-w-2xl">
                        <div className="mb-6 flex space-x-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="新分类名称"
                                className="flex-1 px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                            />
                            <button
                                onClick={handleAddCategory}
                                disabled={loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                <span>添加</span>
                            </button>
                        </div>

                        {editingCategory && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={editingCategory.name}
                                        onChange={(e) =>
                                            setEditingCategory({ ...editingCategory, name: e.target.value })
                                        }
                                        className="flex-1 px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                                    />
                                    <button
                                        onClick={handleUpdateCategory}
                                        disabled={loading}
                                        className="p-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setEditingCategory(null)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEndCategories}
                        >
                            <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <SortableCategory
                                            key={category.id}
                                            category={category}
                                            onEdit={setEditingCategory}
                                            onDelete={handleDeleteCategory}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                {/* 网站管理 */}
                {activeTab === 'sites' && (
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-green-400 mb-2">选择分类</label>
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            >
                                <option value="">请选择分类</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedCategoryId && (
                            <>
                                <div className="mb-6 p-4 bg-black/60 border border-green-500/30 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={newSite.name}
                                            onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                                            placeholder="网站名称"
                                            className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                                        />
                                        <input
                                            type="url"
                                            value={newSite.url}
                                            onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                                            placeholder="https://..."
                                            className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                                        />
                                        <input
                                            type="text"
                                            value={newSite.logo}
                                            onChange={(e) => setNewSite({ ...newSite, logo: e.target.value })}
                                            placeholder="🔗"
                                            className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddSite}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                        <span>添加网站</span>
                                    </button>
                                </div>

                                {editingSite && (
                                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <input
                                                type="text"
                                                value={editingSite.name}
                                                onChange={(e) =>
                                                    setEditingSite({ ...editingSite, name: e.target.value })
                                                }
                                                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            />
                                            <input
                                                type="url"
                                                value={editingSite.url}
                                                onChange={(e) =>
                                                    setEditingSite({ ...editingSite, url: e.target.value })
                                                }
                                                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            />
                                            <input
                                                type="text"
                                                value={editingSite.logo}
                                                onChange={(e) =>
                                                    setEditingSite({ ...editingSite, logo: e.target.value })
                                                }
                                                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleUpdateSite}
                                                disabled={loading}
                                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                                <span>保存</span>
                                            </button>
                                            <button
                                                onClick={() => setEditingSite(null)}
                                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEndSites}
                                >
                                    <SortableContext items={filteredSites} strategy={verticalListSortingStrategy}>
                                        <div className="space-y-2">
                                            {filteredSites.map((site) => (
                                                <SortableSite
                                                    key={site.id}
                                                    site={site}
                                                    onEdit={setEditingSite}
                                                    onDelete={handleDeleteSite}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            </>
                        )}
                    </div>
                )}

                {/* 设置 */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">网站标题</label>
                            <input
                                type="text"
                                value={settingsForm.site_title}
                                onChange={(e) =>
                                    setSettingsForm({ ...settingsForm, site_title: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">Logo (Emoji)</label>
                            <input
                                type="text"
                                value={settingsForm.logo_content}
                                onChange={(e) =>
                                    setSettingsForm({ ...settingsForm, logo_content: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">城市</label>
                            <input
                                type="text"
                                value={settingsForm.city}
                                onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">温度</label>
                            <input
                                type="text"
                                value={settingsForm.temperature}
                                onChange={(e) =>
                                    setSettingsForm({ ...settingsForm, temperature: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">天气状况</label>
                            <input
                                type="text"
                                value={settingsForm.weather_condition}
                                onChange={(e) =>
                                    setSettingsForm({ ...settingsForm, weather_condition: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">默认搜索引擎</label>
                            <select
                                value={settingsForm.default_search_engine}
                                onChange={(e) =>
                                    setSettingsForm({ ...settingsForm, default_search_engine: e.target.value })
                                }
                                className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                            >
                                <option value="google">Google</option>
                                <option value="bing">Bing</option>
                                <option value="baidu">百度</option>
                            </select>
                        </div>

                        <button
                            onClick={handleSaveSettings}
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>保存设置</span>
                        </button>
                    </div>
                )}

                {/* 数据管理 */}
                {activeTab === 'data' && (
                    <div className="max-w-2xl space-y-6">
                        <div className="p-6 bg-black/60 border border-green-500/30 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-500 mb-4">导出数据</h3>
                            <p className="text-green-400/70 mb-4">
                                导出所有分类、网站和设置数据为 JSON 文件，用于备份或迁移。
                            </p>
                            <button
                                onClick={handleExportData}
                                className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                <span>导出数据</span>
                            </button>
                        </div>

                        <div className="p-6 bg-black/60 border border-green-500/30 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-500 mb-4">导入数据</h3>
                            <p className="text-green-400/70 mb-4">
                                从之前导出的 JSON 文件导入数据。<strong className="text-red-400">注意：这将覆盖当前所有数据！</strong>
                            </p>
                            <label className="flex items-center space-x-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors cursor-pointer">
                                <Upload className="w-5 h-5 text-green-500" />
                                <span className="text-green-500 font-semibold">选择文件导入</span>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportData}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
