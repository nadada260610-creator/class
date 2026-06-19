import { create } from 'zustand';

// ─── 설정 ────────────────────────────────────────────────────────────────────
// 로컬: vite.config.js의 proxy를 통해 localhost:3001로 전달
// Vercel: 같은 도메인의 /api/* Serverless Function으로 직접 라우팅
const BACKEND_URL = '';
const SYNC_DEBOUNCE_MS = 3000; // 3초 디바운스

let syncTimer = null;

// ─── Helper: 재귀적으로 씬 번호를 재할당하는 함수 ───────────────────────────
const assignSceneNumbers = (nodes, currentNumber = 1) => {
  let nextNumber = currentNumber;
  const updatedNodes = nodes.map(node => {
    if (node.type === 'scene') {
      const updatedScene = { ...node, scene_number: nextNumber };
      nextNumber++;
      return updatedScene;
    }
    
    if (node.children && node.children.length > 0) {
      const { updatedNodes: updatedChildren, nextNumber: afterChildren } = assignSceneNumbers(node.children, nextNumber);
      nextNumber = afterChildren;
      return { ...node, children: updatedChildren };
    }
    
    return node;
  });
  
  return { updatedNodes, nextNumber };
};

// ─── Helper: 구글 시트 동기화 (디바운스 처리) ────────────────────────────────
const scheduleSync = (project) => {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/save-to-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`📊 구글 시트 저장 완료: ${data.rowsSaved}개 씬, ${data.timestamp}`);
    } catch (err) {
      // 서버가 꺼져 있어도 에디터 사용에 영향 없도록 조용히 처리
      console.warn('⚠️ 구글 시트 자동 저장 실패 (서버 연결 확인):', err.message);
    }
  }, SYNC_DEBOUNCE_MS);
};

// ─── 기본 목업 데이터 (초기 상태) ────────────────────────────────────────────
const initialProjectState = {
  project_id: 'proj_01',
  title: '새 드라마 프로젝트',
  nodes: [
    {
      id: 'node_root_01',
      type: 'folder',
      title: '제 1부',
      children: [
        {
          id: 'node_seq_01',
          type: 'sequence',
          title: '오프닝 시퀀스',
          children: [
            {
              id: 'node_scene_01',
              type: 'scene',
              scene_number: 1,
              summary: '주인공이 운명적인 사건을 마주하는 씬',
              content: 'S# 1. 카페 (낮)\n\n지문이 들어갑니다...'
            }
          ]
        }
      ]
    }
  ]
};

// ─── Zustand 스토어 ───────────────────────────────────────────────────────────
const useProjectStore = create((set, get) => ({
  project: initialProjectState,
  
  // 동기화 상태 표시용
  syncStatus: 'idle', // 'idle' | 'syncing' | 'saved' | 'error'

  // 노드 트리 전체 교체 (드래그 앤 드롭 등 순서 변경 시 사용)
  setNodes: (newNodes) => {
    set((state) => {
      const { updatedNodes } = assignSceneNumbers(newNodes);
      const updatedProject = {
        ...state.project,
        nodes: updatedNodes
      };
      scheduleSync(updatedProject);
      return { project: updatedProject, syncStatus: 'syncing' };
    });
  },
  
  // 수동 씬 재정렬 호출 함수
  reorderScenes: () => {
    set((state) => {
      const { updatedNodes } = assignSceneNumbers(state.project.nodes);
      const updatedProject = {
        ...state.project,
        nodes: updatedNodes
      };
      scheduleSync(updatedProject);
      return { project: updatedProject, syncStatus: 'syncing' };
    });
  },

  // 프로젝트 제목 업데이트
  updateProjectTitle: (title) => {
    set((state) => {
      const updatedProject = { ...state.project, title };
      scheduleSync(updatedProject);
      return { project: updatedProject, syncStatus: 'syncing' };
    });
  },

  // 씬 내용 업데이트 (에디터에서 호출)
  updateSceneContent: (sceneId, content) => {
    set((state) => {
      const updateNode = (nodes) =>
        nodes.map((node) => {
          if (node.id === sceneId) return { ...node, content };
          if (node.children) return { ...node, children: updateNode(node.children) };
          return node;
        });
      const updatedProject = {
        ...state.project,
        nodes: updateNode(state.project.nodes),
      };
      scheduleSync(updatedProject);
      return { project: updatedProject, syncStatus: 'syncing' };
    });
  },

  // 즉시 강제 동기화 (수동 저장 버튼용)
  forceSyncToSheet: async () => {
    if (syncTimer) clearTimeout(syncTimer);
    const { project } = get();
    set({ syncStatus: 'syncing' });
    try {
      const res = await fetch(`${BACKEND_URL}/api/save-to-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      set({ syncStatus: 'saved' });
      console.log(`📊 강제 저장 완료: ${data.rowsSaved}개 씬`);
      setTimeout(() => set({ syncStatus: 'idle' }), 2000);
    } catch (err) {
      set({ syncStatus: 'error' });
      console.error('❌ 강제 저장 실패:', err.message);
      setTimeout(() => set({ syncStatus: 'idle' }), 3000);
    }
  },
}));

export default useProjectStore;
