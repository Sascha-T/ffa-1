SELECT data_type
    FROM information_schema.columns
        WHERE (table_schema, table_name, column_name) = ('public', $1, $2)
