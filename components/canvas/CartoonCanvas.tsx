"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#071a0d 0%,#0d3320 50%,#0a2010 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes cf_leaf{
          0%{transform:translateX(0) translateY(-10px) rotate(0deg);opacity:0}
          10%{opacity:.9}
          50%{transform:translateX(12px) translateY(50vh) rotate(180deg)}
          100%{transform:translateX(-8px) translateY(110vh) rotate(360deg);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${3+i*5}%`,top:0,fontSize:`${10+i%5*3}px`,
          animation:`cf_leaf ${3.5+i*0.25}s ease-in-out ${i*0.35}s infinite`,
          color:["#90EE90","#ADFF2F","#FFFF99","#98FB98","#7CFC00","#BAFF72"][i%6],
        }}>🍃</span>
      ))}
    </div>
  );
}

export default function CartoonCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof navigator !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) return;
    const el = mountRef.current;
    if (!el) return;

    let animId = 0;
    let cleanupFn: (() => void) | undefined;

    import("three").then((THREE) => {
      const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
      camera.position.set(0,0,8);

      scene.add(new THREE.AmbientLight(0xfff5c3, 0.7));
      const dir = new THREE.DirectionalLight(0xffd700, 0.9);
      dir.position.set(2,5,3);
      scene.add(dir);

      const count = (navigator.hardwareConcurrency ?? 4) < 4 ? 60 : 120;
      const COLORS = [0x90EE90,0xADFF2F,0xFFFF99,0x98FB98,0x7CFC00,0xBAFF72];

      type Leaf = {
        mesh: THREE.Mesh;
        fallSpeed: number; swayPhase: number;
        tumbleX: number; tumbleY: number; tumbleZ: number;
        gustPhase: number; opPhase: number;
      };
      const leaves: Leaf[] = [];

      for (let i = 0; i < count; i++) {
        const size = 0.08 + Math.random()*0.14;
        const geo  = new THREE.PlaneGeometry(size, size*1.3);
        const mat  = new THREE.MeshStandardMaterial({
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          transparent:true, opacity:0, side:THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random()-0.5)*16,
          (Math.random()-0.5)*16,
          (Math.random()-0.5)*4,
        );
        mesh.rotation.set(
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
        );
        scene.add(mesh);
        leaves.push({
          mesh,
          fallSpeed:  0.004 + Math.random()*0.006,
          swayPhase:  Math.random()*Math.PI*2,
          tumbleX:    (Math.random()-0.5)*0.025,
          tumbleY:    (Math.random()-0.5)*0.01,
          tumbleZ:    (Math.random()-0.5)*0.02,
          gustPhase:  Math.random()*Math.PI*2,
          opPhase:    Math.random()*Math.PI*2,
        });
      }

      /* Gust system */
      let gustMult        = 1.0;
      let gustTarget      = 1.0;
      let gustTimer       = 0;
      const GUST_INTERVAL = 8;

      const clock = new THREE.Clock();

      const onResize = () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (delta > 0.032) return;
        const time = clock.getElapsedTime();

        /* Gust logic */
        gustTimer += delta;
        if (gustTimer >= GUST_INTERVAL) { gustTarget = 3.0; }
        if (gustTimer >= GUST_INTERVAL + 1) { gustTarget = 1.0; }
        if (gustTimer >= GUST_INTERVAL + 3) { gustTimer = 0; }
        gustMult += (gustTarget - gustMult)*0.05;

        camera.position.x = Math.sin(time*0.15)*0.4;

        for (const l of leaves) {
          const mat = l.mesh.material as THREE.MeshStandardMaterial;
          l.mesh.position.y -= l.fallSpeed;
          l.mesh.position.x += Math.sin(time + l.swayPhase)*0.008*gustMult;
          l.mesh.rotation.x += l.tumbleX;
          l.mesh.rotation.y += l.tumbleY;
          l.mesh.rotation.z += l.tumbleZ;

          const targetOp = 0.7 + Math.sin(time + l.opPhase)*0.2;
          mat.opacity += (targetOp - mat.opacity)*0.05;

          if (l.mesh.position.y < -7) {
            l.mesh.position.y = 8;
            l.mesh.position.x = (Math.random()-0.5)*16;
          }
        }
        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        for (const l of leaves) {
          l.mesh.geometry.dispose();
          (l.mesh.material as THREE.MeshStandardMaterial).dispose();
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
      background:"linear-gradient(135deg,#071a0d 0%,#0d3320 50%,#0a2010 100%)",
    }}/>
  );
}
