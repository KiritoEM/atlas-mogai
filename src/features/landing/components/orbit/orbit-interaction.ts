export type OrbitInteraction = {
  targetYaw: number;
  targetPitch: number;
  dragging: boolean;
};

export const INITIAL_YAW = -0.22;
export const INITIAL_PITCH = 0.12;

export function createOrbitInteraction(): OrbitInteraction {
  return {
    targetYaw: INITIAL_YAW,
    targetPitch: INITIAL_PITCH,
    dragging: false,
  };
}
