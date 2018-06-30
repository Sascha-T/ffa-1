UPDATE users
    SET muted = {0}
        WHERE (guild_id, user_id) = ($1, $2)
