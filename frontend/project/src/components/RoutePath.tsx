import { useEffect, useId, useRef, useState } from 'react';
import type { LearningPath } from '../types';

type NodeState = 'completed' | 'current' | 'pending';

interface RouteNode {
  id: string;
  title: string;
  progress: number;
  state: NodeState;
  x: number;
  y: number;
}

const NODE_R = 7;
const VIEW_W = 1000;
const ROW_H = 92;

function buildNodes(path: LearningPath): RouteNode[] {
  const n = path.topics.length;
  return path.topics.map((t, i) => {
    const allDone = t.subtopics.length > 0 && t.subtopics.every((s) => s.status === 'completed');
    const anyDone = t.subtopics.some((s) => s.status === 'completed');
    let state: NodeState = 'pending';
    if (allDone || t.progress >= 100) state = 'completed';
    else if (anyDone || t.progress > 0) state = 'current';
    const x = ((i + 0.5) / n) * VIEW_W;
    const y = ROW_H * (i + 1);
    return { id: t.topic_id, title: t.title, progress: t.progress, state, x, y };
  });
}

function curvePath(a: RouteNode, b: RouteNode): string {
  const dx = b.x - a.x;
  const midX = a.x + dx * 0.5;
  const c1x = a.x + dx * 0.25;
  const c1y = a.y;
  const c2x = a.x + dx * 0.75;
  const c2y = b.y;
  void midX;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
}

export function RoutePath({ path }: { path: LearningPath }) {
  const nodes = buildNodes(path);
  const gradId = useId();
  const pathRefs = useRef<SVGPathElement[]>([]);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    setDrawn(false);
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [path.learning_path_id]);

  const height = ROW_H * (nodes.length + 1) + 24;

  return (
    <div className="relative w-full overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        className="w-full"
        style={{ minWidth: 560 }}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2F5D50" />
            <stop offset="100%" stopColor="#4A7C6A" />
          </linearGradient>
        </defs>

        {/* connecting path segments */}
        {nodes.slice(0, -1).map((node, i) => {
          const next = nodes[i + 1];
          const d = curvePath(node, next);
          return (
            <path
              key={`seg-${node.id}`}
              ref={(el) => {
                if (el) pathRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth={2}
              strokeDasharray="6 7"
              strokeLinecap="round"
              style={{
                strokeDashoffset: drawn ? 0 : 1400,
                transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: `${i * 120}ms`,
              }}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((node, i) => (
          <g
            key={node.id}
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
              transitionDelay: `${i * 120 + 200}ms`,
            }}
          >
            {/* pulsing ring for current node */}
            {node.state === 'current' && (
              <circle cx={node.x} cy={node.y} r={NODE_R} fill="none" stroke="#D9756A" strokeWidth={2} style={{ transformOrigin: `${node.x}px ${node.y}px` }} className="animate-pulse-ring" />
            )}

            {/* node dot */}
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_R}
              fill={node.state === 'completed' ? '#C99A3B' : node.state === 'current' ? '#D9756A' : '#FBFAFD'}
              stroke={node.state === 'pending' ? '#C3BDD0' : node.state === 'current' ? '#D9756A' : '#C99A3B'}
              strokeWidth={node.state === 'pending' ? 2 : 2.5}
            />

            {/* label */}
            <text
              x={node.x}
              y={node.y - 16}
              textAnchor="middle"
              className="font-sans"
              fontSize={15}
              fill={node.state === 'current' ? '#241F2E' : '#36304A'}
              fontWeight={node.state === 'current' ? 600 : 500}
            >
              {node.title.length > 26 ? `${node.title.slice(0, 24)}…` : node.title}
            </text>
            <text
              x={node.x}
              y={node.y + 22}
              textAnchor="middle"
              className="font-mono"
              fontSize={12}
              fill="#736C82"
              letterSpacing="0.04em"
            >
              {node.progress}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
