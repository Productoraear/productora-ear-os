import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Series,
  Video,
  Img,
  Audio,
} from 'remotion';

export interface SceneItem {
  id: string;
  name: string;
  durationInSeconds: number;
  titleText: string;
  subtitleText: string;
  badgeText?: string;
  captionText?: string;
  transition?: 'zoom' | 'glitch' | 'fade' | 'slide' | 'flash' | 'wipe';
  accentColor?: string;
  speed?: number;
  
  // Media Footage (Track V1 / B-Rolls)
  mediaUrl?: string;
  mediaType?: 'video' | 'image' | 'color';
  mediaFit?: 'cover' | 'contain';
  mediaOpacity?: number;
  mediaScale?: number;
  kenBurns?: boolean;
  
  // Tipografía & Animación Específica de Escena
  titleFont?: 'Syne' | 'Cinzel' | 'Inter' | 'JetBrains Mono' | 'Montserrat';
  titleSize?: number;
  titleY?: number; // Desplazamiento vertical en porcentaje (-30 a 30)
  animationStyle?: 'kinetic' | 'slide' | 'glitch' | 'typewriter' | 'cinematic';
  
  // Audio FX local de Escena (Track A2)
  audioFxUrl?: string;
}

export type EarOsPromoProps = {
  // Global preset & styling
  presetName?: string;
  accentColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
  
  // DaVinci Color Grading & Look
  brightness?: number;       // 0.5 a 1.5 (default 1)
  contrast?: number;         // 0.5 a 2.0 (default 1)
  saturation?: number;       // 0 a 2.0 (default 1)
  temperature?: number;      // -50 (frío azul) a +50 (cálido oro)
  filmGrain?: boolean;
  filmGrainIntensity?: number;
  letterbox?: boolean;       // Barras Anamórficas 2.39:1
  letterboxHeight?: number;  // Altura en px (default 50)

  // FX Rack
  showGrid?: boolean;
  gridOpacity?: number;
  showGlow?: boolean;
  glowIntensity?: number;
  vignette?: boolean;
  vignetteIntensity?: number;
  scanlines?: boolean;
  scanlineOpacity?: number;
  chromaticAberration?: boolean;
  aberrationOffset?: number;
  showTelemetry?: boolean;
  
  // Subtítulos Virales (Hormozi / CapCut)
  showCaptions?: boolean;
  captionStyle?: 'hormozi' | 'minimal' | 'cyber' | 'karaoke';
  captionFontSize?: number;
  captionHighlightColor?: string;
  captionBoxBackground?: boolean;
  captionY?: number; // Offset Y

  // Audio Workstation & Sound Design
  soundtrackUrl?: string;
  soundtrackVolume?: number;
  soundtrackMuted?: boolean;
  autoDucking?: boolean;
  enableTransitionSfx?: boolean;
  
  // Physics Spring Dynamics
  damping?: number;
  mass?: number;
  stiffness?: number;
  
  // Multi-Scene Storyboard
  scenes?: SceneItem[];
  
  // Single-Scene Legacy Fallback
  titleText?: string;
  subtitleText?: string;
  badgeText?: string;
  
  [key: string]: unknown;
};

