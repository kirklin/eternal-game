import type {
  AreaComp,
  BodyComp,
  DoubleJumpComp,
  GameObj,
  HealthComp,
  KKPlayCtx,
  OpacityComp,
  PosComp,
  ScaleComp,
  SpriteComp,
} from "kkplay";
import { FALL_DEATH, JUMP_FORCE, MOVE_SPEED, globalScale } from "./constants";
import { big } from "./components";

// Define a type for the player game object
type PlayerGameObj = GameObj<
  SpriteComp &
  AreaComp &
  BodyComp &
  PosComp &
  ScaleComp &
  DoubleJumpComp &
  HealthComp &
  OpacityComp & {
    speed: number;
    direction: string;
  }
>;

// Create the player game object
export function createPlayer(ctx: KKPlayCtx, posX: number, posY: number, levelId: number, coins: number): PlayerGameObj {
  const player = ctx.make([
    ctx.sprite("kirby", { anim: "idle" }),
    ctx.area({ shape: new ctx.Rect(ctx.vec2(0, 0), 28, 26) }),
    ctx.doubleJump(2),
    ctx.pos(posX * globalScale, posY * globalScale),
    ctx.scale(1.5),
    ctx.body(),
    ctx.anchor("bot"),
    big(),
    ctx.health(3),
    ctx.opacity(1),
    {
      speed: 300,
      direction: "right",
    },
    "player",
  ]);

  player.onBeforePhysicsResolve((collision) => {
    if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
      collision.preventResolution();
    }
  });

  player.onPhysicsResolve(() => {
    ctx.camPos(player.pos);
  });

  // Handle player collision with enemies
  player.onCollide("enemy", async (enemy: GameObj) => {
    ctx.play("hit");
    if (player.hp() === 0) {
      ctx.destroy(player);
      ctx.go("lose");
      return;
    }

    player.hurt();
    await ctx.tween(
      player.opacity,
      0,
      0.05,
      val => (player.opacity = val),
      ctx.easings.linear,
    );
    await ctx.tween(
      player.opacity,
      1,
      0.05,
      val => (player.opacity = val),
      ctx.easings.linear,
    );
  });

  player.onCollide("danger", () => {
    ctx.go("lose");
    ctx.play("hit");
  });

  // Handle player collision with exits
  player.onCollide("portal", () => {
    ctx.play("portal");
    ctx.go("game", {
      levelId: levelId + 1,
      coins,
    });
  });

  // Check if player falls off the screen
  player.onUpdate(() => {
    ctx.camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      ctx.go("lose");
    }
  });

  player.onGround((l) => {
    if (l.is("enemy")) {
      player.jump(JUMP_FORCE * 1.5);
      ctx.destroy(l);
      ctx.play("powerup");
    }
  });
  return player;
}

// Set player controls
export function configureControls(ctx: KKPlayCtx, player: PlayerGameObj) {
  ctx.onKeyDown((key) => {
    switch (key) {
      case "left":
        player.direction = "left";
        player.flipX = true;
        player.move(-MOVE_SPEED, 0);
        break;
      case "right":
        player.direction = "right";
        player.flipX = false;
        player.move(MOVE_SPEED, 0);
        break;
    }
  });
  function jump() {
    if (player.isGrounded()) {
      player.doubleJump(JUMP_FORCE);
    }
  }
  ctx.onKeyPress((key) => {
    if (key === "space") {
      jump();
    }
  });
  ctx.onGamepadButtonPress("south", jump);
  ctx.onGamepadStick("left", (v) => {
    player.move(v.x * MOVE_SPEED, 0);
  });

  ctx.onKeyPress("f", () => {
    ctx.setFullscreen(!ctx.isFullscreen());
  });
}

// Create a flame enemy
export function createFlameEnemy(ctx: KKPlayCtx, posX: number, posY: number) {
  const flame = ctx.add([
    ctx.sprite("monster", { anim: "jump" }),
    ctx.scale(globalScale),
    ctx.pos(posX * globalScale, posY * globalScale),
    ctx.area({
      shape: new ctx.Rect(ctx.vec2(4, 6), 8, 10),
      collisionIgnore: ["enemy"],
    }),
    ctx.body(),
    ctx.state("idle", ["idle", "jump"]),
    "enemy",
  ]);

  flame.onStateEnter("idle", async () => {
    await ctx.wait(1);
    flame.enterState("jump");
  });

  flame.onStateEnter("jump", async () => {
    flame.jump(1000);
  });

  flame.onStateUpdate("jump", () => {
    if (flame.isGrounded()) {
      flame.enterState("idle");
    }
  });

  return flame;
}

// Create a run monster enemy
export function createRunMonsterEnemy(ctx: KKPlayCtx, posX: number, posY: number) {
  const guy = ctx.add([
    ctx.sprite("monster", { anim: "run" }),
    ctx.scale(globalScale),
    ctx.pos(posX * globalScale, posY * globalScale),
    ctx.area({
      shape: new ctx.Rect(ctx.vec2(2, 3.9), 12, 12),
      collisionIgnore: ["enemy"],
    }),
    ctx.body(),
    ctx.state("idle", ["idle", "left", "right", "jump"]),
    { speed: 100 },
    "enemy",
  ]);

  guy.onStateEnter("idle", async () => {
    await ctx.wait(1);
    guy.enterState("left");
  });

  guy.onStateEnter("left", async () => {
    guy.flipX = false;
    await ctx.wait(2);
    guy.enterState("right");
  });

  guy.onStateUpdate("left", () => {
    guy.move(-guy.speed, 0);
  });

  guy.onStateEnter("right", async () => {
    guy.flipX = true;
    await ctx.wait(2);
    guy.enterState("left");
  });

  guy.onStateUpdate("right", () => {
    guy.move(guy.speed, 0);
  });

  return guy;
}

// Create a jump monster enemy
export function createJumpMonsterEnemy(
  ctx: KKPlayCtx,
  posX: number,
  posY: number,
  speed: number,
) {
  const bird = ctx.add([
    ctx.sprite("monster", { anim: "jump" }),
    ctx.scale(globalScale),
    ctx.pos(posX * globalScale, posY * globalScale),
    ctx.area({
      shape: new ctx.Rect(ctx.vec2(4, 6), 8, 10),
      collisionIgnore: ["enemy"],
    }),
    ctx.body({ isStatic: true }),
    ctx.move(ctx.LEFT, speed),
    ctx.offscreen({ destroy: true, distance: 400 }),
    "enemy",
  ]);

  return bird;
}
