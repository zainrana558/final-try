"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

/* ─── Mobile CSS fallback ─────────────────────────────────── */
function MobileFallback() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#1a0a14 0%,#3d0a2e 50%,#1a0014 100%)",overflow:"hidden" }}>
      <style>{`
        @keyframes af_petal{
          0%{transform:translateY(-20px) rotate(0deg);opacity:0}
          10%{opacity:.9}90%{opacity:.7}
          100%{transform:translateY(110vh) rotate(360deg);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${5+i*4.5}%`,top:0,fontSize:`${10+Math.random()*12}px`,
          animation:`af_petal ${3+i*0.3}s linear ${i*0.4}s infinite`,
          color:["#ff9ec4","#ffb3c6","#ffc8d4","#ff6b9d"][i%4],
        }}>🌸</span>
      ))}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
export default function AnimeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const el = mountRef.current;
    if (!el) return;

    let animId = 0;
    let cleanupFn: (() => void) | undefined;

    import("three").then((THREE) => {
      /* Renderer */
      const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      /* Scene + Camera */
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 8);

      /* Lights — max 2 point lights; using Ambient + Directional */
      scene.add(new THREE.AmbientLight(0xff9ec4, 0.4));
      const dir = new THREE.DirectionalLight(0xffd0e8, 0.6);
      dir.position.set(3,5,2);
      scene.add(dir);

      /* Count: halve on low-end hardware */
      const count = (navigator.hardwareConcurrency ?? 4) < 4 ? 75 : 150;
      const COLORS = [0xff9ec4, 0xffb3c6, 0xffc8d4, 0xff6b9d];

      type Petal = {
        mesh: THREE.Mesh;
        fallSpeed: number; swayPhase: number; swayAmp: number;
        rotX: number; rotZ: number; swayPhaseOp: number;
      };
      const petals: Petal[] = [];

      for (let i = 0; i < count; i++) {
        const size = 0.06 + Math.random() * 0.14;
        const geo  = new THREE.PlaneGeometry(size, size);
        const mat  = new THREE.MeshStandardMaterial({
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          transparent: true, opacity: 0, side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random()-0.5)*16,
          (Math.random()-0.5)*18,
          -3 + Math.random()*4,       // parallax z
        );
        mesh.rotation.set(
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
        );
        scene.add(mesh);
        petals.push({
          mesh,
          fallSpeed:  0.006 + Math.random()*0.008,
          swayPhase:  Math.random()*Math.PI*2,
          swayAmp:    0.008 + Math.random()*0.015,
          rotX:       (Math.random()-0.5)*0.02,
          rotZ:       (Math.random()-0.5)*0.015,
          swayPhaseOp:Math.random()*Math.PI*2,
        });
      }

      const clock = new THREE.Clock();

      const onResize = () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      /* Animate */
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (delta > 0.032) return;          // FPS cap: skip frame if too slow
        const time = clock.getElapsedTime();

        camera.position.y = Math.sin(time*0.25)*0.15; // idle float

        for (const p of petals) {
          const mat = p.mesh.material as THREE.MeshStandardMaterial;
          p.mesh.position.y -= p.fallSpeed;
          p.mesh.position.x += Math.sin(time + p.swayPhase)*p.swayAmp;
          p.mesh.rotation.x += p.rotX;
          p.mesh.rotation.z += p.rotZ;

          const targetOp = 0.6 + Math.sin(time*0.5 + p.swayPhaseOp)*0.3;
          mat.opacity += (targetOp - mat.opacity)*0.05;   // opacity lerp

          if (p.mesh.position.y < -8) {
            p.mesh.position.y = 10;
            p.mesh.position.x = (Math.random()-0.5)*16;
          }
        }
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        for (const p of petals) {
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.MeshStandardMaterial).dispose();
        }
        renderer.dispose();
        scene.clear();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    });

    return () => { cleanupFn?.(); cancelAnimationFrame(animId); };
  }, [isMobile]);

  if (isMobile) return <MobileFallback />;

  return (
    <div ref={mountRef} style={{
      position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#1a0a14 0%,#3d0a2e 50%,#1a0014 100%)",
    }}/>
  );
}
