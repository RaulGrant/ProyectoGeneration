CREATE DATABASE IF NOT EXISTS pawsible
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE pawsible;

-- (un usuario solo puede tener un rol)
CREATE TABLE roles (
  id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE               -- ADMIN, CLIENT
) ENGINE=InnoDB;

CREATE TABLE users (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(80)  NOT NULL,
  last_name  VARCHAR(80)  NOT NULL,
  email      VARCHAR(120) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,              -- hash (BCrypt)
  enabled    BOOLEAN      NOT NULL DEFAULT TRUE,
  role_id    BIGINT       NOT NULL,              -- un solo rol por usuario
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;


CREATE TABLE products (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(160) NOT NULL UNIQUE,
  description TEXT         NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT           NOT NULL DEFAULT 0,
  sku         VARCHAR(64)   NULL UNIQUE,
  size        VARCHAR(20)   NULL,                -- S,M,L etc   
category    TINYINT       NOT NULL,            -- 1=Producto, 2=Servicio 
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_products_price CHECK (price >= 0),
  CONSTRAINT chk_products_stock CHECK (stock >= 0),
  CONSTRAINT chk_products_category CHECK (category IN (1,2))
) ENGINE=InnoDB;


CREATE TABLE orders (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  status     ENUM('ESPERA','PAGADO','ENVIADO','CANCELADO') NOT NULL DEFAULT 'EN ESPERA',
  total      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id   BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity   INT NOT NULL,
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT uq_order_product UNIQUE (order_id, product_id),
  CONSTRAINT chk_item_qty CHECK (quantity > 0),
  CONSTRAINT chk_item_price CHECK (unit_price >= 0)
) ENGINE=InnoDB;


CREATE INDEX idx_products_price   ON products(price);
CREATE INDEX idx_orders_user      ON orders(user_id);
CREATE INDEX idx_orderitems_prod  ON order_items(product_id);


INSERT INTO roles (name) VALUES ('ADMIN')
  ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (name) VALUES ('CLIENT')
  ON DUPLICATE KEY UPDATE name=name;