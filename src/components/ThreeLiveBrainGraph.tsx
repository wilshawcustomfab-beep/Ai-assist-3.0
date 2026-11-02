import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Network, 
  RotateCw, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Maximize2, 
  Layers, 
  Cpu, 
  Camera, 
  RefreshCw,
  Info,
  Search
} from 'lucide-react';
import { OpportunityItem } from '../types';

interface GraphNodeData {
  id: string;
  name: string;
  category: 'lead' | 'specialist' | 'knowledge' | 'sensor';
  role: string;
  color: string;
  position: [number, number, number];
  connections: string[];
  throughput: string;
  latency: string;
  activeOpportunities: string[];
}

const graphNodes: GraphNodeData[] = [
  {
    id: 'node-cindy',
    name: 'Cindy (Lead Brain)',
    category: 'lead',
    role: 'Primary Multi-Harness Orchestrator ("Consider it done")',
    color: '#f43f5e', // Vibrant Rose
    position: [0, 0, 0],
    connections: ['atlas', 'cipher', 'vigil', 'argus', 'archivist', 'engineer', 'strategist', 'solon', 'node-agentdb', 'node-adr322a', 'node-motion', 'node-vision'],
    throughput: '42.8 ops/sec',
    latency: '1.2ms',
    activeOpportunities: [
      'Multi-Harness Dynamic Swapping (RuFlo ↔ Claude Code)',
      'Visual Whiteboard / Screen Synthesis from Camera Feed'
    ]
  },
  {
    id: 'atlas',
    name: 'Atlas (Research)',
    category: 'specialist',
    role: 'Authoritative Data Retrieval & Multi-Source Synthesis',
    color: '#06b6d4', // Cyan
    position: [-6, 3, 2],
    connections: ['node-cindy', 'archivist', 'strategist', 'node-vision'],
    throughput: '18.4 ops/sec',
    latency: '2.4ms',
    activeOpportunities: ['Multi-Source Technical Triangulation']
  },
  {
    id: 'cipher',
    name: 'Cipher (Engineering)',
    category: 'specialist',
    role: 'Autonomous Full-Stack TypeScript / Rust Synthesis',
    color: '#10b981', // Emerald
    position: [6, 2, -3],
    connections: ['node-cindy', 'argus', 'engineer', 'node-motion'],
    throughput: '34.2 ops/sec',
    latency: '1.8ms',
    activeOpportunities: ['Deterministic 15s UI-Morph Motion Reel Compilation']
  },
  {
    id: 'vigil',
    name: 'Vigil (AI Defense)',
    category: 'specialist',
    role: 'ADR-322A Sentinel, PII Redaction & Invariant Gates',
    color: '#e11d48', // Deep Rose/Red
    position: [-4, -4, 4],
    connections: ['node-cindy', 'solon', 'node-adr322a'],
    throughput: '56.1 checks/sec',
    latency: '0.9ms',
    activeOpportunities: ['ADR-322A Single-Writer Worktree Enforcement']
  },
  {
    id: 'argus',
    name: 'Argus (QA & Tests)',
    category: 'specialist',
    role: 'Boundary Testing, Fuzzing & Regression Coverage',
    color: '#f97316', // Orange
    position: [5, -3, 4],
    connections: ['node-cindy', 'cipher', 'solon'],
    throughput: '22.0 assertions/sec',
    latency: '3.1ms',
    activeOpportunities: ['Property-Based Invariant Verification Suite']
  },
  {
    id: 'archivist',
    name: 'Archivist (Memory)',
    category: 'specialist',
    role: 'AgentDB Vector Memory & Semantic Ontology Mapping',
    color: '#a855f7', // Purple
    position: [0, 6, -2],
    connections: ['node-cindy', 'atlas', 'node-agentdb'],
    throughput: '64.0 recalls/sec',
    latency: '1.1ms',
    activeOpportunities: ['AgentDB Vector Recall Threshold Optimization (>0.70)']
  },
  {
    id: 'engineer',
    name: 'Engineer (Builds)',
    category: 'specialist',
    role: 'Package Hygiene, Diagnostics & Execution Sandboxes',
    color: '#3b82f6', // Blue
    position: [-5, 1, -5],
    connections: ['node-cindy', 'cipher', 'node-tools'],
    throughput: '12.5 builds/sec',
    latency: '4.2ms',
    activeOpportunities: ['Node Runtime Diagnostic Optimization']
  },
  {
    id: 'strategist',
    name: 'Strategist (Planning)',
    category: 'specialist',
    role: 'DAG Formulation, Trade-offs & ADR Proposal',
    color: '#6366f1', // Indigo
    position: [4, 4, 3],
    connections: ['node-cindy', 'atlas', 'solon'],
    throughput: '15.8 plans/sec',
    latency: '2.8ms',
    activeOpportunities: ['Cost-Benefit Execution Budget Routing']
  },
  {
    id: 'solon',
    name: 'Solon (Consensus)',
    category: 'specialist',
    role: 'Byzantine Fault-Tolerant Voting & Cryptographic Signing',
    color: '#eab308', // Amber
    position: [0, -6, 1],
    connections: ['node-cindy', 'vigil', 'argus', 'strategist', 'node-adr322a'],
    throughput: '28.0 votes/sec',
    latency: '1.4ms',
    activeOpportunities: ['8/8 Unanimous Quorum Release Gate Signing']
  },
  {
    id: 'node-agentdb',
    name: 'AgentDB Vector Store',
    category: 'knowledge',
    role: 'HNSW Crystallized Pattern Memory & Vector RAG',
    color: '#c084fc', // Light Purple
    position: [-3, 7, -4],
    connections: ['archivist', 'node-cindy'],
    throughput: '5 patterns indexed',
    latency: '0.8ms',
    activeOpportunities: ['Consensus Pattern Auto-Crystallization']
  },
  {
    id: 'node-adr322a',
    name: 'ADR-322A Safety Invariant',
    category: 'knowledge',
    role: 'Single-Writer Worktree Isolation Policy Boundary',
    color: '#fb7185', // Rose
    position: [-7, -3, 2],
    connections: ['vigil', 'solon', 'node-cindy'],
    throughput: '100% compliant',
    latency: '0.1ms',
    activeOpportunities: ['Monotonic Tool Permission Check']
  },
  {
    id: 'node-motion',
    name: 'Deterministic Motion Studio',
    category: 'knowledge',
    role: 'seek(t) 60fps Springs & -14 LUFS Beat Grid Engine',
    color: '#38bdf8', // Sky Blue
    position: [7, 5, -2],
    connections: ['cipher', 'node-cindy'],
    throughput: '60 fps / 900 frames',
    latency: '16.6ms',
    activeOpportunities: ['Automated Frame Critique Loop Audit (9.2/10)']
  },
  {
    id: 'node-vision',
    name: 'Surroundings Optical Sensor',
    category: 'sensor',
    role: 'Live Front/Back Camera Visual Perception & Room Context',
    color: '#f43f5e', // Rose
    position: [-6, 5, 4],
    connections: ['node-cindy', 'atlas'],
    throughput: '30 fps optical feed',
    latency: '45ms',
    activeOpportunities: ['Real-Time Workspace Context & Whiteboard OCR']
  },
  {
    id: 'node-tools',
    name: 'Tool Connectors Sandbox',
    category: 'knowledge',
    role: 'Verified External APIs, Code Evaluator & System Tools',
    color: '#34d399', // Mint
    position: [-7, 2, -3],
    connections: ['engineer', 'node-cindy'],
    throughput: '5 tools registered',
    latency: '1.2ms',
    activeOpportunities: ['Sandboxed JS/TS Algorithm Evaluation']
  }
];

