import { gql } from '@apollo/client';

// Player Queries
export const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      firstName
      lastName
      jerseyNumber
      position
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
      position
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