export const defaultScenes: SceneItem[] = [
  {
    id: 'scene-1',
    name: '01. Gancho & Artista',
    durationInSeconds: 3,
    titleText: 'EDWIN AGUDELO',
    subtitleText: 'CONCIERTOS DE GALA S-CLASS',
    badgeText: 'SOLISTA EXCLUSIVO // BASE 350€',
    captionText: 'EL ESTÁNDAR SUPREMO DE MÚSICA EN DIRECTO',
    transition: 'zoom',
    accentColor: '#ecb613',
    mediaType: 'video',
    mediaOpacity: 0.6,
    kenBurns: true,
    titleFont: 'Syne',
    animationStyle: 'cinematic',
  },
  {
    id: 'scene-2',
    name: '02. Logística & Garantía',
    durationInSeconds: 3,
    titleText: 'BLOQUEO ATÓMICO',
    subtitleText: 'DEPÓSITO 100€ 100% DEDUCIBLE',
    badgeText: 'GARANTÍA DE PRECIO // SHA-256',
    captionText: 'RESERVA ATÓMICA DE FECHA SIN COMISIONES OCULTAS',
    transition: 'glitch',
    accentColor: '#00E5FF',
    mediaType: 'video',
    mediaOpacity: 0.55,
    kenBurns: true,
    titleFont: 'Syne',
    animationStyle: 'glitch',
  },
  {
    id: 'scene-3',
    name: '03. Cierre & Impacto',
    durationInSeconds: 3,
    titleText: 'SPLIT 80/10/10',
    subtitleText: '80% ARTISTA · 10% EAR OS · 10% VIMUME',
    badgeText: 'WHATSAPP DIRECTO: +34 693 693 048',
    captionText: 'COTIZA TU EVENTO HOY CON PRODUCTORA EAR',
    transition: 'fade',
    accentColor: '#ecb613',
    mediaType: 'video',
    mediaOpacity: 0.65,
    kenBurns: true,
    titleFont: 'Syne',
    animationStyle: 'kinetic',
  },
];

export const defaultEarOsPromoProps: EarOsPromoProps = {
  titleText: 'EDWIN AGUDELO',
  subtitleText: 'CONCIERTOS DE GALA S-CLASS',
  badgeText: 'SOLISTA EXCLUSIVO // BASE 350€',
  accentColor: '#ecb613',
  glowColor: '#ecb613',
  backgroundColor: '#020202',
  brightness: 1,
  contrast: 1.05,
  saturation: 1.1,
  temperature: 10,
  filmGrain: true,
  filmGrainIntensity: 0.12,
  letterbox: false,
  letterboxHeight: 45,
  showGrid: true,
  gridOpacity: 0.2,
  showGlow: true,
  glowIntensity: 0.6,
  vignette: true,
  vignetteIntensity: 0.6,
  scanlines: false,
  scanlineOpacity: 0.15,
  chromaticAberration: false,
  aberrationOffset: 4,
  showTelemetry: true,
  showCaptions: true,
  captionStyle: 'hormozi',
  captionFontSize: 30,
  captionHighlightColor: '#ecb613',
  captionBoxBackground: true,
  damping: 180,
  mass: 1.8,
  stiffness: 120,
  aspectRatio: '16:9',
  soundtrackUrl: '/api/admin/video-factory/media/stream?file=D%3A%5CBRUTOS_AUDIO%5CGRABACIONES_CUBASE_(Sesiones)%5C24K_Gold.nksf.ogg',
  soundtrackVolume: 0.8,
  soundtrackMuted: false,
  autoDucking: true,
  enableTransitionSfx: true,
  scenes: defaultScenes,
};

// Generador de Cadena de Filtros CSS para Color Grading estilo DaVinci
const buildColorFilter = (props: EarOsPromoProps) => {
  const b = props.brightness ?? 1;
  const c = props.contrast ?? 1;
  const s = props.saturation ?? 1;
  const temp = props.temperature ?? 0;
  const sepia = temp > 0 ? (temp / 100) * 0.35 : 0;
  const hueRotate = temp < 0 ? `${(temp / 100) * 25}deg` : '0deg';

  return `brightness(${b}) contrast(${c}) saturate(${s}) sepia(${sepia}) hue-rotate(${hueRotate})`;
};

