import React, { useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Brainstorming.css';

const initialNodes = [
  { id: 'root', position: { x: 400, y: 300 }, data: { label: '메인 아이디어' } },
];

const initialEdges = [];

let id = 1;
const getId = () => `node_${id++}`;

export default function Brainstorming() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeLabel, setNewNodeLabel] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 100,
      },
      data: { label: newNodeLabel },
    };
    
    // 기본적으로 root 노드와 연결 (원하면 선택된 노드와 연결하도록 고도화 가능)
    const newEdge = {
      id: `e-root-${newNodeId}`,
      source: 'root',
      target: newNodeId,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
    setNewNodeLabel('');
  };

  return (
    <div className="brainstorming-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Panel position="top-right" className="brainstorming-panel">
          <input 
            type="text" 
            placeholder="아이디어 입력..." 
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNode()}
          />
          <button onClick={addNode}>추가</button>
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
