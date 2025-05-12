-- CREATE TABLE shopping.stores (
-- 	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
-- 	name TEXT NOT NULL
-- );

-- CREATE TABLE shopping.shopping_list (
-- 	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
-- 	name TEXT NOT NULL,
-- 	store_id INTEGER REFERENCES shopping.stores (id)
-- );

-- CREATE OR REPLACE PROCEDURE shopping.add_item_to_list(IN item_name text, IN store_name text)
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- 	DECLARE new_store_id shopping.stores.id%TYPE;
-- BEGIN	
-- 	IF NOT EXISTS(SELECT 1 FROM shopping.stores WHERE name = store_name) THEN
-- 		INSERT INTO shopping.stores(name) VALUES (store_name)
-- 			RETURNING id INTO new_store_id;
-- 	ELSE
-- 		SELECT id
-- 		INTO new_store_id
-- 		FROM shopping.stores
-- 		WHERE name = store_name;
-- 	END IF;
	
-- 	INSERT INTO shopping.shopping_list(name, store_id) VALUES (item_name, new_store_id);
-- END
-- $BODY$;
-- ALTER PROCEDURE shopping.add_item_to_list(text, text)
--     OWNER TO postgres;

-- CREATE OR REPLACE PROCEDURE shopping.remove_item_from_list(IN item_id INTEGER)
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- BEGIN	
-- 	DELETE FROM shopping.shopping_list
-- 	WHERE id = item_id;
-- END
-- $BODY$;
-- ALTER PROCEDURE shopping.remove_item_from_list(integer)
--     OWNER TO postgres;

-- CREATE OR REPLACE PROCEDURE shopping.update_item(IN item_id INTEGER, IN new_item_name TEXT, IN new_store_name TEXT)
-- LANGUAGE 'plpgsql'
-- AS $BODY$
-- 	DECLARE new_store_id shopping.stores.id%TYPE;
-- BEGIN
-- 	SELECT id 
-- 	INTO new_store_id 
-- 	FROM shopping.stores 
-- 	WHERE name = new_store_name;
	
-- 	IF new_store_id IS NULL THEN
-- 		INSERT INTO shopping.stores(name) VALUES (new_store_name)
-- 			RETURNING id INTO new_store_id;
-- 	END IF;
	
-- 	UPDATE shopping.shopping_list
-- 	SET name = new_item_name,
-- 		store_id = new_store_id
-- 	WHERE id = item_id;
-- END
-- $BODY$;
-- ALTER PROCEDURE shopping.update_item(integer, text, text)
--     OWNER TO postgres;