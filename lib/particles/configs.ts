// LUMINA: Particle configurations for each genre page

export interface ParticleConfig {
  type: 'anime' | 'cartoon' | 'horror' | 'comedy' | 'action' | 'romance' | 'scifi';
  background: string;
  atmosphere: string;
  heroOverlay: string;
  particles: any;
  extraEffects?: 'gsap-vignette' | 'gsap-speedlines' | 'framer-pulse' | 'gsap-scanline' | 'css-grid' | 'confetti-burst';
}

// LUMINA: Anime - Cherry Blossoms
export const animeConfig: ParticleConfig = {
  type: 'anime',
  background: '#080808',
  atmosphere: 'rgba(255,107,157,0.025)',
  heroOverlay: 'linear-gradient(to top, #080808 0%, rgba(8,8,8,0.4) 50%, transparent 70%), radial-gradient(ellipse at 80% 0%, rgba(255,107,157,0.08) 0%, transparent 60%)',
  particles: {
    particles: {
      number: { value: 45, density: { enable: true, value_area: 800 } },
      color: { value: ['#FFB7C5', '#FF8FAB', '#FFC0CB', '#FF69B4', '#FFAEC9'] },
      shape: {
        type: 'custom',
        custom: [
          {
            path: 'M0,-10 C3,-7 7,-3 10,0 C7,3 3,7 0,10 C-3,7 -7,3 -10,0 C-7,-3 -3,-7 0,-10Z',
            fill: true,
          },
          {
            path: 'M0,-8 C2,-5 5,-2 8,0 C5,2 2,5 0,8 C-2,5 -5,2 -8,0 C-5,-2 -2,-5 0,-8Z',
            fill: true,
          },
        ],
      },
      opacity: { value: { min: 0.3, max: 0.7 }, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
      size: { value: { min: 6, max: 14 }, animation: { enable: true, speed: 2, minimumValue: 4 } },
      move: {
        enable: true,
        speed: { min: 0.8, max: 2.2 },
        direction: 'bottom',
        random: false,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: 1.5,
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 8, sync: false },
      },
    },
  },
};

// LUMINA: Cartoon - Autumn Leaves + Wildflowers
export const cartoonConfig: ParticleConfig = {
  type: 'cartoon',
  background: '#080808',
  atmosphere: 'rgba(255,184,0,0.02)',
  heroOverlay: 'linear-gradient(to top, #080808, transparent 65%), radial-gradient(ellipse at 50% -10%, rgba(255,184,0,0.06) 0%, transparent 55%)',
  particles: {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: ['#FF6B2B', '#FFB800', '#E8520A', '#D4380D', '#FF8C00', '#FFA500', '#FFFFFF', '#FFE566', '#FFA500', '#FFFACD'] },
      shape: {
        type: 'custom',
        custom: [
          {
            path: 'M0,-10 C3,-8 8,-5 10,0 C8,5 3,8 0,10 C-3,8 -8,5 -10,0 C-8,-5 -3,-8 0,-10Z',
            fill: true,
          },
          {
            path: 'M0,-6 C2,-4 4,-2 6,0 C4,2 2,4 0,6 C-2,4 -4,2 -6,0 C-4,-2 -2,-4 0,-6Z',
            fill: true,
          },
        ],
      },
      opacity: { value: { min: 0.25, max: 0.65 }, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
      size: { value: { min: 4, max: 20 }, animation: { enable: true, speed: 2, minimumValue: 3 } },
      move: {
        enable: true,
        speed: { min: 0.6, max: 3.0 },
        direction: 'bottom',
        random: false,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: { min: 1.2, max: 2.8 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: { min: 3, max: 15 }, sync: false },
      },
    },
  },
};

// LUMINA: Horror - Falling Ash + Ember Sparks
export const horrorConfig: ParticleConfig = {
  type: 'horror',
  background: '#050505',
  atmosphere: 'rgba(139,0,255,0.03)',
  heroOverlay: 'linear-gradient(to top, #050505, transparent 60%), radial-gradient(ellipse at 30% 0%, rgba(139,0,255,0.1) 0%, transparent 50%)',
  particles: {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: ['#2A2A2A', '#3D3D3D', '#1A1A1A', '#4A4A4A', '#8B00FF', '#6A00CC', '#FF0033', '#CC0029'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.2, max: 0.9 }, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
      size: { value: { min: 1.5, max: 5 }, animation: { enable: true, speed: 2, minimumValue: 1 } },
      move: {
        enable: true,
        speed: { min: 0.3, max: 1.2 },
        direction: 'bottom',
        random: false,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: { min: 0.4, max: 0.8 },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: 2, sync: false },
      },
      twinkle: {
        enable: true,
        frequency: 0.08,
        opacity: 1,
      },
    },
  },
  extraEffects: 'gsap-vignette',
};

