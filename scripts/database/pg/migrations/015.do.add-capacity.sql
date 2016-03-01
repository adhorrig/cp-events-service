DO $$
	BEGIN
		BEGIN
			ALTER TABLE cd_events ADD COLUMN capacity integer;
		EXCEPTION
			WHEN duplicate_column THEN RAISE NOTICE 'column capacity already exists in cd_applications.';
		END;
	END;
$$