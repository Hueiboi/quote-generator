import './public/tailwind.css'
import { useState } from 'react'
import RandomQuote from './components/random-quote'
import LoginForm from './components/login-form'
import SignupForm from './components/signup-form'
import ForgotPassword from './components/forgot-form'
import { useAuth } from './context/useAuth'

function App() {
  const { user, logout } = useAuth();
  // authMode: trạng thái để chuyển qua lại giữa màn hình Đăng nhập và Đăng ký
  const [authMode, setAuthMode] = useState<'login'|'signup'|'forgot'>('login');

  // Nếu user đã đăng nhập: hiển thị màn hình RandomQuote + nút Đăng xuất
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-500 dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            Xin chào,{' '}
            <span className="font-semibold">
              {user.name || user.email}
            </span>
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 rounded-md text-sm bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Đăng xuất
          </button>
        </div>

        <RandomQuote />
      </div>
    );
  }

  // Nếu chưa đăng nhập: hiển thị form Đăng nhập / Đăng ký / Quên mật khẩu
  return (
    // auth-container full màn hình + flex center để 3 form luôn nằm giữa trang
    <div className="auth-container min-h-screen flex items-center justify-center">
      {authMode === 'login' && (
        <LoginForm
          onSwitchToSignup={() => setAuthMode('signup')}
          onSwitchToForgot={() => setAuthMode('forgot')}
        />
      )}

      {authMode === 'signup' && (
        <SignupForm
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}

      {authMode === 'forgot' && (
        <ForgotPassword
          onSwitchToLogin={() => setAuthMode('login')}
        />
      )}
    </div>
  );
}

export default App
