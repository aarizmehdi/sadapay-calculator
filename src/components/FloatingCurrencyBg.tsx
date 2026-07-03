'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const COUNT = 12;

function FloatingSymbol({ position, symbol, color, speed, delay }: {
  position: [number, number, number];
  symbol: string;
  color: string;
  speed: number;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = position[1];
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + delay;
    // Float up and down
    ref.current.position.y = startY + Math.sin(t) * 0.8;
    // Slow rotation
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    ref.current.rotation.z = Math.cos(t * 0.4) * 0.2;
    // Subtle scale pulse
    const pulse = 1 + Math.sin(t * 0.5) * 0.05;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.6}
      color={color}
      anchorX="center"
      anchorY="middle"
      renderOrder={1}
    >
      {symbol}
    </Text>
  );
}

function CurrencyScene() {
  const items = useMemo(() => {
    const result: { position: [number, number, number]; symbol: string; color: string; speed: number; delay: number }[] = [];
    const symbols = [
      { char: '$', color: '#22c55e' },
      { char: '₨', color: '#06b6d4' },
      { char: '$', color: '#3b82f6' },
      { char: '₨', color: '#8b5cf6' },
    ];
    
    for (let i = 0; i < COUNT; i++) {
      const s = symbols[i % symbols.length];
      const angle = (i / COUNT) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 2;
      result.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 3,
          Math.sin(angle) * radius - 1,
        ],
        symbol: s.char,
        color: s.color,
        speed: 0.3 + Math.random() * 0.4,
        delay: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {items.map((item, i) => (
        <FloatingSymbol key={i} {...item} />
      ))}
    </group>
  );
}

export default function FloatingCurrencyBg() {
  return (
    <div className="fixed inset-0 z-0" style={{ background: 'linear-gradient(135deg, #072333 0%, #0a2e42 50%, #0d3a52 100%)' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -3, 2]} intensity={0.4} color="#06b6d4" />
        <CurrencyScene />
      </Canvas>
    </div>
  );
}
