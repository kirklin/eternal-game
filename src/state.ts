// Global game state object to manage scenes
export const globalGameState: {
  scenes: string[]; // List of available scenes
  nextScene: string; // The next scene to transition to
  currentScene: string; // The current active scene
  setNextScene: (sceneName: string) => void; // Method to set the next scene
  setCurrentScene: (sceneName: string) => void; // Method to set the current scene
} = {
  scenes: ["level-1", "level-2", "end"],
  nextScene: "",
  currentScene: "level-1",

  // Set the current scene if the scene name is valid
  setCurrentScene(sceneName: string) {
    if (this.scenes.includes(sceneName)) {
      this.currentScene = sceneName;
    }
  },

  // Set the next scene if the scene name is valid
  setNextScene(sceneName: string) {
    if (this.scenes.includes(sceneName)) {
      this.nextScene = sceneName;
    }
  },
};