// LUMINA: Comedy - Confetti Burst
export const comedyConfig: ParticleConfig = {
  type: 'comedy',
  background: '#080808',
  atmosphere: 'rgba(255,140,0,0.02)',
  heroOverlay: 'linear-gradient(to top, #080808, transparent 60%)',
  particles: {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: ['#FF8C00', '#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#FF69B4', '#FFFFFF', '#FFB800'] },
      shape: { type: ['square', 'triangle', 'circle'] },
      opacity: { value: { min: 0.4, max: 0.8 }, animation: { enable: true, speed: 1, minimumValue: 0.1 } },
      size: { value: { min: 4, max: 10 }, animation: { enable: true, speed: 2, minimumValue: 3 } },
      move: {
        enable: true,
        speed: { min: 1.5, max: 4.0 },
        direction: 'bottom',
        random: true,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: 3.5,
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: { enable: true, speed: { min: 8, max: 25 }, sync: false },
      },
    },
    emitters: {
      position: { x: 50, y: 0 },
      rate: { delay: 0.15, quantity: 3 },
      size: { width: 0, height: 0 },
    },
  },
  extraEffects: 'confetti-burst',
};

// LUMINA: Action - Falling Sparks + Speed Lines
export const actionConfig: ParticleConfig = {
  type: 'action',
  background: '#080808',
  atmosphere: 'rgba(229,9,20,0.025)',
  heroOverlay: 'linear-gradient(to top, #080808, transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(229,9,20,0.08) 0%, transparent 50%)',
  particles: {
    particles: {
      number: { value: 35, density: { enable: true, value_area: 800 } },
      color: { value: ['#E50914', '#FF4500', '#FF8C00', '#FFD700', '#FFFFFF'] },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.5, max: 1.0 }, animation: { enable: true, speed: 1, minimumValue: 0.3 } },
      size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, minimumValue: 0.5 } },
      move: {
        enable: true,
        speed: { min: 3.0, max: 7.0 },
        direction: 'bottom',
        random: false,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: 0.5,
      },
      twinkle: {
        enable: true,
        frequency: 0.15,
        opacity: 1,
      },
      links: {
        enable: false,
      },
    },
  },
  extraEffects: 'gsap-speedlines',
};

// LUMINA: Romance - Floating Hearts
export const romanceConfig: ParticleConfig = {
  type: 'romance',
  background: '#080808',
  atmosphere: 'rgba(255,77,139,0.03)',
  heroOverlay: 'linear-gradient(to top, #080808, transparent 60%), radial-gradient(ellipse at 60% 0%, rgba(255,77,139,0.07) 0%, transparent 55%)',
  particles: {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: ['#FF4D8B', '#FF1493', '#FF69B4', '#FFB6C1', '#FF0066', '#FFFFFF', '#FFE4E1'] },
      shape: {
        type: 'custom',
        custom: [
          {
            path: 'M0,-8 C-2,-12 -10,-12 -10,-4 C-10,2 0,10 0,12 C0,10 10,2 10,-4 C10,-12 2,-12 0,-8Z',
            fill: true,
          },
        ],
      },
      opacity: { value: { min: 0.08, max: 0.6 }, animation: { enable: true, speed: 1, minimumValue: 0.05 } },
      size: { value: { min: 8, max: 32 }, animation: { enable: true, speed: 2, minimumValue: 6 } },
      move: {
        enable: true,
        speed: { min: 0.3, max: 1.8 },
        direction: 'bottom',
        random: false,
        straight: false,
        outModes: { default: 'out', bottom: 'out' },
        drift: 1.8,
      },
      rotate: {
        value: { min: -15, max: 15 },
        animation: { enable: true, speed: 2, direction: 'random', sync: false },
      },
    },
  },
  extraEffects: 'framer-pulse',
};

// LUMINA: Sci-Fi - Digital Rain + Floating Data Fragments
export const scifiConfig: ParticleConfig = {
  type: 'scifi',
  background: '#030308',
  atmosphere: 'rgba(0,212,255,0.02)',
  heroOverlay: 'linear-gradient(to top, #030308, transparent 60%), radial-gradient(ellipse at 90% 0%, rgba(0,212,255,0.08) 0%, transparent 50%)',
  particles: {
    particles: {
      number: { value: 45, density: { enable: true, value_area: 800 } },
      color: { value: ['#00D4FF', '#00FF88', '#0088FF', '#00FFFF', '#FFFFFF'] },
      shape: { type: ['circle', 'square'] },
      opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 1, minimumValue: 0.05 } },
      size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, minimumValue: 0.5 } },
      move: {
        enable: true,
        speed: { min: 0.2, max: 4.5 },
        direction: { min: 270, max: 270 },
        random: true,
        straight: true,
        outModes: { default: 'out', bottom: 'out' },
      },
      twinkle: {
        enable: true,
        frequency: 0.03,
        opacity: 0.8,
      },
    },
  },
  extraEffects: 'gsap-scanline',
};

// LUMINA: Config mapping
export const particleConfigs: Record<string, ParticleConfig> = {
  anime: animeConfig,
  cartoon: cartoonConfig,
  horror: horrorConfig,
  comedy: comedyConfig,
  action: actionConfig,
  romance: romanceConfig,
  scifi: scifiConfig,
};
