import { GameCtx } from "./gameCtx";

const { loadSprite, loadSound } = GameCtx;

export function loadResources() {
  loadSprite("bg", "/sprites/Level Backgrounds 4.png", {
    sliceX: 3,
    sliceY: 3,
    anims: {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
    },
  });
  loadSprite("kirby", "/sprites/Beam Kirby.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 1, speed: 5, loop: true },
    },
  });
  loadSprite("kirbyRun", "/sprites/Beam Kirby Run.png", {
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 7, speed: 8, loop: true },
    },
  });
  loadSprite("monster", "/sprites/Custom Edited - Kirby Customs - N-Z Paper Mario N64-Style.png", {
    sliceX: 4,
    sliceY: 2,
    anims: {
      run: { from: 4, to: 6, speed: 8, loop: true },
      jump: { from: 0, to: 3, speed: 8, loop: true },
    },
  });
  loadSprite("spike", "/sprites/spike.png");
  loadSprite("grass", "/sprites/grass.png");
  loadSprite("grass2", "/sprites/grass2.png");
  loadSprite("prize", "/sprites/jumpy.png");
  loadSprite("star", "/sprites/star.png");
  loadSprite("portal", "/sprites/portal.png");
  loadSprite("cake", "/sprites/cake.png");

  loadSound("cake", "/sounds/score.mp3");
  loadSound("powerup", "/sounds/powerup.mp3");
  loadSound("blip", "/sounds/blip.mp3");
  loadSound("hit", "/sounds/hit.mp3");
  loadSound("portal", "/sounds/portal.mp3");
}
