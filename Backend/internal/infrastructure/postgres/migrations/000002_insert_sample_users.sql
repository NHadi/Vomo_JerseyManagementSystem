INSERT INTO users (id, username, email, password, role_id, created_at, updated_at)
VALUES 
    (
        uuid_generate_v4(),
        'admin',
        'admin@example.com',
        '$2a$10$ZWU1YTY3ZDk5NWM3YTJlOOJwFnHAyKxzz.96pRO.c8YyRQkqF3Rq6',
        uuid_generate_v4(),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        uuid_generate_v4(),
        'user1',
        'user1@example.com',
        '$2a$10$ZWU1YTY3ZDk5NWM3YTJlOOJwFnHAyKxzz.96pRO.c8YyRQkqF3Rq6',
        uuid_generate_v4(),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );