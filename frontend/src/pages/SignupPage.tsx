import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。');
      return;
    }
    const result = await signup(id, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/characters');
  };

  return (
    <div className="flex flex-col h-screen bg-[#111111] text-gray-300 font-sans">
      <PageHeader title="新規登録" />
      <main className="flex-1 flex items-start justify-center p-4 lg:p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-[#1a1a1a] border border-gray-800 rounded-md p-6 space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-[#333333] border-none rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#333333] border-none rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">パスワード（確認）</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full bg-[#333333] border-none rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e74c3c]"
              required
            />
          </div>

          {error && <div className="text-xs text-[#e74c3c]">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#e74c3c] hover:bg-[#c0392b] transition-colors text-white font-bold rounded py-2"
          >
            登録する
          </button>

          <div className="text-xs text-gray-500 text-center">
            既にアカウントをお持ちの方は{' '}
            <Link to="/login" className="text-[#e74c3c] underline">
              ログイン
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SignupPage;
