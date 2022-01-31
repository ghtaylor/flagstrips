CREATE EXTENSION IF NOT EXISTS "pg_hashids";

CREATE TABLE IF NOT EXISTS trigger_execution (
    id text NOT NULL UNIQUE PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS user_role (
    name text NOT NULL UNIQUE,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (name)
);
INSERT INTO user_role (name) VALUES ('standard');

CREATE TABLE IF NOT EXISTS user_account (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    username text NOT NULL UNIQUE,
    first_name text,
    last_name text,
    password text NOT NULL,
    role_name text NOT NULL REFERENCES user_role(name) DEFAULT 'standard',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid),
    UNIQUE (id, uid, email, username)
);

CREATE TABLE IF NOT EXISTS flag (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    user_account_uid text NOT NULL REFERENCES user_account (uid) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Untitled',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid),
    UNIQUE (id, uid, user_account_uid)
);

CREATE TABLE IF NOT EXISTS flag_padding (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    flag_uid text NOT NULL UNIQUE REFERENCES flag (uid) ON DELETE CASCADE,
    top integer NOT NULL DEFAULT 6,
    "right" integer NOT NULL DEFAULT 4,
    bottom integer NOT NULL DEFAULT 6,
    "left" integer NOT NULL DEFAULT 4,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid, flag_uid)
);

CREATE TABLE IF NOT EXISTS flag_border (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    flag_uid text NOT NULL UNIQUE REFERENCES flag (uid) ON DELETE CASCADE,
    width integer NOT NULL DEFAULT 0,
    color text NOT NULL DEFAULT '#000000ff',
    radius integer NOT NULL DEFAULT 8,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid, flag_uid)
);

CREATE TABLE IF NOT EXISTS strip (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    user_account_uid text NOT NULL REFERENCES user_account (uid) ON DELETE CASCADE,
    flag_uid text NOT NULL REFERENCES flag (uid) ON DELETE CASCADE,
    position integer,
    background_color text NOT NULL DEFAULT '#ffffffff',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid),
    UNIQUE (flag_uid, position) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE IF NOT EXISTS strip_image_option (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    uri text NOT NULL,
    name text NOT NULL DEFAULT 'Twitter',
    PRIMARY KEY (id, uid)
);

CREATE OR REPLACE FUNCTION default_strip_image_option_uid() RETURNS text AS $$ 
    SELECT uid FROM strip_image_option LIMIT 1;
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS strip_image (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    strip_uid text NOT NULL UNIQUE REFERENCES strip (uid) ON DELETE CASCADE,
    image_option_uid text NOT NULL DEFAULT default_strip_image_option_uid() REFERENCES strip_image_option (uid),
    size integer NOT NULL DEFAULT 32,
    color text NOT NULL DEFAULT '#000000FF',
    gap_to_text integer NOT NULL DEFAULT 4,
    position text NOT NULL DEFAULT 'left',
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid, strip_uid),
    CHECK (color ~* '^#(?:[0-9a-fA-F]{3,4}){1,2}$'),
    CHECK (position ~* '^(left|right)$')
);

CREATE TABLE IF NOT EXISTS strip_text (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    strip_uid text NOT NULL UNIQUE REFERENCES strip (uid) ON DELETE CASCADE,
    value text NOT NULL DEFAULT 'flagstrips',
    color text NOT NULL DEFAULT '#000000FF',
    font_family text NOT NULL DEFAULT 'Arial',
    font_weight text NOT NULL DEFAULT 'normal',
    font_size integer NOT NULL DEFAULT 16,
    created timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    modified timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id, uid, strip_uid),
    CHECK (color ~* '^#(?:[0-9a-fA-F]{3,4}){1,2}$'),
    CHECK (font_weight ~* '^(normal|bold|bolder|lighter)$'),
    CHECK (font_size BETWEEN 1 AND 256)
);


CREATE TABLE IF NOT EXISTS animation_easing_option (
    name text NOT NULL UNIQUE PRIMARY KEY
);

CREATE OR REPLACE FUNCTION default_animation_easing_option_name() RETURNS text AS $$ 
    SELECT name FROM animation_easing_option LIMIT 1;
$$ LANGUAGE SQL;

CREATE TABLE IF NOT EXISTS animation_preset_option (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE, 
    name text NOT NULL UNIQUE,
    anime_json jsonb NOT NULL,
    direction text NOT NULL,
    PRIMARY KEY (id, uid),
    CHECK (direction ~* '^(in|static|out)$')
);

