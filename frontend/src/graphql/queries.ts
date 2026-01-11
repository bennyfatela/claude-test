import { gql } from '@apollo/client';

// Player Queries
export const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      firstName
      lastName
      jerseyNumber
      positions
      dateOfBirth
      photo
      comments
      createdAt
      updatedAt
    }
  }
`;

export const GET_PLAYER = gql`
  query GetPlayer($id: ID!) {
    player(id: $id) {
      id
      firstName
      lastName
      jerseyNumber
      positions
      dateOfBirth
      photo
      comments
      createdAt
      updatedAt
    }
  }
`;

// Training Session Queries
export const GET_TRAINING_SESSIONS = gql`
  query GetTrainingSessions {
    trainingSessions {
      id
      title
      date
      startTime
      endTime
      location
      objectives
      components
      comments
      recurringId
      recurringPattern
      recurringDays
      recurringEndDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRAINING_SESSION = gql`
  query GetTrainingSession($id: ID!) {
    trainingSession(id: $id) {
      id
      title
      date
      startTime
      endTime
      location
      objectives
      components
      comments
      recurringId
      recurringPattern
      recurringDays
      recurringEndDate
      createdAt
      updatedAt
    }
  }
`;

// Attendance Queries
export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords($sessionId: ID, $playerId: ID) {
    attendanceRecords(sessionId: $sessionId, playerId: $playerId) {
      id
      playerId
      sessionId
      sessionType
      status
      notes
      createdAt
    }
  }
`;

// Game Queries
export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      date
      startTime
      opponent
      location
      homeGame
      finalScore
      videoUrl
      comments
      createdAt
      updatedAt
    }
  }
`;

export const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      id
      date
      startTime
      opponent
      location
      homeGame
      finalScore
      videoUrl
      comments
      createdAt
      updatedAt
    }
  }
`;

// Drill Queries
export const GET_DRILLS = gql`
  query GetDrills {
    drills {
      id
      name
      description
      objectives
      feedback
      duration
      category
      isTemplate
      imageUrl
      videoUrl
      diagramData
      createdAt
      updatedAt
    }
  }
`;

export const GET_DRILL_TEMPLATES = gql`
  query GetDrillTemplates {
    drillTemplates {
      id
      name
      description
      objectives
      feedback
      duration
      category
      isTemplate
      imageUrl
      videoUrl
      diagramData
      createdAt
      updatedAt
    }
  }
`;

export const GET_DRILL = gql`
  query GetDrill($id: ID!) {
    drill(id: $id) {
      id
      name
      description
      objectives
      feedback
      duration
      category
      isTemplate
      imageUrl
      videoUrl
      diagramData
      createdAt
      updatedAt
    }
  }
`;
