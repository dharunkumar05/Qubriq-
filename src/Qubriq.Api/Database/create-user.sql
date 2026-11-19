-- Run as a MySQL administrative account.
-- Replace <password> only in this local, non-source-controlled execution.
CREATE DATABASE IF NOT EXISTS qubriq_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'qubriq_app'@'localhost' IDENTIFIED BY '<password>';
ALTER USER 'qubriq_app'@'localhost' IDENTIFIED BY '<password>';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
ON qubriq_auth.* TO 'qubriq_app'@'localhost';
FLUSH PRIVILEGES;
