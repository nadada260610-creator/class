import React from 'react';
import useProjectStore from '../../store/projectStore';
import ScenarioEditor from './ScenarioEditor';
import MemoEditor from './MemoEditor';

// 트리 구조에서 특정 ID를 가진 노드를 재귀적으로 찾는 헬퍼 함수
const findNodeById = (nodes, id) => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const MainEditorView = () => {
  const { project, selectedNodeId } = useProjectStore();

  let selectedNode = null;
  if (selectedNodeId) {
    selectedNode = findNodeById(project.nodes, selectedNodeId);
  }

  // 선택된 노드가 없거나 씬인 경우 대본 에디터 렌더링
  if (!selectedNode || selectedNode.type === 'scene') {
    return <ScenarioEditor node={selectedNode} />;
  }

  // 폴더나 시퀀스인 경우 메모장 렌더링
  return <MemoEditor node={selectedNode} />;
};

export default MainEditorView;
