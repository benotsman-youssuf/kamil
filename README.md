# كامل - محرر نصوص عربي متقدم!

<p align="center">
  <img width="100" height="100" alt="logo" src="https://github.com/user-attachments/assets/40bbdeab-cbf4-4265-a5e1-f34f68724031" />
</p>



مشروع كامل هو محرر نصوص عربي متقدم مبني بتقنيات الويب الحديثة، مصمم خصيصًا للكتابة باللغة العربية مع دعم متكامل للقرآن الكريم والأدوات الكتابية المتقدمة.

## المميزات الرئيسية

- ✍️ **محرر نصوص غني** مع دعم كامل للغة العربية
- 📖 **تكامل مع القرآن الكريم** مع إمكانية البحث والإدراج

## التقنيات المستخدمة

- React 
- Tailwind CSS
- PlateJS (محرر النصوص)
- Indexed DB


## التثبيت

1. استنسخ المشروع:
   ```bash
   git clone https://github.com/yourusername/kamil.git
   cd kamil
   ```

2. قم بتثبيت الحزم المطلوبة:
   ```bash
   npm install
   # أو
   yarn install
   ```

## التشغيل

لتشغيل المشروع في وضع التطوير:

```bash
npm run dev
# أو
yarn dev
```

لإنشاء نسخة إنتاج:

```bash
npm run build
# أو
yarn build
```

## الاستخدام

1. **الكتابة العادية**: ابدأ بالكتابة مباشرة في المحرر
2. **إدراج آيات قرآنية**:ضع مسافة ثم اكتب `/` متبوعًا ببداية الآية التي تريد إدراجها
3. **تنسيق النص**: استخدم شريط الأدوات لتنسيق النص


## وضع الهاكاثون (تكامل Quran Foundation)

يمكنك الإبقاء على التطبيق محليًا بالكامل، أو تفعيل تكامل API كالتالي:

```bash
cp .env.template .env
```

ثم حدّث المتغيرات:

- `VITE_USE_QF_CONTENT_API=true` لتفعيل البحث عبر Content API.
- `VITE_QF_ENDPOINT`: ضع الـ End-Point الذي وصلك من الهاكاثون.
- `VITE_QF_CLIENT_ID`: ضع Client ID.
- `VITE_QF_CLIENT_SECRET`: ضع Client Secret.

عند عدم تفعيل بيانات User API سيظل التطبيق يعمل محليًا فقط (Local-first).
