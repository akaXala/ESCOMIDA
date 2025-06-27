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
  id VARCHAR(75) PRIMARY KEY,
  telefono VARCHAR (10)
);

-- --- Tabla Favorito ---
CREATE TABLE Favorito (
  id_favorito SERIAL PRIMARY KEY,
  id VARCHAR(75) NOT NULL,
  id_alimento INT NOT NULL,

  FOREIGN KEY (id) REFERENCES Usuario(id),
  FOREIGN KEY (id_alimento) REFERENCES Alimento(id_alimento),

  -- Restricción para asegurar que un usuario no pueda marcar
  -- el mismo alimento como favorito más de una vez.
  CONSTRAINT uq_usuario_alimento_favorito UNIQUE (id, id_alimento)
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

-- APARTADO DE INSERT A LOS ALIMENTOS --
INSERT INTO Alimento (categoria, nombre, ingredientes_obligatorios, salsa, extra, ingredientes_opcionales, descripcion, calorias, precio, imagen) VALUES
('Desayuno', 'Huevo a la Mexicana', 'Frijoles, Cebolla, Chile, Jitomate, Huevo', NULL, 'Tortilla, Pan', NULL, 'Clásico desayuno mexicano de huevos revueltos guisados con jitomate, cebolla y chile picado, usualmente acompañados de frijoles y tortillas.', 450, 35, '/alimentos/huevoalamexicana.webp'),
('Desayuno', 'Huevos Rancheros', 'Frijoles, Tortilla de maíz frita, Huevo estrellado', 'Salsa roja, Salsa verde', 'Tortilla, Pan', NULL, 'Huevos estrellados montados sobre tortillas de maíz ligeramente fritas, bañados en abundante salsa casera y acompañados de frijoles refritos.', 500, 35, '/alimentos/huevosrancheros.webp'),
('Desayuno', 'Huevo con Salchicha', 'Huevo revuelto, Salchicha, Frijoles', NULL, 'Tortilla, Pan', NULL, 'Abundantes huevos revueltos con trozos de salchicha doradita, un desayuno sustancioso servido con frijoles y tortillas.', 500, 35, '/alimentos/huevoconsalchicha.webp'),
('Desayuno', 'Huevos Estrellados con Tocino', 'Tortillas, Frijoles, Tocino, Huevo estrellado', NULL, 'Tortilla, Pan', NULL, 'Perfectos huevos estrellados acompañados de crujientes tiras de tocino, servidos con frijoles y tortillas para empezar el día.', 550, 35, '/alimentos/huevosestrelladoscontocino.webp'),
('Desayuno', 'Huevos Revueltos con Jamón', 'Huevo revuelto, Frijoles, Jamón', NULL, 'Tortilla, Pan', NULL, 'Suaves huevos revueltos mezclados con daditos de jamón, un favorito para el desayuno, con frijoles y tortillas.', 480, 35, '/alimentos/huevosrevueltosconjamon.webp'),
('Desayuno', 'Omelette de Jamón con Queso', 'Frijoles, Queso, Jamón, Huevo', NULL, 'Tortilla, Pan', NULL, 'Omelette esponjoso relleno de generosas porciones de jamón y queso derretido, acompañado de frijoles y su elección de tortillas o pan.', 500, 38, '/alimentos/omelettedejamonconqueso.webp'),
('Desayuno', 'Omelette de Setas', 'Huevo, Setas, champiñones, Frijoles', NULL, 'Tortilla, Pan', NULL, 'Delicado omelette relleno de champiñones frescos salteados, una opción ligera y sabrosa con frijoles y tortillas o pan.', 450, 38, '/alimentos/omelettesetas.webp'),
('Desayuno', 'Omelette de Champiñones', 'Huevo, Setas, champiñones, Frijoles', NULL, 'Tortilla, Pan', NULL, 'Delicado omelette relleno de setas frescos salteados, una opción ligera y sabrosa con frijoles y tortillas o pan.', 450, 38, '/alimentos/omelettechampinones.webp'),
('Desayuno', 'Omelette de Jamón con Queso y Champiñones', 'Queso, Jamón, Champiñones, Huevo', NULL, 'Tortilla, Pan', 'Frijoles', 'El omelette más completo, relleno de jamón, queso derretido y champiñones salteados, servido con frijoles y tortillas o pan.', 550, 40, '/alimentos/omelettedejamonconquesoychampinones.webp'),
('Desayuno', 'Huevo con Chorizo', 'Huevo revuelto, Chorizo', NULL, 'Tortilla, Pan', 'Frijoles', 'Intenso sabor mexicano en huevos revueltos con chorizo de la casa, acompañados de frijoles refritos y tortillas.', 550, 35, '/alimentos/huevoconchorizo.webp'),
('Torta', 'Torta de Salchicha', 'Mayonesa, Salchicha, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Torta clásica con rebanadas de salchicha, aderezada con mayonesa y vegetales frescos en pan crujiente.', 500, 25, '/alimentos/tortadesalchicha.webp'),
('Torta', 'Torta de Jamón con Queso', 'Mayonesa, Queso, Bolillo, Jamón', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'La tradicional torta de jamón y queso, una combinación infalible con aguacate, jitomate y chiles en vinagre.', 550, 28, '/alimentos/tortadejamonconqueso.webp'),
('Torta', 'Torta de Pierna', 'Mayonesa, Pierna de cerdo, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Exquisita torta de pierna de cerdo horneada y deshebrada, jugosa y llena de sabor, con todos sus complementos.', 600, 28, '/alimentos/tortadepierna.webp'),
('Torta', 'Torta de Milanesa de Res', 'Mayonesa, Milanesa res, pollo, Mayonesa, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Generosa torta en pan crujiente, rellena de una sabrosa milanesa empanizada (res o pollo), con frijoles, aguacate y vegetales.', 700, 28, '/alimentos/tortademilanesares.webp'),
('Torta', 'Torta de Milanesa de Pollo', 'Milanesa pollo, pollo, Mayonesa, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Generosa torta en pan crujiente, rellena de una sabrosa milanesa empanizada (res o pollo), con frijoles, aguacate y vegetales.', 700, 28, '/alimentos/tortademilanesapollo.webp'),
('Torta', 'Torta de Huevo', 'Mayonesa, Huevo estrellado, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Torta reconfortante con huevo preparado a tu gusto (revuelto o estrellado), puede incluir chorizo o jamón.', 550, 25, '/alimentos/tortadehuevo.webp'),
('Torta', 'Torta de Al Pastor', 'Mayonesa, Bolillo, Carne al pastor', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles, Piña, Cilantro', 'Deliciosa torta con carne al pastor marinada, acompañada de cilantro, cebolla, un toque de piña opcional y aguacate.', 600, 30, '/alimentos/tortadealpastor.webp'),
('Torta', 'Torta Cubana', 'Pierna, Mayonesa, Queso, Salchicha, Huevo, Bolillo, Jamón, Milanesa', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'La reina de las tortas: una mezcla explosiva de milanesa, pierna, salchicha, jamón, queso y huevo, ¡para un gran apetito!', 900, 55, '/alimentos/tortacubana.webp'),
('Torta', 'Torta Especial', 'Combinación selecta de carnes, ingredientes premium, Bolillo', NULL, NULL, 'Cebolla, Aguacate, Jitomate, Chiles en vinagre, Frijoles', 'Nuestra torta especial de la casa, con una combinación única de ingredientes seleccionados para un sabor inigualable.', 700, 35, '/alimentos/tortaespecial.webp'),
('Sandwichito', 'Sincronizada', 'Tortilla de harina, Queso, Jamón', NULL, NULL, 'Pico de gallo, Guacamole', 'Clásica sincronizada de tortilla de harina doradita, rellena de jamón y queso derretido, ideal para un antojo ligero.', 350, 18, '/alimentos/sincronizada.webp'),
('Sandwichito', 'Club Sandwich', 'Pan tostado, Mayonesa, Queso, Tocino, Pollo, Pavo, Jamón', NULL, NULL, 'Jitomate, Lechuga, Papas fritas', 'Imponente sándwich de tres pisos con pollo o pavo, tocino crujiente, jamón, queso y vegetales frescos, puede acompañarse de papas.', 700, 40, '/alimentos/clubsandwich.webp'),
('Mollete', 'Mollete Sencillos', 'Bolillo, Queso gratinado, Frijoles', NULL, NULL, 'Pico de gallo', 'Tradicionales molletes con una base de bolillo tostado, frijoles refritos y abundante queso gratinado, servidos con pico de gallo.', 350, 18, '/alimentos/molletesencillos.webp'),
('Mollete', 'Mollete de Jamón', 'Bolillo, Jamón, Queso gratinado, Frijoles', NULL, NULL, 'Pico de gallo', 'Molletes clásicos con el añadido de trocitos de jamón sobre el queso gratinado, acompañados de pico de gallo.', 400, 20, '/alimentos/molletedejamon.webp'),
('Mollete', 'Mollete de Chorizo', 'Chorizo, Bolillo, Queso gratinado, Frijoles', NULL, NULL, 'Pico de gallo', 'Sabrosos molletes con chorizo de la casa desmenuzado sobre el queso fundido, un toque picante y delicioso.', 450, 22, '/alimentos/molletedechorizo.webp'),
('Mollete', 'Mollete de Tocino', 'Bolillo, Tocino, Queso gratinado, Frijoles', NULL, NULL, 'Pico de gallo', 'Irresistibles molletes coronados con trocitos de tocino crujiente sobre el queso derretido, para los amantes del tocino.', 480, 22, '/alimentos/molletedetocino.webp'),
('Mollete', 'Mollete de Especial con Papas', 'Papas fritas, Queso, Bolillo, Frijoles', NULL, NULL, 'Carne', 'Molletes especiales, posiblemente con alguna carne, acompañados de una porción de papas fritas doraditas.', 600, 42, '/alimentos/molletedeespecialconpapas.webp'),
('Chilaquiles', 'Chilaquiles Solos', 'Queso, Totopos, Crema', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', 'Crujientes totopos bañados en tu elección de salsa verde o roja, terminados con crema fresca, queso espolvoreado y aros de cebolla.', 400, 25, '/alimentos/chilaquilessolos.webp'),
('Chilaquiles', 'Chilaquiles de Con Pollo', 'Pollo deshebrado, Queso, Totopos, Crema', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', 'Chilaquiles tradicionales con una generosa porción de pollo deshebrado, bañados en salsa, crema, queso y cebolla.', 500, 35, '/alimentos/chilaquilesdeconpollo.webp'),
('Chilaquiles', 'Chilaquiles de Con Huevo Estrellado', 'Queso, Totopos, Crema, Huevo estrellado', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', 'Tus chilaquiles favoritos coronados con uno o dos huevos estrellados al punto, una combinación perfecta.', 500, 32, '/alimentos/chilaquilesdeconhuevoestrellado.webp'),
('Chilaquiles', 'Chilaquiles de Con Bistec', 'Queso, Totopos, Crema, Bistec', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', 'Contundentes chilaquiles acompañados de tiras de bistec jugoso, bañados en salsa, crema, queso y cebolla.', 600, 38, '/alimentos/chilaquilesdeconbistec.webp'),
('Chilaquiles', 'Chilaquiles de Con Chorizo', 'Queso, Totopos, Crema, Chorizo', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', 'Chilaquiles con el toque especial del chorizo de la casa, aportando un sabor único y delicioso.', 600, 38, '/alimentos/chilaquilesdeconchorizo.webp'),
('Chilaquiles', 'Chilaquiles de Especiales', 'Pollo, Queso, Totopos, Huevo, Crema, Bistec', 'Salsa verde, Salsa roja', 'Bolillo', 'Cebolla', '¡Los chilaquiles con todo! Pollo deshebrado, huevo estrellado y bistec sobre una cama de totopos en salsa, crema, queso y cebolla.', 800, 42, '/alimentos/chilaquilesdeespeciales.webp'),
('Taco', 'Taco de Bistec', 'Tortilla de maíz, Bistec', NULL, NULL, 'Cebolla, Cilantro', 'Clásico taco de bistec de res picado finamente, servido en tortilla de maíz con cebolla, cilantro y tu salsa preferida.', 150, 13, '/alimentos/tacodebistec.webp'),
('Taco', 'Taco de Chuleta', 'Tortilla de maíz, Chuleta de cerdo', NULL, NULL, 'Cebolla, Cilantro', 'Sabroso taco de chuleta de cerdo picada, una opción jugosa servida con cebolla, cilantro y salsa.', 170, 13, '/alimentos/tacodechuleta.webp'),
('Taco', 'Taco de Chorizo', 'Tortilla de maíz, Chorizo', NULL, NULL, 'Cebolla, Cilantro', 'Taco con el auténtico sabor del chorizo de la casa, dorado y desmenuzado, ideal con cebolla, cilantro y salsa.', 180, 13, '/alimentos/tacodechorizo.webp'),
('Taco', 'Taco de Pastor', 'Carne al pastor, Tortilla de maíz', NULL, NULL, 'Cebolla, Cilantro, Piña, Salsa', 'Tradicional taco al pastor con carne de cerdo marinada, servido con cebolla, cilantro y un toque de piña si lo deseas.', 160, 13, '/alimentos/tacodepastor.webp'),
('Taco', 'Taco Campechano', 'Tortilla de maíz, Bistec, Chorizo', NULL, NULL, 'Cebolla, Cilantro', 'La combinación perfecta de dos sabores: bistec y chorizo en un solo taco, con cebolla, cilantro y salsa.', 170, 13, '/alimentos/tacocampechano.webp'),
('Taco', 'Taco de Alambre con Tortilla de Maíz', 'Pimiento, Tocino, Queso, Bistec, Tortilla de maíz', NULL, NULL, 'Cebolla, Cilantro', 'Delicioso alambre de bistec salteado con pimiento, cebolla y tocino, todo cubierto con queso fundido, servido en taco.', 250, 20, '/alimentos/tacodealambremaiz.webp'),
('Taco', 'Taco de Alambre con Tortilla de Harina', 'Pimiento, Tocino, Queso, Bistec, Tortilla de harina', NULL, NULL, 'Cebolla, Cilantro', 'Delicioso alambre de bistec salteado con pimiento, cebolla y tocino, todo cubierto con queso fundido, servido en taco.', 250, 20, '/alimentos/tacodealambreharina.webp'),
('Quesos y Antojos', 'Quesadilla Sencilla con Tortilla de Maíz', 'Tortilla de maíz, Queso', NULL, NULL, NULL, 'La clásica quesadilla con abundante queso derretido en tortilla de maíz o harina, simple y deliciosa.', 200, 13, '/alimentos/quesadillasencillamaiz.webp'),
('Quesos y Antojos', 'Quesadilla Sencilla con Tortilla de Harina', 'Tortilla de harina, Queso', NULL, NULL, NULL, 'La clásica quesadilla con abundante queso derretido en tortilla de maíz o harina, simple y deliciosa.', 200, 13, '/alimentos/quesadillasencillaharina.webp'),
('Quesos y Antojos', 'Quesadilla con Chorizo con Tortilla de Maíz', 'Tortilla de maíz, Chorizo, Queso', NULL, NULL, NULL, 'Quesadilla rellena de queso fundido y chorizo de la casa, una explosión de sabor.', 300, 15, '/alimentos/quesadillaconchorizomaiz.webp'),
('Quesos y Antojos', 'Quesadilla con Chorizo con Tortilla de Harina', 'Tortilla de harina, Chorizo, Queso', NULL, NULL, NULL, 'Quesadilla rellena de queso fundido y chorizo de la casa, una explosión de sabor.', 300, 15, '/alimentos/quesadillaconchorizoharina.webp'),
('Quesos y Antojos', 'Quesadilla con Champiñones con Tortilla de Maíz', 'Champiñones, Tortilla de harina, Queso', NULL, NULL, 'Quesadilla con una sabrosa mezcla de queso derretido y champiñones frescos salteados.', '', 250, 15, '/alimentos/quesadillaconchampinonesmaiz.webp'),
('Quesos y Antojos', 'Quesadilla con Champiñones con Tortilla de Harina', 'Champiñones, Tortilla de maíz, Queso', NULL, NULL, 'Quesadilla con una sabrosa mezcla de queso derretido y champiñones frescos salteados.', '', 250, 15, '/alimentos/quesadillaconchampinonesharina.webp'),
('Quesos y Antojos', 'Quesadilla con Rajas con Tortilla de Maíz', 'Tortilla de maíz, Rajas poblanas, Queso', NULL, NULL, NULL, 'Deliciosa quesadilla con queso fundido y rajas de chile poblano, un toque ligeramente picante.', 250, 15, '/alimentos/quesadillaconrajasmaiz.webp'),
('Quesos y Antojos', 'Quesadilla con Rajas con Tortilla de Harina', 'Tortilla de harina, Rajas poblanas, Queso', NULL, NULL, NULL, 'Deliciosa quesadilla con queso fundido y rajas de chile poblano, un toque ligeramente picante.', 250, 15, '/alimentos/quesadillaconrajasharina.webp'),
('Quesos y Antojos', 'Gringa', 'Tortilla de harina, Carne al pastor, Queso', NULL, NULL, NULL, 'Irresistible gringa preparada con dos tortillas de harina, carne al pastor y mucho queso derretido.', 450, 35, '/alimentos/gringa.webp'),
('Postre', 'Pay de Limón', 'Crema de limón, Base de galleta', NULL, NULL, 'Merengue', 'Refrescante pay con una base crocante de galleta y un suave relleno de crema de limón, perfecto para endulzar tu día.', 300, 20, '/alimentos/paydelimon.webp'),
('Postre', 'Muffin de Chocolate', 'Chispas de chocolate, Cacao, Harina', NULL, NULL, NULL, 'Esponjoso muffin de chocolate con intensas notas de cacao y chispas de chocolate derretidas en su interior.', 350, 20, '/alimentos/muffindechocolate.webp'),
('Postre', 'Gelatina con Crema', 'Crema batida, rompope, Gelatina', NULL, NULL, NULL, 'Colorida gelatina del día servida con una generosa porción de crema batida o un toque de rompope', 150, 22, '/alimentos/gelatinaconcrema.webp'),
('Postre', 'Gelatina', 'Gelatina de agua, leche', NULL, NULL, NULL, 'Postre ligero y refrescante, gelatina de agua o leche en sabores variados.', 80, 12, '/alimentos/gelatina.webp'),
('Postre', 'Pastel de Elote', 'Leche, Harina, Elote, Huevo, Mantequilla', NULL, NULL, NULL, 'Suave y húmeda rebanada de pastel de elote casero, con el dulzor natural del maíz, una delicia tradicional.', 300, 25, '/alimentos/pasteldeelote.webp'),
('Bebida Caliente', 'Café de Olla', 'Café, Agua, Canela, Piloncillo', NULL, NULL, 'Leche', 'Tradicional café de olla endulzado con piloncillo y canela', 50, 12, '/alimentos/cafedeolla.webp'),
('Bebida Caliente', 'Café de Nescafé', 'Café instantáneo, Agua', NULL, NULL, 'Leche', 'Tradicional café de con reconfortante Nescafé.', 50, 12, '/alimentos/cafenescafe.webp'),
('Bebida Caliente', 'Café de Máquina Americano', 'Café de grano molido', NULL, NULL, NULL, 'Café americano recién hecho en nuestra máquina, para los amantes del buen café.', 5, 15, '/alimentos/cafedemaquina(americano).webp'),
('Bebida Caliente', 'Café de Máquina Espresso', 'Café de grano molido', NULL, NULL, NULL, 'Café intenso espresso recién hecho en nuestra máquina, para los amantes del buen café.', 5, 15, '/alimentos/cafedemaquina(espresso).webp'),
('Bebida Caliente', 'Café de Máquina (Cappuccino)', 'Café de grano, Leche', NULL, NULL, NULL, 'Disfruta de nuestras especialidades de café cappuccino, preparados con leche cremosa.', 50, 25, '/alimentos/cafedemaquina(cappuccino).webp'),
('Bebida Caliente', 'Café de Máquina (Late)', 'Café de grano, Leche', NULL, NULL, NULL, 'Disfruta de nuestras especialidades de café latte, preparados con leche cremosa.', 50, 25, '/alimentos/cafedemaquina(latte).webp'),
('Bebida Caliente', 'Té Manzanilla', 'Infusión de hierbas', NULL, NULL, NULL, 'Té caliente para relajarte de manzanilla', 5, 12, '/alimentos/te(manzanilla).webp'),
('Bebida Caliente', 'Té Limón', 'Infusión de hierbas', NULL, NULL, NULL, 'Té caliente para relajarte de limón', 5, 12, '/alimentos/te(limon).webp'),
('Bebida Caliente', 'Té Hierbabuena', 'Infusión de hierbas', NULL, NULL, NULL, 'Té caliente para relajarte de hierbabuena', 5, 12, '/alimentos/te(manzanilla).webp'),
('Bebida Caliente', 'Leche con Chocolate', 'Leche, Chocolate en polvo', NULL, NULL, NULL, 'Reconfortante leche caliente con chocolate, la bebida perfecta para cualquier momento.', 180, 18, '/alimentos/lecheconchocolate.webp'),
('Bebida Fría', 'Agua del Día (Medio Litro)', 'Agua fresca de frutas de temporada', NULL, NULL, NULL, 'Refrescante agua fresca preparada diariamente con frutas de temporada, opción de medio litro.', 100, 17, '/alimentos/aguadeldia(mediolitro).webp'),
('Bebida Fría', 'Agua del Día (Litro)', 'Agua fresca de frutas de temporada', NULL, NULL, NULL, 'Disfruta de un litro completo de nuestra deliciosa agua fresca del día, hecha con frutas naturales.', 200, 32, '/alimentos/aguadeldia(litro).webp'),
('Bebida Fría', 'Jugo de Naranja', 'Naranja natural exprimida', NULL, NULL, NULL, 'Jugo de naranja 100% natural, recién exprimido para conservar todas sus vitaminas y sabor.', 150, 30, '/alimentos/jugodenaranja.webp'),
('Bebida Fría', 'Jugo Verde', 'Fruta (piña, naranja), Vegetales verdes', NULL, NULL, NULL, 'Bebida saludable y energizante a base de una mezcla de vegetales verdes y un toque de fruta.', 100, 35, '/alimentos/jugoverde.webp'),
('Bebida Fría', 'Licuado de Fresa', 'Leche, Fresa', NULL, NULL, NULL, 'Cremoso licuado preparado con leche y fresa', 250, 25, '/alimentos/licuado(fresa).webp'),
('Bebida Fría', 'Licuado de Plátano', 'Leche, Plátano', NULL, NULL, NULL, 'Cremoso licuado preparado con leche y plátano', 250, 25, '/alimentos/licuado(platano).webp'),
('Bebida Fría', 'Licuado de Chocolate', 'Leche, Chocolate', NULL, NULL, NULL, 'Cremoso licuado preparado con leche y chocolate.', 250, 25, '/alimentos/licuado(chocolate).webp'),
('Bebida Fría', 'Chocomilk', 'Chocolate en polvo, Leche fría', NULL, NULL, NULL, 'Clásico Chocomilk frío, una bebida chocolatada refrescante y nutritiva.', 180, 18, '/alimentos/chocomilk(frio).webp'),
('Bebida Fría', 'Refresco', 'Bebida carbonatada (varios sabores)', NULL, NULL, NULL, 'Tu refresco favorito para acompañar tus alimentos, disponible en varios sabores.', 150, 17, '/alimentos/refresco.webp'),
('Bebida Fría', 'Naranjada (Medio Litro)', 'Agua, Azúcar, Naranja', NULL, NULL, NULL, 'Refrescante naranjada reparada con jugo natural', 100, 25, '/alimentos/naranjada(mediolitro).webp'),
('Bebida Fría', 'Limonada (Medio Litro)', 'Agua, Azúcar, Limón', NULL, NULL, NULL, 'Refrescante limonada preparada con jugo natural', 100, 25, '/alimentos/limonada(mediolitro).webp'),
('Bebida Fría', 'Naranjada (Litro)', 'Agua, Azúcar, Naranja', NULL, NULL, NULL, 'Un litro de nuestra clásica naranjada, perfecta para compartir o calmar la sed.', 200, 40, '/alimentos/naranjada(litro).webp'),
('Bebida Fría', 'Limonada (Litro)', 'Agua, Azúcar, Limón', NULL, NULL, NULL, 'Un litro de nuestra clásica limonada, perfecta para compartir o calmar la sed.', 200, 40, '/alimentos/limonada(litro).webp'),
('Bebida Fría', 'Malteada de Fresa', 'Leche, Helado, Jarabe', NULL, NULL, NULL, 'Deliciosa y espesa malteada preparada con helado de fresa', 400, 40, '/alimentos/malteada(fresa).webp'),
('Bebida Fría', 'Malteada de Chocolate', 'Leche, Helado, Jarabe', NULL, NULL, NULL, 'Deliciosa y espesa malteada preparada con helado de chocolate', 400, 40, '/alimentos/malteada(chocolate).webp'),
('Bebida Fría', 'Malteada de Vainilla', 'Leche, Helado, Jarabe', NULL, NULL, NULL, 'Deliciosa y espesa malteada preparada con helado de vainilla.', 400, 40, '/alimentos/malteada(vainilla).webp');
