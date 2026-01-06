import { defineStore } from 'pinia';
import type { TrainingSession } from '../types';
import { apolloClient } from '../graphql/client';
import { GET_TRAINING_SESSIONS } from '../graphql/queries';
import { CREATE_TRAINING_SESSION, UPDATE_TRAINING_SESSION, DELETE_TRAINING_SESSION, DELETE_TRAINING_SESSIONS_BY_RECURRING_ID } from '../graphql/mutations';

interface TrainingSessionsState {
  sessions: TrainingSession[];
  loading: boolean;
  error: string | null;
}

export const useTrainingSessionsStore = defineStore('trainingSessions', {
  state: (): TrainingSessionsState => ({
    sessions: [],
    loading: false,
    error: null,
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
    async fetchTrainingSessions() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apolloClient.query({
          query: GET_TRAINING_SESSIONS,
        });
        // Create copies with mutable arrays to avoid frozen array issues
        this.sessions = data.trainingSessions.map((session: any) => ({
          ...session,
          objectives: session.objectives ? [...session.objectives] : [],
          components: session.components ? [...session.components] : [],
          recurringDays: session.recurringDays ? [...session.recurringDays] : [],
        }));
      } catch (error: any) {
        this.error = error.message;
        console.error('Error fetching training sessions:', error);
      } finally {
        this.loading = false;
      }
    },

    generateSessionTitle(date: string, startTime: string): string {
      // Get all sessions sorted by date and time
      const sortedSessions = [...this.sessions].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      // Count sessions that come before this one chronologically
      let sessionNumber = 1;
      const targetDateTime = new Date(`${date}T${startTime}`);

      for (const session of sortedSessions) {
        const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
        if (sessionDateTime < targetDateTime) {
          sessionNumber++;
        }
      }

      return `Session ${sessionNumber}`;
    },

    async renumberAllSessions() {
      // Sort all sessions by date and time
      const sortedSessions = [...this.sessions].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });

      // Renumber each session individually in chronological order
      for (let i = 0; i < sortedSessions.length; i++) {
        const session = sortedSessions[i];
        const newTitle = `Session ${i + 1}`;

        // Update title if it changed
        if (session.title !== newTitle) {
          try {
            await apolloClient.mutate({
              mutation: UPDATE_TRAINING_SESSION,
              variables: {
                id: session.id,
                input: {
                  title: newTitle,
                  date: session.date,
                  startTime: session.startTime,
                  endTime: session.endTime,
                  location: session.location,
                  objectives: session.objectives,
                  components: session.components,
                  comments: session.comments,
                  recurringPattern: session.recurringPattern,
                  recurringDays: session.recurringDays,
                  recurringEndDate: session.recurringEndDate,
                },
              },
            });
            // Update local store
            const index = this.sessions.findIndex((s) => s.id === session.id);
            if (index !== -1) {
              this.sessions[index].title = newTitle;
            }
          } catch (error) {
            console.error('Error renumbering session:', error);
          }
        }
      }
    },

    async addSession(sessionData: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;

      try {
        console.log('addSession called with:', sessionData);
        console.log('recurringPattern:', sessionData.recurringPattern);
        console.log('recurringEndDate:', sessionData.recurringEndDate);

        // If recurring, generate multiple sessions
        if (sessionData.recurringPattern && sessionData.recurringPattern !== 'none' && sessionData.recurringEndDate) {
          console.log('Creating recurring sessions');
          const recurringId = crypto.randomUUID();
          const sessions = this.generateRecurringSessions(sessionData, recurringId);
          console.log(`Generated ${sessions.length} sessions`);

          // Create all sessions via GraphQL - each gets its own title based on when it occurs
          for (let i = 0; i < sessions.length; i++) {
            const sessionToCreate = sessions[i];
            const title = this.generateSessionTitle(sessionToCreate.date, sessionToCreate.startTime);
            console.log(`Creating session ${i + 1}/${sessions.length}:`, sessionToCreate, 'with title:', title);
            const { data } = await apolloClient.mutate({
              mutation: CREATE_TRAINING_SESSION,
              variables: {
                input: { ...sessionToCreate, title },
              },
            });
            // Create a copy with mutable arrays to avoid frozen array issues
            const session = {
              ...data.createTrainingSession,
              objectives: data.createTrainingSession.objectives ? [...data.createTrainingSession.objectives] : [],
              components: data.createTrainingSession.components ? [...data.createTrainingSession.components] : [],
              recurringDays: data.createTrainingSession.recurringDays ? [...data.createTrainingSession.recurringDays] : [],
            };
            this.sessions.push(session);
          }
          console.log('All recurring sessions created successfully');
          return sessions;
        } else {
          console.log('Creating single session');
          // Single session
          const title = this.generateSessionTitle(sessionData.date, sessionData.startTime);
          const { data } = await apolloClient.mutate({
            mutation: CREATE_TRAINING_SESSION,
            variables: {
              input: {
                ...sessionData,
                title,
                recurringPattern: 'none',
              },
            },
          });
          // Create a copy with mutable arrays to avoid frozen array issues
          const session = {
            ...data.createTrainingSession,
            objectives: data.createTrainingSession.objectives ? [...data.createTrainingSession.objectives] : [],
            components: data.createTrainingSession.components ? [...data.createTrainingSession.components] : [],
            recurringDays: data.createTrainingSession.recurringDays ? [...data.createTrainingSession.recurringDays] : [],
          };
          this.sessions.push(session);
          return [session];
        }
      } catch (error: any) {
        this.error = error.message;
        console.error('Error creating training session:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    generateRecurringSessions(
      sessionData: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>,
      recurringId: string
    ): Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>[] {
      const sessions: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      const startDate = new Date(sessionData.date);
      const endDate = new Date(sessionData.recurringEndDate!);

      if (sessionData.recurringPattern === 'weekly') {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          sessions.push({
            date: currentDate.toISOString().split('T')[0],
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            location: sessionData.location,
            objectives: [],
            components: [],
            comments: '',
            recurringId,
            recurringPattern: sessionData.recurringPattern,
            recurringDays: sessionData.recurringDays,
            recurringEndDate: sessionData.recurringEndDate,
          });
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else if (sessionData.recurringPattern === 'custom' && sessionData.recurringDays?.length) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() - currentDate.getDay());
        
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          if (sessionData.recurringDays.includes(dayOfWeek) && currentDate >= startDate) {
            sessions.push({
              date: currentDate.toISOString().split('T')[0],
              startTime: sessionData.startTime,
              endTime: sessionData.endTime,
              location: sessionData.location,
              objectives: [],
              components: [],
              comments: '',
              recurringId,
              recurringPattern: sessionData.recurringPattern,
              recurringDays: sessionData.recurringDays,
              recurringEndDate: sessionData.recurringEndDate,
            });
          }
          currentDate = new Date(currentDate);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      return sessions;
    },

    async updateSession(id: string, sessionData: Partial<TrainingSession>) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apolloClient.mutate({
          mutation: UPDATE_TRAINING_SESSION,
          variables: {
            id,
            input: sessionData,
          },
        });
        // Create a copy with mutable arrays to avoid frozen array issues
        const session = {
          ...data.updateTrainingSession,
          objectives: data.updateTrainingSession.objectives ? [...data.updateTrainingSession.objectives] : [],
          components: data.updateTrainingSession.components ? [...data.updateTrainingSession.components] : [],
          recurringDays: data.updateTrainingSession.recurringDays ? [...data.updateTrainingSession.recurringDays] : [],
        };
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sessions[index] = session;
        }
        return session;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error updating training session:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSession(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await apolloClient.mutate({
          mutation: DELETE_TRAINING_SESSION,
          variables: { id },
        });
        const index = this.sessions.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.sessions.splice(index, 1);
        }
        return true;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error deleting training session:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteAllRecurringSessions(recurringId: string) {
      this.loading = true;
      this.error = null;
      try {
        await apolloClient.mutate({
          mutation: DELETE_TRAINING_SESSIONS_BY_RECURRING_ID,
          variables: { recurringId },
        });
        this.sessions = this.sessions.filter((s) => s.recurringId !== recurringId);
        return true;
      } catch (error: any) {
        this.error = error.message;
        console.error('Error deleting recurring sessions:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
