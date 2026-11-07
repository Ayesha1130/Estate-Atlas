"use client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

// Interactive Architectural Hotspot in 3D Space
function Hotspot3D({
  position,
  title,
  subtitle,
}: {
  position: [number, number, number];
  title: string;
  subtitle: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Outer pulsing ring */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? "#D4AF37" : "#FFFFFF"}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Html
        distanceFactor={10}
        position={[0, 0.35, 0]}
        center
        className="pointer-events-auto select-none"
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`transition-all duration-300 transform ${
            hovered ? "scale-105 opacity-100" : "scale-95 opacity-85"
          }`}
        >
          <div className="flex items-center gap-2.5 bg-[#0E1513]/90 backdrop-blur-md border border-gold/40 px-3.5 py-2 rounded-2xl shadow-floating-pill whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <div>
              <p className="text-xs font-semibold text-sand-50 tracking-wide font-sans">
                {title}
              </p>
              <p className="text-[10px] text-gold/90 font-medium">{subtitle}</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Camera Mouse Parallax & Scroll Rig
function CameraRig() {
  useFrame(({ camera, pointer }) => {
    // Parallax based on mouse pointer
    const targetX = pointer.x * 1.5;
    const targetY = 3.2 + pointer.y * 0.8;
    const scrollFactor = typeof window !== "undefined" ? Math.min(window.scrollY / 700, 1) : 0;

    camera.position.x += (6 + targetX - scrollFactor * 3 - camera.position.x) * 0.04;
    camera.position.y += (targetY + scrollFactor * 2 - camera.position.y) * 0.04;
    camera.position.z += (7 - scrollFactor * 3 - camera.position.z) * 0.04;
    camera.lookAt(0, 0.4, 0);
  });
  return null;
}

// Procedural Modern Architectural Villa with Cantilevered Pavilions & Water
function ModernVilla() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Subtle architectural ambient rotation
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Foundation / Travertine Podium */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[9, 0.25, 7]} />
        <meshStandardMaterial color="#1A221F" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Infinity Reflecting Water Basin */}
      <mesh position={[1.8, 0.14, 1.6]} receiveShadow>
        <boxGeometry args={[4.2, 0.05, 3]} />
        <meshStandardMaterial
          color="#163832"
          roughness={0.1}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Main Ground Floor Pavilion (Travertine & Cedar) */}
      <mesh position={[-1.6, 0.85, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 1.4, 3.8]} />
        <meshStandardMaterial color="#232C28" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Double Height Floor-to-Ceiling Glass Walls */}
      <mesh position={[-1.6, 0.85, 1.8]}>
        <boxGeometry args={[3.4, 1.3, 0.08]} />
        <meshPhysicalMaterial
          color="#B8E2D8"
          transmission={0.88}
          opacity={0.7}
          transparent
          roughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Warm Interior Illumination Core */}
      <mesh position={[-1.6, 0.85, 0.2]}>
        <boxGeometry args={[2.8, 1.1, 2.8]} />
        <meshStandardMaterial
          color="#F5D7A1"
          emissive="#D4AF37"
          emissiveIntensity={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Cantilevered Upper Master Suite (Floating Structure) */}
      <mesh position={[0.5, 2.05, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.1, 3.2]} />
        <meshStandardMaterial color="#141C19" roughness={0.35} metalness={0.3} />
      </mesh>

      {/* Upper Suite Glass Facade overlooking Infinity Pool */}
      <mesh position={[0.5, 2.05, 1.22]}>
        <boxGeometry args={[4.4, 0.95, 0.08]} />
        <meshPhysicalMaterial
          color="#D2F0E7"
          transmission={0.9}
          opacity={0.65}
          transparent
          roughness={0.05}
        />
      </mesh>

      {/* Roof Slabs & Sleek Black Architectural Overhangs */}
      <mesh position={[0.5, 2.65, -0.4]} castShadow>
        <boxGeometry args={[5.2, 0.12, 3.8]} />
        <meshStandardMaterial color="#0E1412" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh position={[-1.6, 1.6, 0.2]} castShadow>
        <boxGeometry args={[4.2, 0.1, 4.2]} />
        <meshStandardMaterial color="#0E1412" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Cedar Wood Sun Deck alongside Pool */}
      <mesh position={[1.8, 0.15, -0.8]} receiveShadow>
        <boxGeometry args={[4.2, 0.08, 1.8]} />
        <meshStandardMaterial color="#8C6747" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Architectural Column Accents (Dark Bronze) */}
      <mesh position={[3.6, 1.35, 1.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 16]} />
        <meshStandardMaterial color="#C5A880" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[3.6, 1.35, -1.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 16]} />
        <meshStandardMaterial color="#C5A880" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Subtle Floating Architectural Shading Panels */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-3.6, 2.8, 1.8]}>
          <boxGeometry args={[0.05, 1.8, 1.2]} />
          <meshStandardMaterial
            color="#C5A880"
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* 3D Hotspot Markers with HTML Tooltips */}
      <Hotspot3D
        position={[2.2, 0.45, 1.6]}
        title="Heated Infinity Pool"
        subtitle="Italian mosaic & underwater acoustics"
      />

      <Hotspot3D
        position={[-1.2, 1.2, 1.9]}
        title="Grand Double-Height Salon"
        subtitle="Greek Thassos marble & cove lighting"
      />

      <Hotspot3D
        position={[1.5, 2.4, 1.3]}
        title="Master Penthouse Suite"
        subtitle="Cantilevered sky terrace & 270° panorama"
      />
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [6, 3.2, 7], fov: 44 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        {/* Architectural Twilight Lighting */}
        <ambientLight intensity={0.7} color="#D6E8E2" />
        <directionalLight
          position={[8, 12, 6]}
          intensity={2.8}
          color="#FFF0D4"
          castShadow
        />
        <pointLight position={[-4, 3, -2]} intensity={25} color="#C5A880" />
        <pointLight position={[2, 1, 2]} intensity={35} color="#5EEAD4" />

        <CameraRig />
        <ModernVilla />
      </Canvas>
    </div>
  );
}
