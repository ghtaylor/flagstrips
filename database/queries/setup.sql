--------TODO---------
--SETUP TRIGGER FOR MODIFIED COLUMN

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--Tables--

CREATE TABLE IF NOT EXISTS user_role (
    name text NOT NULL UNIQUE,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (name)
);


CREATE TABLE IF NOT EXISTS user_account (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    email text NOT NULL UNIQUE,
    username text NOT NULL UNIQUE,
    first_name text,
    last_name text,
    password text NOT NULL,
    role_name text NOT NULL REFERENCES user_role(name) DEFAULT 'standard',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, email, username)
);

CREATE TABLE IF NOT EXISTS flag (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_account_id uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Untitled',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, user_account_id)
);

CREATE TABLE IF NOT EXISTS flag_padding (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    flag_id uuid NOT NULL REFERENCES flag(id) ON DELETE CASCADE,
    top integer NOT NULL DEFAULT 6,
    "right" integer NOT NULL DEFAULT 4,
    bottom integer NOT NULL DEFAULT 6,
    "left" integer NOT NULL DEFAULT 4,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, flag_id)
);

CREATE TABLE IF NOT EXISTS flag_border (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    flag_id uuid NOT NULL REFERENCES flag(id) ON DELETE CASCADE,
    width integer NOT NULL DEFAULT 0,
    color text NOT NULL DEFAULT '#000000ff',
    top_left integer NOT NULL DEFAULT 8,
    top_right integer NOT NULL DEFAULT 8,
    bottom_left integer NOT NULL DEFAULT 8,
    bottom_right integer NOT NULL DEFAULT 8,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, flag_id)
);

CREATE TABLE IF NOT EXISTS strip (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    user_account_id uuid NOT NULL REFERENCES user_account(id) ON DELETE CASCADE,
    flag_id uuid NOT NULL REFERENCES flag(id) ON DELETE CASCADE,
    position integer NOT NULL DEFAULT 0,
    background_color text NOT NULL DEFAULT '#ffffffff',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, user_account_id),
    UNIQUE (flag_id, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS strip_image_option (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    uri text NOT NULL DEFAULT 'https://cdns.iconmonstr.com/wp-content/assets/preview/2012/240/iconmonstr-twitter-1.png',
    name text NOT NULL DEFAULT 'Twitter',
    PRIMARY KEY (id)
);

CREATE OR REPLACE FUNCTION max_strip_image_option() RETURNS uuid AS $$ 
    SELECT id FROM strip_image_option LIMIT 1;
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS strip_image (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    strip_id uuid NOT NULL REFERENCES strip(id) ON DELETE CASCADE,
    image_option_id uuid NOT NULL DEFAULT max_strip_image_option() REFERENCES strip_image_option(id),
    size integer NOT NULL DEFAULT 32,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, strip_id)
);

CREATE TABLE IF NOT EXISTS strip_text (
    id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    strip_id uuid NOT NULL REFERENCES strip(id) ON DELETE CASCADE,
    value text NOT NULL DEFAULT 'flagstrips',
    color text NOT NULL DEFAULT '#000000ff',
    font_family text NOT NULL DEFAULT 'Arial',
    font_weight text NOT NULL DEFAULT 'normal',
    font_size text NOT NULL DEFAULT '16pt',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, strip_id)
);

CREATE OR REPLACE FUNCTION insert_strip_children() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP != 'INSERT') THEN
            RAISE EXCEPTION 'Operation must be INSERT. % was used', TG_OP;
        ELSE
            INSERT INTO strip_image (strip_id) VALUES (NEW.id);
            INSERT INTO strip_text (strip_id) VALUES (NEW.id);
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_strip_children
    AFTER INSERT ON strip
    FOR EACH ROW
    EXECUTE FUNCTION insert_strip_children();

