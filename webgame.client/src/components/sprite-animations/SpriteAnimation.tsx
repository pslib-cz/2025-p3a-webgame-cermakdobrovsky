import { type FC, useEffect, useRef, useState, useMemo } from 'react';
import { Sprite } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

export type AnimationMap = {
    [key: string]: number[];
};
export type SpriteAnimationProps = {
    src: string;
    animations?: AnimationMap;
    animation?: string;
    frameWidth?: number;
    frameHeight?: number;
    columns?: number;
    rows?: number;
    frameRate?: number;
    loop?: boolean;
    autoplay?: boolean;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
    opacity?: number;
    listening?: boolean;
    delay?: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};
const SpriteAnimation: FC<SpriteAnimationProps> = ({
    src,
    animations,
    animation,
    frameWidth,
    frameHeight,
    columns,
    rows,
    frameRate = 10,
    loop = true,
    autoplay = true,
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    rotation = 0,
    opacity = 1,
    listening = true,
    delay = 0,
    onClick,
    onMouseEnter,
    onMouseLeave
}) => {
    const [image] = useImage(src);
    const spriteRef = useRef<Konva.Sprite>(null);
    const [isRunning, setIsRunning] = useState(false);
    const finalAnimations = useMemo(() => {
        if (animations) return animations;
        if (frameWidth && frameHeight && columns && rows) {
            const frames = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    frames.push(c * frameWidth, r * frameHeight, frameWidth, frameHeight);
                }
            }
            return { 'default': frames };
        }
        return {};
    }, [animations, frameWidth, frameHeight, columns, rows]);
    const currentAnimation = animation || 'default';
    useEffect(() => {
        if (image && spriteRef.current && autoplay) {
            if (!isRunning) {
                if (delay > 0) {
                    const timer = setTimeout(() => {
                        if (spriteRef.current) {
                            spriteRef.current.start();
                            setIsRunning(true);
                        }
                    }, delay);
                    return () => clearTimeout(timer);
                } else {
                    spriteRef.current.start();
                    setIsRunning(true);
                }
            }
        }
    }, [image, isRunning, autoplay, delay]);
    useEffect(() => {
        if (spriteRef.current && currentAnimation) spriteRef.current.animation(currentAnimation);
    }, [currentAnimation]);
    if (!image) return null;
    return (
        <Sprite
            ref={spriteRef}
            x={x}
            y={y}
            scaleX={scaleX}
            scaleY={scaleY}
            rotation={rotation}
            opacity={opacity}
            image={image}
            animation={currentAnimation}
            animations={finalAnimations}
            frameRate={frameRate}
            frameIndex={0}
            loop={loop}
            listening={listening}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            zIndex={10}
        />
    );
};
export default SpriteAnimation;