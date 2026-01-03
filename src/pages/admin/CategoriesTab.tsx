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
import React from 'react';

export default function CategoriesTab({
  categories,
  sensors,
  newCategoryName,
  setNewCategoryName,
  editingCategory,
  setEditingCategory,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  handleDragEndCategories,
  loading,
  SortableCategory,
}: {
  categories: any[];
  sensors: any;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  editingCategory: any | null;
  setEditingCategory: (c: any | null) => void;
  handleAddCategory: () => Promise<void> | void;
  handleUpdateCategory: () => Promise<void> | void;
  handleDeleteCategory: (id: string) => Promise<void> | void;
  handleDragEndCategories: (event: DragEndEvent) => void;
  loading: boolean;
  SortableCategory: React.ComponentType<any>;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex space-x-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="新分类名称"
          className="flex-1 px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500"
          aria-label="新分类名称"
        />
        <button
          onClick={handleAddCategory}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
          aria-label="添加分类"
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
              aria-label="编辑分类名称"
            />
            <button
              onClick={handleUpdateCategory}
              disabled={loading}
              className="p-2 bg-green-500 hover:bg-green-600 text-black rounded-lg transition-colors"
              aria-label="保存分类"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存'}
            </button>
            <button
              onClick={() => setEditingCategory(null)}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
              aria-label="取消编辑"
            >
              取消
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
  )
}
