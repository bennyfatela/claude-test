// GraphQL Types - mirrors backend schema

export enum Position {
  GOALKEEPER = 'GOALKEEPER',
  LEFT_WING = 'LEFT_WING',
  LEFT_BACK = 'LEFT_BACK',
  CENTER_BACK = 'CENTER_BACK',
  PIVOT = 'PIVOT',
  RIGHT_BACK = 'RIGHT_BACK',
  RIGHT_WING = 'RIGHT_WING',
}

export enum EventType {
  GOAL = 'GOAL',
  SAVE = 'SAVE',
  TECHNICAL_FOUL = 'TECHNICAL_FOUL',
  TWO_MINUTE_SUSPENSION = 'TWO_MINUTE_SUSPENSION',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  SEVEN_METER_THROW = 'SEVEN_METER_THROW',
  ASSIST = 'ASSIST',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum SessionType {
  TRAINING = 'TRAINING',
  GAME = 'GAME',
}

export enum SessionObjective {
  ATTACK = 'ATTACK',
  DEFENSE = 'DEFENSE',
  TRANSITIONS = 'TRANSITIONS',
}

export enum SessionComponent {
  INDIVIDUAL_TACTIC = 'INDIVIDUAL_TACTIC',
  INDIVIDUAL_TECHNIC = 'INDIVIDUAL_TECHNIC',
  GROUP_TACTIC = 'GROUP_TACTIC',
  COLLECTIVE_TACTIC = 'COLLECTIVE_TACTIC',
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position: Position;
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
  objectives?: SessionObjective[];
  components?: SessionComponent[];
  comments?: string;
  recurringId?: string;
  recurringPattern?: 'none' | 'weekly' | 'custom';
  recurringDays?: number[];
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
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

export interface Drill {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  category?: string;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  playerId: string;
  sessionId: string;
  sessionType: SessionType;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}

export interface GameEvent {
  id: string;
  gameId: string;
  playerId?: string;
  eventType: EventType;
  timestamp: number;
  videoTimestamp?: number;
  period?: number;
  comments?: string;
  createdAt: string;
}

export interface Statistics {
  playerId?: string;
  playerName?: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  saves: number;
  technicalFouls: number;
  suspensions: number;
  attendanceRate?: number;
}
