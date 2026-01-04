import { defineStore } from 'pinia';
import type { Player, Position } from '../types';

interface PlayersState {
  players: Player[];
}

export const usePlayersStore = defineStore('players', {
  state: (): PlayersState => ({
    players: [],
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
        return this.players[index];
      }
      return null;
    },

    deletePlayer(id: string) {
      const index = this.players.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.players.splice(index, 1);
        return true;
      }
      return false;
    },
  },
});
