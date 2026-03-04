-- ============================================
-- Seed 50 Products (Electronics + Home Appliances)
-- Run this AFTER fix-rls.sql in Supabase SQL Editor
-- ============================================

-- Get category IDs
DO $$
DECLARE
  cat_electronics UUID;
  cat_home UUID;
BEGIN
  SELECT id INTO cat_electronics FROM categories WHERE name_en = 'Electronics' LIMIT 1;
  SELECT id INTO cat_home FROM categories WHERE name_en = 'Home Appliances' LIMIT 1;

  -- If categories don't exist, create them
  IF cat_electronics IS NULL THEN
    INSERT INTO categories (name_ar, name_en) VALUES ('إلكترونيات', 'Electronics') RETURNING id INTO cat_electronics;
  END IF;
  IF cat_home IS NULL THEN
    INSERT INTO categories (name_ar, name_en) VALUES ('أجهزة منزلية', 'Home Appliances') RETURNING id INTO cat_home;
  END IF;

  -- =====================
  -- ELECTRONICS (25 items)
  -- =====================
  INSERT INTO products (name_ar, name_en, description_ar, description_en, price, discount_price, stock, image_url, category_id) VALUES
  ('آيفون 15 برو ماكس', 'iPhone 15 Pro Max', 'أحدث هاتف من أبل بشريحة A17 Pro وكاميرا 48 ميجابكسل', 'Latest Apple phone with A17 Pro chip and 48MP camera', 1199.99, 1099.99, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop', cat_electronics),
  ('سامسونج جالاكسي S24 ألترا', 'Samsung Galaxy S24 Ultra', 'هاتف سامسونج الرائد مع قلم S Pen وذكاء اصطناعي', 'Samsung flagship with S Pen and Galaxy AI', 1299.99, NULL, 35, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop', cat_electronics),
  ('ماك بوك برو 16', 'MacBook Pro 16"', 'لابتوب أبل الاحترافي بشريحة M3 Max وشاشة Liquid Retina XDR', 'Apple pro laptop with M3 Max chip and Liquid Retina XDR display', 2499.99, 2299.99, 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop', cat_electronics),
  ('آيباد برو 12.9', 'iPad Pro 12.9"', 'أقوى تابلت من أبل مع شريحة M2 وشاشة XDR', 'Most powerful Apple tablet with M2 chip and XDR display', 1099.99, 999.99, 30, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', cat_electronics),
  ('سماعات AirPods Pro 2', 'AirPods Pro 2', 'سماعات لاسلكية مع إلغاء الضوضاء النشط وصوت مكاني', 'Wireless earbuds with Active Noise Cancellation and Spatial Audio', 249.99, 229.99, 100, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&h=500&fit=crop', cat_electronics),
  ('ساعة أبل ألترا 2', 'Apple Watch Ultra 2', 'أقوى ساعة ذكية من أبل للمغامرات والرياضة', 'Apple most rugged smartwatch for adventure and sport', 799.99, NULL, 25, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop', cat_electronics),
  ('سوني بلايستيشن 5', 'Sony PlayStation 5', 'أحدث جهاز ألعاب من سوني مع SSD فائق السرعة', 'Latest Sony gaming console with ultra-fast SSD', 499.99, 449.99, 40, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop', cat_electronics),
  ('تلفزيون سامسونج 65 بوصة', 'Samsung 65" QLED TV', 'تلفزيون ذكي بتقنية QLED 4K وصوت محيطي', 'Smart TV with QLED 4K and surround sound', 899.99, 799.99, 15, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop', cat_electronics),
  ('كاميرا سوني A7 IV', 'Sony A7 IV Camera', 'كاميرا احترافية بدون مرآة بدقة 33 ميجابكسل', 'Professional mirrorless camera with 33MP sensor', 2499.99, 2199.99, 10, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', cat_electronics),
  ('سماعات سوني WH-1000XM5', 'Sony WH-1000XM5', 'أفضل سماعات رأس لاسلكية مع إلغاء الضوضاء', 'Best wireless headphones with noise cancellation', 349.99, 299.99, 60, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', cat_electronics),
  ('جهاز نينتندو سويتش OLED', 'Nintendo Switch OLED', 'جهاز ألعاب محمول بشاشة OLED مذهلة', 'Portable gaming console with stunning OLED screen', 349.99, NULL, 45, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&h=500&fit=crop', cat_electronics),
  ('شاحن لاسلكي MagSafe', 'MagSafe Wireless Charger', 'شاحن لاسلكي مغناطيسي سريع لأجهزة أبل', 'Fast magnetic wireless charger for Apple devices', 39.99, 29.99, 200, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop', cat_electronics),
  ('لابتوب ديل XPS 15', 'Dell XPS 15 Laptop', 'لابتوب أنيق بمعالج Intel i9 وشاشة 4K OLED', 'Sleek laptop with Intel i9 and 4K OLED display', 1899.99, 1699.99, 18, 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=500&fit=crop', cat_electronics),
  ('ماوس لوجيتك MX Master 3S', 'Logitech MX Master 3S', 'أفضل ماوس لاسلكي للإنتاجية مع تتبع 8K DPI', 'Best wireless mouse for productivity with 8K DPI tracking', 99.99, 79.99, 80, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', cat_electronics),
  ('كيبورد ميكانيكي Keychron K2', 'Keychron K2 Mechanical Keyboard', 'كيبورد ميكانيكي لاسلكي بإضاءة RGB', 'Wireless mechanical keyboard with RGB backlight', 89.99, NULL, 55, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop', cat_electronics),
  ('شاشة LG UltraWide 34', 'LG UltraWide 34" Monitor', 'شاشة عريضة للعمل والألعاب بدقة QHD', 'Ultrawide monitor for work and gaming with QHD resolution', 449.99, 399.99, 22, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop', cat_electronics),
  ('سبيكر JBL Charge 5', 'JBL Charge 5 Speaker', 'سبيكر بلوتوث مقاوم للماء ببطارية 20 ساعة', 'Waterproof Bluetooth speaker with 20hr battery', 179.99, 149.99, 70, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', cat_electronics),
  ('درون DJI Mini 3 Pro', 'DJI Mini 3 Pro Drone', 'طائرة درون خفيفة بكاميرا 4K وتتبع ذكي', 'Lightweight drone with 4K camera and smart tracking', 759.99, 699.99, 12, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&h=500&fit=crop', cat_electronics),
  ('هارد خارجي سامسونج T7', 'Samsung T7 Portable SSD', 'هارد خارجي SSD بسرعة 1050 ميجابايت/ثانية', 'Portable SSD with 1050MB/s speed', 109.99, 89.99, 90, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop', cat_electronics),
  ('باور بانك أنكر 20000', 'Anker Power Bank 20000mAh', 'شاحن متنقل بسعة كبيرة مع شحن سريع', 'High capacity portable charger with fast charging', 49.99, 39.99, 150, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', cat_electronics),
  ('راوتر واي فاي TP-Link', 'TP-Link WiFi 6 Router', 'راوتر سريع بتقنية WiFi 6 لتغطية المنزل بالكامل', 'Fast WiFi 6 router for whole home coverage', 129.99, NULL, 40, 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop', cat_electronics),
  ('كاميرا مراقبة Ring', 'Ring Security Camera', 'كاميرا مراقبة ذكية بالرؤية الليلية والتنبيهات', 'Smart security camera with night vision and alerts', 99.99, 79.99, 65, 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=500&fit=crop', cat_electronics),
  ('جهاز Google Chromecast', 'Google Chromecast 4K', 'جهاز بث ذكي لتحويل أي تلفزيون إلى سمارت TV', 'Smart streaming device to make any TV smart', 49.99, NULL, 85, 'https://images.unsplash.com/photo-1544866092-1935c5ef2a8f?w=500&h=500&fit=crop', cat_electronics),
  ('سماعة أمازون إيكو', 'Amazon Echo Dot 5th Gen', 'مكبر صوت ذكي مع أليكسا والتحكم بالمنزل', 'Smart speaker with Alexa and home control', 49.99, 34.99, 110, 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=500&fit=crop', cat_electronics),
  ('ساعة سامسونج Galaxy Watch 6', 'Samsung Galaxy Watch 6', 'ساعة ذكية بشاشة AMOLED وتتبع الصحة المتقدم', 'Smartwatch with AMOLED display and advanced health tracking', 299.99, 269.99, 35, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop', cat_electronics);

  -- ============================
  -- HOME APPLIANCES (25 items)
  -- ============================
  INSERT INTO products (name_ar, name_en, description_ar, description_en, price, discount_price, stock, image_url, category_id) VALUES
  ('مكنسة كهربائية دايسون V15', 'Dyson V15 Vacuum Cleaner', 'مكنسة لاسلكية بتقنية الليزر لكشف الغبار', 'Cordless vacuum with laser dust detection', 749.99, 649.99, 20, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&h=500&fit=crop', cat_home),
  ('ثلاجة سامسونج فرنش دور', 'Samsung French Door Refrigerator', 'ثلاجة ذكية بشاشة لمس وصانع ثلج', 'Smart fridge with touchscreen and ice maker', 1899.99, 1699.99, 10, 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&h=500&fit=crop', cat_home),
  ('غسالة ملابس LG أتوماتيك', 'LG Front Load Washer', 'غسالة أتوماتيك بتقنية البخار وتوفير الطاقة', 'Front load washer with steam technology and energy saving', 799.99, 699.99, 15, 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&h=500&fit=crop', cat_home),
  ('مكيف سبليت 1.5 طن', 'Split AC 1.5 Ton Inverter', 'مكيف هواء انفرتر موفر للطاقة بتبريد سريع', 'Energy efficient inverter AC with fast cooling', 599.99, 499.99, 25, 'https://images.unsplash.com/photo-1631567091196-1e4b57e4d264?w=500&h=500&fit=crop', cat_home),
  ('ميكروويف سامسونج', 'Samsung Microwave Oven', 'ميكروويف بتقنية السيراميك وسعة 32 لتر', 'Microwave with ceramic tech and 32L capacity', 199.99, 169.99, 40, 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop', cat_home),
  ('محضرة طعام كينوود', 'Kenwood Food Processor', 'محضرة طعام متعددة الوظائف بمحرك قوي', 'Multi-function food processor with powerful motor', 249.99, NULL, 30, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop', cat_home),
  ('مكواة بخار فيليبس', 'Philips Steam Iron', 'مكواة بخار بقاعدة سيراميك وبخار قوي', 'Steam iron with ceramic soleplate and powerful steam', 79.99, 59.99, 50, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop', cat_home),
  ('خلاط كيتشن إيد', 'KitchenAid Stand Mixer', 'خلاط عجين احترافي بـ 10 سرعات و5 لتر', 'Professional stand mixer with 10 speeds and 5L bowl', 449.99, 399.99, 18, 'https://images.unsplash.com/photo-1594385208974-2f8bb9a39569?w=500&h=500&fit=crop', cat_home),
  ('ماكينة قهوة ديلونجي', 'De Longhi Espresso Machine', 'ماكينة إسبريسو أتوماتيك بمطحنة مدمجة', 'Automatic espresso machine with built-in grinder', 599.99, 549.99, 22, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop', cat_home),
  ('غلاية ماء كهربائية', 'Electric Kettle 1.7L', 'غلاية كهربائية بتحكم في درجة الحرارة', 'Electric kettle with temperature control', 49.99, 39.99, 80, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', cat_home),
  ('مجفف ملابس سامسونج', 'Samsung Clothes Dryer', 'مجفف ملابس بتقنية المضخة الحرارية', 'Clothes dryer with heat pump technology', 699.99, NULL, 12, 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500&h=500&fit=crop', cat_home),
  ('فرن كهربائي بلت إن', 'Built-in Electric Oven', 'فرن كهربائي مدمج بشاشة رقمية و12 برنامج طهي', 'Built-in electric oven with digital display and 12 cooking modes', 599.99, 499.99, 14, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop', cat_home),
  ('غسالة صحون بوش', 'Bosch Dishwasher', 'غسالة صحون هادئة بتقنية الغسيل الذكي', 'Quiet dishwasher with smart wash technology', 849.99, 749.99, 16, 'https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=500&h=500&fit=crop', cat_home),
  ('مروحة سقف ذكية', 'Smart Ceiling Fan', 'مروحة سقف بريموت والتحكم عبر التطبيق', 'Ceiling fan with remote and app control', 199.99, 179.99, 35, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop', cat_home),
  ('سخان ماء كهربائي', 'Electric Water Heater 50L', 'سخان مياه كهربائي بسعة 50 لتر وعزل حراري', 'Electric water heater 50L with thermal insulation', 249.99, 219.99, 28, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=500&fit=crop', cat_home),
  ('مكنسة روبوت iRobot', 'iRobot Roomba Robot Vacuum', 'مكنسة روبوت ذكية بخرائط وتنظيف تلقائي', 'Smart robot vacuum with mapping and auto cleaning', 449.99, 399.99, 20, 'https://images.unsplash.com/photo-1589894404892-8eada05c8c51?w=500&h=500&fit=crop', cat_home),
  ('توستر فيليبس', 'Philips Toaster', 'محمصة خبز بـ 8 مستويات تحميص وإلغاء فوري', 'Toaster with 8 browning levels and instant cancel', 39.99, 29.99, 60, 'https://images.unsplash.com/photo-1590515024536-21500cfe4f80?w=500&h=500&fit=crop', cat_home),
  ('منقي هواء شاومي', 'Xiaomi Air Purifier', 'منقي هواء ذكي بفلتر HEPA لتنقية الهواء', 'Smart air purifier with HEPA filter', 199.99, 169.99, 30, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop', cat_home),
  ('شفاط مطبخ ستانلس', 'Stainless Steel Range Hood', 'شفاط مطبخ بقوة سحب عالية وإضاءة LED', 'Range hood with high suction and LED lighting', 349.99, 299.99, 18, 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500&h=500&fit=crop', cat_home),
  ('مبرد مياه', 'Water Dispenser Hot/Cold', 'مبرد مياه ساخن وبارد مع خزان سفلي', 'Hot and cold water dispenser with bottom load', 199.99, NULL, 25, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=500&fit=crop', cat_home),
  ('مقلاة هوائية نينجا', 'Ninja Air Fryer XL', 'قلاية هوائية بسعة كبيرة وبرامج طبخ متعددة', 'Large capacity air fryer with multiple cooking programs', 149.99, 119.99, 45, 'https://images.unsplash.com/photo-1648464486451-e0a86fa72e0d?w=500&h=500&fit=crop', cat_home),
  ('عصارة فواكه بطيئة', 'Slow Juicer Machine', 'عصارة بطيئة تحافظ على العناصر الغذائية', 'Slow juicer that preserves nutrients', 179.99, 149.99, 25, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&h=500&fit=crop', cat_home),
  ('سخان زيت ديلونجي', 'De Longhi Oil Heater', 'سخان زيت بـ 11 ريشة وثرموستات ذكي', 'Oil heater with 11 fins and smart thermostat', 129.99, NULL, 35, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=500&fit=crop', cat_home),
  ('جهاز تنقية مياه', 'Water Purifier System', 'جهاز تنقية مياه 7 مراحل بتقنية التناضح العكسي', '7-stage water purifier with reverse osmosis', 299.99, 249.99, 20, 'https://images.unsplash.com/photo-1564419320461-6262a0fced37?w=500&h=500&fit=crop', cat_home),
  ('مكبس ساندويتش كهربائي', 'Electric Sandwich Press', 'مكبس ساندويتش بألواح غير لاصقة وتسخين سريع', 'Sandwich press with non-stick plates and fast heating', 34.99, 24.99, 70, 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&h=500&fit=crop', cat_home);

END $$;
