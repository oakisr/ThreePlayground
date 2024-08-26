-- init.sql

CREATE TABLE `accounts`
(
    `id`       INT          NOT NULL AUTO_INCREMENT, -- Primary key
    `name`     VARCHAR(255) NOT NULL,                -- User's name
    `email`    VARCHAR(255) NOT NULL UNIQUE,         -- User's email (should be unique)
    `password` VARCHAR(255) NOT NULL,                -- User's password (hashed or plain text)
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `files`
(
    `id`      INT          NOT NULL AUTO_INCREMENT, -- Primary key
    `id_user` INT          NOT NULL,                -- User ID associated with the file
    `model`   VARCHAR(255) NOT NULL,                -- Model related to the file
    `date`    DATE         NOT NULL,                -- Date related to the file
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `accounts` (`name`, `email`, `password`)
VALUES ('testuser', 'test@email.com', 'testpassword');

INSERT INTO `files` (`id_user`, `model`, `date`)
VALUES (1, 'Blue Cylinder', '2024-08-26');