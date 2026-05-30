"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#0d0800 0%,#1a0e00 50%,#0d0500 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes ac_spark{
          0%{transform:translateY(0) scale(1);opacity:0}
          15%{opacity:1}
          100%{transform:translateY(-80px) scale(.2);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",
          left:`${3+i*5}%`,bottom:`${5+i*2}%`,
          width:`${2+i%3}px`,height:`${4+i%5}px`,borderRadius:"50%",
          background:["#ff4500","#ff6b35","#ff8c00","#ffd700"][i%4],
          animation:`ac_spark ${1.2+i*0.15}s ease-out ${i*0.2}s infinite`,
        }}/>
      ))}
    </div>
  );
}

export default function ActionCanvas() {
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

      /* Lights — max 2 point lights */
      scene.add(new THREE.AmbientLight(0x110800, 0.4));
      const heatLight = new THREE.PointLight(0xff4500, 1.2, 40);
      heatLight.position.set(0,0,3);
      scene.add(heatLight);

      const emberCount = (navigator.hardwareConcurrency ?? 4) < 4 ? 90 : 180;

      /* ── EMBERS (Points single draw call) ── */
      const emberPos   = new Float32Array(emberCount*3);
      const emberSizes = new Float32Array(emberCount);
      const emberData: {vy:number;phase:number;amp:number;fPhase:number;fSpeed:number}[] = [];

      const EMBER_COLORS = [0xff4500,0xff6b35,0xff8c00,0xffd700];

      for (let i = 0; i < emberCount; i++) {
        const i3 = i*3;
        emberPos[i3]   = (Math.random()-0.5)*16;
        emberPos[i3+1] = -5 + Math.random()*13;
        emberPos[i3+2] = (Math.random()-0.5)*4;
        emberSizes[i]  = 0.04 + Math.random()*0.08;
        emberData.push({
          vy:     0.008 + Math.random()*0.015,
          phase:  Math.random()*Math.PI*2,
          amp:    0.005 + Math.random()*0.01,
          fPhase: Math.random()*Math.PI*2,
          fSpeed: 2 + Math.random()*4,
        });
      }
      const emberGeo = new THREE.BufferGeometry();
      emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPos, 3));
      emberGeo.setAttribute("size",     new THREE.BufferAttribute(emberSizes,1));
      const emberMat = new THREE.PointsMaterial({
        color: EMBER_COLORS[Math.floor(Math.random()*EMBER_COLORS.length)],
        size: 0.06, transparent:true, opacity:0.8, sizeAttenuation:true,
        vertexColors: false,
      });
      scene.add(new THREE.Points(emberGeo, emberMat));

      /* ── SHOCKWAVE RINGS ── */
      type Ring = { mesh:THREE.Mesh; scale:number; opacity:number; delay:number; active:boolean };
      const rings: Ring[] = [];
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.RingGeometry(0.1,0.15,32);
        const mat = new THREE.MeshBasicMaterial({color:0xff6b35,transparent:true,opacity:0.9,side:THREE.DoubleSide});
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.z = 1;
        scene.add(mesh);
        rings.push({ mesh, scale:0.1 + i*0.1, opacity:0.9 - i*0.15, delay: i*0.7, active:true });
      }

      /* ── CAMERA SHAKE STATE ── */
      let shakeTarget = 0;
      let shakeTimer  = 0;
      let camX        = 0;

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

        /* Heat light pulse */
        const targetIntensity = 1.2 + Math.sin(time*4)*0.6;
        heatLight.intensity += (targetIntensity - heatLight.intensity)*0.05;

        /* Camera shake */
        shakeTimer += delta;
        if (shakeTimer >= 2) { shakeTarget = (Math.random()-0.5)*0.03; shakeTimer = 0; }
        camX += (shakeTarget - camX)*0.1;
        shakeTarget *= 0.9;
        camera.position.x = camX;

        /* Embers */
        const ePos = emberGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < emberCount; i++) {
          const i3 = i*3;
          const d  = emberData[i];
          ePos.array[i3]   += Math.sin(time + d.phase)*d.amp;
          ePos.array[i3+1] += d.vy;
          if (ePos.array[i3+1] > 8) {
            ePos.array[i3+1] = -5;
            ePos.array[i3]   = (Math.random()-0.5)*16;
          }
        }
        ePos.needsUpdate = true;
        // flicker via overall opacity
        emberMat.opacity = 0.4 + Math.sin(time*3)*0.35;

        /* Shockwave rings */
        for (const r of rings) {
          r.scale   += 0.035;
          r.opacity -= 0.012;
          r.mesh.scale.set(r.scale, r.scale, 1);
          const mat = r.mesh.material as THREE.MeshBasicMaterial;
          mat.opacity += (r.opacity - mat.opacity)*0.05;
          if (r.opacity <= 0) { r.scale = 0.1; r.opacity = 0.9; mat.opacity = 0.9; }
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        emberGeo.dispose(); emberMat.dispose();
        for (const r of rings) {
          r.mesh.geometry.dispose();
          (r.mesh.material as THREE.MeshBasicMaterial).dispose();
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
      background:"linear-gradient(135deg,#0d0800 0%,#1a0e00 50%,#0d0500 100%)",
    }}/>
  );
}
