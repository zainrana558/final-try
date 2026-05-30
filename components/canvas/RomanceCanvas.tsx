"use client";

import type * as THREE from "three";

import { useEffect, useRef } from "react";

function MobileFallback() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,
      background:"linear-gradient(135deg,#1a0010 0%,#330010 50%,#1a0010 100%)",overflow:"hidden"}}>
      <style>{`
        @keyframes rc_heart{
          0%{transform:translateY(0) scale(1);opacity:0}
          15%{opacity:1}
          100%{transform:translateY(-90px) scale(.6);opacity:0}
        }
      `}</style>
      {Array.from({length:20}).map((_,i)=>(
        <span key={i} style={{
          position:"absolute",
          left:`${3+i*5}%`,bottom:`${5+i%6*4}%`,
          fontSize:`${10+i%5*3}px`,
          animation:`rc_heart ${3+i*0.25}s ease-out ${i*0.35}s infinite`,
          color:["#ff6b9d","#ff1493","#ffd700","#ff69b4","#ffc0cb"][i%5],
        }}>❤️</span>
      ))}
    </div>
  );
}

export default function RomanceCanvas() {
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
      scene.add(new THREE.AmbientLight(0xff69b4, 0.45));
      const pinkLight = new THREE.PointLight(0xff1493, 0.8, 40);
      pinkLight.position.set(0,0,4);
      scene.add(pinkLight);

      /* Heart shape */
      const heartShape = new THREE.Shape();
      heartShape.moveTo(0,0);
      heartShape.bezierCurveTo(0,0.4,0.5,0.4,0.5,0);
      heartShape.bezierCurveTo(0.5,-0.4,0,-0.7,0,-1);
      heartShape.bezierCurveTo(0,-0.7,-0.5,-0.4,-0.5,0);
      heartShape.bezierCurveTo(-0.5,0.4,0,0.4,0,0);

      const count  = (navigator.hardwareConcurrency ?? 4) < 4 ? 40 : 80;
      const COLORS = [0xff6b9d,0xff1493,0xffd700,0xff69b4,0xffc0cb];

      type Heart = {
        mesh: THREE.Mesh;
        riseSpeed: number; swayPhase: number; swayAmp: number;
        rotSpeed: number; pulsePhase: number; baseScale: number;
        opPhase: number;
        burstVx: number; burstVy: number; bursting: boolean;
      };
      const hearts: Heart[] = [];

      const makeHeart = (x:number,y:number,burst=false): Heart => {
        const bs  = 0.08 + Math.random()*0.15;
        const geo = new THREE.ShapeGeometry(heartShape);
        const mat = new THREE.MeshStandardMaterial({
          color: COLORS[Math.floor(Math.random()*COLORS.length)],
          transparent:true, opacity:0, side:THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, (Math.random()-0.5)*3);
        mesh.scale.setScalar(bs);
        scene.add(mesh);
        return {
          mesh,
          riseSpeed:  0.005 + Math.random()*0.008,
          swayPhase:  Math.random()*Math.PI*2,
          swayAmp:    0.006 + Math.random()*0.012,
          rotSpeed:   (Math.random()-0.5)*0.015,
          pulsePhase: Math.random()*Math.PI*2,
          baseScale:  bs,
          opPhase:    Math.random()*Math.PI*2,
          burstVx:    burst ? (Math.random()-0.5)*0.08 : 0,
          burstVy:    burst ? Math.random()*0.06 : 0,
          bursting:   burst,
        };
      };

      for (let i = 0; i < count; i++) {
        hearts.push(makeHeart(
          (Math.random()-0.5)*14,
          -6 + Math.random()*14,
        ));
      }

      /* Burst state */
      let burstTimer   = 0;
      const BURST_INT  = 8;
      let burstHearts: Heart[] = [];

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

        camera.position.x = Math.sin(time*0.12)*0.4;
        camera.position.y = Math.cos(time*0.09)*0.25;

        /* Light pulse */
        const targetInt = 0.6 + Math.sin(time*1.2)*0.3;
        pinkLight.intensity += (targetInt - pinkLight.intensity)*0.05;

        /* Burst trigger */
        burstTimer += delta;
        if (burstTimer >= BURST_INT) {
          burstTimer = 0;
          // remove old burst hearts
          for (const bh of burstHearts) {
            scene.remove(bh.mesh);
            bh.mesh.geometry.dispose();
            (bh.mesh.material as THREE.MeshStandardMaterial).dispose();
          }
          burstHearts = [];
          for (let b = 0; b < 12; b++) burstHearts.push(makeHeart(0,0,true));
        }

        const allHearts = [...hearts, ...burstHearts];

        for (const h of allHearts) {
          const mat = h.mesh.material as THREE.MeshStandardMaterial;
          if (h.bursting) {
            h.mesh.position.x += h.burstVx;
            h.mesh.position.y += h.burstVy;
            h.burstVx *= 0.97;
            h.burstVy += h.riseSpeed;
          } else {
            h.mesh.position.y += h.riseSpeed;
            h.mesh.position.x += Math.sin(time*0.6 + h.swayPhase)*h.swayAmp;
          }
          h.mesh.rotation.z += h.rotSpeed;

          const pulse = h.baseScale*(1 + Math.sin(time*1.5 + h.pulsePhase)*0.08);
          h.mesh.scale.setScalar(pulse);

          const targetOp = 0.5 + Math.sin(time + h.opPhase)*0.15;
          mat.opacity += (targetOp - mat.opacity)*0.05;

          if (!h.bursting && h.mesh.position.y > 8) {
            h.mesh.position.y = -6 + Math.random()*(-2);
          }
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        for (const h of [...hearts,...burstHearts]) {
          h.mesh.geometry.dispose();
          (h.mesh.material as THREE.MeshStandardMaterial).dispose();
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
      background:"linear-gradient(135deg,#1a0010 0%,#330010 50%,#1a0010 100%)",
    }}/>
  );
}
