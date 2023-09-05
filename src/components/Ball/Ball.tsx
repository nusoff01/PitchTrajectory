import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Mesh } from "three";
import { CatmullRomLine } from "@react-three/drei";
import { PITCH_PERSPECTIVE } from "../../App";


const baseballDiameter = 0.11975; // in feet

type TrajectoryFunction = (t: number) => number;

function createTrajectoryFunction (
    v0: number, aT: number, d0: number
): TrajectoryFunction {
    return (t: number) => (v0 * t + 0.5 * aT * Math.pow(t, 2) + d0);
}

function findIntercept (a: number, b: number, c: number) {
    return -(Math.sqrt(Math.pow(a, 2) - 2*b*c) + a) / b;
}

function generateLine (xTrajectory: any, yTrajectory: any, zTrajectory: any, lastTime: number) {
    const points: [number, number, number][] = [];
    for (let i = 0; i <= 100; i ++) {
        const currTime = i / 100 * lastTime;
        points.push([
            xTrajectory(currTime),
            yTrajectory(currTime),
            zTrajectory(currTime)
        ]);
    }
    return points;
}

interface BallInterface {
    perspective: PITCH_PERSPECTIVE, // triggers a clock reset when changed
    timeOffset: number,
    xCoefficients: [number, number, number], 
    yCoefficients: [number, number, number], 
    zCoefficients: [number, number, number],
    texture: any,
    onHover?: any,
    onClick?: any
}

export function Ball ({
    perspective,
    timeOffset,
    xCoefficients,
    yCoefficients,
    zCoefficients,
    texture,
    onHover,
    onClick
}: BallInterface): JSX.Element {
    const meshRef = useRef<Mesh>(null!);
    const {clock} = useThree();
    
    useEffect(() => {
        clock.start();
    }, [perspective]);

    const xTrajectory = useCallback((t: number) => {
        return createTrajectoryFunction(
            xCoefficients[0], 
            xCoefficients[1], 
            xCoefficients[2]
        )(t);
    }, [xCoefficients]);
    const yTrajectory = useCallback((t: number) => {
        return createTrajectoryFunction(
            yCoefficients[0], 
            yCoefficients[1], 
            yCoefficients[2]
        )(t);
    }, [yCoefficients]);
    const zTrajectory = useCallback((t: number) => {
        return createTrajectoryFunction(
            zCoefficients[0], 
            zCoefficients[1], 
            zCoefficients[2]
        )(t);
    }, [zCoefficients]);

    const strikezoneInterceptTime = useMemo(() => {
        return findIntercept(
            yCoefficients[0], 
            yCoefficients[1], 
            yCoefficients[2]
        );
    }, [yCoefficients]);
    const flightPathLine = useMemo(() => {
        return generateLine(
            xTrajectory, 
            zTrajectory,
            yTrajectory,
            strikezoneInterceptTime
        );
    }, [xTrajectory, yTrajectory, zTrajectory, strikezoneInterceptTime])

    const getPosition = useCallback((t: number, tFunction: TrajectoryFunction) => {
        const constrainedT = Math.min(t, strikezoneInterceptTime);
        return tFunction(constrainedT);
    }, [strikezoneInterceptTime]);

    useFrame(({clock}) => {
        if (clock.running) {
            const rawTime = clock.getElapsedTime();
            const t = rawTime - timeOffset; 
            if (t < 0) {
                meshRef.current.visible = false;
                return;
            } 
            meshRef.current.visible = true;
            meshRef.current.position.x = getPosition(t, xTrajectory);
            meshRef.current.position.y = getPosition(t, zTrajectory);
            meshRef.current.position.z = getPosition(t, yTrajectory);
        }
    })
    const [pathIsVisible, setPathIsVisible] = useState<boolean>(false);
    return (
        <>
            <mesh 
            castShadow
                ref={meshRef}
                onClick={() => { 
                    setPathIsVisible(!pathIsVisible)
                }}
            >
                <sphereGeometry args={[baseballDiameter, 20, 20]} />
                <meshStandardMaterial map={texture}/>
            </mesh>
            <CatmullRomLine
                visible={pathIsVisible}
                points={flightPathLine}
                lineWidth={2}
                color={'#880000'}
            />
        </>
    );
}