interface ThreeLiveBrainGraphProps {
  onDispatchOpportunity?: (action: string) => void;
  onOpenVisionHub?: () => void;
}

export const ThreeLiveBrainGraph: React.FC<ThreeLiveBrainGraphProps> = ({
  onDispatchOpportunity,
  onOpenVisionHub
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData>(graphNodes[0]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<boolean>(autoRotate);
  autoRotateRef.current = autoRotate;
  const [isLoadingOpp, setIsLoadingOpp] = useState<boolean>(false);

  // Fetch opportunities from backend
  const fetchOpportunities = async () => {
    setIsLoadingOpp(true);
    try {
      const res = await fetch('/api/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (e) {
      console.warn('Failed to load live opportunities:', e);
    } finally {
      setIsLoadingOpp(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Three.js Interactive 3D Live Brain Graph
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 1);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfb7185, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const blueDirLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    blueDirLight.position.set(-10, -10, -10);
    scene.add(blueDirLight);

    // 3. Background Cyber Particle Stars Field
    const starCount = 350;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x475569,
      size: 0.15,
      transparent: true,
      opacity: 0.6
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Graph Group for Rotation
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // 5. Node Meshes Map
    const nodeMeshes: { [id: string]: THREE.Mesh } = {};
    const clickableObjects: THREE.Object3D[] = [];

    graphNodes.forEach((node) => {
      const isLead = node.id === 'node-cindy';
      const radius = isLead ? 1.4 : node.category === 'specialist' ? 0.85 : 0.65;

      const geometry = new THREE.SphereGeometry(radius, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: isLead ? 0.8 : 0.45,
        roughness: 0.2,
        metalness: 0.8
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = { nodeData: node };

      // Orbiting wireframe rings for the Cindy Lead Brain
      if (isLead) {
        const ringGeo = new THREE.TorusGeometry(2.2, 0.04, 16, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true, transparent: true, opacity: 0.7 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        mesh.add(ringMesh);

        const ringGeo2 = new THREE.TorusGeometry(2.6, 0.03, 16, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.5 });
        const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
        ringMesh2.rotation.y = Math.PI / 4;
        mesh.add(ringMesh2);
      }

      graphGroup.add(mesh);
      nodeMeshes[node.id] = mesh;
      clickableObjects.push(mesh);
    });

    // 6. Connecting Synaptic Edges Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const linePoints: THREE.Vector3[] = [];
    const edgePairs: Array<[THREE.Vector3, THREE.Vector3]> = [];

    graphNodes.forEach((node) => {
      const fromMesh = nodeMeshes[node.id];
      if (!fromMesh) return;

      node.connections.forEach((targetId) => {
        const toMesh = nodeMeshes[targetId];
        if (toMesh) {
          linePoints.push(fromMesh.position);
          linePoints.push(toMesh.position);
          edgePairs.push([fromMesh.position, toMesh.position]);
        }
      });
    });

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    graphGroup.add(lineSegments);

    // 7. Dynamic Animated Synaptic Packets (Traveling Sparks along edges)
    const packetCount = 45;
    const packetGeometry = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetProgress = new Float32Array(packetCount);
    const packetEdgeIndex = new Int32Array(packetCount);

    for (let p = 0; p < packetCount; p++) {
      packetProgress[p] = Math.random();
      packetEdgeIndex[p] = Math.floor(Math.random() * edgePairs.length);
    }

    packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMaterial = new THREE.PointsMaterial({
      color: 0xfb7185,
      size: 0.35,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const packetSystem = new THREE.Points(packetGeometry, packetMaterial);
    graphGroup.add(packetSystem);

    // 8. Mouse Orbit Controls (Smooth Drag to Rotate & Zoom)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotVelocity = { x: 0, y: 0.003 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      graphGroup.rotation.y += deltaX * 0.006;
      graphGroup.rotation.x += deltaY * 0.006;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.min(28, Math.max(8, camera.position.z + e.deltaY * 0.015));
    };

    // Raycasting Node Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.nodeData) {
          setSelectedNode(hit.userData.nodeData);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    // 9. Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Auto-rotation when idle
      if (autoRotateRef.current && !isDragging) {
        graphGroup.rotation.y += 0.004;
      }

      // Cindy Core Orbit Rings Rotation
      const cindyMesh = nodeMeshes['node-cindy'];
      if (cindyMesh && cindyMesh.children.length >= 2) {
        cindyMesh.children[0].rotation.z += 0.02;
        cindyMesh.children[1].rotation.x += 0.015;
      }

      // Animate Synaptic Packet Positions
      if (edgePairs.length > 0) {
        const posAttr = packetGeometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        for (let p = 0; p < packetCount; p++) {
          packetProgress[p] += delta * 0.75;
          if (packetProgress[p] >= 1.0) {
            packetProgress[p] = 0;
            packetEdgeIndex[p] = Math.floor(Math.random() * edgePairs.length);
          }

          const edge = edgePairs[packetEdgeIndex[p]];
          if (edge) {
            const start = edge[0];
            const end = edge[1];
            const prog = packetProgress[p];

            posArray[p * 3] = start.x + (end.x - start.x) * prog;
            posArray[p * 3 + 1] = start.y + (end.y - start.y) * prog;
            posArray[p * 3 + 2] = start.z + (end.z - start.z) * prog;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                3D Live Brains & Knowledge Mesh
              </h2>
              <span className="text-xs text-rose-400 font-mono">NEURAL TOPOLOGY</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time interactive 3D visualization of Cindy's 9 specialist brains, AgentDB memory, ADR-322A invariants, and camera vision sensor communicating live.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                autoRotate
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Auto-Orbit On' : 'Orbit Paused'}</span>
            </button>

            {onOpenVisionHub && (
              <button
                onClick={onOpenVisionHub}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-rose-400" />
                <span>Camera Hub</span>
              </button>
            )}
          </div>
        </div>

        {/* Legend pills */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-3 flex-wrap text-xs font-mono">
          <span className="text-slate-500">Nodes:</span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Cindy Lead
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            9 Specialist Brains
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            AgentDB Memory
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            ADR Invariants
          </span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            seek(t) Motion Studio
          </span>
        </div>
      </div>

      {/* Main Grid: 3D Viewport + Node Inspector & Live Opportunity Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D WebGL Canvas Viewport */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div ref={mountRef} className="w-full h-[540px] cursor-grab active:cursor-grabbing block"></div>

          {/* Interactive Controls Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Click node to inspect</span>
            <span className="text-slate-600">·</span>
            <span>Drag to rotate 3D</span>
            <span className="text-slate-600">·</span>
            <span>Scroll to zoom</span>
          </div>

          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Synaptic Throughput: Active</span>
          </div>
        </div>

        {/* Right Column: Node Details & Opportunity Radar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Node Telemetry HUD */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                  Node Telemetry HUD
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.name}</h3>
              </div>
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: selectedNode.color }}
              ></span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800">
              {selectedNode.role}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Throughput:</span>
                <strong className="text-slate-200">{selectedNode.throughput}</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Synaptic Latency:</span>
                <strong className="text-emerald-400">{selectedNode.latency}</strong>
              </div>
            </div>

            {/* Connected Peers list */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">
                Active Peer Connections ({selectedNode.connections.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedNode.connections.map((cId) => (
                  <span
                    key={cId}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {cId}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Opportunity Radar */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Opportunity Radar</h3>
              </div>
              <button
                onClick={fetchOpportunities}
                disabled={isLoadingOpp}
                className="text-slate-400 hover:text-slate-200 p-1"
                title="Refresh Opportunities"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOpp ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-amber-300">{opp.title}</h4>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {opp.impact}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {opp.description}
                  </p>

                  {onDispatchOpportunity && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onDispatchOpportunity(opp.actionableStep)}
                        className="text-[10px] font-medium text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-800/80 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                      >
                        <span>{opp.actionableStep}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
