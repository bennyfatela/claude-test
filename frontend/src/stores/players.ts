import { defineStore } from 'pinia';
import type { Player, Position } from '../types';
import { apolloClient } from '../graphql/client';
import { GET_PLAYERS } from '../graphql/queries';
import { CREATE_PLAYER, UPDATE_PLAYER, DELETE_PLAYER } from '../graphql/mutations';

interface PlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
}

export const usePlayersStore = defineStore('players', {
  state: (): PlayersState => ({
    players: [],
    loading: false,
    error: null,
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
    async fetchPlayers() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apolloClient.query({
          query: GET_PLAYERS,
        });
        this.players = data.players;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error fetching players:', error);
      } finally {
        this.loading = false;
      }
    },

    async addPlayer(playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apolloClient.mutate({
          mutation: CREATE_PLAYER,
          variables: {
            input: playerData,
          },
        });
        this.players.push(data.createPlayer);
        return data.createPlayer;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error creating player:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updatePlayer(id: string, playerData: Partial<Player>) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apolloClient.mutate({
          mutation: UPDATE_PLAYER,
          variables: {
            id,
            input: playerData,
          },
        });
        const index = this.players.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.players[index] = data.updatePlayer;
        }
        return data.updatePlayer;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error updating player:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deletePlayer(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await apolloClient.mutate({
          mutation: DELETE_PLAYER,
          variables: { id },
        });
        const index = this.players.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.players.splice(index, 1);
        }
        return true;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error deleting player:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
