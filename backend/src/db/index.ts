import * as fs from 'fs';
import * as path from 'path';

const DB_DIR = path.join(__dirname, '../../data');
const PLAYERS_FILE = path.join(DB_DIR, 'players.json');
const SESSIONS_FILE = path.join(DB_DIR, 'training-sessions.json');
const ATTENDANCE_FILE = path.join(DB_DIR, 'attendance.json');
const GAMES_FILE = path.join(DB_DIR, 'games.json');

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
if (!fs.existsSync(ATTENDANCE_FILE)) {
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(GAMES_FILE)) {
  fs.writeFileSync(GAMES_FILE, JSON.stringify([], null, 2));
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

export interface AttendanceRecord {
  id: string;
  playerId: string;
  sessionId: string;
  sessionType: 'TRAINING' | 'GAME';
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'NOT_APPLICABLE';
  notes?: string;
  createdAt: string;
}

export interface Game {
  id: string;
  date: string;
  startTime: string;
  opponent: string;
  location?: string;
  homeGame: boolean;
  finalScore?: string;
  videoUrl?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

class Database {
  // Players
  getPlayers(): Player[] {
    try {
      const data = fs.readFileSync(PLAYERS_FILE, 'utf-8');
      if (!data || data.trim() === '') {
        // If file is empty, return empty array and reinitialize file
        fs.writeFileSync(PLAYERS_FILE, JSON.stringify([], null, 2));
        return [];
      }
      const players = JSON.parse(data);
      // Ensure all players have positions as an array
      return players.map((p: any) => ({
        ...p,
        positions: Array.isArray(p.positions) ? p.positions : [],
      }));
    } catch (error) {
      console.error('Error reading players file:', error);
      // If file is corrupted, backup and reinitialize
      if (fs.existsSync(PLAYERS_FILE)) {
        const backupFile = PLAYERS_FILE + '.backup.' + Date.now();
        fs.copyFileSync(PLAYERS_FILE, backupFile);
        console.log(`Corrupted file backed up to ${backupFile}`);
      }
      fs.writeFileSync(PLAYERS_FILE, JSON.stringify([], null, 2));
      return [];
    }
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
      // Ensure positions is always an array, never null or undefined
      positions: Array.isArray(player.positions) ? player.positions : [],
      createdAt: now,
      updatedAt: now,
    };
    players.push(newPlayer);
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2));

    // Mark as N/A in all past training sessions
    this.markPlayerAsNAInPastSessions(newPlayer.id);

    return newPlayer;
  }

  private markPlayerAsNAInPastSessions(playerId: string): void {
    const sessions = this.getTrainingSessions();
    const today = new Date().toISOString().split('T')[0];

    // Find all past sessions
    const pastSessions = sessions.filter(session => session.date < today);

    // Mark attendance as N/A for each past session
    pastSessions.forEach(session => {
      this.recordAttendance({
        playerId,
        sessionId: session.id,
        sessionType: 'TRAINING',
        status: 'NOT_APPLICABLE',
      });
    });
  }

  updatePlayer(id: string, data: Partial<Player>): Player | null {
    const players = this.getPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Ensure positions is always an array, never null or undefined
    const updatedData = { ...data };
    if ('positions' in updatedData && !Array.isArray(updatedData.positions)) {
      updatedData.positions = [];
    }

    players[index] = {
      ...players[index],
      ...updatedData,
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
    try {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      if (!data || data.trim() === '') {
        // If file is empty, return empty array and reinitialize file
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading training sessions file:', error);
      // If file is corrupted, backup and reinitialize
      if (fs.existsSync(SESSIONS_FILE)) {
        const backupFile = SESSIONS_FILE + '.backup.' + Date.now();
        fs.copyFileSync(SESSIONS_FILE, backupFile);
        console.log(`Corrupted file backed up to ${backupFile}`);
      }
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
      return [];
    }
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

  // Attendance
  getAttendanceRecords(sessionId?: string, playerId?: string): AttendanceRecord[] {
    try {
      const data = fs.readFileSync(ATTENDANCE_FILE, 'utf-8');
      if (!data || data.trim() === '') {
        fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify([], null, 2));
        return [];
      }
      let records = JSON.parse(data);

      if (sessionId) {
        records = records.filter((r: AttendanceRecord) => r.sessionId === sessionId);
      }
      if (playerId) {
        records = records.filter((r: AttendanceRecord) => r.playerId === playerId);
      }

      return records;
    } catch (error) {
      console.error('Error reading attendance file:', error);
      if (fs.existsSync(ATTENDANCE_FILE)) {
        const backupFile = ATTENDANCE_FILE + '.backup.' + Date.now();
        fs.copyFileSync(ATTENDANCE_FILE, backupFile);
        console.log(`Corrupted file backed up to ${backupFile}`);
      }
      fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify([], null, 2));
      return [];
    }
  }

  recordAttendance(input: Omit<AttendanceRecord, 'id' | 'createdAt'>): AttendanceRecord {
    const records = this.getAttendanceRecords();

    // Check if attendance already exists for this player and session
    const existingIndex = records.findIndex(
      r => r.playerId === input.playerId && r.sessionId === input.sessionId
    );

    if (existingIndex !== -1) {
      // Update existing record
      records[existingIndex] = {
        ...records[existingIndex],
        ...input,
      };
      fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2));
      return records[existingIndex];
    }

    // Create new record
    const newRecord: AttendanceRecord = {
      id: this.generateId(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    records.push(newRecord);
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2));
    return newRecord;
  }

  updateAttendance(id: string, status: string, notes?: string): AttendanceRecord | null {
    const records = this.getAttendanceRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    records[index] = {
      ...records[index],
      status: status as any,
      notes: notes || records[index].notes,
    };
    fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(records, null, 2));
    return records[index];
  }

  // Games
  getGames(): Game[] {
    try {
      const data = fs.readFileSync(GAMES_FILE, 'utf-8');
      if (!data || data.trim() === '') {
        fs.writeFileSync(GAMES_FILE, JSON.stringify([], null, 2));
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading games file:', error);
      if (fs.existsSync(GAMES_FILE)) {
        const backupFile = GAMES_FILE + '.backup.' + Date.now();
        fs.copyFileSync(GAMES_FILE, backupFile);
        console.log(`Corrupted file backed up to ${backupFile}`);
      }
      fs.writeFileSync(GAMES_FILE, JSON.stringify([], null, 2));
      return [];
    }
  }

  getGame(id: string): Game | null {
    const games = this.getGames();
    return games.find(g => g.id === id) || null;
  }

  createGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Game {
    const games = this.getGames();
    const now = new Date().toISOString();
    const newGame: Game = {
      id: this.generateId(),
      ...game,
      createdAt: now,
      updatedAt: now,
    };
    games.push(newGame);
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
    return newGame;
  }

  updateGame(id: string, data: Partial<Game>): Game | null {
    const games = this.getGames();
    const index = games.findIndex(g => g.id === id);
    if (index === -1) return null;

    games[index] = {
      ...games[index],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
    return games[index];
  }

  deleteGame(id: string): boolean {
    const games = this.getGames();
    const filtered = games.filter(g => g.id !== id);
    if (filtered.length === games.length) return false;
    fs.writeFileSync(GAMES_FILE, JSON.stringify(filtered, null, 2));
    return true;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const db = new Database();
