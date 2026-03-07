-- Add brand column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;

-- Update existing products with brands based on their names
UPDATE products SET brand = 'Apple' WHERE name_en LIKE '%iPhone%' OR name_en LIKE '%MacBook%' OR name_en LIKE '%iPad%' OR name_en LIKE '%AirPods%' OR name_en LIKE '%Apple Watch%';
UPDATE products SET brand = 'Samsung' WHERE name_en LIKE '%Samsung%' OR name_en LIKE '%Galaxy%';
UPDATE products SET brand = 'Sony' WHERE name_en LIKE '%Sony%' OR name_en LIKE '%PlayStation%';
UPDATE products SET brand = 'LG' WHERE name_en LIKE '%LG%';
UPDATE products SET brand = 'Bosch' WHERE name_en LIKE '%Bosch%';
UPDATE products SET brand = 'Philips' WHERE name_en LIKE '%Philips%';
UPDATE products SET brand = 'Dyson' WHERE name_en LIKE '%Dyson%';
UPDATE products SET brand = 'Dell' WHERE name_en LIKE '%Dell%';
UPDATE products SET brand = 'Logitech' WHERE name_en LIKE '%Logitech%';
UPDATE products SET brand = 'JBL' WHERE name_en LIKE '%JBL%';
UPDATE products SET brand = 'DJI' WHERE name_en LIKE '%DJI%';
UPDATE products SET brand = 'Anker' WHERE name_en LIKE '%Anker%';
UPDATE products SET brand = 'TP-Link' WHERE name_en LIKE '%TP-Link%';
UPDATE products SET brand = 'Ring' WHERE name_en LIKE '%Ring%';
UPDATE products SET brand = 'Google' WHERE name_en LIKE '%Google%' OR name_en LIKE '%Chromecast%';
UPDATE products SET brand = 'Amazon' WHERE name_en LIKE '%Amazon%' OR name_en LIKE '%Echo%';
UPDATE products SET brand = 'Kenwood' WHERE name_en LIKE '%Kenwood%';
UPDATE products SET brand = 'KitchenAid' WHERE name_en LIKE '%KitchenAid%';
UPDATE products SET brand = 'De Longhi' WHERE name_en LIKE '%De Longhi%';
UPDATE products SET brand = 'iRobot' WHERE name_en LIKE '%iRobot%' OR name_en LIKE '%Roomba%';
UPDATE products SET brand = 'Ninja' WHERE name_en LIKE '%Ninja%';
UPDATE products SET brand = 'Xiaomi' WHERE name_en LIKE '%Xiaomi%';
UPDATE products SET brand = 'Keychron' WHERE name_en LIKE '%Keychron%';
UPDATE products SET brand = 'Nintendo' WHERE name_en LIKE '%Nintendo%';

-- Set default brand for products without one
UPDATE products SET brand = 'Generic' WHERE brand IS NULL;