CREATE OR REPLACE FUNCTION handle_strip_position() RETURNS TRIGGER AS $$
    DECLARE
        position_max strip.position%type;
        c_insert CURSOR FOR
            SELECT position
            FROM strip
            WHERE position >= NEW.position AND flag_id = NEW.flag_id
            ORDER BY position DESC
            FOR UPDATE;
        c_update_increase CURSOR FOR
            SELECT position
            FROM strip
            WHERE position <= NEW.position AND position > OLD.position AND flag_id = NEW.flag_id
            ORDER BY position DESC
            FOR UPDATE;
        c_update_decrease CURSOR FOR
            SELECT position
            FROM strip
            WHERE position >= NEW.position AND position < OLD.position AND flag_id = NEW.flag_id
            ORDER BY position DESC
            FOR UPDATE;
        c_delete CURSOR FOR
            SELECT position
            FROM strip
            WHERE position > OLD.position AND flag_id = OLD.flag_id
            ORDER BY position DESC
            FOR UPDATE;
    BEGIN
        SELECT max(position) FROM strip INTO position_max WHERE flag_id = NEW.flag_id;

        
        IF TG_OP = 'INSERT' THEN
            --- If out-of-bounds, raise exception.
            IF NEW.position < 0 OR NEW.position > (SELECT position_max + 1) THEN
                RAISE EXCEPTION 'Strip position provided invalid.';
            -- If position provided is equal to (max + 1), allow.
            ELSIF NEW.position = (SELECT position_max + 1) THEN
                RETURN NEW;
            ELSIF NEW.position IS NULL THEN
                NEW.position := (SELECT position_max + 1);
                RETURN NEW;
            ELSE
                FOR row IN c_insert LOOP
                    UPDATE strip
                    SET position = row.position + 1
                    WHERE CURRENT OF c_insert;
                END LOOP;
                RETURN NEW;
            END IF;

        ELSIF TG_OP = 'UPDATE' THEN
            --- If out-of-bounds, raise exception.
            IF NEW.position < 0 OR NEW.position > (SELECT position_max) THEN
                RAISE EXCEPTION 'Strip position provided invalid.';
            ELSIF NEW.position IS NULL THEN
                RETURN NEW;
            ELSIF NEW.position > OLD.position THEN
                FOR row IN c_update_increase LOOP
                    UPDATE strip
                    SET position = row.position - 1
                    WHERE CURRENT OF c_update_increase;
                END LOOP;
                RETURN NEW;
            ELSE
                FOR row IN c_update_decrease LOOP
                    UPDATE strip
                    SET position = row.position + 1
                    WHERE CURRENT OF c_update_decrease;
                END LOOP;
                RETURN NEW;
            END IF;

        ELSIF TG_OP = 'DELETE' THEN
            FOR row IN c_delete LOOP
                UPDATE strip
                SET position = row.position - 1
                WHERE CURRENT OF c_delete;
            END LOOP;
            RETURN OLD;

        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_strip_position_upsert
    BEFORE INSERT OR UPDATE ON strip
    FOR EACH ROW
    WHEN (pg_trigger_depth() = 0)
    EXECUTE FUNCTION handle_strip_position();

CREATE TRIGGER handle_strip_position_delete
    AFTER DELETE ON strip
    FOR EACH ROW
    WHEN (pg_trigger_depth() = 0)
    EXECUTE FUNCTION handle_strip_position();

CREATE OR REPLACE FUNCTION insert_flag_children() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP != 'INSERT') THEN
            RAISE EXCEPTION 'Operation must be INSERT. % was used', TG_OP;
        ELSE
            INSERT INTO flag_padding (flag_id) VALUES (NEW.id);
            INSERT INTO flag_border (flag_id) VALUES (NEW.id);
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_flag_children
    AFTER INSERT ON flag
    FOR EACH ROW
    EXECUTE FUNCTION insert_flag_children();

CREATE OR REPLACE FUNCTION update_modified_timestamp() RETURNS TRIGGER AS $$
    BEGIN
        NEW.modified := now();
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT * FROM information_schema.columns
        WHERE column_name = 'modified'
    LOOP
        EXECUTE format('CREATE TRIGGER update_modified_timestamp
                        BEFORE UPDATE ON %I
                        FOR EACH ROW
                        EXECUTE FUNCTION update_modified_timestamp();',
                        t.table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;



--Populate data--
INSERT INTO user_role (name) VALUES ('standard');