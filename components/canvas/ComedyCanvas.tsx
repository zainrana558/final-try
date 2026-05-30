"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#1a1200 0%,#332400 50%,#1a1200 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes cm_confetti{
          0%{transform:translateY(-10px) rotate(0deg);opacity:0}
          10%{opacity:1}
          100%{transform:translateY(110vh) rotate(720deg);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${3+i*5}%`,top:0,
          fontSize:`${8+i%4*3}px`,
          animation:`cm_confetti ${2.5+i*0.2}s linear ${i*0.3}s infinite`,
          color:["#facc15","#fb923c","#f472b6","#34d399","#60a5fa"][i%5],
        }}>{["🎉","😂","🎊","✨","🎈"][i%5]}</span>
      ))}
    </div>
  );
}

export default function ComedyCanvas() {
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

      scene.add(new THREE.AmbientLight(0xfff5c3, 0.6));
      const spotLight = new THREE.PointLight(0xfacc15, 1.0, 40);
      spotLight.position.set(0,3,4);
      scene.add(spotLight);

      const count = (navigator.hardwareConcurrency ?? 4) < 4 ? 75 : 150;
      const COLORS = [0xfacc15,0xfb923c,0xf472b6,0x34d399,0x60a5fa,0xa78bfa];

      /* Confetti — PlaneGeometry pieces */
      type Piece = {
        mesh: THREE.Mesh;
        fallSpeed: number; swayPhase: number; swayAmp: number;
        rotX: number; rotY: number; rotZ: number; opPhase: number;
      };
      const pieces: Piece[] = [];

      for (let i = 0; i < count; i++) {
        const w   = 0.08 + Math.random()*0.12;
        const h   = 0.05 + Math.random()*0.08;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          transparent:true, opacity:0, side:THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random()-0.5)*16,
          (Math.random()-0.5)*18,
          (Math.random()-0.5)*4,
        );
        mesh.rotation.set(
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
          Math.random()*Math.PI*2,
        );
        scene.add(mesh);
        pieces.push({
          mesh,
          fallSpeed:  0.007 + Math.random()*0.01,
          swayPhase:  Math.random()*Math.PI*2,
          swayAmp:    0.008 + Math.random()*0.015,
          rotX:       (Math.random()-0.5)*0.03,
          rotY:       (Math.random()-0.5)*0.02,
          rotZ:       (Math.random()-0.5)*0.04,
          opPhase:    Math.random()*Math.PI*2,
        });
      }

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

        camera.position.y = Math.sin(time*0.2)*0.2;
        spotLight.intensity = 0.8 + Math.sin(time*2.5)*0.3;

        for (const p of pieces) {
          const mat = p.mesh.material as THREE.MeshStandardMaterial;
          p.mesh.position.y -= p.fallSpeed;
          p.mesh.position.x += Math.sin(time + p.swayPhase)*p.swayAmp;
          p.mesh.rotation.x += p.rotX;
          p.mesh.rotation.y += p.rotY;
          p.mesh.rotation.z += p.rotZ;

          const targetOp = 0.6 + Math.sin(time*0.8 + p.opPhase)*0.3;
          mat.opacity += (targetOp - mat.opacity)*0.05;

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
        for (const p of pieces) {
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
      background:"linear-gradient(135deg,#1a1200 0%,#332400 50%,#1a1200 100%)",
    }}/>
  );
}
