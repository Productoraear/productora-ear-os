"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    ContactShadows,
    Float,
    Grid,
    MeshDistortMaterial,
    MeshWobbleMaterial,
    OrbitControls,
    RoundedBox,
    Sparkles,
    Stars,
    Text,
    Trail,
} from "@react-three/drei";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import type { DemoSlug } from "./demo-registry";

const ACCENT_GOLD = "#ecb613";
const ACCENT_RUBY = "#FF2B44";
const ACCENT_CYAN = "#00E5FF";
const DEEP_BG = "#030305";

/* ──────────────────────────── ShaderGradient ──────────────────────────── */

function ShaderGold() {
    return (
        <ShaderGradientCanvas style={{ position: "absolute", inset: 0 }}>
            <ShaderGradient
                control="props"
                type="plane"
                animate="on"
                uSpeed={0.2}
                uStrength={2.2}
                uDensity={1.15}
                uFrequency={5.5}
                uAmplitude={1}
                color1={ACCENT_GOLD}
                color2="#b8840a"
                color3={DEEP_BG}
                reflection={0.22}
                grain="on"
                grainBlending={0.4}
                lightType="env"
                brightness={1}
            />
        </ShaderGradientCanvas>
    );
}

function ShaderRuby() {
    return (
        <ShaderGradientCanvas style={{ position: "absolute", inset: 0 }}>
            <ShaderGradient
                control="props"
                type="sphere"
                animate="on"
                uSpeed={0.3}
                uStrength={2.5}
                uDensity={1.2}
                uFrequency={6}
                uAmplitude={0.9}
                color1={ACCENT_RUBY}
                color2={ACCENT_CYAN}
                color3={DEEP_BG}
                reflection={0.3}
                grain="on"
                grainBlending={0.35}
                lightType="3d"
                brightness={1.05}
                cameraZoom={4.5}
            />
        </ShaderGradientCanvas>
    );
}

/* ──────────────────────────── drei / fiber scenes ──────────────────────────── */

function StarsDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
    );
}

function SparklesDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <mesh>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial color={DEEP_BG} roughness={0.6} metalness={0.3} />
            </mesh>
            <Sparkles count={120} scale={9} size={5} speed={0.4} color={ACCENT_GOLD} />
        </Canvas>
    );
}

function FloatDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <RoundedBox args={[2, 2, 2]} radius={0.2} smoothness={4}>
                    <meshStandardMaterial color={ACCENT_GOLD} metalness={0.9} roughness={0.12} />
                </RoundedBox>
            </Float>
            <ContactShadows position={[0, -2.4, 0]} opacity={0.6} blur={2.6} />
        </Canvas>
    );
}

function WobbleDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <mesh>
                <icosahedronGeometry args={[2, 4]} />
                <MeshWobbleMaterial color={ACCENT_RUBY} factor={1} speed={2} metalness={0.4} roughness={0.3} />
            </mesh>
        </Canvas>
    );
}

function DistortDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <mesh>
                <torusKnotGeometry args={[1.4, 0.38, 160, 24]} />
                <MeshDistortMaterial color={ACCENT_CYAN} distort={0.45} speed={2} metalness={0.5} roughness={0.2} />
            </mesh>
        </Canvas>
    );
}

function TrailBall() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (ref.current) {
            ref.current.position.x = Math.sin(t) * 3;
            ref.current.position.z = Math.cos(t) * 3;
        }
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshBasicMaterial color={ACCENT_GOLD} />
        </mesh>
    );
}

function TrailDemo() {
    return (
        <Canvas camera={{ position: [0, 4, 10] }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <Trail width={0.6} length={8} color={ACCENT_GOLD} attenuation={(width) => width * width}>
                <TrailBall />
            </Trail>
        </Canvas>
    );
}

function TextDemo() {
    return (
        <Canvas camera={{ position: [0, 0, 6] }} dpr={[1, 2]}>
            <ambientLight intensity={0.7} />
            <Text color={ACCENT_GOLD} fontSize={1.4} anchorX="center" anchorY="middle" letterSpacing={0.08}>
                EAR OS
            </Text>
        </Canvas>
    );
}

function GridDemo() {
    return (
        <Canvas camera={{ position: [0, 5, 9] }} dpr={[1, 2]}>
            <Grid
                infiniteGrid
                cellColor="#0a4f5c"
                sectionColor={ACCENT_GOLD}
                cellSize={0.6}
                sectionSize={3}
                fadeDistance={35}
                fadeStrength={1}
            />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
    );
}

function PointsDemo() {
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const count = 2400;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i += 1) {
            positions[i * 3] = (Math.random() - 0.5) * 11;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    return (
        <Canvas camera={{ position: [0, 0, 6] }} dpr={[1, 2]}>
            <points geometry={geometry}>
                <pointsMaterial
                    color={ACCENT_CYAN}
                    size={0.05}
                    sizeAttenuation
                    transparent
                    opacity={0.85}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </Canvas>
    );
}

function ContactShadowsDemo() {
    return (
        <Canvas camera={{ position: [0, 3, 8] }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
            <mesh>
                <torusGeometry args={[1.5, 0.4, 32, 64]} />
                <meshStandardMaterial color={ACCENT_GOLD} metalness={0.8} roughness={0.2} />
            </mesh>
            <ContactShadows position={[0, -2.2, 0]} opacity={0.7} blur={2.8} scale={12} far={4} />
        </Canvas>
    );
}

/* ──────────────────────────── dispatcher ──────────────────────────── */

function DemoCanvas({ slug }: { slug: DemoSlug }) {
    switch (slug) {
        case "shadergradient-gold":
            return <ShaderGold />;
        case "shadergradient-ruby":
            return <ShaderRuby />;
        case "stars":
            return <StarsDemo />;
        case "sparkles":
            return <SparklesDemo />;
        case "float":
            return <FloatDemo />;
        case "wobble":
            return <WobbleDemo />;
        case "distort":
            return <DistortDemo />;
        case "trail":
            return <TrailDemo />;
        case "text":
            return <TextDemo />;
        case "grid":
            return <GridDemo />;
        case "points":
            return <PointsDemo />;
        case "contact-shadows":
            return <ContactShadowsDemo />;
        default:
            return null;
    }
}

export default function VisualDemo({ slug }: { slug: DemoSlug }) {
    return (
        <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#030305]">
            <DemoCanvas slug={slug} />
        </div>
    );
}