-- --- Tabla Alimento ---
CREATE TABLE Alimento (
  id_alimento SERIAL PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  ingredientes_obligatorios VARCHAR(300) NOT NULL,
  salsa VARCHAR(50),
  extra VARCHAR(50),
  ingredientes_opcionales VARCHAR(300),
  descripcion VARCHAR(300) NOT NULL,
  calorias INT NOT NULL,
  precio INT NOT NULL,
  imagen VARCHAR(100) NOT NULL
);

-- --- Tabla Usuario ---
CREATE TABLE Usuario (
  id VARCHAR(75) PRIMARY KEY
);

-- --- Tabla Pedidos ---
CREATE TABLE Pedidos (
  id_pedido SERIAL PRIMARY KEY,
  estatus VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE, -- Se añade un valor por defecto.
  precio_total INT NOT NULL,
  id VARCHAR(75) NOT NULL,
  FOREIGN KEY (id) REFERENCES Usuario(id)
);

-- --- Tabla Carrito ---
-- Se cambia id_carrito a SERIAL.
CREATE TABLE Carrito (
  id_carrito SERIAL PRIMARY KEY,
  id VARCHAR(75) NOT NULL,
  FOREIGN KEY (id) REFERENCES Usuario(id)
);

-- --- Tabla Item ---
CREATE TABLE item (
  id_item SERIAL PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  ingredientes_obligatorios VARCHAR(300) NOT NULL,
  salsa VARCHAR(50),
  extra VARCHAR(50),
  ingredientes_opcionales VARCHAR(300),
  precio INT NOT NULL,
  imagen VARCHAR(100),
  cantidad INT NOT NULL DEFAULT 1, 
  id_original INT NOT NULL,
  id_carrito INT, -- Se permite NULL
  id_pedido INT,  -- Se permite NULL
  precio_final INT GENERATED ALWAYS AS (precio * cantidad) STORED,
  
  FOREIGN KEY (id_original) REFERENCES Alimento(id_alimento),
  FOREIGN KEY (id_carrito) REFERENCES Carrito(id_carrito),
  FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
  
  -- Un item debe estar en un carrito O en un pedido, pero no en ambos.
  CONSTRAINT chk_item_location CHECK (
    (id_carrito IS NOT NULL AND id_pedido IS NULL) OR 
    (id_carrito IS NULL AND id_pedido IS NOT NULL)
  )
);


-- --- Tabla Reseña ---
CREATE TABLE reseña (
  puntuacion INT NOT NULL,
  comentario VARCHAR(100) NOT NULL,
  id_alimento INT NOT NULL,
  id VARCHAR(75) NOT NULL,
  
  PRIMARY KEY (id_alimento, id),
  FOREIGN KEY (id_alimento) REFERENCES Alimento(id_alimento),
  FOREIGN KEY (id) REFERENCES Usuario(id),
  
  CONSTRAINT chk_puntuacion CHECK (puntuacion >= 1 AND puntuacion <= 5)
);
