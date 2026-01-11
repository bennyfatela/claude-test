import gql from 'graphql-tag';

export const typeDefs = gql`
  # Enums
  enum Position {
    GOALKEEPER
    LEFT_WING
    LEFT_BACK
    CENTER_BACK
    PIVOT
    RIGHT_BACK
    RIGHT_WING
  }

  enum EventType {
    GOAL
    SAVE
    TECHNICAL_FOUL
    TWO_MINUTE_SUSPENSION
    YELLOW_CARD
    RED_CARD
    SEVEN_METER_THROW
    ASSIST
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    EXCUSED
    NOT_APPLICABLE
  }

  enum SessionType {
    TRAINING
    GAME
  }

  enum SessionObjective {
    ATTACK
    DEFENSE
    TRANSITIONS
  }

  enum SessionComponent {
    INDIVIDUAL_TACTIC
    INDIVIDUAL_TECHNIC
    GROUP_TACTIC
    COLLECTIVE_TACTIC
  }

  # Types
  type Player {
    id: ID!
    firstName: String!
    lastName: String!
    jerseyNumber: Int
    positions: [Position!]!
    dateOfBirth: String
    photo: String
    comments: String
    createdAt: String!
    updatedAt: String!
    attendanceRecords: [AttendanceRecord!]!
    gameEvents: [GameEvent!]!
  }

  type TrainingSession {
    id: ID!
    title: String
    date: String!
    startTime: String!
    endTime: String
    location: String
    objectives: [SessionObjective!]
    components: [SessionComponent!]
    comments: String
    recurringId: String
    recurringPattern: String
    recurringDays: [Int!]
    recurringEndDate: String
    createdAt: String!
    updatedAt: String!
  }

  type Game {
    id: ID!
    date: String!
    startTime: String!
    opponent: String!
    location: String
    homeGame: Boolean!
    finalScore: String
    videoUrl: String
    comments: String
    events: [GameEvent!]!
    attendanceRecords: [AttendanceRecord!]!
    createdAt: String!
    updatedAt: String!
  }

  type Drill {
    id: ID!
    name: String!
    description: String
    objectives: [String!]
    feedback: String
    duration: Int
    category: String
    isTemplate: Boolean!
    imageUrl: String
    videoUrl: String
    diagramData: String
    createdAt: String!
    updatedAt: String!
  }

  type AttendanceRecord {
    id: ID!
    playerId: ID!
    sessionId: ID
    sessionType: SessionType!
    status: AttendanceStatus!
    notes: String
    player: Player!
    createdAt: String!
  }

  type GameEvent {
    id: ID!
    gameId: ID!
    playerId: ID
    eventType: EventType!
    timestamp: Int!
    videoTimestamp: Int
    period: Int
    comments: String
    player: Player
    game: Game!
    createdAt: String!
  }

  type Statistics {
    playerId: ID
    playerName: String
    gamesPlayed: Int!
    goals: Int!
    assists: Int!
    saves: Int!
    technicalFouls: Int!
    suspensions: Int!
    attendanceRate: Float
  }

  # Input Types
  input PlayerInput {
    firstName: String!
    lastName: String!
    jerseyNumber: Int
    positions: [Position!]!
    dateOfBirth: String
    photo: String
    comments: String
  }

  input TrainingSessionInput {
    title: String
    date: String!
    startTime: String!
    endTime: String
    location: String
    objectives: [SessionObjective!]
    components: [SessionComponent!]
    comments: String
    recurringId: String
    recurringPattern: String
    recurringDays: [Int!]
    recurringEndDate: String
  }

  input GameInput {
    date: String!
    startTime: String!
    opponent: String!
    location: String
    homeGame: Boolean!
    videoUrl: String
    comments: String
  }

  input DrillInput {
    name: String!
    description: String
    objectives: [String!]
    feedback: String
    duration: Int
    category: String
    isTemplate: Boolean!
    imageUrl: String
    videoUrl: String
    diagramData: String
  }

  input AttendanceInput {
    playerId: ID!
    sessionId: ID!
    sessionType: SessionType!
    status: AttendanceStatus!
    notes: String
  }

  input GameEventInput {
    gameId: ID!
    playerId: ID
    eventType: EventType!
    timestamp: Int!
    videoTimestamp: Int
    period: Int
    comments: String
  }

  input StatisticsFilter {
    playerId: ID
    gameId: ID
    startDate: String
    endDate: String
    season: String
  }

  # Queries
  type Query {
    # Players
    players: [Player!]!
    player(id: ID!): Player

    # Training Sessions
    trainingSessions: [TrainingSession!]!
    trainingSession(id: ID!): TrainingSession

    # Games
    games: [Game!]!
    game(id: ID!): Game

    # Drills
    drills: [Drill!]!
    drillTemplates: [Drill!]!
    drill(id: ID!): Drill

    # Attendance
    attendanceRecords(sessionId: ID, playerId: ID): [AttendanceRecord!]!

    # Events
    gameEvents(gameId: ID!): [GameEvent!]!

    # Statistics
    statistics(filter: StatisticsFilter): [Statistics!]!
  }

  # Mutations
  type Mutation {
    # Player mutations
    createPlayer(input: PlayerInput!): Player!
    updatePlayer(id: ID!, input: PlayerInput!): Player!
    deletePlayer(id: ID!): Boolean!

    # Training session mutations
    createTrainingSession(input: TrainingSessionInput!): TrainingSession!
    updateTrainingSession(id: ID!, input: TrainingSessionInput!): TrainingSession!
    deleteTrainingSession(id: ID!): Boolean!
    deleteTrainingSessionsByRecurringId(recurringId: ID!): Int!

    # Game mutations
    createGame(input: GameInput!): Game!
    updateGame(id: ID!, input: GameInput!): Game!
    deleteGame(id: ID!): Boolean!

    # Drill mutations
    createDrill(input: DrillInput!): Drill!
    updateDrill(id: ID!, input: DrillInput!): Drill!
    deleteDrill(id: ID!): Boolean!

    # Attendance mutations
    recordAttendance(input: AttendanceInput!): AttendanceRecord!
    updateAttendance(id: ID!, status: AttendanceStatus!, notes: String): AttendanceRecord!
    deleteAttendance(playerId: ID!, sessionId: ID!): Boolean!

    # Event mutations
    createGameEvent(input: GameEventInput!): GameEvent!
    updateGameEvent(id: ID!, input: GameEventInput!): GameEvent!
    deleteGameEvent(id: ID!): Boolean!
  }
`;
