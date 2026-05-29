"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#00060f 0%,#001433 50%,#00060f 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes sf_twinkle{
          0%,100%{opacity:.2;transform:scale(.8)}
          50%{opacity:1;transform:scale(1.4)}
        }
      `}</style>
      {Array.from({length:40}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",
          left:`${2+i*2.4}%`,top:`${5+i%10*9}%`,
          width:`${1+i%3}px`,height:`${1+i%3}px`,
          borderRadius:"50%",background:"#fff",
          animation:`sf_twinkle ${1+i*0.15}s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
    </div>
  );
}

export default function SciFiCanvas() {
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
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 200);
      camera.position.set(0,0,5);

      /* Lights — max 2 point lights */
      scene.add(new THREE.AmbientLight(0x000833, 0.3));
      const energyLight = new THREE.PointLight(0x00ffff, 0.6, 60);
      energyLight.position.set(0,0,4);
      scene.add(energyLight);

      const starCount  = (navigator.hardwareConcurrency ?? 4) < 4 ? 125 : 250;
      const nebulaCount= (navigator.hardwareConcurrency ?? 4) < 4 ? 150 : 300;

      /* ── HYPERSPACE STARS ── */
      const starPos    = new Float32Array(starCount*3);
      const starSizes  = new Float32Array(starCount);
      const starOrig   = new Float32Array(starCount*3);
      const starData:{opSpeed:number;opPhase:number}[] = [];

      for (let i = 0; i < starCount; i++) {
        const phi   = Math.acos(2*Math.random()-1);
        const theta = Math.random()*Math.PI*2;
        const r     = 2 + Math.random()*6;
        const x     = r*Math.sin(phi)*Math.cos(theta);
        const y     = r*Math.sin(phi)*Math.sin(theta);
        const z     = r*Math.cos(phi);
        const i3    = i*3;
        starPos[i3]=starOrig[i3]=x;
        starPos[i3+1]=starOrig[i3+1]=y;
        starPos[i3+2]=starOrig[i3+2]=z;
        starSizes[i] = 0.5;
        starData.push({ opSpeed:0.5+Math.random()*2, opPhase:Math.random()*Math.PI*2 });
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos,3));
      starGeo.setAttribute("size",     new THREE.BufferAttribute(starSizes,1));
      const starMat = new THREE.PointsMaterial({
        color:0xffffff, size:0.06, transparent:true, opacity:0.8, sizeAttenuation:true,
      });
      scene.add(new THREE.Points(starGeo, starMat));

      /* ── NEBULA DUST ── */
      const nebPos  = new Float32Array(nebulaCount*3);
      const nebData:{phase:number}[] = [];
      const NEB_COLORS = [0x0044ff,0x00ccff,0x8800ff,0x00ffcc];

      for (let i = 0; i < nebulaCount; i++) {
        const i3 = i*3;
        nebPos[i3]  = (Math.random()-0.5)*18;
        nebPos[i3+1]= (Math.random()-0.5)*18;
        nebPos[i3+2]= (Math.random()-0.5)*8;
        nebData.push({ phase: Math.random()*Math.PI*2 });
      }
      const nebGeo = new THREE.BufferGeometry();
      nebGeo.setAttribute("position", new THREE.BufferAttribute(nebPos,3));
      const nebMat = new THREE.PointsMaterial({
        color: NEB_COLORS[Math.floor(Math.random()*NEB_COLORS.length)],
        size: 0.3+Math.random()*0.7, transparent:true, opacity:0.12, sizeAttenuation:true,
      });
      scene.add(new THREE.Points(nebGeo, nebMat));

      /* ── ENERGY PULSE RING ── */
      const ringGeo  = new THREE.RingGeometry(0.1,0.15,64);
      const ringMat  = new THREE.MeshBasicMaterial({color:0x00ffff,transparent:true,opacity:0.9,side:THREE.DoubleSide});
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = 0;
      scene.add(ringMesh);
      let ringScale   = 0.1;
      let ringOpacity = 0;
      let ringTimer   = 0;
      const RING_INT  = 15;

      /* ── WARP STATE ── */
      let warpTimer = 0;
      const WARP_INT = 12;
      let warpPhase  = 0; // 0=idle 1=stretch 2=reset 3=fade-in
      let warpT      = 0;

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

        camera.position.z = 5 + Math.sin(time*0.1)*0.5;
        camera.position.x = Math.sin(time*0.08)*0.6;

        /* Light pulse */
        const targetInt = 0.4 + Math.sin(time*1.8)*0.3;
        energyLight.intensity += (targetInt - energyLight.intensity)*0.05;

        /* Stars twinkle / warp */
        warpTimer += delta;
        if (warpPhase===0 && warpTimer >= WARP_INT) { warpPhase=1; warpT=0; }

        const sPos = starGeo.attributes.position as THREE.BufferAttribute;
        const sSiz = starGeo.attributes.size     as THREE.BufferAttribute;

        if (warpPhase > 0) warpT += delta;

        for (let i = 0; i < starCount; i++) {
          const i3 = i*3;
          const d  = starData[i];

          if (warpPhase===0) {
            // twinkle
            const op = 0.3 + Math.sin(time*d.opSpeed + d.opPhase)*0.5;
            starMat.opacity += (Math.max(0,op) - starMat.opacity)*0.02;
            sSiz.array[i] += (0.5 - sSiz.array[i] as number)*0.05;
          } else if (warpPhase===1 && warpT < 2) {
            // stretch to pos*4
            const t = warpT/2;
            sPos.array[i3]   += (starOrig[i3]*4   - sPos.array[i3]  )*t*0.05;
            sPos.array[i3+1] += (starOrig[i3+1]*4 - sPos.array[i3+1])*t*0.05;
            sPos.array[i3+2] += (starOrig[i3+2]*4 - sPos.array[i3+2])*t*0.05;
            sSiz.array[i] += (3.0 - sSiz.array[i] as number)*0.04;
            starMat.opacity += (0 - starMat.opacity)*0.04;
          } else if (warpPhase===1 && warpT >= 2) {
            // snap back
            sPos.array[i3]   = starOrig[i3];
            sPos.array[i3+1] = starOrig[i3+1];
            sPos.array[i3+2] = starOrig[i3+2];
            sSiz.array[i] = 0.5;
            warpPhase = 3; warpT = 0;
          } else if (warpPhase===3) {
            starMat.opacity += (0.8 - starMat.opacity)*0.05;
            if (warpT > 1) { warpPhase=0; warpTimer=0; }
          }
        }
        sPos.needsUpdate = true;
        sSiz.needsUpdate = true;

        /* Nebula drift */
        const nPos = nebGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < nebulaCount; i++) {
          const i3 = i*3;
          const d  = nebData[i];
          nPos.array[i3]   += Math.sin(time*0.05 + d.phase)*0.001;
          nPos.array[i3+1] += Math.cos(time*0.04 + d.phase)*0.001;
        }
        nPos.needsUpdate = true;
        nebMat.opacity = 0.1 + Math.sin(time*0.3)*0.08;

        /* Energy pulse ring */
        ringTimer += delta;
        if (ringTimer >= RING_INT) { ringScale=0.1; ringOpacity=0.9; ringTimer=0; }
        ringScale   += 0.06;
        ringOpacity -= 0.01;
        ringMesh.scale.set(ringScale, ringScale, 1);
        ringMat.opacity += (Math.max(0,ringOpacity) - ringMat.opacity)*0.05;

        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        starGeo.dispose(); starMat.dispose();
        nebGeo.dispose();  nebMat.dispose();
        ringGeo.dispose(); ringMat.dispose();
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
      background:"linear-gradient(135deg,#00060f 0%,#001433 50%,#00060f 100%)",
    }}/>
  );
}
