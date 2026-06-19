import React, { useState } from 'react';
import './SecurityBanner.css';

const SecurityBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="security-banner">
      <div className="banner-content">
        ⚠️ <strong>보안 경고:</strong> 본 서비스는 아직 베타 테스트 중입니다. 중요한 저작물은 반드시 개인 PC에 이중 백업을 권장합니다.
      </div>
      <button className="banner-close" onClick={() => setIsVisible(false)}>
        ✕
      </button>
    </div>
  );
};

export default SecurityBanner;
