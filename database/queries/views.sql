CREATE OR REPLACE VIEW flag_flat AS
SELECT f.*, fb.id AS flag_border_id, fp.id AS flag_padding_id, s.strip_array
FROM flag f
JOIN (
  SELECT fs.flag_id AS id, array_agg(s.id) AS strip_array
  FROM flag_strip fs
  JOIN strip s ON s.id = fs.strip_id
  GROUP BY fs.flag_id
) s USING (id)
JOIN flag_border fb ON f.id = fb.flag_id
JOIN flag_padding fp ON f.id = fp.flag_id;

CREATE OR REPLACE VIEW strip_flat AS
SELECT s.*, si.id AS strip_image_id, st.id AS strip_text_id
FROM strip s
JOIN strip_image si ON si.strip_id = s.id
JOIN strip_text st ON st.strip_id = s.id;