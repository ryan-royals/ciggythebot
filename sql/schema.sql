-- DROP TABLE IF EXISTS servers;
CREATE TABLE IF NOT EXISTS servers (serverID INTEGER PRIMARY KEY, ingress NUMBERIC, egress NUMBERIC, timing NUMERIC);
INSERT INTO servers (serverID, ingress, egress, timing) VALUES (123456, 123456, 124315, 1), (6789, 67891, 67890, 8);