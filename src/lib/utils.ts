import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URL 验证工具 - 防止 javascript: 等危险协议
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// 自动补全 URL 协议
export function normalizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

// 基础文本清理 - 移除潜在危险字符
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

import { toast } from 'sonner';
export const logger = {
  info(message: string) {
    if (import.meta.env.DEV) {
      console.info(message);
    }
    toast.message(message);
  },
  warn(message: string) {
    if (import.meta.env.DEV) {
      console.warn(message);
    }
    toast.warning(message);
  },
  error(message: string) {
    if (import.meta.env.DEV) {
      console.error(message);
    }
    toast.error(message);
  }
}
