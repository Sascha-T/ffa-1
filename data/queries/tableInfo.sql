SELECT column_name, is_nullable, column_default
    FROM information_schema.columns
        WHERE (table_schema, table_name) = ('public', $1)
