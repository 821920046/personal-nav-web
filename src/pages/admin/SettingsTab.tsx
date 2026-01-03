import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SettingsTab({
  settingsForm,
  setSettingsForm,
  logoType,
  setLogoType,
  handleLogoFileChange,
  handleSaveSettings,
  loading,
}: {
  settingsForm: {
    site_title: string;
    logo_type: 'emoji' | 'url' | 'upload';
    logo_content: string;
    default_search_engine: string;
  };
  setSettingsForm: (v: any) => void;
  logoType: 'emoji' | 'url' | 'upload';
  setLogoType: (v: 'emoji' | 'url' | 'upload') => void;
  handleLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveSettings: () => Promise<void> | void;
  loading: boolean;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-green-400 mb-2">网站标题</label>
        <input
          type="text"
          value={settingsForm.site_title}
          onChange={(e) => setSettingsForm({ ...settingsForm, site_title: e.target.value })}
          className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
          aria-label="网站标题"
        />
      </div>

      <div className="p-4 bg-black/40 border border-green-500/20 rounded-lg">
        <label className="block text-sm font-medium text-green-400 mb-3">网站 Logo</label>
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={logoType === 'emoji'}
              onChange={() => setLogoType('emoji')}
              aria-label="使用 Emoji 作为 Logo"
            />
            <span>Emoji</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={logoType === 'url'}
              onChange={() => setLogoType('url')}
              aria-label="使用 URL 作为 Logo"
            />
            <span>图片 URL</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={logoType === 'upload'}
              onChange={() => setLogoType('upload')}
              aria-label="上传图片作为 Logo"
            />
            <span>上传图片</span>
          </label>
        </div>

        {logoType === 'emoji' && (
          <input
            type="text"
            value={settingsForm.logo_content}
            onChange={(e) => setSettingsForm({ ...settingsForm, logo_content: e.target.value })}
            placeholder="例如：🌐"
            className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
            aria-label="Logo Emoji"
          />
        )}

        {logoType === 'url' && (
          <input
            type="url"
            value={settingsForm.logo_content}
            onChange={(e) => setSettingsForm({ ...settingsForm, logo_content: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
            aria-label="Logo 图片 URL"
          />
        )}

        {logoType === 'upload' && (
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoFileChange}
            className="w-full"
            aria-label="上传 Logo 图片"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-green-400 mb-2">默认搜索引擎</label>
        <select
          value={settingsForm.default_search_engine}
          onChange={(e) => setSettingsForm({ ...settingsForm, default_search_engine: e.target.value })}
          className="w-full px-4 py-2 bg-black/60 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
          aria-label="默认搜索引擎"
        >
          <option value="google">Google</option>
          <option value="baidu">百度</option>
          <option value="bing">Bing</option>
          <option value="github">GitHub</option>
        </select>
      </div>

      <button
        onClick={handleSaveSettings}
        disabled={loading}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        aria-label="保存设置"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存设置'}
      </button>
    </div>
  )
}
