"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#0a0a0a 0%,#1a0000 50%,#0a0a0a 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes hf_ash{
          0%{transform:translateY(100vh) scale(1);opacity:0}
          10%{opacity:.5}90%{opacity:.2}
          100%{transform:translateY(-10px) scale(.5);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",left:`${3+i*5}%`,bottom:0,
          width:`${3+i%4}px`,height:`${3+i%4}px`,borderRadius:"50%",
          background:["#333","#444","#555","#666"][i%4],
          animation:`hf_ash ${4+i*0.4}s ease-in-out ${i*0.3}s infinite`,
        }}/>
      ))}
    </div>
  );
}

export default function HorrorCanvas() {
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

      /* Lights */
      scene.add(new THREE.AmbientLight(0x001100, 0.2));
      const lightning = new THREE.PointLight(0x9999ff, 0, 50);
      lightning.position.set(0,4,2);
      scene.add(lightning);

      const count = (navigator.hardwareConcurrency ?? 4) < 4 ? 100 : 200;

      /* ── DARK ASH (Points) ── */
      const ashPositions = new Float32Array(count*3);
      const ashDrift: {dx:number;dy:number;phase:number}[] = [];
      for (let i = 0; i < count; i++) {
        const i3 = i*3;
        ashPositions[i3]   = (Math.random()-0.5)*16;
        ashPositions[i3+1] = (Math.random()-0.5)*16;
        ashPositions[i3+2] = (Math.random()-0.5)*4;
        ashDrift.push({
          dx:    (Math.random()-0.5)*0.003,
          dy:    -0.002 + Math.random()*0.001,
          phase: Math.random()*Math.PI*2,
        });
      }
      const ashGeo = new THREE.BufferGeometry();
      ashGeo.setAttribute("position", new THREE.BufferAttribute(ashPositions, 3));
      const ashMat = new THREE.PointsMaterial({
        color: 0x555555, size: 0.04, transparent:true, opacity:0.5,
        sizeAttenuation:true,
      });
      const ashPoints = new THREE.Points(ashGeo, ashMat);
      scene.add(ashPoints);

      /* ── MIST (SphereGeometry clouds) ── */
      type Cloud = { mesh:THREE.Mesh; riseSpeed:number; opTarget:number; phase:number };
      const clouds: Cloud[] = [];
      const mistCount = (navigator.hardwareConcurrency ?? 4) < 4 ? 4 : 8;
      for (let i = 0; i < mistCount; i++) {
        const geo = new THREE.SphereGeometry(1.5, 6, 6);
        const mat = new THREE.MeshStandardMaterial({
          color:0x003300, transparent:true, opacity:0,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random()-0.5)*12,
          -5 + Math.random()*2,
          -2 + Math.random()*2,
        );
        mesh.scale.set(
          1+Math.random()*1.5,
          0.4+Math.random()*0.4,
          0.8+Math.random(),
        );
        scene.add(mesh);
        clouds.push({
          mesh,
          riseSpeed: 0.003 + Math.random()*0.002,
          opTarget:  0.06 + Math.random()*0.08,
          phase:     Math.random()*Math.PI*2,
        });
      }

      /* ── LIGHTNING STATE ── */
      let flashTimer   = 0;
      let nextFlash    = 7 + Math.random()*5;
      let flashPhase   = 0;   // 0=waiting 1=rise1 2=fall1 3=rise2 4=fall2
      let flashT       = 0;

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

        camera.position.x = Math.sin(time*0.12)*0.25;
        camera.position.y = Math.cos(time*0.08)*0.15;

        /* Ash particles */
        const pos = ashGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < count; i++) {
          const i3 = i*3;
          const d  = ashDrift[i];
          pos.array[i3]   += d.dx + Math.sin(time*0.2 + d.phase)*0.002;
          pos.array[i3+1] += d.dy;
          if (pos.array[i3+1] < -6) {
            pos.array[i3+1] = 8;
            pos.array[i3]   = (Math.random()-0.5)*16;
          }
        }
        pos.needsUpdate = true;

        /* Mist */
        for (const c of clouds) {
          const mat = c.mesh.material as THREE.MeshStandardMaterial;
          c.mesh.position.y  += c.riseSpeed;
          c.mesh.position.x  += Math.sin(time*0.15 + c.phase)*0.004;
          mat.opacity += (c.opTarget - mat.opacity)*0.05;
          if (c.mesh.position.y > 2) {
            c.mesh.position.y = -5;
            mat.opacity = 0;
          }
        }

        /* Lightning */
        flashTimer += delta;
        if (flashPhase === 0 && flashTimer >= nextFlash) {
          flashPhase = 1; flashT = 0;
        }
        if (flashPhase > 0) {
          flashT += delta;
          if      (flashPhase===1){ const t=flashT/0.05; lightning.intensity += (3.0-lightning.intensity)*Math.min(t,1)*0.3; if(flashT>=0.05){flashPhase=2;flashT=0;} }
          else if (flashPhase===2){ lightning.intensity += (0 -lightning.intensity)*0.15; if(flashT>=0.08){flashPhase=3;flashT=0;} }
          else if (flashPhase===3){ lightning.intensity += (2.0-lightning.intensity)*0.3;  if(flashT>=0.05){flashPhase=4;flashT=0;} }
          else if (flashPhase===4){ lightning.intensity += (0 -lightning.intensity)*0.1;  if(flashT>=0.15){flashPhase=0;flashTimer=0;nextFlash=7+Math.random()*5;} }
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        ashGeo.dispose(); ashMat.dispose();
        for (const c of clouds) {
          c.mesh.geometry.dispose();
          (c.mesh.material as THREE.MeshStandardMaterial).dispose();
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
      background:"linear-gradient(135deg,#0a0a0a 0%,#1a0000 50%,#0a0a0a 100%)",
    }}/>
  );
}
