import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import MatrixRain from '../components/MatrixRain';
import { UserPlus, Loader2, Mail, Lock } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 验证密码
        if (password.length < 6) {
            setError('密码至少需要6个字符');
            return;
        }

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致');
            return;
        }

        setLoading(true);

        try {
            // 注册用户
            await signUp(email, password);

            // 等待用户创建完成
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // 创建默认设置
                await supabase.from('settings').insert({
                    user_id: user.id,
                    site_title: '智能导航网站',
                    logo_type: 'url',
                    logo_content: '🌐',
                    province: '北京市',
                    city: '北京',
                    temperature: '20°C',
                    weather_condition: '晴',
                    default_search_engine: 'google',
                });
            }

            navigate('/');
        } catch (err: any) {
            setError(err.message || '注册失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <MatrixRain />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🌐</div>
                        <h1 className="text-3xl font-bold text-green-500 mb-2">创建账号</h1>
                        <p className="text-green-400/70">开始使用智能导航</p>
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* 注册表单 */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">
                                邮箱
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500/50" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 transition-colors"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">
                                密码
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500/50" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 transition-colors"
                                    placeholder="至少6个字符"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-400 mb-2">
                                确认密码
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500/50" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 transition-colors"
                                    placeholder="再次输入密码"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>注册中...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>注册</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* 登录链接 */}
                    <div className="mt-6 text-center">
                        <p className="text-green-400/70">
                            已有账号？{' '}
                            <Link
                                to="/login"
                                className="text-green-500 hover:text-green-400 font-semibold transition-colors"
                            >
                                立即登录
                            </Link>
                        </p>
                    </div>

                    {/* 游客访问 */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-green-400/70 hover:text-green-400 text-sm transition-colors"
                        >
                            以游客身份浏览
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