// Renderizador de Subtítulos Dinámicos Virales (Hormozi / CapCut Style)
const ViralCaptions: React.FC<{
  text: string;
  frame: number;
  fps: number;
  accentColor: string;
  isVertical: boolean;
  props: EarOsPromoProps;
}> = ({ text, frame, fps, accentColor, isVertical, props }) => {
  const words = text.split(' ');
  const totalDuration = 120; // 2 segundos
  const framesPerWord = Math.max(10, Math.floor(totalDuration / Math.max(words.length, 1)));
  const currentWordIndex = Math.min(Math.floor(frame / framesPerWord), words.length - 1);
  const fontSize = props.captionFontSize || (isVertical ? 24 : 32);
  const highlight = props.captionHighlightColor || accentColor;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: props.captionY ? `${props.captionY}px` : (isVertical ? 140 : 80),
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: isVertical ? 8 : 12,
        padding: '0 40px',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      {words.map((word, idx) => {
        const isActive = idx === currentWordIndex;
        const isPassed = idx < currentWordIndex;

        const pop = spring({
          frame: frame - idx * framesPerWord,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 220 },
        });

        const scale = isActive ? interpolate(pop, [0, 1], [1, 1.25]) : 1;
        const opacity = isPassed ? 0.75 : isActive ? 1 : 0.4;

        return (
          <span
            key={idx}
            style={{
              fontFamily: "'Syne', -apple-system, sans-serif",
              fontSize,
              fontWeight: 900,
              textTransform: 'uppercase',
              color: isActive ? highlight : '#ffffff',
              backgroundColor: props.captionBoxBackground !== false && isActive ? 'rgba(0,0,0,0.85)' : 'transparent',
              padding: isActive ? '4px 10px' : '0px',
              borderRadius: 8,
              border: isActive ? `1px solid ${highlight}80` : 'none',
              transform: `scale(${scale})`,
              opacity,
              textShadow: isActive ? `0 0 25px ${highlight}` : '0 2px 8px rgba(0,0,0,0.9)',
              transition: 'color 0.1s ease',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Componente de Escena Individual con Track V1 Media & B-Roll
const SingleScene: React.FC<{
  scene: SceneItem;
  props: EarOsPromoProps;
  index: number;
}> = ({ scene, props, index }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const isVertical = width < height;

  const accentColor = scene.accentColor || props.accentColor || '#ecb613';
  const glowColor = props.glowColor || accentColor;

  // 1. Transición de Entrada de la Escena
  let sceneScale = 1;
  let sceneOpacity = 1;
  let sceneX = 0;
  let sceneWhiteFlash = 0;

  const enterProgress = spring({
    frame,
    fps,
    config: { damping: props.damping || 180, mass: props.mass || 1.8, stiffness: props.stiffness || 120 },
  });

  if (scene.transition === 'zoom') {
    sceneScale = interpolate(enterProgress, [0, 1], [0.75, 1]);
    sceneOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  } else if (scene.transition === 'slide') {
    sceneX = interpolate(enterProgress, [0, 1], [width * 0.35, 0]);
    sceneOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  } else if (scene.transition === 'glitch') {
    const glitchJitter = Math.sin(frame * 1.5) * (frame < 12 ? 18 : 0);
    sceneX = glitchJitter;
    sceneOpacity = frame % 3 === 0 && frame < 10 ? 0.3 : 1;
  } else if (scene.transition === 'flash') {
    sceneWhiteFlash = interpolate(frame, [0, 4, 12], [1, 0.8, 0], { extrapolateRight: 'clamp' });
    sceneOpacity = 1;
  } else {
    // Fade default
    sceneOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  }

  // 2. Movimiento Ken Burns para Media de Fondo
  const kenBurnsScale = scene.kenBurns !== false
    ? interpolate(frame, [0, durationInFrames], [1, 1.15])
    : (scene.mediaScale || 1);

  // 3. Animación de Entrada del Badge y Título
  const badgeY = interpolate(enterProgress, [0, 1], [-25, 0]);
  
  // Título: animación personalizada según animationStyle
  let titleTransform = 'none';
  if (scene.animationStyle === 'kinetic') {
    const popTitle = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 180 } });
    titleTransform = `scale(${interpolate(popTitle, [0, 1], [0.85, 1])})`;
  } else if (scene.animationStyle === 'slide') {
    const slideTitle = interpolate(enterProgress, [0, 1], [50, 0]);
    titleTransform = `translateY(${slideTitle}px)`;
  } else if (scene.animationStyle === 'glitch' && frame < 15) {
    titleTransform = `translateX(${Math.sin(frame * 2) * 8}px)`;
  }

  const colorFilter = buildColorFilter(props);
  const titleFontFamily = scene.titleFont === 'Cinzel' 
    ? "'Cinzel', serif" 
    : scene.titleFont === 'Inter' 
      ? "'Inter', sans-serif" 
      : scene.titleFont === 'JetBrains Mono' 
        ? "'JetBrains Mono', monospace" 
        : "'Syne', -apple-system, sans-serif";

  // Estado de fallo de carga de media
  const [videoError, setVideoError] = React.useState(false);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: props.backgroundColor || '#020202',
        opacity: sceneOpacity,
        transform: `scale(${sceneScale}) translateX(${sceneX}px)`,
        overflow: 'hidden',
        color: '#ffffff',
        fontFamily: titleFontFamily,
      }}
    >
      {/* PISTA V1: MEDIA DE FONDO (VIDEO O IMAGEN B-ROLL) */}
      {Boolean(
        scene.mediaUrl &&
        !videoError &&
        !scene.mediaUrl.includes('commondatastorage.googleapis.com') &&
        scene.mediaUrl.trim() !== ''
      ) && (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          {scene.mediaUrl!.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? (
            <Video
              src={scene.mediaUrl!}
              onError={() => {
                setVideoError(true);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: scene.mediaFit || 'cover',
                transform: `scale(${kenBurnsScale})`,
                opacity: scene.mediaOpacity ?? 0.65,
                filter: colorFilter,
              }}
              playbackRate={scene.speed || 1}
              muted
            />
          ) : (
            <Img
              src={scene.mediaUrl!}
              onError={() => setVideoError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: scene.mediaFit || 'cover',
                transform: `scale(${kenBurnsScale})`,
                opacity: scene.mediaOpacity ?? 0.65,
                filter: colorFilter,
              }}
            />
          )}

          {/* Sombra de contraste para garantizar legibilidad del texto */}
          <AbsoluteFill
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Grid 3D Dinámico si no hay media o con baja opacidad */}
      {props.showGrid && (
        <AbsoluteFill
          style={{
            perspective: '1200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '260%',
              height: '260%',
              backgroundImage: `
                linear-gradient(${accentColor}25 1px, transparent 1px),
                linear-gradient(90deg, ${accentColor}25 1px, transparent 1px)
              `,
              backgroundSize: '90px 90px',
              transform: `rotateX(${interpolate(frame, [0, 300], [60, 48])}deg) translateY(${(frame * 2.5 + index * 40) % 100}px)`,
              opacity: scene.mediaUrl ? (props.gridOpacity || 0.2) * 0.4 : (props.gridOpacity || 0.2),
              transformOrigin: 'center center',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Core Glow Nebula */}
      {props.showGlow && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: isVertical ? width * 0.9 : 850,
              height: isVertical ? width * 0.9 : 850,
              background: `radial-gradient(circle, ${glowColor} 0%, ${accentColor}40 35%, transparent 70%)`,
              opacity: props.glowIntensity || 0.6,
              filter: 'blur(120px)',
              transform: `scale(${interpolate(frame, [0, 180], [0.8, 1.2])})`,
            }}
          />
        </AbsoluteFill>
      )}

      {/* Telemetría Superior */}
      {props.showTelemetry && (
        <div
          style={{
            position: 'absolute',
            top: isVertical ? 60 : 35,
            left: isVertical ? 40 : 50,
            right: isVertical ? 40 : 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: isVertical ? 12 : 14,
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.45)',
            zIndex: 30,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}`,
              }}
            />
            <span>ESCENA 0{index + 1} // {scene.name.toUpperCase()}</span>
          </div>
          <div>EAR OS S-CLASS NLE</div>
        </div>
      )}

      {/* Contenido Central de la Escena (Títulos & Badges) */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: isVertical ? '0 40px' : '0 100px',
          zIndex: 25,
          transform: scene.titleY ? `translateY(${scene.titleY}%)` : 'none',
        }}
      >
        {/* Badge Superior */}
        {scene.badgeText && (
          <div
            style={{
              transform: `translateY(${badgeY}px)`,
              marginBottom: isVertical ? 20 : 32,
              padding: isVertical ? '8px 20px' : '10px 28px',
              border: `1px solid ${accentColor}60`,
              borderRadius: 9999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(24px)',
              boxShadow: `0 0 25px ${accentColor}25`,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isVertical ? 11 : 13,
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              {scene.badgeText}
            </span>
          </div>
        )}

        {/* Título Principal */}
        <h1
          style={{
            margin: 0,
            fontSize: scene.titleSize || (isVertical ? Math.min(width * 0.13, 85) : 125),
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.06em',
            textShadow: `0 0 50px ${accentColor}80, 0 10px 40px rgba(0,0,0,0.95)`,
            lineHeight: 1.05,
            textAlign: 'center',
            transform: titleTransform,
          }}
        >
          {scene.titleText}
        </h1>

        {/* Subtítulo */}
        {scene.subtitleText && (
          <div
            style={{
              marginTop: isVertical ? 22 : 36,
              padding: isVertical ? '12px 24px' : '16px 44px',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 9999,
              background: 'rgba(10, 10, 14, 0.8)',
              backdropFilter: 'blur(30px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
              maxWidth: isVertical ? '90%' : '80%',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isVertical ? 16 : 24,
                fontWeight: 600,
                color: accentColor,
                margin: 0,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              {scene.subtitleText}
            </h2>
          </div>
        )}
      </AbsoluteFill>

      {/* Subtítulos Dinámicos Virales (Hormozi Style) */}
      {props.showCaptions && scene.captionText && (
        <ViralCaptions
          text={scene.captionText}
          frame={frame}
          fps={fps}
          accentColor={accentColor}
          isVertical={isVertical}
          props={props}
        />
      )}

      {/* Flash Blanco de Transición */}
      {sceneWhiteFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#ffffff',
            opacity: sceneWhiteFlash,
            pointerEvents: 'none',
            zIndex: 42,
          }}
        />
      )}

      {/* Scanlines CRT Retro */}
      {props.scanlines && (
        <AbsoluteFill
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)',
            opacity: props.scanlineOpacity || 0.15,
            pointerEvents: 'none',
            zIndex: 45,
          }}
        />
      )}

      {/* Film Grain Cinematográfico */}
      {props.filmGrain && (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,${props.filmGrainIntensity || 0.1}) 1px, transparent 0)`,
            backgroundSize: '4px 4px',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 46,
          }}
        />
      )}

      {/* Viñeta Cinematográfica */}
      {props.vignette && (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.95) 100%)',
            opacity: props.vignetteIntensity || 0.6,
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}

      {/* Barras Anamórficas 2.39:1 (Cinema Letterbox) */}
      {props.letterbox && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: props.letterboxHeight || 50,
              backgroundColor: '#000000',
              zIndex: 55,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: props.letterboxHeight || 50,
              backgroundColor: '#000000',
              zIndex: 55,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {/* PISTA A2: AUDIO FX LOCAL ESPECÍFICO DE LA ESCENA */}
      {scene.audioFxUrl && (
        <Audio
          src={scene.audioFxUrl}
          volume={0.9}
          onError={() => {
            // Error silencioso controlado
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Componente Principal Multiescena con Mezcla de Audio NLE
export const EarOsPromo: React.FC<EarOsPromoProps> = (userProps) => {
  const props: EarOsPromoProps = { ...defaultEarOsPromoProps, ...userProps };
  const { fps } = useVideoConfig();

  const scenes = props.scenes && props.scenes.length > 0 ? props.scenes : defaultScenes;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* PISTA A1: MÚSICA MASTER SOUNDTRACK */}
      {props.soundtrackUrl && !props.soundtrackMuted && (
        <Audio
          src={props.soundtrackUrl}
          volume={props.soundtrackVolume ?? 0.8}
          onError={() => {
            // Error silencioso controlado
          }}
        />
      )}

      {/* SECUENCIA MULTI-ESCENA EN TIMELINE */}
      <Series>
        {scenes.map((scene, idx) => {
          const durationFrames = Math.max(60, Math.round((scene.durationInSeconds || 3) * fps));
          return (
            <Series.Sequence durationInFrames={durationFrames} key={scene.id || idx}>
              <SingleScene scene={scene} props={props} index={idx} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