CREATE OR REPLACE FUNCTION default_animation_preset_option_uid(m_direction animation_preset_option.direction%type) RETURNS text AS $$ 
    SELECT uid FROM animation_preset_option WHERE direction = m_direction LIMIT 1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION check_animation_preset_direction(preset_option_uid animation_preset_option.uid%type, direction animation_preset_option.direction%type) RETURNS boolean AS $$
    DECLARE
        actual_direction animation_preset_option.direction%type;
    BEGIN
        SELECT p.direction INTO actual_direction
        FROM animation_preset_option p
        WHERE p.uid = preset_option_uid;

        RETURN actual_direction = direction;
    END;
$$ LANGUAGE plpgsql;

CREATE TABLE strip_animation_in (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    strip_uid text NOT NULL UNIQUE REFERENCES strip (uid) ON DELETE CASCADE,
    easing text NOT NULL DEFAULT default_animation_easing_option_name() REFERENCES animation_easing_option (name),
    preset_option_uid text NOT NULL DEFAULT default_animation_preset_option_uid('in') REFERENCES animation_preset_option (uid),
    duration integer NOT NULL DEFAULT 1500,
    PRIMARY KEY (id, uid, strip_uid),
    CHECK (check_animation_preset_direction(preset_option_uid, 'in'))
);

CREATE TABLE strip_animation_static (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    strip_uid text NOT NULL UNIQUE REFERENCES strip (uid) ON DELETE CASCADE,
    easing text NOT NULL DEFAULT default_animation_easing_option_name() REFERENCES animation_easing_option (name),
    preset_option_uid text NOT NULL DEFAULT default_animation_preset_option_uid('static') REFERENCES animation_preset_option (uid),
    duration integer NOT NULL DEFAULT 1500,
    PRIMARY KEY (id, uid, strip_uid),
    CHECK (check_animation_preset_direction(preset_option_uid, 'static'))
);

CREATE TABLE strip_animation_out (
    id serial UNIQUE,
    uid text NOT NULL UNIQUE,
    strip_uid text NOT NULL UNIQUE REFERENCES strip (uid) ON DELETE CASCADE,
    easing text NOT NULL DEFAULT default_animation_easing_option_name() REFERENCES animation_easing_option (name),
    preset_option_uid text NOT NULL DEFAULT default_animation_preset_option_uid('out') REFERENCES animation_preset_option (uid),
    duration integer NOT NULL DEFAULT 1500,
    PRIMARY KEY (id, uid, strip_uid),
    CHECK (check_animation_preset_direction(preset_option_uid, 'out'))
);

CREATE OR REPLACE FUNCTION insert_flag_children() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP != 'INSERT') THEN
            RAISE EXCEPTION 'Operation must be INSERT. % was used', TG_OP;
        ELSE
            INSERT INTO flag_padding (flag_uid) VALUES (NEW.uid);
            INSERT INTO flag_border (flag_uid) VALUES (NEW.uid);
            INSERT INTO strip (flag_uid, user_account_uid) VALUES (NEW.uid, NEW.user_account_uid);
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_flag_children
    AFTER INSERT ON flag
    FOR EACH ROW
    EXECUTE FUNCTION insert_flag_children();

