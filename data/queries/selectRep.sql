SELECT user_id, reputation
    FROM users
        WHERE (guild_id, in_guild, muted) = ($1, true, false)
    ORDER BY reputation {0}
