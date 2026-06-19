import React from 'react';
import useProjectStore from '../store/projectStore';
import './SyncBadge.css';

const STATUS_CONFIG = {
  idle:    { icon: '📊', label: '시트 연동' },
  syncing: { icon: '⟳',  label: '저장 중...' },
  saved:   { icon: '✓',  label: '저장됨' },
  error:   { icon: '⚠',  label: '저장 실패' },
};

export default function SyncBadge() {
  const { syncStatus, forceSyncToSheet } = useProjectStore();
  const { icon, label } = STATUS_CONFIG[syncStatus] || STATUS_CONFIG.idle;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className={`sync-badge ${syncStatus}`} title="구글 시트 자동 저장 상태">
        <span className="sync-dot" />
        <span>{icon} {label}</span>
      </div>
      <button
        id="btn-force-save"
        className="btn-save-sheet"
        onClick={forceSyncToSheet}
        title="지금 즉시 구글 시트에 저장 (Ctrl+S 대용)"
      >
        📤 수동 저장
      </button>
    </div>
  );
}
