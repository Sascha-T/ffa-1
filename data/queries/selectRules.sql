SELECT category, content, epoch, mute_length
    FROM rules
        WHERE guild_id = $1
    ORDER BY epoch ASC
