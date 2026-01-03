import React from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, Loader2 } from 'lucide-react';

export default function SitesTab({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  newSite,
  setNewSite,
  handleAddSite,
  loading,
  editingSite,
  setEditingSite,
  handleUpdateSite,
  filteredSites,
  sensors,
  handleDragEndSites,
  handleDeleteSite,
  SortableSite,
}: {
  categories: any[];
  selectedCategoryId: string;
  setSelectedCategoryId: (v: string) => void;
  newSite: { name: string; url: string; logo: string };
  setNewSite: (v: { name: string; url: string; logo: string }) => void;
  handleAddSite: () => Promise<void> | void;
  loading: boolean;
  editingSite: any | null;
  setEditingSite: (s: any | null) => void;
  handleUpdateSite: () => Promise<void> | void;
  filteredSites: any[];
  sensors: any;
  handleDragEndSites: (e: DragEndEvent) => void;
  handleDeleteSite: (id: string) => Promise<void> | void;
  SortableSite: React.ComponentType<any>;
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <label className="block text-sm font-medium text-green-400 mb-2">选择分类</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
          aria-label="选择分类"
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
                aria-label="网站名称"
              />
              <input
                type="url"
                value={newSite.url}
                onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
                placeholder="https://..."
                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                aria-label="网站地址"
              />
              <input
                type="text"
                value={newSite.logo}
                onChange={(e) => setNewSite({ ...newSite, logo: e.target.value })}
                placeholder="🔗"
                className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
                aria-label="网站图标"
              />
            </div>
            <button
              onClick={handleAddSite}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
              aria-label="添加网站"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span>添加网站</span>
            </button>
          </div>

          {editingSite && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  value={editingSite.name}
                  onChange={(e) =>
                    setEditingSite({ ...editingSite, name: e.target.value })
                  }
                  placeholder="网站名称"
                  className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                  aria-label="编辑网站名称"
                />
                <input
                  type="url"
                  value={editingSite.url}
                  onChange={(e) =>
                    setEditingSite({ ...editingSite, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                  aria-label="编辑网站地址"
                />
                <input
                  type="text"
                  value={editingSite.logo}
                  onChange={(e) =>
                    setEditingSite({ ...editingSite, logo: e.target.value })
                  }
                  placeholder="🔗"
                  className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                  aria-label="编辑网站图标"
                />
                <select
                  value={editingSite.category_id}
                  onChange={(e) =>
                    setEditingSite({ ...editingSite, category_id: e.target.value })
                  }
                  className="px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                  aria-label="编辑网站分类"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateSite}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors"
                  aria-label="保存网站"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存'}
                </button>
                <button
                  onClick={() => setEditingSite(null)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
                  aria-label="取消编辑网站"
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
  )
}
