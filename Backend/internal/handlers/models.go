package handlers

import (
    "github.com/google/uuid"
    "vomo/internal/domain/user"
)

type CreateUserRequest struct {
    Username string `json:"username" binding:"required"`
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
    RoleID   int    `json:"role_id" binding:"required"`
}

type UserResponse struct {
    ID       uuid.UUID `json:"id"`
    Username string    `json:"username"`
    Email    string    `json:"email"`
    RoleID   int      `json:"role_id"`
}

type ErrorResponse struct {
    Error string `json:"error"`
}

func ToUserResponse(u *user.User) UserResponse {
    return UserResponse{
        ID:       u.ID,
        Username: u.Username,
        Email:    u.Email,
        RoleID:   u.RoleID,  // Changed from uuid.UUID(u.RoleID) to just u.RoleID
    }
}

func ToUserResponses(users []user.User) []UserResponse {
    responses := make([]UserResponse, len(users))
    for i, u := range users {
        responses[i] = ToUserResponse(&u)
    }
    return responses
}