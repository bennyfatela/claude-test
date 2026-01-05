import * as fs from 'fs';
import * as path from 'path';

const DB_DIR = path.join(__dirname, '../../data');
const PLAYERS_FILE = path.join(DB_DIR, 'players.json');
const SESSIONS_FILE = path.join(DB_DIR, 'training-sessions.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(PLAYERS_FILE)) {
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SESSIONS_FILE)) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  positions: string[];
  dateOfBirth?: string;
  photo?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingSession {
  id: string;
  title?: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  objectives?: string[];
  components?: string[];
  comments?: string;
  recurringId?: string;
  recurringPattern?: string;
  recurringDays?: number[];
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

class Database {
  // Players
  getPlayers(): Player[] {
    const data = fs.readFileSync(PLAYERS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  getPlayer(id: string): Player | null {
    const players = this.getPlayers();
    return players.find(p => p.id === id) || null;
  }

  createPlayer(player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>): Player {
    const players = this.getPlayers();
    const now = new Date().toISOString();
    const newPlayer: Player = {
      id: this.generateId(),
      ...player,
      createdAt: now,
      updatedAt: now,
    };
    players.push(newPlayer);
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
    return newPlayer;
  }

  updatePlayer(id: string, data: Partial<Player>): Player | null {
    const players = this.getPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;

    players[index] = {
      ...players[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));
    return players[index];
  }

  deletePlayer(id: string): boolean {
    const players = this.getPlayers();
    const filtered = players.filter(p => p.id !== id);
    if (filtered.length === players.length) return false;
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(filtered, null, 2));
    return true;
  }

  // Training Sessions
  getTrainingSessions(): TrainingSession[] {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  getTrainingSession(id: string): TrainingSession | null {
    const sessions = this.getTrainingSessions();
    return sessions.find(s => s.id === id) || null;
  }

  createTrainingSession(session: Omit<TrainingSession, 'id' | 'createdAt' | 'updatedAt'>): TrainingSession {
    const sessions = this.getTrainingSessions();
    const now = new Date().toISOString();
    const newSession: TrainingSession = {
      id: this.generateId(),
      ...session,
      createdAt: now,
      updatedAt: now,
    };
    sessions.push(newSession);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    return newSession;
  }

  updateTrainingSession(id: string, data: Partial<TrainingSession>): TrainingSession | null {
    const sessions = this.getTrainingSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    sessions[index] = {
      ...sessions[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
    return sessions[index];
  }

  deleteTrainingSession(id: string): boolean {
    const sessions = this.getTrainingSessions();
    const filtered = sessions.filter(s => s.id !== id);
    if (filtered.length === sessions.length) return false;
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(filtered, null, 2));
    return true;
  }

  deleteTrainingSessionsByRecurringId(recurringId: string): number {
    const sessions = this.getTrainingSessions();
    const filtered = sessions.filter(s => s.recurringId !== recurringId);
    const deletedCount = sessions.length - filtered.length;
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(filtered, null, 2));
    return deletedCount;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const db = new Database();
