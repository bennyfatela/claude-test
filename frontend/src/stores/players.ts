import { defineStore } from 'pinia';
import type { Player, Position } from '../types';

interface PlayersState {
  players: Player[];
}

const STORAGE_KEY = 'handball-players';

// Load initial state from localStorage
function loadPlayersFromStorage(): Player[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load players from storage:', error);
    return [];
  }
}

// Save players to localStorage
function savePlayersToStorage(players: Player[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.error('Failed to save players to storage:', error);
  }
}

export const usePlayersStore = defineStore('players', {
  state: (): PlayersState => ({
    players: loadPlayersFromStorage(),
  }),

  getters: {
    getPlayerById: (state) => (id: string) => {
      return state.players.find((player) => player.id === id);
    },

    getPlayersByPosition: (state) => (position: Position | null) => {
      if (!position) return state.players;
      return state.players.filter((player) => player.position === position);
    },

    playersCount: (state) => state.players.length,
  },

  actions: {
    addPlayer(playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        ...playerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.players.push(newPlayer);
      savePlayersToStorage(this.players);
      return newPlayer;
    },

    updatePlayer(id: string, playerData: Partial<Player>) {
      const index = this.players.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.players[index] = {
          ...this.players[index],
          ...playerData,
          updatedAt: new Date().toISOString(),
        };
        savePlayersToStorage(this.players);
        return this.players[index];
      }
      return null;
    },

    deletePlayer(id: string) {
      const index = this.players.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.players.splice(index, 1);
        savePlayersToStorage(this.players);
        return true;
      }
      return false;
    },
  },
});
