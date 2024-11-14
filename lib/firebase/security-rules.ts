// Firebase Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUser() {
      return request.resource.data.keys().hasAll(['email', 'createdAt', 'settings']) &&
             request.resource.data.email is string &&
             request.resource.data.createdAt is timestamp;
    }
    
    function isValidSession() {
      return request.resource.data.keys().hasAll(['userId', 'type', 'status', 'startTime']) &&
             request.resource.data.type in ['technical', 'behavioral', 'mock'] &&
             request.resource.data.status in ['in_progress', 'completed'];
    }
    
    // User collection rules
    match /users/{userId} {
      allow read: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && isOwner(userId) && isValidUser();
      allow update: if isAuthenticated() && isOwner(userId);
      allow delete: if isAuthenticated() && isOwner(userId);
      
      // Nested collections
      match /sessions/{sessionId} {
        allow read: if isAuthenticated() && isOwner(userId);
        allow create: if isAuthenticated() && isOwner(userId) && isValidSession();
        allow update: if isAuthenticated() && isOwner(userId);
        allow delete: if isAuthenticated() && isOwner(userId);
      }
    }
    
    // Global collections with user-specific documents
    match /interviews/{interviewId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
  }
}