CREATE OR REPLACE FUNCTION insert_strip_children() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP != 'INSERT') THEN
            RAISE EXCEPTION 'Operation must be INSERT. % was used', TG_OP;
        ELSE
            INSERT INTO strip_image (strip_uid) VALUES (NEW.uid);
            INSERT INTO strip_text (strip_uid) VALUES (NEW.uid);
            INSERT INTO strip_animation_in (strip_uid) VALUES (NEW.uid);
            INSERT INTO strip_animation_static (strip_uid) VALUES (NEW.uid);
            INSERT INTO strip_animation_out (strip_uid) VALUES (NEW.uid);
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
            WHERE position >= NEW.position AND flag_uid = NEW.flag_uid
            ORDER BY position DESC
            FOR UPDATE;
        c_update_increase CURSOR FOR
            SELECT position
            FROM strip
            WHERE position <= NEW.position AND position > OLD.position AND flag_uid = NEW.flag_uid
            ORDER BY position DESC
            FOR UPDATE;
        c_update_decrease CURSOR FOR
            SELECT position
            FROM strip
            WHERE position >= NEW.position AND position < OLD.position AND flag_uid = NEW.flag_uid
            ORDER BY position DESC
            FOR UPDATE;
        c_delete CURSOR FOR
            SELECT position
            FROM strip
            WHERE position > OLD.position AND flag_uid = OLD.flag_uid
            ORDER BY position DESC
            FOR UPDATE;
    BEGIN
        SELECT max(position) FROM strip INTO position_max WHERE flag_uid = NEW.flag_uid;

        -- If this particular trigger has recursed, then don't continue with trigger logic and return expected value.
        IF EXISTS (SELECT 1 FROM trigger_execution te WHERE te.id = COALESCE(NEW.flag_uid, OLD.flag_uid)) THEN
            RETURN COALESCE(NEW, OLD);
        ELSE
            INSERT INTO trigger_execution (id) VALUES (COALESCE(NEW.flag_uid, OLD.flag_uid));
            IF TG_OP = 'INSERT' THEN
                -- If out-of-bounds, raise exception.
                IF NEW.position < 0 OR NEW.position > (SELECT position_max + 1) THEN
                    RAISE EXCEPTION 'Strip position provided invalid.';
                ELSIF NEW.position IS NULL AND position_max IS NULL THEN
                    NEW.position := 0;
                ELSIF NEW.position IS NULL THEN
                    NEW.position := (SELECT position_max + 1);
                ELSIF NEW.position >= 0 AND NEW.position <= position_max THEN
                    FOR row IN c_insert LOOP
                        UPDATE strip
                        SET position = row.position + 1
                        WHERE CURRENT OF c_insert;
                    END LOOP;
                END IF;

            ELSIF TG_OP = 'UPDATE' THEN
                -- If out-of-bounds, raise exception.
                IF NEW.position < 0 OR NEW.position > (SELECT position_max) THEN
                    RAISE EXCEPTION 'Strip position provided is out of bounds.';
                ELSIF NEW.position > OLD.position THEN
                    FOR row IN c_update_increase LOOP
                        UPDATE strip
                        SET position = row.position - 1
                        WHERE CURRENT OF c_update_increase;
                    END LOOP;
                ELSIF NEW.position < OLD.position THEN
                    FOR row IN c_update_decrease LOOP
                        UPDATE strip
                        SET position = row.position + 1
                        WHERE CURRENT OF c_update_decrease;
                    END LOOP;
                END IF;

            ELSIF TG_OP = 'DELETE' THEN
                FOR row IN c_delete LOOP
                    UPDATE strip
                    SET position = row.position - 1
                    WHERE CURRENT OF c_delete;
                END LOOP;
            END IF;
        END IF;

        -- Remove trigger execution record now it has completed.
        DELETE FROM trigger_execution te WHERE te.id = COALESCE(NEW.flag_uid, OLD.flag_uid);
        RETURN COALESCE(NEW, OLD);
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_strip_position_upsert
    BEFORE INSERT OR UPDATE ON strip
    FOR EACH ROW
    EXECUTE FUNCTION handle_strip_position();

CREATE TRIGGER handle_strip_position_delete
    AFTER DELETE ON strip
    FOR EACH ROW
    EXECUTE FUNCTION handle_strip_position();

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

CREATE OR REPLACE FUNCTION apply_uid() RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP != 'INSERT') THEN
            RAISE EXCEPTION 'Operation must be INSERT. % was used', TG_OP;
        ELSE
            NEW.uid := (SELECT id_encode(NEW.id, TG_TABLE_NAME, 10));
            RETURN NEW;
        END IF;
    END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT * FROM information_schema.columns
        WHERE column_name = 'uid'
    LOOP
        EXECUTE format('CREATE TRIGGER apply_uid
                        BEFORE INSERT ON %I
                        FOR EACH ROW
                        EXECUTE FUNCTION apply_uid();',
                        t.table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

INSERT INTO animation_easing_option (name) VALUES ('easeInOutQuint');
INSERT INTO animation_preset_option (name, anime_json, direction) VALUES ('zoomIn', '{"scale": [0,1]}', 'in');
INSERT INTO animation_preset_option (name, anime_json, direction) VALUES ('bounce', '{"y": [0,10,0,8,0,6,0,4,0,2,0]}', 'static');
INSERT INTO animation_preset_option (name, anime_json, direction) VALUES ('zoomOut', '{"scale": [1,0]}', 'out');