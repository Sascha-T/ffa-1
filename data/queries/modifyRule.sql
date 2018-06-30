UPDATE rules
    SET content = $1, mute_length = $2
        WHERE (guild_id, category, epoch) = ($3, $4, $5)
