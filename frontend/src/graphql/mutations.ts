import { gql } from '@apollo/client';

// Player Mutations
export const CREATE_PLAYER = gql`
  mutation CreatePlayer($input: PlayerInput!) {
    createPlayer(input: $input) {
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

export const UPDATE_PLAYER = gql`
  mutation UpdatePlayer($id: ID!, $input: PlayerInput!) {
    updatePlayer(id: $id, input: $input) {
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

export const DELETE_PLAYER = gql`
  mutation DeletePlayer($id: ID!) {
    deletePlayer(id: $id)
  }
`;

// Training Session Mutations
export const CREATE_TRAINING_SESSION = gql`
  mutation CreateTrainingSession($input: TrainingSessionInput!) {
    createTrainingSession(input: $input) {
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

export const UPDATE_TRAINING_SESSION = gql`
  mutation UpdateTrainingSession($id: ID!, $input: TrainingSessionInput!) {
    updateTrainingSession(id: $id, input: $input) {
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

export const DELETE_TRAINING_SESSION = gql`
  mutation DeleteTrainingSession($id: ID!) {
    deleteTrainingSession(id: $id)
  }
`;

export const DELETE_TRAINING_SESSIONS_BY_RECURRING_ID = gql`
  mutation DeleteTrainingSessionsByRecurringId($recurringId: ID!) {
    deleteTrainingSessionsByRecurringId(recurringId: $recurringId)
  }
`;

// Attendance Mutations
export const RECORD_ATTENDANCE = gql`
  mutation RecordAttendance($input: AttendanceInput!) {
    recordAttendance(input: $input) {
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

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: ID!, $status: AttendanceStatus!, $notes: String) {
    updateAttendance(id: $id, status: $status, notes: $notes) {
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
