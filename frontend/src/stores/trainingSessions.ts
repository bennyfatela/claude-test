import { defineStore } from 'pinia';
import type { TrainingSession } from '../types';

interface TrainingSessionsState {
  sessions: TrainingSession[];
}

export const useTrainingSessionsStore = defineStore('trainingSessions', {
  state: (): TrainingSessionsState => ({
    sessions: [],
  }),

  getters: {
    getSessionById: (state) => (id: string) => {
      return state.sessions.find((session) => session.id === id);
    },

    getSessionsByDateRange: (state) => (startDate: string, endDate: string) => {
      return state.sessions.filter((session) => {
        return session.date >= startDate && session.date <= endDate;
      });
    },

    getSessionsByRecurringId: (state) => (recurringId: string) => {
      return state.sessions.filter((session) => session.recurringId === recurringId);
    },

    getAllSessions: (state) => {
      return [...state.sessions].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
    },

    sessionsCount: (state) => state.sessions.length,
  },

  actions: {
    generateSessionTitle(date: string, recurringId?: string): string {
      // Get all existing sessions sorted by date
      const sortedSessions = [...this.sessions].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      // If this is part of a recurring series, check if any session in the series already has a number
      if (recurringId) {
        const existingInSeries = sortedSessions.find((s) => s.recurringId === recurringId);
        if (existingInSeries?.title) {
          return existingInSeries.title;
        }
      }

      // Find the next session number by counting unique sessions/series before this date
      const uniqueSessions = new Set<string>();
      let sessionNumber = 1;

      for (const session of sortedSessions) {
        if (session.date < date) {
          // Count unique sessions or recurring series
          const key = session.recurringId || session.id;
          uniqueSessions.add(key);
        }
      }

      sessionNumber = uniqueSessions.size + 1;
      return `Session ${sessionNumber}`;
    },

    addSession(sessionData: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>) {
      const now = new Date().toISOString();

      // If recurring, generate multiple sessions
      if (sessionData.recurringPattern && sessionData.recurringPattern !== 'none' && sessionData.recurringEndDate) {
        const recurringId = crypto.randomUUID();
        const sessions = this.generateRecurringSessions(sessionData, recurringId);

        // Generate title for the series based on the first session date
        const firstSessionDate = sessions.length > 0 ? sessions[0].date : sessionData.date;
        const title = this.generateSessionTitle(firstSessionDate, recurringId);

        sessions.forEach((session) => {
          this.sessions.push({
            ...session,
            title,
            createdAt: now,
            updatedAt: now,
          });
        });

        return sessions;
      } else {
        // Single session
        const title = this.generateSessionTitle(sessionData.date);
        const newSession: TrainingSession = {
          id: crypto.randomUUID(),
          ...sessionData,
          title,
          recurringPattern: 'none',
          createdAt: now,
          updatedAt: now,
        };
        this.sessions.push(newSession);
        return [newSession];
      }
    },

    generateRecurringSessions(
      sessionData: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>,
      recurringId: string
    ): Omit<TrainingSession, 'createdAt' | 'updatedAt'>[] {
      const sessions: Omit<TrainingSession, 'createdAt' | 'updatedAt'>[] = [];
      const startDate = new Date(sessionData.date);
      const endDate = new Date(sessionData.recurringEndDate!);

      if (sessionData.recurringPattern === 'weekly') {
        // Weekly on the same day
        const dayOfWeek = startDate.getDay();
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          sessions.push({
            id: crypto.randomUUID(),
            ...sessionData,
            date: currentDate.toISOString().split('T')[0],
            recurringId,
          });

          // Move to next week
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else if (sessionData.recurringPattern === 'custom' && sessionData.recurringDays?.length) {
        // Custom days of the week
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday of the week

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();

          if (sessionData.recurringDays.includes(dayOfWeek) && currentDate >= startDate) {
            sessions.push({
              id: crypto.randomUUID(),
              ...sessionData,
              date: currentDate.toISOString().split('T')[0],
              recurringId,
            });
          }

          // Move to next day
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      return sessions;
    },

    updateSession(id: string, sessionData: Partial<TrainingSession>) {
      const index = this.sessions.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sessions[index] = {
          ...this.sessions[index],
          ...sessionData,
          updatedAt: new Date().toISOString(),
        };
        return this.sessions[index];
      }
      return null;
    },

    deleteSession(id: string) {
      const index = this.sessions.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sessions.splice(index, 1);
        return true;
      }
      return false;
    },

    deleteAllRecurringSessions(recurringId: string) {
      const sessionsToDelete = this.sessions.filter((s) => s.recurringId === recurringId);
      this.sessions = this.sessions.filter((s) => s.recurringId !== recurringId);
      return sessionsToDelete.length;
    },
  },
});
