# آخر التحديثات - Latest Updates

## التحديثات الجديدة (13 مارس 2026)

### ✅ **إضافة صور للتصنيفات**
- إضافة عمود `image_url` لجدول التصنيفات
- إمكانية رفع صور للتصنيفات من لوحة التحكم
- عرض صور التصنيفات في الصفحة الرئيسية
- إذا لم توجد صورة، يظهر أيقونة افتراضية

**الملفات المعدلة:**
- `src/types/index.ts` - إضافة `image_url` للـ Category
- `src/app/dashboard/categories/page.tsx` - رفع وإدارة صور التصنيفات
- `src/app/page.tsx` - عرض صور التصنيفات
- `supabase/add-category-images.sql` - SQL migration

### ✅ **التنقل بين صور المنتجات**
تم إضافة طرق متعددة للتنقل بين صور المنتج:

#### 📱 **على الموبايل:**
- **السحب بالإصبع**: اسحب يمين/يسار للتنقل بين الصور
- **النقر على الأسهم**: أسهم تظهر عند لمس الصورة

#### 🖱️ **على الكمبيوتر:**
- **الماوس**: أسهم تظهر عند تمرير الماوس على الصورة
- **لوحة المفاتيح**: استخدم السهم الأيمن ← والسهم الأيسر →
- **النقر على الصور المصغرة**: اضغط على أي صورة مصغرة للانتقال إليها

#### ✨ **مميزات إضافية:**
- عداد الصور (1/5) يظهر أسفل الصورة
- الصورة الحالية محددة في الصور المصغرة
- تأثيرات سلسة عند التنقل
- منع السحب غير المقصود للصورة

**الملفات المعدلة:**
- `src/app/(shop)/shop/[id]/page.tsx` - إضافة كل وظائف التنقل

---

## خطوات التشغيل المطلوبة

### 🔴 **مهم جداً - شغل SQL Migrations:**

افتح Supabase Dashboard → SQL Editor وشغل:

```sql
-- 1. إضافة صور للتصنيفات
-- انسخ محتوى: supabase/add-category-images.sql
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;
```

---

## جميع التحديثات السابقة

### ✅ اللوجو والأيقونة
- لوجو في الهيدر والفوتر
- فافيكون محدث

### ✅ معلومات التواصل
- فيسبوك: https://www.facebook.com/profile.php?id=61584064901025&locale=ar_AR
- هاتف: +20 10 11905287

### ✅ صور متعددة للمنتجات
- رفع أكثر من صورة لكل منتج
- معرض صور مع صور مصغرة
- حذف الصور الفردية

### ✅ إدارة العلامات التجارية
- قسم جديد في لوحة التحكم
- رفع شعارات العلامات
- عرض في الصفحة الرئيسية

---

## الملفات المهمة

### SQL Migrations (يجب تشغيلها):
1. `supabase/add-product-images.sql` - صور متعددة للمنتجات
2. `supabase/add-brands-table.sql` - جدول العلامات التجارية
3. `supabase/add-category-images.sql` - صور التصنيفات ⭐ جديد

### الصفحات الرئيسية:
- `src/app/page.tsx` - الصفحة الرئيسية
- `src/app/(shop)/shop/[id]/page.tsx` - صفحة المنتج
- `src/app/dashboard/brands/page.tsx` - إدارة العلامات
- `src/app/dashboard/categories/page.tsx` - إدارة التصنيفات
- `src/app/dashboard/products/page.tsx` - إدارة المنتجات

---

## للمطورين

### كيفية استخدام التنقل بين الصور:
```typescript
// التنقل بالأسهم
const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % totalImages);
const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);

// السحب باللمس
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}

// لوحة المفاتيح
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [totalImages]);
```

---

تم التحديث: 13 مارس 2026 - 10:31 مساءً
