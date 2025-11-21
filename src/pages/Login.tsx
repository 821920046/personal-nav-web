import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MatrixRain from '../components/MatrixRain';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || '登录失败，请检查邮箱和密码');
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
                        <h1 className="text-3xl font-bold text-green-500 mb-2">智能导航</h1>
                        <p className="text-green-400/70">欢迎回来</p>
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* 登录表单 */}
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
                                    className="w-full pl-10 pr-4 py-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-green-500/50 focus:outline-none focus:border-green-500 transition-colors"
                                    placeholder="••••••••"
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
                                    <span>登录中...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>登录</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* 注册链接 */}
                    <div className="mt-6 text-center">
                        <p className="text-green-400/70">
                            还没有账号？{' '}
                            <Link
                                to="/register"
                                className="text-green-500 hover:text-green-400 font-semibold transition-colors"
                            >
                                立即注册
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
