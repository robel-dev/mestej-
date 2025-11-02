-- Mestej Inventory Products Migration
-- This migration inserts all products from the inventory list

-- First, get supplier IDs (assuming they were created in the previous migration)
DO $$
DECLARE
    mestej_id UUID;
    alessandro_id UUID;
    anno_domini_id UUID;
    corteaura_id UUID;
    bellussi_id UUID;
    mazood_id UUID;
    matusko_id UUID;
    nino_zeni_id UUID;
    premium_id UUID;
BEGIN
    -- Get supplier IDs
    SELECT id INTO mestej_id FROM suppliers WHERE name = 'Mestej';
    SELECT id INTO alessandro_id FROM suppliers WHERE name = 'Alessandro Bortolin';
    SELECT id INTO anno_domini_id FROM suppliers WHERE name = '47 ANNO DOMINI';
    SELECT id INTO corteaura_id FROM suppliers WHERE name = 'Corteaura';
    SELECT id INTO bellussi_id FROM suppliers WHERE name = 'BELLUSSÌ';
    SELECT id INTO mazood_id FROM suppliers WHERE name = 'MAZOOD';
    SELECT id INTO matusko_id FROM suppliers WHERE name = 'MATUSKO';
    SELECT id INTO nino_zeni_id FROM suppliers WHERE name = 'Nino Zeni';
    SELECT id INTO premium_id FROM suppliers WHERE name = 'Premium Wine Supplier';

    -- Mestej Products (Tej/Honeywine)
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('Honeywine Normal', 'Traditional honey wine', 'wine', mestej_id, 'in_stock'),
    ('Buckwheat honey', 'Honey wine made from buckwheat honey', 'wine', mestej_id, 'in_stock'),
    ('Blueberry', 'Blueberry wine', 'wine', mestej_id, 'in_stock'),
    ('Buckthorn', 'Buckthorn wine', 'wine', mestej_id, 'in_stock');

    -- Alessandro Bortolin Products
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('AB - D.O.C.G Brut', 'Prosecco D.O.C.G Brut', 'wine', alessandro_id, 'in_stock'),
    ('AB - D.O.C.G Millesemato', 'Prosecco D.O.C.G Millesemato', 'wine', alessandro_id, 'in_stock'),
    ('AB - D.O.C.G Extra Dry', 'Prosecco D.O.C.G Extra Dry', 'wine', alessandro_id, 'in_stock'),
    ('AB - D.O.C.G VIVID Millesimato', 'Prosecco D.O.C.G VIVID Millesimato', 'wine', alessandro_id, 'in_stock'),
    ('AB - Cartizze AURA', 'Prosecco Cartizze AURA', 'wine', alessandro_id, 'in_stock'),
    ('VIBRANT Prosecco/Spumante Alkoholfri', 'Alcohol-free Prosecco/Spumante', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C.G Brut', 'GEMIN Prosecco D.O.C.G Brut', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C.G Extra Dry', 'GEMIN Prosecco D.O.C.G Extra Dry', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C Brut', 'GEMIN Prosecco D.O.C Brut', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C Extra Dry', 'GEMIN Prosecco D.O.C Extra Dry', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C.G Millesi. Dry Madre P.', 'GEMIN D.O.C.G Millesimato Dry Madre Perla', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Sparkling Rosé', 'GEMIN Sparkling Rosé', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Superior de Cartizze', 'GEMIN Superior de Cartizze', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Treviso 0,20 Brut', 'GEMIN Treviso 0,20 Brut', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Treviso 0,20 Extra Dry', 'GEMIN Treviso 0,20 Extra Dry', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - D.O.C.G Extra Brut Pioniere', 'GEMIN D.O.C.G Extra Brut Pioniere', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Sparkling Extra Dry', 'GEMIN Sparkling Extra Dry', 'wine', alessandro_id, 'in_stock'),
    ('GEMIN - Sparkling Brut', 'GEMIN Sparkling Brut', 'wine', alessandro_id, 'in_stock');

    -- 47 ANNO DOMINI Products
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('PROSECCO DOC SPUMANTE BRUT', 'Prosecco DOC Spumante Brut', 'wine', anno_domini_id, 'in_stock'),
    ('BIANCO SPUMANTE CUVEE Extra Dry', 'Bianco Spumante Cuvée Extra Dry', 'wine', anno_domini_id, 'in_stock'),
    ('PROSECCO DOC SPUMANTE BIO VEGAN EXTRA BRUT', 'Prosecco DOC Spumante Bio Vegan Extra Brut', 'wine', anno_domini_id, 'in_stock'),
    ('GRAN CUVÉE VINO BIANCO SPUMANTE BIO VEGAN', 'Gran Cuvée Vino Bianco Spumante Bio Vegan', 'wine', anno_domini_id, 'in_stock');

    -- Corteaura Products
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('CORTE AURA BRUT', 'Corte Aura Brut', 'wine', corteaura_id, 'in_stock'),
    ('CORTE AURA BRUT SATEN 2013', 'Corte Aura Brut Saten 2013', 'wine', corteaura_id, 'in_stock'),
    ('CORTE AURA PAS DOSE 2013', 'Corte Aura Pas Dosé 2013', 'wine', corteaura_id, 'in_stock'),
    ('CORTE AURA INSÈ PAS DOSE 2013', 'Corte Aura Insè Pas Dosé 2013', 'wine', corteaura_id, 'in_stock');

    -- BELLUSSÌ Products
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('VALDOBBIADENE PROSECCO SUP.DOCG EXTRA DRY', 'Valdobbiadene Prosecco Superiore DOCG Extra Dry', 'wine', bellussi_id, 'in_stock'),
    ('VALDOBBIADENE PROSECCO SUP. DOCG BRUT', 'Valdobbiadene Prosecco Superiore DOCG Brut', 'wine', bellussi_id, 'in_stock'),
    ('PROSECCO DOC BRUT', 'Prosecco DOC Brut', 'wine', bellussi_id, 'in_stock'),
    ('PROSECCO DOC EXTRA DRY', 'Prosecco DOC Extra Dry', 'wine', bellussi_id, 'in_stock'),
    ('GRANDE CUVÈE EXTRA DRY', 'Grande Cuvée Extra Dry', 'wine', bellussi_id, 'in_stock');

    -- MAZOOD Products
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('NegroAmaro Mira ROSÉ', 'NegroAmaro Mira Rosé', 'wine', mazood_id, 'in_stock'),
    ('NegroAmaro Mira RED', 'NegroAmaro Mira Red', 'wine', mazood_id, 'in_stock'),
    ('Verdeca Mira WHITE', 'Verdeca Mira White', 'wine', mazood_id, 'in_stock'),
    ('Primitivo IGP Puglia', 'Primitivo IGP Puglia', 'wine', mazood_id, 'in_stock'),
    ('Primitivo Mira RED', 'Primitivo Mira Red', 'wine', mazood_id, 'in_stock');

    -- Premium Wines
    INSERT INTO products (name, description, product_type, supplier_id, availability) VALUES
    ('Royal Dignac RED 2011', 'Royal Dignac Red 2011 - MATUSKO', 'wine', matusko_id, 'in_stock'),
    ('Reserva Dignac RED 2013', 'Reserva Dignac Red 2013 - MATUSKO', 'wine', matusko_id, 'in_stock'),
    ('Dekanozishvili Dry Red Wine 2017', 'Dekanozishvili Dry Red Wine 2017 - Georgia', 'wine', premium_id, 'in_stock'),
    ('AMARONE DELLA VALPOLICELLA Classico DOCG 2015', 'Amarone della Valpolicella Classico DOCG 2015 - Nino Zeni', 'wine', nino_zeni_id, 'in_stock'),
    ('AMARONE DELLA VALPOLICELLA Classico Riserva DOCG 2016', 'Amarone della Valpolicella Classico Riserva DOCG 2016 - Nino Zeni', 'wine', nino_zeni_id, 'in_stock'),
    ('OPUS ONE CALIFORNIE NAPA VALLEY 2019', 'Opus One California Napa Valley 2019', 'wine', premium_id, 'in_stock');

END $$;

-- Note: Prices should be added separately via the application or admin panel
-- Example price insertion (commented out - adjust prices as needed):
/*
-- Insert default prices for products (example - adjust prices)
INSERT INTO product_prices (product_id, price, currency)
SELECT id, 299.00, 'SEK' FROM products WHERE name LIKE 'Mestej%'
UNION ALL
SELECT id, 250.00, 'SEK' FROM products WHERE supplier_id IN (SELECT id FROM suppliers WHERE name != 'Mestej');
*/

