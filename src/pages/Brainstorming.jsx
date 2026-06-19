import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './Brainstorming.css';
import EditableNode from './EditableNode';

const nodeTypes = { custom: EditableNode };

let id = 2;
const getId = () => `node_${id++}`;

export default function Brainstorming() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 초기 상태 설정
  React.useEffect(() => {
    setNodes([
      {
        id: 'node_1',
        type: 'custom',
        position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 },
        data: { label: '메인 아이디어', onChange: (lbl) => updateNodeLabel('node_1', lbl) },
      }
    ]);
  }, []);

  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          n.data = { ...n.data, label: newLabel };
        }
        return n;
      })
    );
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeDoubleClick = useCallback((event, node) => {
    event.preventDefault();

    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: {
        x: node.position.x + (Math.random() * 200 - 100), // 약간 랜덤한 위치에 생성
        y: node.position.y + 150,
      },
      data: { 
        label: '', 
        onChange: (lbl) => updateNodeLabel(newNodeId, lbl) 
      },
    };
    
    const newEdge = {
      id: `e-${node.id}-${newNodeId}`,
      source: node.id,
      target: newNodeId,
    };

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) => eds.concat(newEdge));
  }, [setNodes, setEdges, updateNodeLabel]);

  return (
    <div className="brainstorming-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
