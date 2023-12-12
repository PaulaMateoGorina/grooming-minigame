import { createStore } from 'vuex'

interface GameState {
  count: number;
}

// Create a new store instance.
const gameStore = createStore({
  state() {
    return {
      count: 0
    } as GameState; // Explicitly define the type of state
  },
  mutations: {
    increment(state: GameState) {
      state.count++;
    }
  }
})

export default gameStore;