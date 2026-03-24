import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    try {
        const user = await login(form);
        const role = user.role;
        toast.success(`Welcome back ${user.name}!`);
        setTimeout(() => navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard'), 500);
    } catch (error) {
        toast.error(error.message || 'Login failed');
        setErrors({ ...errors, general: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    // Demo login workaround since backend doesn't have hardcoded demo users usually
    // We can simulate a successful login structure directly if backend is not available for demo
    // OR we can actually register/login a demo user.
    // Let's keep the client-side simulation for demo buttons for now to ensure instant access
    // unless you want real backend auth even for demo.
    // For now, let's keep it simple as originally designed for demo.
    const user = {
        _id: 'demo-' + role,
        name: role === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate',
        email: role + '@demo.com',
        role: role,
        company: role === 'recruiter' ? 'Demo Corp' : undefined
    };

    // Need to bypass the API call in AuthContext manually or just set user directly
    // Since AuthContext.login now calls API, we can't use it for fake demo unless we add a bypass
    // Let's modify AuthContext login to accept a 'bypass' flag or handle it here?
    // Actually, let's just use localStorage hack for demo for now, OR update AuthContext
    // Better: Update AuthContext to support "setUser" directly for demo
    // But since I can't easily change AuthContext export signature without breaking other things,
    // I will assume for now we just want API working.
    // I will try to login with real credentials if possible, or just mock it.
    
    // Actually, let's mock the API response for demo buttons by overriding the login function locally? No.
    // Let's just create a real user for demo? No.
    
    // I will add a special check in AuthContext for demo users? No.
    
    // Let's just fake it by manually setting localStorage and reloading?
    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload(); // Quick dirty way to load user from localStorage in AuthContext
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to your TalentFlow account</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <button onClick={() => handleDemoLogin('candidate')} className="py-2 px-3 rounded-lg text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-100 dark:border-blue-800">
          Demo Candidate
        </button>
        <button onClick={() => handleDemoLogin('recruiter')} className="py-2 px-3 rounded-lg text-sm font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-100 dark:border-purple-800">
          Demo Recruiter
        </button>
      </div>

      <div className="flex items-center mb-5">
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        <span className="px-3 text-xs text-gray-400 dark:text-gray-500">or sign in with email</span>
        <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Create account</Link>
      </p>
    </div>
  );
};
