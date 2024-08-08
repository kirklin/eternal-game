import { GameCtx } from "./gameCtx";
import { LevelGenerator, levelConf } from "./levelGenerator";
import { loadResources } from "./loadResources";
import menu from "./scenes/menu";
import { configureControls, createPlayer } from "./entities";
import Win from "./scenes/win";
import Lose from "./scenes/lose";

loadResources();

GameCtx.setGravity(3200);
GameCtx.layers([
  "bg",
  "game",
  "ui",
], "game");
GameCtx.scene("menu", menu);
GameCtx.scene("game", async ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
  const levelGenerator = LevelGenerator.getInstance();
  const levelData = await levelGenerator.generateLevelWithAI(levelId);
  const level = GameCtx.addLevel(levelData, levelConf);

  GameCtx.add([
    GameCtx.sprite("bg", { width: GameCtx.width(), height: GameCtx.height(), anim: String(levelId % 8) }),
    GameCtx.layer("bg"),
    GameCtx.pos(0, 0),
    GameCtx.fixed(),
  ]);

  const player = createPlayer(GameCtx, 0, 0, levelId, coins);
  GameCtx.add(player);

  let hasStar = false;

  player.onHeadbutt((obj) => {
    if (obj.is("prize") && !hasStar) {
      const star = level.spawn("#", obj.tilePos.sub(0, 1));
      star.jump();
      hasStar = true;
      GameCtx.play("blip");
    }
  });

  player.onCollide("star", (a) => {
    GameCtx.destroy(a);
    player.biggify(3);
    hasStar = false;
    GameCtx.play("powerup");
  });

  let coinPitch = 0;

  GameCtx.onUpdate(() => {
    if (coinPitch > 0) {
      coinPitch = Math.max(0, coinPitch - GameCtx.dt() * 100);
    }
  });
  const coinsLabel = GameCtx.add([
    GameCtx.text(coins),
    GameCtx.pos(24, 24),
    GameCtx.fixed(),
  ]);

  player.onCollide("cake", (c) => {
    GameCtx.destroy(c);
    GameCtx.play("cake", {
      detune: coinPitch,
    });
    coinPitch += 100;
    coins += 1;
    coinsLabel.text = coins;
  });
  configureControls(GameCtx, player);
});

GameCtx.scene("lose", Lose);

GameCtx.scene("win", Win);

GameCtx.go("game");
// Enter inspect mode, which shows the collider outline of each object with area() component, handy for debugging
// Can also be toggled by pressing F1
GameCtx.debug.inspect = false;
