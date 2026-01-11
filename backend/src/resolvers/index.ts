import { db } from '../db';

export const resolvers = {
  Query: {
    // Players
    players: () => db.getPlayers(),
    player: (_: any, { id }: { id: string }) => db.getPlayer(id),

    // Training Sessions
    trainingSessions: () => db.getTrainingSessions(),
    trainingSession: (_: any, { id }: { id: string }) => db.getTrainingSession(id),

    // Attendance
    attendanceRecords: (_: any, { sessionId, playerId }: { sessionId?: string; playerId?: string }) =>
      db.getAttendanceRecords(sessionId, playerId),

    // Games
    games: () => db.getGames(),
    game: (_: any, { id }: { id: string }) => db.getGame(id),

    // Not yet implemented
    drills: () => [],
    drillTemplates: () => [],
    drill: () => null,
    gameEvents: () => [],
    statistics: () => [],
  },

  Mutation: {
    // Player mutations
    createPlayer: (_: any, { input }: { input: any }) => {
      return db.createPlayer(input);
    },

    updatePlayer: (_: any, { id, input }: { id: string; input: any }) => {
      return db.updatePlayer(id, input);
    },

    deletePlayer: (_: any, { id }: { id: string }) => {
      return db.deletePlayer(id);
    },

    // Training session mutations
    createTrainingSession: (_: any, { input }: { input: any }) => {
      return db.createTrainingSession(input);
    },

    updateTrainingSession: (_: any, { id, input }: { id: string; input: any }) => {
      return db.updateTrainingSession(id, input);
    },

    deleteTrainingSession: (_: any, { id }: { id: string }) => {
      return db.deleteTrainingSession(id);
    },

    deleteTrainingSessionsByRecurringId: (_: any, { recurringId }: { recurringId: string }) => {
      return db.deleteTrainingSessionsByRecurringId(recurringId);
    },

    // Attendance mutations
    recordAttendance: (_: any, { input }: { input: any }) => {
      return db.recordAttendance(input);
    },

    updateAttendance: (_: any, { id, status, notes }: { id: string; status: string; notes?: string }) => {
      return db.updateAttendance(id, status, notes);
    },

    // Game mutations
    createGame: (_: any, { input }: { input: any }) => {
      return db.createGame(input);
    },

    updateGame: (_: any, { id, input }: { id: string; input: any }) => {
      return db.updateGame(id, input);
    },

    deleteGame: (_: any, { id }: { id: string }) => {
      return db.deleteGame(id);
    },

    // Not yet implemented
    createDrill: () => null,
    updateDrill: () => null,
    deleteDrill: () => false,
    createGameEvent: () => null,
    updateGameEvent: () => null,
    deleteGameEvent: () => false,
  },
};
