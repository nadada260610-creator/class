import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

// TODO: Import Supabase client and use it
// import { supabase } from '../supabaseClient';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    // Supabase Auth Mock
    setTimeout(() => {
      setMessage('회원가입 요청이 완료되었습니다. (MVP 목업)');
      setLoading(false);
      // setTimeout(() => navigate('/'), 1500);
    }, 1000);
    
    /* 실제 Supabase 연동 시 아래 주석 해제
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) setMessage(error.message);
    else setMessage('가입 완료! 이메일을 확인해주세요.');
    setLoading(false);
    */
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>오서박스 시작하기</h2>
        <p className="subtitle">당신의 놀라운 이야기를 구조화하세요.</p>
        
        <form onSubmit={handleSignup} className="signup-form">
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="author@example.com"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="6자리 이상"
            />
          </div>

          <div className="agreement-group">
            <input 
              type="checkbox" 
              id="security-agree" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)} 
            />
            <label htmlFor="security-agree">
              (필수) 본 서비스는 테스트 버전이며, 데이터 유실에 대해 책임지지 않음을 동의합니다.
            </label>
          </div>

          <button 
            type="submit" 
            className="signup-button" 
            disabled={!agreed || loading}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
          
          {message && <p className="form-message">{message}</p>}
        </form>
        
        <div className="form-footer">
          이미 계정이 있으신가요? <button onClick={() => navigate('/')} className="text-button">에디터로 돌아가기</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
