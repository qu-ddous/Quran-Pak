import type { IslamicBook } from '../types/books';

export const ISLAMIC_BOOKS_DATA: IslamicBook[] = [
  // ─── BOOK 1: NAMAZ-E-HANAFI ────────────────────────────────────────────────
  {
    id: 'namaz-e-hanafi',
    title: 'Namaz-e-Hanafi مع مکمل ترجمہ و احکام',
    arabicTitle: 'صَلَاةُ الحَنَفِيَّةِ مَعَ التَّرْجَمَةِ وَالأَحْكَامِ',
    author: 'فقہ حنفی • Fiqh Hanafi Scholars',
    category: 'namaz',
    categoryLabel: 'نماز گائیڈ • Salah Guide',
    description: 'حنفی طریقہ نماز کی مکمل رہنمائی مع تکبیرِ تحریمہ، ثناء، رکوع، سجود، تشہد، درود شریف، دعائے قنوت، نمازِ جنازہ، عیدین، تراویح اور ضروری احکام و مسائل۔',
    coverGradient: 'linear-gradient(135deg, #092c21 0%, #165b44 50%, #0d382b 100%)',
    accentColor: '#d4af37',
    totalItems: 22,
    readTime: '20 mins',
    tags: [
      'namaz', 'salah', 'hanafi', 'namaz-e-hanafi', 'qunoot', 'janaza', 'tashahhud',
      'thana', 'ruku', 'sajdah', 'witr', 'eid', 'taraweeh', 'نماز', 'حنفی', 'قنوت', 'جنازہ'
    ],
    chapters: [
      {
        id: 'namaz-steps',
        title: 'نماز کی ترتیب اور مسنون اذکار مع ترجمہ',
        arabicTitle: 'أَذْكَارُ الصَّلَاةِ وَتَرْتِيبُهَا',
        description: 'تکبیرِ تحریمہ سے سلام پھیرنے تک ہر رکن کے الفاظ، عربی متن، تلفظ اور اردو و انگریزی ترجمہ۔',
        items: [
          {
            id: 'nh-niyyah-takbeer',
            title: '1. نیت اور تکبیرِ تحریمہ (Takbeer-e-Tehreema)',
            arabicTitle: 'التَّكْبِيرَةُ الأُولَى',
            arabicText: 'اللَّهُ أَكْبَرُ',
            transliteration: 'Allahu Akbar',
            translationUrdu: 'اللہ سب سے بڑا ہے۔ (دل میں نماز کا ارادہ کر کے دونوں ہاتھ کانوں کی لو تک اٹھائیں اور اللہ اکبر کہہ کر ناف کے نیچے باندھ لیں)۔',
            translationEnglish: 'Allah is the Greatest. (Intend the prayer in your heart, raise both hands to the earlobes, say the Takbeer and fold hands below the navel).',
            reference: 'صحیح البخاری: 735 • سنن ابی داود: 721',
            benefits: 'نماز کی ابتدا تکبیرِ تحریمہ سے ہوتی ہے جس کے بعد دنیاوی بات چیت حرام ہو جاتی ہے۔',
            repeatCount: 1,
            tags: ['takbeer', 'start', 'niyyah', 'تکبیر']
          },
          {
            id: 'nh-thana',
            title: '2. ثناء (Subhanak Allahumma)',
            arabicTitle: 'دُعَاءُ الاسْتِفْتَاحِ (الثَّنَاءُ)',
            arabicText: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ.',
            transliteration: 'Subhanaka Allahumma wa bihamdika, wa tabarakasmuka, wa ta\'ala jadduka, wa la ilaha ghairuk.',
            translationUrdu: 'اے اللہ! تو پاک ہے اور تیری ہی تعریف ہے، اور تیرا نام برکت والا ہے، اور تیری شان بہت بلند ہے، اور تیرے سوا کوئی عبادت کے لائق نہیں۔',
            translationEnglish: 'Glory be to You, O Allah, and praise be to You, blessed is Your Name, exalted is Your Majesty, and there is none worthy of worship besides You.',
            reference: 'سنن الترمذی: 242 • سنن ابی داود: 775',
            benefits: 'تکبیرِ تحریمہ کے فوراً بعد ثناء پڑھنا سنتِ مؤکدہ ہے۔',
            repeatCount: 1,
            tags: ['thana', 'subhanak', 'ثناء']
          },
          {
            id: 'nh-taawwuz-tasmiyah',
            title: '3. تعوذ اور تسمیہ (Ta\'awwuz & Tasmiyah)',
            arabicTitle: 'التَّعَوُّذُ وَالتَّسْمِيَةُ',
            arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ • بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            transliteration: 'A\'udhu billahi minash-shaytanir-rajeem. Bismillahir-Rahmanir-Raheem.',
            translationUrdu: 'میں پناہ مانگتا ہوں اللہ کی شیطان مردود سے۔ • شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔',
            translationEnglish: 'I seek refuge in Allah from Satan the outcast. • In the name of Allah, the Entirely Merciful, the Especially Merciful.',
            reference: 'سورۃ النحل: 98 • قرآن کریم',
            benefits: 'قرآن پڑھنے سے پہلے تعوذ اور ہر سورت سے پہلے تسمیہ پڑھنا سنت ہے۔',
            repeatCount: 1,
            tags: ['taawwuz', 'bismillah', 'تسمیہ']
          },
          {
            id: 'nh-fatihah',
            title: '4. سورۃ الفاتحہ (Surah Al-Fatihah)',
            arabicTitle: 'سُورَةُ الفَاتِحَةِ',
            arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝ آمِينَ',
            transliteration: 'Al-hamdu lillahi Rabbil-\'alameen. Ar-Rahmanir-Raheem. Maliki Yawmid-Deen. Iyyaka na\'budu wa iyyaka nasta\'een. Ihdinas-siratal-mustaqeem. Siratal-ladheena an\'amta \'alayhim ghayril-maghdoobi \'alayhim wa lad-daalleen. Ameen.',
            translationUrdu: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے۔ بہت مہربان، نہایت رحم کرنے والا ہے۔ روزِ جزا کا مالک ہے۔ ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد چاہتے ہیں۔ ہمیں سیدھے راستے پر چلا۔ ان لوگوں کے راستے پر جن پر تو نے انعام فرمایا، نہ کہ ان پر جن پر غضب نازل ہوا اور نہ گمراہوں کے راستے۔ الٰہی قبول فرما۔',
            translationEnglish: '[All] praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path. The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray. Amen.',
            reference: 'سورۃ الفاتحہ: 1-7 • صحیح البخاری: 756',
            benefits: 'سورۃ الفاتحہ نماز کا لازمی رکن ہے، اس کے بعد کوئی اور سورت (جیسے سورۃ الاخلاص یا کوثر) ملائی جاتی ہے۔',
            repeatCount: 1,
            tags: ['fatihah', 'surah', 'فاتحہ']
          },
          {
            id: 'nh-ruku',
            title: '5. رکوع کی تسبیح (Tasbeeh in Ruku)',
            arabicTitle: 'تَسْبِيحُ الرُّكُوعِ',
            arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
            transliteration: 'Subhana Rabbiyal-\'Azeem',
            translationUrdu: 'پاک ہے میرا پروردگار جو بڑی عظمت والا ہے۔ (رکوع میں کم از کم تین مرتبہ پڑھیں)۔',
            translationEnglish: 'Glory be to my Lord, the Almighty. (Recited at least 3 times in bowing position).',
            reference: 'صحیح مسلم: 772 • سنن ابی داود: 871',
            benefits: 'رکوع میں پیٹھ سیدھی رکھنا اور اطمینان سے کم از کم 3، 5 یا 7 بار تسبیح پڑھنا سنت ہے۔',
            repeatCount: 3,
            tags: ['ruku', 'bowing', 'رکوع']
          },
          {
            id: 'nh-qawmah',
            title: '6. قومہ: تسمیع اور تحمید (Tasmee & Tahmeed)',
            arabicTitle: 'التَّسْمِيعُ وَالتَّحْمِيدُ فِي القَوْمَةِ',
            arabicText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ • رَبَّنَا لَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
            transliteration: 'Sami\' Allahu liman hamidah. Rabbana lakal-hamd, hamdan katheeran tayyiban mubarakan feeh.',
            translationUrdu: 'اللہ نے سن لی اس کی بات جس نے اس کی تعریف کی۔ • اے ہمارے پروردگار! تمام تعریفیں تیرے ہی لیے ہیں، بہت زیادہ، پاکیزہ اور برکت والی تعریفیں۔',
            translationEnglish: 'Allah hears whoever praises Him. • Our Lord, to You belongs all praise, an abundant, good and blessed praise.',
            reference: 'صحیح البخاری: 795 • صحیح مسلم: 409',
            benefits: 'رکوع سے اٹھتے وقت امام تسمیع کہتا ہے، مقتدی تحمید، اور اکیلا نمازی دونوں پڑھتا ہے۔ قومہ میں بالکل سیدھا کھڑا ہونا واجب ہے۔',
            repeatCount: 1,
            tags: ['qawmah', 'tahmeed', 'قومہ']
          },
          {
            id: 'nh-sajdah',
            title: '7. سجدے کی تسبیح (Tasbeeh in Sajdah)',
            arabicTitle: 'تَسْبِيحُ السُّجُودِ',
            arabicText: 'سُبْحَانَ رَبِّيَ الأَعْلَىٰ',
            transliteration: 'Subhana Rabbiyal-A\'la',
            translationUrdu: 'پاک ہے میرا پروردگار جو سب سے بلند تر ہے۔ (سجدے میں کم از کم تین مرتبہ پڑھیں)۔',
            translationEnglish: 'Glory be to my Lord, the Most High. (Recited at least 3 times in prostration).',
            reference: 'صحیح مسلم: 772 • سنن ابی داود: 871',
            benefits: 'بندہ اپنے رب کے سب سے زیادہ قریب سجدے کی حالت میں ہوتا ہے۔ دونوں سجدوں کے درمیان اطمینان سے بیٹھنا واجب ہے۔',
            repeatCount: 3,
            tags: ['sajdah', 'prostration', 'سجدہ']
          },
          {
            id: 'nh-jalsa',
            title: '8. جلسہ: دو سجدوں کے درمیان کی دعا (Dua in Jalsa)',
            arabicTitle: 'دُعَاءُ الجِلْسَةِ بَيْنَ السَّجْدَتَيْنِ',
            arabicText: 'رَبِّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَعَافِنِي، وَارْزُقْنِي.',
            transliteration: 'Rabbighfir lee, warhamnee, wahdinee, wa \'aafinee, warzuqnee.',
            translationUrdu: 'اے میرے رب! مجھے بخش دے، مجھ پر رحم فرما، مجھے ہدایت دے، مجھے عافیت عطا فرما، اور مجھے رزق عطا فرما۔',
            translationEnglish: 'O my Lord! Forgive me, have mercy on me, guide me, grant me health/well-being, and provide for me.',
            reference: 'سنن ابی داود: 850 • سنن الترمذی: 284',
            benefits: 'دونوں سجدوں کے درمیان سیدھے بیٹھ کر یہ دعا پڑھنا سنت اور باعثِ برکت ہے۔',
            repeatCount: 1,
            tags: ['jalsa', 'between-sajdah', 'جلسہ']
          },
          {
            id: 'nh-tashahhud',
            title: '9. التحیات / تشہد (Tashahhud - Attahiyyat)',
            arabicTitle: 'التَّشَهُّدُ (التَّحِيَّاتُ)',
            arabicText: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
            transliteration: 'At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu \'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu \'alayna wa \'ala \'ibadillahis-saliheen. Ash-hadu alla ilaha illallahu wa ash-hadu anna Muhammadan \'abduhu wa rasooluh.',
            translationUrdu: 'تمام قولی، بدنی اور مالی عبادتیں اللہ ہی کے لیے ہیں۔ اے نبی! آپ پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں ہوں۔ ہم پر اور اللہ کے تمام نیک بندوں پر سلامتی ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور میں گواہی دیتا ہوں کہ حضرت محمد ﷺ اللہ کے بندے اور اس کے رسول ہیں۔',
            translationEnglish: 'All verbal, physical, and financial worships are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is none worthy of worship except Allah, and I bear witness that Muhammad is His servant and His messenger.',
            reference: 'صحیح البخاری: 831 • صحیح مسلم: 402',
            benefits: 'قعدہ اولیٰ اور قعدہ اخیرہ میں تشہد پڑھنا واجب ہے۔ "أَشْهَدُ أَنْ لَا إِلَٰهَ" پر شہادت کی انگلی اٹھانا اور "إِلَّا اللَّهُ" پر جھکانا سنت ہے۔',
            repeatCount: 1,
            tags: ['tashahhud', 'attahiyyat', 'تشہد', 'التحیات']
          },
          {
            id: 'nh-durood-ibrahim',
            title: '10. درودِ ابراہیم (Durood-e-Ibrahimi)',
            arabicTitle: 'الصَّلَاةُ الإِبْرَاهِيمِيَّةُ',
            arabicText: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ • اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ.',
            transliteration: 'Allahumma salli \'ala Muhammadin wa \'ala aali Muhammadin kama sallayta \'ala Ibraheema wa \'ala aali Ibraheema innaka Hameedum-Majeed. Allahumma barik \'ala Muhammadin wa \'ala aali Muhammadin kama barakta \'ala Ibraheema wa \'ala aali Ibraheema innaka Hameedum-Majeed.',
            translationUrdu: 'اے اللہ! رحمت نازل فرما حضرت محمد ﷺ پر اور ان کی آل پر جیسا کہ تو نے رحمت نازل فرمائی حضرت ابراہیم علیہ السلام پر اور ان کی آل پر، بیشک تو تعریف کے لائق اور بزرگی والا ہے۔ اے اللہ! برکت نازل فرما حضرت محمد ﷺ پر اور ان کی آل پر جیسا کہ تو نے برکت نازل فرمائی حضرت ابراہیم علیہ السلام پر اور ان کی آل پر، بیشک تو تعریف کے لائق اور بزرگی والا ہے۔',
            translationEnglish: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim; indeed, You are Praiseworthy and Glorious.',
            reference: 'صحیح البخاری: 3370 • صحیح مسلم: 406',
            benefits: 'آخری قعدے میں تشہد کے بعد درود شریف پڑھنا سنتِ مؤکدہ ہے۔ نبی کریم ﷺ پر درود بھیجنا سب سے افضل عبادتوں میں سے ہے۔',
            repeatCount: 1,
            tags: ['durood', 'salawat', 'درود']
          },
          {
            id: 'nh-dua-masura',
            title: '11. دعائے ماثورہ (Dua-e-Masura)',
            arabicTitle: 'الدُّعَاءُ بَعْدَ الصَّلَاةِ عَلَى النَّبِيِّ',
            arabicText: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ.',
            transliteration: 'Allahumma innee zalamtu nafsee zulman katheera, wa la yaghfirudh-dhunooba illa anta, faghfir lee maghfiratan min \'indika, warhamnee, innaka antal-Ghafoorur-Raheem.',
            translationUrdu: 'اے اللہ! میں نے اپنی جان پر بہت زیادہ ظلم کیا ہے، اور تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا، پس مجھے اپنے پاس سے خاص بخشش عطا فرما اور مجھ پر رحم فرما، بیشک تو ہی بہت بخشنے والا، نہایت رحم فرمانے والا ہے۔',
            translationEnglish: 'O Allah, I have wronged myself greatly, and no one forgives sins except You, so grant me forgiveness from You and have mercy on me. Indeed, You are the Forgiving, the Merciful.',
            reference: 'صحیح البخاری: 834 • صحیح مسلم: 2705',
            benefits: 'درودِ پاک کے بعد سلام سے پہلے یہ دعا یا قرآن و حدیث کی کوئی بھی ماثورہ دعا پڑھنا سنت ہے۔',
            repeatCount: 1,
            tags: ['dua-masura', 'dua', 'دعائے ماثورہ']
          },
          {
            id: 'nh-salam',
            title: '12. سلام (Tasleem / Salam)',
            arabicTitle: 'التَّسْلِيمُ لِلْخُرُوجِ مِنَ الصَّلَاةِ',
            arabicText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
            transliteration: 'As-salamu \'alaykum wa rahmatullah',
            translationUrdu: 'تم پر سلامتی ہو اور اللہ کی رحمت۔ (پہلے دائیں طرف رخ کر کے کہیں، پھر بائیں طرف رخ کر کے کہیں)۔',
            translationEnglish: 'Peace be upon you, and the mercy of Allah. (Turn face to the right, then turn face to the left).',
            reference: 'صحیح مسلم: 582 • سنن الترمذی: 295',
            benefits: 'سلام پھیرنے کے ساتھ ہی نماز مکمل ہو جاتی ہے۔',
            repeatCount: 2,
            tags: ['salam', 'tasleem', 'سلام']
          }
        ]
      },
      {
        id: 'witr-qunoot',
        title: 'دعائے قنوت (نمازِ وتر)',
        arabicTitle: 'دُعَاءُ القُنُوتِ فِي صَلَاةِ الوِتْرِ',
        description: 'حنفی مسلک کے مطابق نمازِ وتر کی تیسری رکعت میں تکبیر کہہ کر پڑھی جانے والی دعائے قنوت مع اردو و انگریزی ترجمہ۔',
        items: [
          {
            id: 'nh-qunoot-full',
            title: 'دعائے قنوت (مکمل مع اعراب و ترجمہ)',
            arabicTitle: 'دُعَاءُ القُنُوتِ المَشْهُورُ',
            arabicText: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ • اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، وَنَرْجُو رَحْمَتَكَ وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ.',
            transliteration: 'Allahumma inna nasta\'eenuka wa nastaghfiruka wa nu\'minu bika wa natawakkalu \'alayka wa nuthnee \'alaykal-khayr, wa nashkuruka wa la nakfuruk, wa nakhla\'u wa natruku may-yafjuruk. Allahumma iyyaka na\'budu wa laka nusallee wa nasjudu wa ilayka nas\'a wa nahfid, wa narjoo rahmataka wa nakhsha \'adhabak, inna \'adhabaka bil-kuffari mulhiq.',
            translationUrdu: 'اے اللہ! ہم تجھ ہی سے مدد چاہتے ہیں اور تجھ سے مغفرت مانگتے ہیں اور تجھ پر ایمان لاتے ہیں اور تجھ پر ہی بھروسا کرتے ہیں اور تیری بہت اچھی تعریف کرتے ہیں، اور تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور ہم الگ کرتے ہیں اور چھوڑتے ہیں اس شخص کو جو تیری نافرمانی کرے۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں اور تیرے ہی لیے نماز پڑھتے ہیں اور سجدہ کرتے ہیں اور تیری ہی طرف دوڑتے ہیں اور خدمت کے لیے حاضر ہوتے ہیں، اور تیری رحمت کی امید رکھتے ہیں اور تیرے عذاب سے ڈرتے ہیں، بیشک تیرا عذاب کافروں کو پہنچنے والا ہے۔',
            translationEnglish: 'O Allah, we seek Your help and ask for Your forgiveness, we believe in You and place our trust in You, and we praise You in the best manner; we thank You and are not ungrateful to You, and we cast off and forsake whoever disobeys You. O Allah, You alone do we worship, and to You we pray and prostrate, and towards You we strive and serve; we hope for Your mercy and fear Your punishment, indeed Your punishment will overtake the disbelievers.',
            reference: 'مصنف ابن ابی شیبہ: 6965 • بیہقی: 3/40',
            benefits: 'حنفی مسلک میں عشاء کے وتر واجب ہیں اور وتر کی تیسری رکعت میں قرأت کے بعد ہاتھ اٹھا کر تکبیر کہنا اور دعائے قنوت پڑھنا واجب ہے۔ اگر کسی کو یاد نہ ہو تو وہ "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً" یا "اللَّهُمَّ اغْفِرْ لِي" تین بار پڑھ سکتا ہے۔',
            repeatCount: 1,
            tags: ['qunoot', 'witr', 'hanafi', 'قنوت', 'وتر']
          }
        ]
      },
      {
        id: 'janaza-prayer',
        title: 'نمازِ جنازہ کا طریقہ اور دعائیں',
        arabicTitle: 'صَلَاةُ الجَنَازَةِ وَأَدْعِيَتُهَا',
        description: 'نمازِ جنازہ کی چار تکبیرات، بالغ مرد و عورت اور نابالغ بچوں کی الگ الگ مسنون دعائیں مع ترجمہ۔',
        items: [
          {
            id: 'nh-janaza-adult',
            title: 'بالغ مرد اور عورت کے جنازے کی دعا',
            arabicTitle: 'دُعَاءُ الجَنَازَةِ لِلْبَالِغِينَ',
            arabicText: 'اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا • اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الإِيمَانِ.',
            transliteration: 'Allahummagh-fir li-hayyina wa mayyitina, wa shahidina wa gha\'ibina, wa sagheerina wa kabeerina, wa dhakarina wa unthana. Allahumma man ahyaytahu minna fa-ahyihi \'alal-Islam, wa man tawaffaytahu minna fa-tawaffahu \'alal-Iman.',
            translationUrdu: 'اے اللہ! بخش دے ہمارے زندہ کو اور ہمارے مردہ کو، ہمارے حاضر کو اور ہمارے غائب کو، ہمارے چھوٹے کو اور ہمارے بڑے کو، اور ہمارے مرد کو اور ہماری عورت کو۔ اے اللہ! ہم میں سے جسے تو زندہ رکھے اسے اسلام پر زندہ رکھ، اور جسے ہم میں سے موت دے اسے ایمان پر موت دے۔',
            translationEnglish: 'O Allah, forgive our living and our dead, those present and those absent, our young and our old, our males and our females. O Allah, whomever among us You keep alive, let them live upon Islam, and whomever You cause to die, let them die upon Faith.',
            reference: 'سنن ابی داود: 3201 • سنن الترمذی: 1024',
            benefits: 'نمازِ جنازہ فرضِ کفایہ ہے۔ تیسری تکبیر کے بعد یہ دعا پڑھی جاتی ہے۔ چوتھی تکبیر کے بعد بغیر کسی دعا کے دونوں طرف سلام پھیرا جاتا ہے۔',
            repeatCount: 1,
            tags: ['janaza', 'funeral', 'جنازہ']
          },
          {
            id: 'nh-janaza-boy',
            title: 'نابالغ لڑکے کے جنازے کی دعا (Boy Child)',
            arabicTitle: 'دُعَاءُ الجَنَازَةِ لِلصَّبِيِّ',
            arabicText: 'اللَّهُمَّ اجْعَلْهُ لَنَا فَرَطًا، وَاجْعَلْهُ لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهُ لَنَا شَافِعًا وَمُشَفَّعًا.',
            transliteration: 'Allahummaj-\'alhu lana farataw, waj-\'alhu lana ajraw-wa dhukhra, waj-\'alhu lana shafi\'aw-wa mushaffa\'a.',
            translationUrdu: 'اے اللہ! اس بچے کو ہمارے لیے آگے پہنچ کر سامان کرنے والا بنا، اور اس کو ہمارے لیے اجر اور ذخیرہ بنا، اور اس کو ہمارے حق میں سفارش کرنے والا اور ایسا بنا جس کی سفارش قبول کی جائے۔',
            translationEnglish: 'O Allah, make him for us a forerunner, a source of reward and treasure, and make him for us an intercessor whose intercession is accepted.',
            reference: 'کنز العمال: 42687 • فتاویٰ شامی',
            benefits: 'نابالغ لڑکے کی نمازِ جنازہ میں تیسری تکبیر کے بعد یہ دعا پڑھی جاتی ہے۔',
            repeatCount: 1,
            tags: ['janaza', 'child', 'جنازہ بچہ']
          },
          {
            id: 'nh-janaza-girl',
            title: 'نابالغ لڑکی کے جنازے کی دعا (Girl Child)',
            arabicTitle: 'دُعَاءُ الجَنَازَةِ لِلصَّبِيَّةِ',
            arabicText: 'اللَّهُمَّ اجْعَلْهَا لَنَا فَرَطًا، وَاجْعَلْهَا لَنَا أَجْرًا وَذُخْرًا، وَاجْعَلْهَا لَنَا شَافِعَةً وَمُشَفَّعَةً.',
            transliteration: 'Allahummaj-\'alha lana farataw, waj-\'alha lana ajraw-wa dhukhra, waj-\'alha lana shafi\'ataw-wa mushaffa\'ah.',
            translationUrdu: 'اے اللہ! اس بچی کو ہمارے لیے آگے پہنچ کر سامان کرنے والی بنا، اور اس کو ہمارے لیے اجر اور ذخیرہ بنا، اور اس کو ہمارے حق میں سفارش کرنے والی اور ایسی بنا جس کی سفارش قبول کی جائے۔',
            translationEnglish: 'O Allah, make her for us a forerunner, a source of reward and treasure, and make her for us an intercessor whose intercession is accepted.',
            reference: 'فتاویٰ عالمگیری • رد المحتار',
            benefits: 'نابالغ بچی کے جنازے میں تیسری تکبیر کے بعد مؤنث کے صیغے کے ساتھ یہ دعا پڑھی جاتی ہے۔',
            repeatCount: 1,
            tags: ['janaza', 'girl', 'جنازہ بچی']
          }
        ]
      },
      {
        id: 'special-tasbeehs',
        title: 'تراویح، عیدین اور نماز کے بعد کے اذکار',
        arabicTitle: 'تَسْبِيحُ التَّرَاوِيحِ وَأَذْكَارُ بَعْدَ الصَّلَاةِ',
        description: 'رمضان المبارک میں تراویح کی مشہور تسبیح، سجدہ تلاوت کی دعا، اور نماز کے بعد مسنون اذکار۔',
        items: [
          {
            id: 'nh-taraweeh',
            title: 'تسبیحِ تراویح (Taraweeh Tasbeeh)',
            arabicTitle: 'تَسْبِيحُ صَلَاةِ التَّرَاوِيحِ',
            arabicText: 'سُبْحَانَ ذِي الْمُلْكِ وَالْمَلَكُوتِ، سُبْحَانَ ذِي الْعِزَّةِ وَالْعَظَمَةِ وَالْهَيْبَةِ وَالْقُدْرَةِ وَالْكِبْرِيَاءِ وَالْجَبَرُوتِ، سُبْحَانَ الْمَلِكِ الْحَيِّ الَّذِي لَا يَنَامُ وَلَا يَمُوتُ، سُبُّوحٌ قُدُّوسٌ رَبُّنَا وَرَبُّ الْمَلَائِكَةِ وَالرُّوحِ، لَا إِلَٰهَ إِلَّا اللَّهُ نَسْتَغْفِرُ اللَّهَ، نَسْأَلُكَ الْجَنَّةَ وَنَعُوذُ بِكَ مِنَ النَّارِ.',
            transliteration: 'Subhana dhil-mulki wal-malakoot, Subhana dhil-\'izzati wal-\'azamati wal-haybati wal-qudrati wal-kibriya\'i wal-jabaroot, Subhanal-Malikil-Hayyil-ladhee la yanamu wa la yamoot, Subboohun Quddoosun Rabbuna wa Rabbul-mala\'ikati war-Rooh, La ilaha illallahu nastaghfirullah, nas\'alukal-jannata wa na\'oodhu bika minan-naar.',
            translationUrdu: 'پاک ہے وہ ذات جو زمین و آسمان کی بادشاہی کی مالک ہے، پاک ہے وہ ذات جو عزت، عظمت، ہیبت، قدرت، بڑائی اور غلبے کی مالک ہے، پاک ہے وہ حقیقی بادشاہ جو زندہ ہے، نہ کبھی سوتا ہے اور نہ کبھی مرے گا، وہ بے حد پاک ہے اور نہایت تقدس والا ہے، ہمارا اور تمام فرشتوں اور روح (جبرائیل) کا پروردگار ہے۔ اللہ کے سوا کوئی معبود نہیں، ہم اللہ سے بخشش مانگتے ہیں، ہم تجھ سے جنت کا سوال کرتے ہیں اور جہنم کی آگ سے تیری پناہ چاہتے ہیں۔',
            translationEnglish: 'Glory be to the Owner of the Dominion and Sovereignty, Glory be to the Possessor of Honor, Greatness, Awe, Power, Majesty and Omnipotence, Glory be to the Sovereign Sovereign Who lives forever, never sleeps nor dies, Most Pure and Most Holy, our Lord and Lord of the angels and the Spirit. None has the right to be worshipped except Allah, we ask Allah for forgiveness, we ask You for Paradise and seek Your refuge from the Fire.',
            reference: 'معمولاتِ سلف صالحین • فقہی کتب',
            benefits: 'رمضان المبارک میں نمازِ تراویح کی ہر چار رکعت کے بعد کے وقفے (ترویحہ) میں یہ پاکیزہ تسبیح پڑھی جاتی ہے۔',
            repeatCount: 1,
            tags: ['taraweeh', 'ramadan', 'تراویح']
          },
          {
            id: 'nh-sajda-tilawat',
            title: 'سجدۂ تلاوت کی دعا (Dua of Sajdah Tilawat)',
            arabicTitle: 'دُعَاءُ سَجْدَةِ التِّلَاوَةِ',
            arabicText: 'سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ، وَشَقَّ سَمْعَهُ وَبَصَرَهُ، بِحَوْلِهِ وَقُدَّتِهِ، فَتَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ.',
            transliteration: 'Sajada wajhiya lilladhee khalaqahu, wa shaqqa sam\'ahu wa basarahu, bihawlihi wa quwwatih, fatabarakallahu ahsanul-khaliqeen.',
            translationUrdu: 'میرے چہرے نے سجدہ کیا اس ذات کو جس نے اسے پیدا فرمایا، اور اپنی قدرت و طاقت سے اس میں کان اور آنکھیں بنائیں، پس بڑی برکت والا ہے اللہ جو سب سے بہترین پیدا فرمانے والا ہے۔',
            translationEnglish: 'My face has prostrated to the One Who created it and brought forth its hearing and sight by His might and power. Blessed is Allah, the Best of Creators.',
            reference: 'سنن الترمذی: 580 • سنن ابی داود: 1414',
            benefits: 'قرآن مجید کی آیتِ سجدہ پڑھنے یا سننے کے بعد سجدۂ تلاوت کرنا واجب ہے۔ سجدے میں یہ دعا پڑھی جاتی ہے۔',
            repeatCount: 1,
            tags: ['sajda-tilawat', 'quran', 'سجدہ تلاوت']
          },
          {
            id: 'nh-post-salah-tasbeeh',
            title: 'تسبیحِ فاطمہ اور سلام کے بعد کے اذکار (Post-Prayer Azkar)',
            arabicTitle: 'تَسْبِيحُ فَاطِمَةَ رَضِيَ اللَّهُ عَنْهَا',
            arabicText: 'أَسْتَغْفِرُ اللَّهَ (۳ بار) • اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ • سُبْحَانَ اللَّهِ (۳۳ بار) • الْحَمْدُ لِلَّهِ (۳۳ بار) • اللَّهُ أَكْبَرُ (۳۴ بار)',
            transliteration: 'Astaghfirullah (3 times). Allahumma Antas-Salamu wa minkas-salam, tabarakta ya dhal-Jalali wal-Ikram. SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (34x).',
            translationUrdu: 'میں اللہ سے بخشش طلب کرتا ہوں (تین بار)۔ اے اللہ! تو ہی سراپا سلامتی ہے اور تیری ہی طرف سے سلامتی ہے، تو بڑی برکت والا ہے اے عظمت اور بزرگی والے! پھر ۳۳ بار سبحان اللہ، ۳۳ بار الحمد للہ، اور ۳۴ بار اللہ اکبر پڑھیں۔',
            translationEnglish: 'I seek Allah\'s forgiveness (3x). O Allah, You are Peace and from You comes peace, blessed are You, Possessor of Majesty and Honor. Then: SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (34x).',
            reference: 'صحیح مسلم: 591 • صحیح البخاری: 843',
            benefits: 'رسول اللہ ﷺ نے فرمایا کہ جو شخص ہر نماز کے بعد یہ تسبیحات پڑھے، اس کے گناہ بخش دیے جاتے ہیں اگرچہ سمندر کی جھاگ کے برابر ہوں۔',
            repeatCount: 33,
            tags: ['tasbeeh-fatima', 'post-salah', 'تسبیح فاطمہ']
          }
        ]
      }
    ]
  },

  // ─── BOOK 2: 6 KALIMAS ─────────────────────────────────────────────────────
  {
    id: 'shash-kalimat',
    title: 'شش کلمے مع اعراب، اردو ترجمہ اور فضیلت',
    arabicTitle: 'الكَلِمَاتُ السِّتَّةُ مَعَ التَّرْجَمَةِ وَالفَضَائِلِ',
    author: 'علمائے امت • Islamic Tradition',
    category: 'kalima',
    categoryLabel: 'کلمے • Six Kalimas',
    description: 'اسلام کے بنیادی ۶ کلمے (کلمہ طیبہ، شہادت، تمجید، توحید، استغفار، اور ردِ کفر) مع ایمانِ مجمل و مفصل، مکمل اعراب، انگریزی و اردو ترجمہ اور ان کی فضیلت۔',
    coverGradient: 'linear-gradient(135deg, #451a03 0%, #854d0e 50%, #713f12 100%)',
    accentColor: '#f59e0b',
    totalItems: 8,
    readTime: '10 mins',
    tags: [
      'kalima', 'kalme', 'tayyibah', 'shahadah', 'tamjeed', 'tauheed', 'astaghfar',
      'radde-kufr', 'iman', 'کلمہ', 'کلمے', 'شہادت', 'توحید'
    ],
    chapters: [
      {
        id: 'six-kalimas-all',
        title: 'چھ کلمے مع ترجمہ اور مفہوم',
        arabicTitle: 'الكَلِمَاتُ الإِسْلَامِيَّةُ السِّتَّةُ',
        description: 'ہر مسلمان کے لیے ان کلموں کو یاد کرنا، سمجھنا اور روزانہ ورد رکھنا ازحد ضروری ہے۔',
        items: [
          {
            id: 'k1-tayyibah',
            title: '1. پہلا کلمہ: طیبہ (Kalima Tayyibah - Word of Purity)',
            arabicTitle: 'الكَلِمَةُ الأُولَى: الطَّيِّبَةُ',
            arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ',
            transliteration: 'La ilaha illallahu Muhammadur-Rasoolullah',
            translationUrdu: 'اللہ کے سوا کوئی معبود نہیں، حضرت محمد ﷺ اللہ کے رسول ہیں۔',
            translationEnglish: 'There is none worthy of worship except Allah, and Muhammad (ﷺ) is the Messenger of Allah.',
            reference: 'صحیح البخاری: 8 • سورۃ محمد: 19',
            benefits: 'یہ کلمہ اسلام کی بنیاد اور جنت کی چابی ہے۔ رسول اللہ ﷺ نے فرمایا: جس کا آخری کلام لَا إِلٰهَ إِلَّا اللّٰهُ ہوگا وہ جنت میں داخل ہوگا۔',
            repeatCount: 100,
            tags: ['kalima-1', 'tayyibah', 'پہلا کلمہ']
          },
          {
            id: 'k2-shahadah',
            title: '2. دوسرا کلمہ: شہادت (Kalima Shahadah - Word of Testimony)',
            arabicTitle: 'الكَلِمَةُ الثَّانِيَةُ: الشَّهَادَةُ',
            arabicText: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
            transliteration: 'Ash-hadu alla ilaha illallahu wahdahu la shareeka lah, wa ash-hadu anna Muhammadan \'abduhu wa rasooluh.',
            translationUrdu: 'میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اور میں گواہی دیتا ہوں کہ حضرت محمد ﷺ اس کے بندے اور اس کے رسول ہیں۔',
            translationEnglish: 'I bear witness that there is none worthy of worship except Allah, alone without partner, and I bear witness that Muhammad is His servant and His messenger.',
            reference: 'صحیح مسلم: 234',
            benefits: 'وضو کے بعد یہ کلمہ پڑھنے والے کے لیے جنت کے آٹھوں دروازے کھول دیے جاتے ہیں، جس سے چاہے داخل ہو جائے۔',
            repeatCount: 1,
            tags: ['kalima-2', 'shahadah', 'دوسرا کلمہ']
          },
          {
            id: 'k3-tamjeed',
            title: '3. تیسرا کلمہ: تمجید (Kalima Tamjeed - Word of Glorification)',
            arabicTitle: 'الكَلِمَةُ الثَّالِثَةُ: التَّمْجِيدُ',
            arabicText: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.',
            transliteration: 'Subhanallahi, wal-hamdu lillahi, wa la ilaha illallahu, wallahu akbar, wa la hawla wa la quwwata illa billahil-\'Aliyyil-\'Azeem.',
            translationUrdu: 'اللہ پاک ہے، اور سب تعریفیں اللہ کے لیے ہیں، اور اللہ کے سوا کوئی معبود نہیں، اور اللہ سب سے بڑا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کرنے کی قوت نہیں مگر اللہ کی توفیق سے جو بہت بلند اور بڑی عظمت والا ہے۔',
            translationEnglish: 'Glory be to Allah, and all praise is for Allah, and there is none worthy of worship except Allah, and Allah is the Greatest; and there is no power and no strength except with Allah, the Most High, the Most Supreme.',
            reference: 'صحیح مسلم: 2072 • سنن الترمذی: 3462',
            benefits: 'یہ کلمات باقی رہنے والی نیکیاں ہیں جنہیں جنت کے پودے کہا گیا ہے۔ ان کے پڑھنے سے گناہ ایسے جھڑتے ہیں جیسے درخت سے سوکھے پتے۔',
            repeatCount: 33,
            tags: ['kalima-3', 'tamjeed', 'تیسرا کلمہ']
          },
          {
            id: 'k4-tauheed',
            title: '4. چوتھا کلمہ: توحید (Kalima Tauheed - Word of Oneness)',
            arabicTitle: 'الكَلِمَةُ الرَّابِعَةُ: التَّوْحِيدُ',
            arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ أَبَدًا أَبَدًا، ذُو الْجَلَالِ وَالإِكْرَامِ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.',
            transliteration: 'La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu, yuhyee wa yumeet, wa Huwa hayyul-la yamootu abadan abada, Dhul-Jalali wal-Ikram, biyadihil-khayr, wa Huwa \'ala kulli shay\'in Qadeer.',
            translationUrdu: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تمام تعریفیں ہیں، وہی جِلاتا ہے اور وہی مارتا ہے، اور وہ ہمیشہ زندہ ہے جسے کبھی موت نہیں آئے گی، وہ عظمت اور بزرگی والا ہے، اسی کے دستِ قدرت میں تمام بھلائی ہے، اور وہ ہر چیز پر کامل قدرت رکھنے والا ہے۔',
            translationEnglish: 'There is none worthy of worship except Allah, alone without partner. His is the sovereignty and His is all praise. He gives life and causes death, and He is Ever-Living who never dies, Possessor of Majesty and Honor. In His hand is all good, and He is over all things Omnipotent.',
            reference: 'صحیح البخاری: 3293 • سنن الترمذی: 3428',
            benefits: 'رسول اللہ ﷺ نے فرمایا: جو شخص دن میں ۱۰۰ مرتبہ یہ کلمہ پڑھے، اسے دس غلام آزاد کرنے کا ثواب ملتا ہے، سو نیکیاں لکھی جاتی ہیں اور سو برائیاں مٹا دی جاتی ہیں۔',
            repeatCount: 10,
            tags: ['kalima-4', 'tauheed', 'چوتھا کلمہ']
          },
          {
            id: 'k5-astaghfar',
            title: '5. پانچواں کلمہ: استغفار (Kalima Astaghfar - Word of Penitence)',
            arabicTitle: 'الكَلِمَةُ الخَامِسَةُ: الاسْتِغْفَارُ',
            arabicText: 'أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمْدًا أَوْ خَطَأً، سِرًّا أَوْ عَلَانِيَةً، وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.',
            transliteration: 'Astaghfirullaha Rabbee min kulli dhambin adhnabtuhu \'amdan aw khata\'an, sirran aw \'alaniyataw-wa atoobu ilayhi minadh-dhambil-ladhee a\'lamu wa minadh-dhambil-ladhee la a\'lam, innaka Anta \'Allamul-ghuyoobi wa Sattarul-\'uyoobi wa Ghaffarudh-dhunoob, wa la hawla wa la quwwata illa billahil-\'Aliyyil-\'Azeem.',
            translationUrdu: 'میں اللہ سے معافی مانگتا ہوں جو میرا پروردگار ہے، ہر اس گناہ سے جو میں نے جان بوجھ کر کیا یا بھول کر، چھپ کر کیا یا کھلم کھلا، اور میں اس کے حضور توبہ کرتا ہوں اس گناہ سے جسے میں جانتا ہوں اور اس گناہ سے بھی جسے میں نہیں جانتا، بیشک تو غیبوں کا خوب جاننے والا اور عیبوں کو چھپانے والا اور گناہوں کو بخشنے والا ہے، اور گناہوں سے بچنے کی طاقت اور نیکی کی قوت نہیں مگر اللہ ہی کی توفیق سے جو بہت بلند اور بڑی عظمت والا ہے۔',
            translationEnglish: 'I seek forgiveness from Allah, my Lord, from every sin I committed deliberately or by error, secretly or openly, and I turn to Him in repentance from the sin that I know and from the sin that I do not know. Indeed, You are the Knower of all the unseen, the Concealer of flaws, and the Forgiver of sins, and there is no power nor might except with Allah, the Most High, the Most Great.',
            reference: 'جامع الاحادیث • مسند احمد: 4/403',
            benefits: 'استغفار دل کے زنگ کو دور کرتا ہے، رزق میں کشادگی اور غموں سے نجات کا سب سے مؤثر ذریعہ ہے۔',
            repeatCount: 100,
            tags: ['kalima-5', 'astaghfar', 'پانچواں کلمہ']
          },
          {
            id: 'k6-radde-kufr',
            title: '6. چھٹا کلمہ: ردِ کفر (Kalima Radd-e-Kufr - Word of Refutation)',
            arabicTitle: 'الكَلِمَةُ السَّادِسَةُ: رَدُّ الكُفْرِ',
            arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ، تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا، وَأَسْلَمْتُ وَأَقُولُ: لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ.',
            transliteration: 'Allahumma innee a\'oodhu bika min an ushrika bika shay\'aw-wa ana a\'lamu bih, wa astaghfiruka lima la a\'lamu bih, tubtu \'anhu wa tabarra\'tu minal-kufri wash-shirki wal-kidhbi wal-gheebati wal-bid\'ati wan-nameemati wal-fawahishi wal-buhtani wal-ma\'asi kulliha, wa aslamtu wa aqoolu: La ilaha illallahu Muhammadur-Rasoolullah.',
            translationUrdu: 'اے اللہ! میں تیری پناہ مانگتا ہوں اس بات سے کہ میں تیرے ساتھ کسی چیز کو شریک ٹھہراؤں حالانکہ میں اسے جانتا ہوں، اور میں تجھ سے معافی چاہتا ہوں اس گناہ کی جسے میں نہیں جانتا۔ میں نے اس سے توبہ کی اور میں بیزار ہوا کفر سے، شرک سے، جھوٹ سے، غیبت سے، بدعت سے، چغلی سے، بے حیائی کے کاموں سے، تہمت لگانے سے اور تمام گناہوں سے، اور میں اسلام لایا اور کہتا ہوں: اللہ کے سوا کوئی معبود نہیں، حضرت محمد ﷺ اللہ کے رسول ہیں۔',
            translationEnglish: 'O Allah, I seek Your refuge from associating anything with You while I know it, and I seek Your forgiveness for that which I do not know. I repent from it and renounce disbelief, polytheism, falsehood, backbiting, innovation, tale-bearing, lewdness, slanders, and all sins whatsoever. I have submitted to Islam and I declare: There is none worthy of worship except Allah, and Muhammad is the Messenger of Allah.',
            reference: 'مسند احمد: 4/403 • الادب المفرد للبخاری: 716',
            benefits: 'یہ کلمہ شرک، کفر، اور دل کی تمام برائیوں سے حفاظت اور تجدیدِ ایمان کا عظیم حصار ہے۔',
            repeatCount: 1,
            tags: ['kalima-6', 'radde-kufr', 'چھٹا کلمہ']
          },
          {
            id: 'k-iman-mujmal',
            title: '7. ایمانِ مجمل (Iman-e-Mujmal - Faith in Brief)',
            arabicTitle: 'الإِيمَانُ المُجْمَلُ',
            arabicText: 'آمَنْتُ بِاللَّهِ كَمَا هُوَ بِأَسْمَائِهِ وَصِفَاتِهِ، وَقَبِلْتُ جَمِيعَ أَحْكَامِهِ.',
            transliteration: 'Aamantu billahi kama Huwa bi-asmaa\'ihi wa sifatihi, wa qabiltu jamee\'a ahkaamih.',
            translationUrdu: 'میں ایمان لایا اللہ پر جیسا کہ وہ اپنے ناموں اور اپنی صفتوں کے ساتھ ہے، اور میں نے اس کے تمام احکام کو دل سے قبول کیا۔',
            translationEnglish: 'I believe in Allah as He is with His names and attributes, and I have accepted all of His commandments.',
            reference: 'کتبِ عقائدِ اہل سنت',
            benefits: 'ایمانِ مجمل میں اللہ کی تمام صفات اور احکامات کا اجمالی اور پختہ اقرار موجود ہے۔',
            repeatCount: 1,
            tags: ['iman', 'mujmal', 'ایمان مجمل']
          },
          {
            id: 'k-iman-mufassal',
            title: '8. ایمانِ مفصل (Iman-e-Mufassal - Faith in Detail)',
            arabicTitle: 'الإِيمَانُ المُفَصَّلُ',
            arabicText: 'آمَنْتُ بِاللَّهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الآخِرِ، وَالْقَدَرِ خَيْرِهِ وَشَرِّهِ مِنَ اللَّهِ تَعَالَىٰ، وَالْبَعْثِ بَعْدَ الْمَوْتِ.',
            transliteration: 'Aamantu billahi, wa malaa\'ikatihi, wa kutubihi, wa rusulihi, wal-yawmil-aakhiri, wal-qadari khayrihi wa sharrihi minallahi Ta\'ala, wal-ba\'thi ba\'dal-mawt.',
            translationUrdu: 'میں ایمان لایا اللہ پر، اور اس کے فرشتوں پر، اور اس کی کتابوں پر، اور اس کے رسولوں پر، اور قیامت کے دن پر، اور تقدیر پر کہ اس کی اچھائی اور برائی اللہ تعالیٰ کی طرف سے ہے، اور موت کے بعد دوبارہ زندہ کیے جانے پر۔',
            translationEnglish: 'I believe in Allah, His angels, His books, His messengers, the Last Day, and in destiny—both its good and bad being from Allah the Exalted—and in the resurrection after death.',
            reference: 'صحیح مسلم: 8 (حدیثِ جبرائیل) • عقیدہ طحاویہ',
            benefits: 'یہ ارکانِ ایمان کی تفصیلی بنیاد ہے جس پر ہر مسلمان کا کامل یقین ہونا لازمی ہے۔',
            repeatCount: 1,
            tags: ['iman', 'mufassal', 'ایمان مفصل']
          }
        ]
      }
    ]
  },

  // ─── BOOK 3: HISN AL-MUSLIM (DAILY MASNOON DUAS) ───────────────────────────
  {
    id: 'hisn-al-muslim',
    title: 'حصن المسلم: مسنون و روزمرہ دعاؤں کی کتاب',
    arabicTitle: 'حِصْنُ المُسْلِمِ مِنْ أَذْكَارِ الكِتَابِ وَالسُّنَّةِ',
    author: 'شیخ سعید بن علی بن وہف القحطانی رحمہ اللہ',
    category: 'duas',
    categoryLabel: 'مسنون دعائیں • Daily Duas',
    description: 'صبح و شام کے اذکار، سوتے اور جاگتے وقت، بیت الخلاء، مسجد، کھانا کھانے، سفر، پریشانی اور ہر موقع کی مسنون دعائیں مع عربی اعراب، تلفظ، اور اردو و انگریزی ترجمہ۔',
    coverGradient: 'linear-gradient(135deg, #022c22 0%, #0f766e 50%, #115e59 100%)',
    accentColor: '#14b8a6',
    totalItems: 18,
    readTime: '25 mins',
    tags: [
      'duas', 'hisn', 'hisnul-muslim', 'masnoon', 'daily-duas', 'morning', 'evening',
      'eating', 'travel', 'sleep', 'restroom', 'masjid', 'حصن المسلم', 'دعائیں', 'مسنون'
    ],
    chapters: [
      {
        id: 'morning-evening',
        title: 'صبح و شام کے حفاظتی اذکار',
        arabicTitle: 'أَذْكَارُ الصَّبَاحِ وَالمَسَاءِ',
        description: 'ہر صبح اور شام کے وقت پڑھے جانے والے مسنون اور باعثِ برکت اذکار۔',
        items: [
          {
            id: 'hm-sayyid-istighfar',
            title: 'سید الاستغفار (The Master Supplication for Forgiveness)',
            arabicTitle: 'سَيِّدُ الاسْتِغْفَارِ',
            arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.',
            transliteration: 'Allahumma Anta Rabbee la ilaha illa Ant, khalaqtanee wa ana \'abduk, wa ana \'ala \'ahdika wa wa\'dika mastata\'t, a\'oodhu bika min sharri ma sana\'t, aboo\'u laka bini\'matika \'alayya, wa aboo\'u bidhambee, faghfir lee, fa-innahu la yaghfirudh-dhunooba illa Ant.',
            translationUrdu: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں، میں نے جو برائیاں کیں ان کے شر سے تیری پناہ مانگتا ہوں، میں اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اقرار کرتا ہوں، پس مجھے بخش دے، بیشک تیرے سوا کوئی گناہوں کو نہیں بخش سکتا۔',
            translationEnglish: 'O Allah, You are my Lord, there is none worthy of worship except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I confess my sins, so forgive me; indeed, no one forgives sins except You.',
            reference: 'صحیح البخاری: 6306',
            benefits: 'رسول اللہ ﷺ نے فرمایا: جس نے یقین کے ساتھ شام کے وقت یہ دعا پڑھی اور رات میں فوت ہو گیا وہ جنتی ہے، اور جس نے صبح کے وقت پڑھی اور شام سے پہلے فوت ہو گیا وہ جنتی ہے۔',
            repeatCount: 1,
            tags: ['istighfar', 'morning', 'evening', 'سید الاستغفار']
          },
          {
            id: 'hm-morning-dua',
            title: 'صبح کے وقت کی مسنون دعا',
            arabicTitle: 'دُعَاءُ الصَّبَاحِ',
            arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.',
            transliteration: 'Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in Qadeer.',
            translationUrdu: 'ہم نے صبح کی اور تمام بادشاہی نے اللہ کے لیے صبح کی، اور سب تعریف اللہ ہی کے لیے ہے، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے اور وہ ہر چیز پر قدرت رکھنے والا ہے۔',
            translationEnglish: 'We have entered the morning and the entire kingdom belongs to Allah, and all praise is for Allah. None is worthy of worship except Allah alone, without partner; to Him belongs all sovereignty and all praise, and He has power over everything.',
            reference: 'صحیح مسلم: 2723',
            benefits: 'صبح کا آغاز رب کی توحید اور شکر کے ساتھ کرنے کا بہترین طریقہ۔',
            repeatCount: 1,
            tags: ['morning', 'اذکار صبح']
          },
          {
            id: 'hm-evening-dua',
            title: 'شام کے وقت کی مسنون دعا',
            arabicTitle: 'دُعَاءُ المَسَاءِ',
            arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.',
            transliteration: 'Amsayna wa amsal-mulku lillah, wal-hamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa \'ala kulli shay\'in Qadeer.',
            translationUrdu: 'ہم نے شام کی اور تمام بادشاہی نے اللہ کے لیے شام کی، اور سب تعریف اللہ ہی کے لیے ہے، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف ہے اور وہ ہر چیز پر قدرت رکھنے والا ہے۔',
            translationEnglish: 'We have reached the evening and all dominion belongs to Allah, and all praise is for Allah. None has the right to be worshipped except Allah alone without partner, to Him belongs the kingdom and praise, and He is over all things able.',
            reference: 'صحیح مسلم: 2723',
            benefits: 'غروبِ آفتاب کے بعد شام کا مسنون وظیفہ۔',
            repeatCount: 1,
            tags: ['evening', 'اذکار شام']
          }
        ]
      },
      {
        id: 'daily-activities',
        title: 'روزمرہ کاموں اور معمولات کی دعائیں',
        arabicTitle: 'أَدْعِيَةُ الأَفْعَالِ اليَوْمِيَّةِ',
        description: 'سونے، جاگنے، کھانے، سفر اور بیت الخلاء کی اہم مسنون دعائیں مع ترجمہ۔',
        items: [
          {
            id: 'hm-sleeping',
            title: 'سوتے وقت کی دعا (Before Sleeping)',
            arabicTitle: 'دُعَاءُ النَّوْمِ',
            arabicText: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
            transliteration: 'Bismika Allahumma amootu wa ahya',
            translationUrdu: 'اے اللہ! میں تیرے ہی نام کے ساتھ مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
            translationEnglish: 'In Your Name, O Allah, I die and I live.',
            reference: 'صحیح البخاری: 6324 • صحیح مسلم: 2711',
            benefits: 'سونے سے پہلے دائیں کروٹ لیٹ کر یہ دعا پڑھنا سنت ہے۔',
            repeatCount: 1,
            tags: ['sleeping', 'bedtime', 'سونے کی دعا']
          },
          {
            id: 'hm-waking-up',
            title: 'نیند سے بیدار ہونے کی دعا (Waking Up)',
            arabicTitle: 'دُعَاءُ الاسْتَيْقَاظِ مِنَ النَّوْمِ',
            arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
            transliteration: 'Al-hamdu lillahil-ladhee ahyana ba\'da ma amatana wa ilayhin-nushoor',
            translationUrdu: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف اٹھ کر جانا ہے۔',
            translationEnglish: 'All praise is due to Allah Who gave us life after having caused us to die, and unto Him is the resurrection.',
            reference: 'صحیح البخاری: 6312 • صحیح مسلم: 2711',
            benefits: 'صبح آنکھ کھلتے ہی سب سے پہلے اللہ کا شکر ادا کرنا۔',
            repeatCount: 1,
            tags: ['waking-up', 'morning', 'جاگنے کی دعا']
          },
          {
            id: 'hm-eating-before',
            title: 'کھانا شروع کرنے کی دعا (Before Eating)',
            arabicTitle: 'دُعَاءُ ابْتِدَاءِ الطَّعَامِ',
            arabicText: 'بِسْمِ اللَّهِ وَعَلَىٰ بَرَكَةِ اللَّهِ',
            transliteration: 'Bismillahi wa \'ala barakatillah',
            translationUrdu: 'اللہ کے نام سے اور اللہ کی برکت پر شروع کرتا ہوں۔ (اور اگر شروع میں بھول جائے تو کہے: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ)',
            translationEnglish: 'In the name of Allah and upon the blessings of Allah. (If forgotten at start, say: Bismillahi awwalahu wa aakhirahu).',
            reference: 'سنن ابی داود: 3767 • المستدرک للحاکم: 7084',
            benefits: 'کھانے میں برکت پیدا ہوتی ہے اور شیطان شامل نہیں ہوتا۔',
            repeatCount: 1,
            tags: ['eating', 'food', 'کھانے کی دعا']
          },
          {
            id: 'hm-eating-after',
            title: 'کھانے کے بعد کی دعا (After Finishing Eating)',
            arabicTitle: 'دُعَاءُ الفَرَاغِ مِنَ الطَّعَامِ',
            arabicText: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
            transliteration: 'Al-hamdu lillahil-ladhee at\'amana wa saqana wa ja\'alana muslimeen',
            translationUrdu: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمان بنایا۔',
            translationEnglish: 'All praise belongs to Allah Who fed us, gave us drink, and made us Muslims.',
            reference: 'سنن الترمذی: 3457 • سنن ابی داود: 3850',
            benefits: 'رزق دینے والے پروردگار کا شکر ادا کرنا نعمتوں کے اضافے کا سبب بنتا ہے۔',
            repeatCount: 1,
            tags: ['eating', 'after-food', 'کھانے کے بعد']
          },
          {
            id: 'hm-toilet-entry',
            title: 'بیت الخلاء (واش روم) جانے کی دعا (Entering Bathroom)',
            arabicTitle: 'دُعَاءُ دُخُولِ الخَلَاءِ',
            arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
            transliteration: 'Allahumma innee a\'oodhu bika minal-khubuthi wal-khaba\'ith',
            translationUrdu: 'اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں اور ناپاک جنیوں سے۔ (بایاں پاؤں اندر رکھیں)۔',
            translationEnglish: 'O Allah, I seek refuge in You from the male and female impure devils. (Enter with left foot).',
            reference: 'صحیح البخاری: 142 • صحیح مسلم: 375',
            benefits: 'شیطانی اثرات اور خبیث جنات کی شرارت سے حفاظت رہتی ہے۔',
            repeatCount: 1,
            tags: ['restroom', 'toilet', 'بیت الخلاء']
          },
          {
            id: 'hm-toilet-exit',
            title: 'بیت الخلاء سے نکلنے کی دعا (Leaving Bathroom)',
            arabicTitle: 'دُعَاءُ الخُرُوجِ مِنَ الخَلَاءِ',
            arabicText: 'غُفْرَانَكَ • الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَىٰ وَعَافَانِي',
            transliteration: 'Ghufranaka. Al-hamdu lillahil-ladhee adh-haba \'annil-adha wa \'aafanee.',
            translationUrdu: 'اے اللہ! میں تیری بخشش چاہتا ہوں۔ • تمام تعریفیں اللہ کے لیے ہیں جس نے مجھ سے تکلیف دہ چیز کو دور کیا اور مجھے عافیت بخشی۔ (دایاں پاؤں باہر نکالیں)۔',
            translationEnglish: 'I seek Your forgiveness. All praise is for Allah Who removed harm from me and granted me relief/well-being. (Exit with right foot).',
            reference: 'سنن الترمذی: 7 • سنن ابن ماجہ: 300',
            benefits: 'تکلیف دہ مادوں سے نجات پر اللہ کا شکر اور کوتاہیوں پر استغفار۔',
            repeatCount: 1,
            tags: ['restroom', 'exit', 'نکلنے کی دعا']
          },
          {
            id: 'hm-masjid-entry',
            title: 'مسجد میں داخل ہونے کی دعا (Entering Masjid)',
            arabicTitle: 'دُعَاءُ دُخُولِ المَسْجِدِ',
            arabicText: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
            transliteration: 'Allahummaftah lee abwaba rahmatik',
            translationUrdu: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔ (دایاں پاؤں اندر رکھیں اور درود شریف بھی پڑھیں)۔',
            translationEnglish: 'O Allah, open for me the gates of Your mercy. (Enter with right foot).',
            reference: 'صحیح مسلم: 713',
            benefits: 'مسجد اللہ کا گھر ہے، جہاں رحمت کے دروازے کھلتے ہیں۔',
            repeatCount: 1,
            tags: ['masjid', 'mosque', 'مسجد داخلہ']
          },
          {
            id: 'hm-masjid-exit',
            title: 'مسجد سے نکلنے کی دعا (Leaving Masjid)',
            arabicTitle: 'دُعَاءُ الخُرُوجِ مِنَ المَسْجِدِ',
            arabicText: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
            transliteration: 'Allahumma innee as\'aluka min fadlik',
            translationUrdu: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔ (بایاں پاؤں باہر نکالیں)۔',
            translationEnglish: 'O Allah, I ask You of Your bounty. (Step out with left foot).',
            reference: 'صحیح مسلم: 713',
            benefits: 'دنیاوی امور اور حلال رزق میں برکت کے لیے اللہ کا فضل مانگنا۔',
            repeatCount: 1,
            tags: ['masjid', 'exit', 'مسجد سے نکلنا']
          },
          {
            id: 'hm-leaving-home',
            title: 'گھر سے نکلتے وقت کی دعا (Leaving Home)',
            arabicTitle: 'دُعَاءُ الخُرُوجِ مِنَ المَنْزِلِ',
            arabicText: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
            transliteration: 'Bismillahi, tawakkaltu \'alallahi, wa la hawla wa la quwwata illa billah',
            translationUrdu: 'اللہ کے نام سے نکلا، میں نے اللہ ہی پر بھروسا کیا، اور گناہوں سے بچنے اور نیکی کرنے کی طاقت نہیں مگر اللہ ہی کی مدد سے۔',
            translationEnglish: 'In the name of Allah, I trust in Allah, and there is no power nor might except with Allah.',
            reference: 'سنن ابی داود: 5095 • سنن الترمذی: 3426',
            benefits: 'فرشتے کہتے ہیں: تجھے کفایت کی گئی، تجھے بچا لیا گیا اور سیدھی راہ دکھا دی گئی، اور شیطان اس سے دور ہو جاتا ہے۔',
            repeatCount: 1,
            tags: ['home', 'leaving', 'گھر سے نکلنا']
          },
          {
            id: 'hm-entering-home',
            title: 'گھر میں داخل ہوتے وقت کی دعا (Entering Home)',
            arabicTitle: 'دُعَاءُ دُخُولِ المَنْزِلِ',
            arabicText: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
            transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa \'ala Rabbina tawakkalna',
            translationUrdu: 'ہم اللہ کے نام سے داخل ہوئے اور اللہ کے نام سے نکلے، اور اپنے پروردگار پر ہی ہم نے بھروسا کیا۔ (پھر اہل خانہ کو سلام کریں)۔',
            translationEnglish: 'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we rely. (Then greet your household with Salam).',
            reference: 'سنن ابی داود: 5096',
            benefits: 'گھر میں سلام اور دعا کے ساتھ داخل ہونے سے شیطان باہر ہی رہ جاتا ہے اور گھر میں برکت ہوتی ہے۔',
            repeatCount: 1,
            tags: ['home', 'entering', 'گھر میں داخلہ']
          },
          {
            id: 'hm-travel-vehicle',
            title: 'سفر اور سواری کی دعا (Vehicle & Travel Dua)',
            arabicTitle: 'دُعَاءُ الرُّكُوبِ وَالسَّفَرِ',
            arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
            transliteration: 'Subhanal-ladhee sakh-khara lana hadha wa ma kunna lahu muqrineen, wa inna ila Rabbina lamunqaliboon.',
            translationUrdu: 'پاک ہے وہ ذات جس نے اس (سواری/گاڑی) کو ہمارے تابع کر دیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور یقیناً ہم اپنے پروردگار ہی کی طرف لوٹ کر جانے والے ہیں۔',
            translationEnglish: 'Glory be to the One Who has subjected this to us, and we could not have otherwise subdued it. And indeed, to our Lord we shall return.',
            reference: 'سورۃ الزخرف: 13-14 • سنن الترمذی: 3446',
            benefits: 'حادثات، خطرات اور راستے کی آفات سے مکمل الٰہی حفاظت۔',
            repeatCount: 1,
            tags: ['travel', 'vehicle', 'سفر کی دعا']
          },
          {
            id: 'hm-anxiety-debt',
            title: 'غم، پریشانی اور قرض سے نجات کی دعا (Relief from Anxiety & Debt)',
            arabicTitle: 'دُعَاءُ تَفْرِيجِ الهَمِّ وَقَضَاءِ الدَّيْنِ',
            arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.',
            transliteration: 'Allahumma innee a\'oodhu bika minal-hammi wal-hazan, wa a\'oodhu bika minal-\'ajzi wal-kasal, wa a\'oodhu bika minal-jubni wal-bukhl, wa a\'oodhu bika min ghalabatid-dayni wa qahrir-rijal.',
            translationUrdu: 'اے اللہ! میں تیری پناہ مانگتا ہوں فکر و پریشانی اور غم سے، اور تیری پناہ مانگتا ہوں عاجزی اور سستی سے، اور تیری پناہ مانگتا ہوں بزدلی اور کنجوسی سے، اور تیری پناہ مانگتا ہوں قرض کے چڑھ جانے اور لوگوں کے دباؤ و غلبے سے۔',
            translationEnglish: 'O Allah, I seek refuge in You from grief and sadness, and I seek refuge in You from incapacity and laziness, and I seek refuge in You from cowardice and stinginess, and I seek refuge in You from being heavily in debt and the oppression of men.',
            reference: 'صحیح البخاری: 2893 • سنن ابی داود: 1555',
            benefits: 'غم دور ہونے، دل کو سکون ملنے اور قرض کی ادائیگی کے غیبی راستے کھلنے کا تیر بہدف نسخہ۔',
            repeatCount: 3,
            tags: ['anxiety', 'debt', 'grief', 'پریشانی', 'قرض']
          },
          {
            id: 'hm-mirror',
            title: 'آئینہ دیکھنے کی دعا (Looking into the Mirror)',
            arabicTitle: 'دُعَاءُ النَّظَرِ فِي المِرْآةِ',
            arabicText: 'اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
            transliteration: 'Allahumma Anta hassanta khalqee fahassin khuluqee',
            translationUrdu: 'اے اللہ! جس طرح تو نے میری صورت اچھی بنائی ہے اسی طرح میرے اخلاق و کردار کو بھی اچھا بنا دے۔',
            translationEnglish: 'O Allah, just as You made my external appearance good, make my character and manners good.',
            reference: 'مسند احمد: 1/403 • صحیح ابن حبان: 959',
            benefits: 'حسنِ اخلاق، تواضع اور عاجزی کی دعا۔',
            repeatCount: 1,
            tags: ['mirror', 'beauty', 'آئینہ']
          },
          {
            id: 'hm-sneezing',
            title: 'چھینک آنے اور اس کا جواب دینے کی دعائیں (Sneezing)',
            arabicTitle: 'أَدْعِيَةُ العُطَاسِ وَتَشْمِيتِهِ',
            arabicText: 'چھینکنے والا کہے: الْحَمْدُ لِلَّهِ • سننے والا کہے: يَرْحَمُكَ اللَّهُ • پھر چھینکنے والا جواب دے: يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ',
            transliteration: 'Sneezer: Al-hamdu lillah. Hearer: Yarhamukallah. Sneezer replies: Yahdeekumullahu wa yuslihu balakum.',
            translationUrdu: 'چھینکنے والا کہے: تمام تعریف اللہ ہی کے لیے ہے۔ • سننے والا کہے: اللہ تجھ پر رحم فرمائے۔ • پھر چھینکنے والا جواب میں کہے: اللہ تمہیں ہدایت دے اور تمہارا حال سنوارے۔',
            translationEnglish: 'Sneezer says: Praise be to Allah. Hearer says: May Allah have mercy on you. Sneezer replies: May Allah guide you and rectify your condition.',
            reference: 'صحیح البخاری: 6224',
            benefits: 'مسلمانوں کے باہمی حقوق اور محبت میں اضافے کا ذریعہ۔',
            repeatCount: 1,
            tags: ['sneezing', 'چھینک']
          },
          {
            id: 'hm-anger',
            title: 'غصہ ٹھنڈا کرنے کی دعا (When Angry)',
            arabicTitle: 'دُعَاءُ الغَضَبِ',
            arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
            transliteration: 'A\'udhu billahi minash-shaytanir-rajeem',
            translationUrdu: 'میں پناہ مانگتا ہوں اللہ کی شیطان مردود کے شر سے۔',
            translationEnglish: 'I seek refuge in Allah from Satan the outcast.',
            reference: 'صحیح البخاری: 6115 • صحیح مسلم: 2610',
            benefits: 'غصہ شیطان کی طرف سے ہوتا ہے، یہ پڑھنے سے غصے کی آگ ٹھنڈی ہو جاتی ہے۔',
            repeatCount: 1,
            tags: ['anger', 'غصہ']
          }
        ]
      }
    ]
  },

  // ─── BOOK 4: 40 RABBANA DUAS ───────────────────────────────────────────────
  {
    id: 'rabbana-duas',
    title: 'قرآنی ۴۰ ربنا دعائیں مع اردو و انگریزی ترجمہ',
    arabicTitle: 'الأَرْبَعُونَ رَبَّنَا مِنَ القُرْآنِ الكَرِيمِ',
    author: 'القرآن الکریم • The Holy Quran',
    category: 'quranic',
    categoryLabel: 'قرآنی دعائیں • 40 Rabbana',
    description: 'قرآنِ مجید کی وہ ۴۰ مبارک اور قبولیت والی دعائیں جو لفظ "ربنا" (اے ہمارے رب) سے شروع ہوتی ہیں، مع سورت اور آیت کا حوالہ، عربی متن، اور مفہوم۔',
    coverGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
    accentColor: '#818cf8',
    totalItems: 14,
    readTime: '15 mins',
    tags: [
      'rabbana', 'quranic-duas', '40-rabbana', 'supplication', 'holy-quran', 'ربنا',
      'قرآنی دعائیں', 'دعا'
    ],
    chapters: [
      {
        id: 'rabbana-collection',
        title: 'جامع قرآنی ربنا دعائیں مع حوالہ جات',
        arabicTitle: 'أَدْعِيَةُ رَبَّنَا المُبَارَكَةُ',
        description: 'انبیاءِ کرام اور صالحین کی وہ پکار جسے اللہ تعالیٰ نے قرآن میں ہمیشہ کے لیے محفوظ فرما دیا۔',
        items: [
          {
            id: 'rab-1',
            title: '1. قبولیتِ اعمال کی دعا (Acceptance of Deeds)',
            arabicTitle: 'رَبَّنَا تَقَبَّلْ مِنَّا',
            arabicText: 'رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
            transliteration: 'Rabbana taqabbal minna innaka Antas-Samee\'ul-\'Aleem',
            translationUrdu: 'اے ہمارے پروردگار! ہماری یہ خدمت قبول فرما، بیشک تو ہی سب کچھ سننے والا، خوب جاننے والا ہے۔',
            translationEnglish: 'Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.',
            reference: 'سورۃ البقرۃ: 127 (حضرت ابراہیم و اسماعیل علیہما السلام کی دعا)',
            benefits: 'کوئی بھی نیک کام، نماز، صدقہ یا تلاوت کرنے کے بعد اس دعا کو پڑھنا چاہیے تاکہ عمل بارگاہِ الٰہی میں شرفِ قبولیت پائے۔',
            repeatCount: 3,
            tags: ['acceptance', 'rabbana', 'قبولیت']
          },
          {
            id: 'rab-2',
            title: '2. دنیا اور آخرت کی بھلائی کی جامع دعا (Good in this World & Hereafter)',
            arabicTitle: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً',
            arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            transliteration: 'Rabbana aatina fid-dunya hasanataw-wa fil-aakhirati hasanataw-wa qina \'adhaban-naar',
            translationUrdu: 'اے ہمارے پروردگار! ہمیں دنیا میں بھی بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں دوزخ کے عذاب سے بچا۔',
            translationEnglish: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
            reference: 'سورۃ البقرۃ: 201',
            benefits: 'نبی کریم ﷺ سب سے زیادہ یہی دعا مانگا کرتے تھے کیونکہ یہ دونوں جہانوں کی تمام سعادتوں کو سمیٹے ہوئے ہے۔',
            repeatCount: 7,
            tags: ['dunya-akhirah', 'hasanah', 'دنیا و آخرت']
          },
          {
            id: 'rab-3',
            title: '3. صبر و استقامت اور نصرت کی دعا (Patience & Victory)',
            arabicTitle: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا',
            arabicText: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
            transliteration: 'Rabbana afrigh \'alayna sabraw-wa thabbit aqdamana wansurna \'alal-qawmil-kafireen',
            translationUrdu: 'اے ہمارے پروردگار! ہم پر صبر و حوصلہ انڈیل دے اور ہمارے قدم جمائے رکھ اور کافر قوم کے مقابلے میں ہماری مدد فرما۔',
            translationEnglish: 'Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.',
            reference: 'سورۃ البقرۃ: 250 (طالوت و جالوت کے موقع پر مجاہدین کی دعا)',
            benefits: 'مشکلات، آزمائشوں اور مخالفین کے سامنے ثابت قدمی اور فتح پانے کے لیے تیر بہدف دعا۔',
            repeatCount: 3,
            tags: ['patience', 'victory', 'صبر']
          },
          {
            id: 'rab-4',
            title: '4. بھول چوک، بوجھ اور معافی کی دعا (Forgiveness & Removal of Burden)',
            arabicTitle: 'رَبَّنَا لَا تُؤَاخِذْنَا',
            arabicText: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
            transliteration: 'Rabbana la tu\'akhidhna in naseena aw akhta\'na, Rabbana wa la tahmil \'alayna isran kama hamaltahu \'alal-ladheena min qablina, Rabbana wa la tuhammilna ma la taqata lana bih, wa\'fu \'anna waghfir lana warhamna, Anta mawlana fansurna \'alal-qawmil-kafireen.',
            translationUrdu: 'اے ہمارے رب! اگر ہم بھول جائیں یا چوک جائیں تو ہمارا مواخذہ نہ فرما۔ اے ہمارے رب! اور ہم پر ویسا بوجھ نہ ڈال جیسا تو نے ہم سے پہلے لوگوں پر ڈالا تھا۔ اے ہمارے رب! اور ہم سے وہ بوجھ نہ اٹھوا جس کی ہم میں طاقت نہیں۔ اور ہمارے گناہوں سے درگزر فرما، اور ہمیں بخش دے، اور ہم پر رحم فرما، تو ہی ہمارا کارساز ہے، پس کافر قوم پر ہماری مدد فرما۔',
            translationEnglish: 'Our Lord, do not impose blame upon us if we forget or make a mistake. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.',
            reference: 'سورۃ البقرۃ: 286',
            benefits: 'سورۃ البقرۃ کی آخری دو آیات رات کو پڑھنے والے کے لیے ہر آفت سے کفایت کر جاتی ہیں۔ اللہ تعالیٰ فرماتا ہے: میں نے تمہاری یہ دعا قبول کر لی۔',
            repeatCount: 1,
            tags: ['forgiveness', 'baqarah-last', 'مغفرت']
          },
          {
            id: 'rab-5',
            title: '5. دل کے ٹیڑھے پن سے حفاظت کی دعا (Steadfastness of the Heart)',
            arabicTitle: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا',
            arabicText: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
            transliteration: 'Rabbana la tuzigh quloobana ba\'da idh hadaytana wa hab lana mil-ladunka rahmah, innaka Antal-Wahhab.',
            translationUrdu: 'اے ہمارے پروردگار! ہدایت دینے کے بعد ہمارے دلوں کو ٹیڑھا نہ کر، اور ہمیں اپنے پاس سے خاص رحمت عطا فرما، بیشک تو ہی بہت زیادہ عطا کرنے والا ہے۔',
            translationEnglish: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
            reference: 'سورۃ آل عمران: 8',
            benefits: 'ایمان پر خاتمے اور گمراہی و شکوک سے بچنے کے لیے کثرت سے یہ دعا مانگنی چاہیے۔',
            repeatCount: 3,
            tags: ['guidance', 'heart', 'ہدایت']
          },
          {
            id: 'rab-6',
            title: '6. والدین کے لیے دعائے رحمت (Dua for Parents)',
            arabicTitle: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ',
            arabicText: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
            transliteration: 'Rabbanagh-fir lee wa liwalidayya wa lil-mu\'mineena yawma yaqoomul-hisaab',
            translationUrdu: 'اے ہمارے پروردگار! مجھے اور میرے والدین کو اور تمام مومنوں کو بخش دے اس دن جب حساب قائم ہوگا۔',
            translationEnglish: 'Our Lord, forgive me and my parents and the believers the Day the account is established.',
            reference: 'سورۃ ابراہیم: 41 (حضرت ابراہیم علیہ السلام کی دعا)',
            benefits: 'والدین کے حق میں مغفرت اور بخشش کی سب سے افضل اور با برکت قرآنی دعا۔',
            repeatCount: 5,
            tags: ['parents', 'forgiveness', 'والدین']
          },
          {
            id: 'rab-7',
            title: '7. نیک بیوی اور اولاد کی دعا (Righteous Family & Children)',
            arabicTitle: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا',
            arabicText: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
            transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yuniw-waj\'alna lil-muttaqeena imama',
            translationUrdu: 'اے ہمارے پروردگار! ہمیں ہماری بیویوں اور ہماری اولاد کی طرف سے آنکھوں کی ٹھنڈک عطا فرما، اور ہمیں پرہیزگاروں کا پیشوا بنا۔',
            translationEnglish: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.',
            reference: 'سورۃ الفرقان: 74 (عباد الرحمن کی دعا)',
            benefits: 'گھریلو امن و سکون، ازدواجی محبت اور نیک صالح اولاد کے لیے انتہائی آزمودہ قرآنی وظیفہ۔',
            repeatCount: 3,
            tags: ['family', 'children', 'spouse', 'اہل و عیال']
          },
          {
            id: 'rab-8',
            title: '8. جہنم کے عذاب سے پناہ کی دعا (Protection from Hellfire)',
            arabicTitle: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ',
            arabicText: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ ۖ إِنَّ عَذَابَهَا كَانَ غَرَامًا ۝ إِنَّهَا سَاءَتْ مُسْتَقَرًّا وَمُقَامًا',
            transliteration: 'Rabbanas-rif \'anna \'adhaba Jahannam, inna \'adhabaha kana gharama, innaha sa\'at mustaqarraw-wa muqama.',
            translationUrdu: 'اے ہمارے پروردگار! ہم سے جہنم کا عذاب پھیر دے، بیشک اس کا عذاب گلے کا طوق ہے، وہ ٹھہرنے اور رہنے کی بہت ہی بری جگہ ہے۔',
            translationEnglish: 'Our Lord, avert from us the punishment of Hell. Indeed, its punishment is ever adhering; indeed, it is evil as a settlement and residence.',
            reference: 'سورۃ الفرقان: 65-66',
            benefits: 'دوزخ کی ہولناکیوں سے چھٹکارے اور اللہ کی رضا پانے کے لیے۔',
            repeatCount: 3,
            tags: ['jahannam', 'protection', 'جہنم سے پناہ']
          }
        ]
      }
    ]
  },

  // ─── BOOK 5: SPECIAL OCCASION PRAYERS & DUAS ──────────────────────────────
  {
    id: 'special-prayers',
    title: 'خصوصی نمازیں اور التجائیں (استخارہ، حاجت، تسبیح و تہجد)',
    arabicTitle: 'الصَّلَوَاتُ المَسْنُونَةُ وَالأَدْعِيَةُ لِلْحَاجَاتِ',
    author: 'احادیثِ مبارکہ • Sunnah Collection',
    category: 'special',
    categoryLabel: 'خصوصی عبادات • Special Prayers',
    description: 'نمازِ استخارہ کا مسنون طریقہ و مکمل دعا، صلاۃ الحاجۃ، صلاۃ التسبیح کا مفصل طریقہ، نمازِ تہجد، اور بیماری و تکلیف میں شفاء کی دعائیں۔',
    coverGradient: 'linear-gradient(135deg, #2e0854 0%, #6b21a8 50%, #581c87 100%)',
    accentColor: '#c084fc',
    totalItems: 6,
    readTime: '18 mins',
    tags: [
      'istikhara', 'hajat', 'tasbeeh', 'tahajjud', 'shifa', 'special-prayer', 'استخارہ',
      'حاجت', 'تہجد', 'تسبیح'
    ],
    chapters: [
      {
        id: 'special-list',
        title: 'طریقہ اور مسنون دعائیں',
        arabicTitle: 'كَيْفِيَّةُ الصَّلَاةِ وَالأَدْعِيَةُ المَأْثُورَةُ',
        description: 'اہم زندگی کے فیصلوں، پریشانیوں اور دلی مقاصد کے لیے مسنون دعائیں اور نمازیں۔',
        items: [
          {
            id: 'sp-istikhara',
            title: 'نمازِ استخارہ کا طریقہ اور مکمل مسنون دعا (Salat-ul-Istikhara)',
            arabicTitle: 'دُعَاءُ صَلَاةِ الاسْتِخَارَةِ',
            arabicText: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ • اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ • وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَٰذَا الأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ.',
            transliteration: 'Allahumma innee astakheeruka bi\'ilmik, wa astaqa-diruka biqudratik, wa as\'aluka min fadlikal-\'azeem, fa-innaka taqdiru wa la aqdir, wa ta\'lamu wa la a\'lam, wa Anta \'Allamul-ghuyoob. Allahumma in kunta ta\'lamu anna hadhal-amra khayrul-lee fee deenee wa ma\'aashee wa \'aaqibati amree, faqdur-hu lee wa yassir-hu lee thumma barik lee feeh. Wa in kunta ta\'lamu anna hadhal-amra sharrul-lee fee deenee wa ma\'aashee wa \'aaqibati amree, fasrif-hu \'annee wasrifnee \'anh, waqdur liyal-khayra haythu kana thumma ardinee bih.',
            translationUrdu: 'اے اللہ! میں تیرے علم کے وسیلے سے تجھ سے بھلائی طلب کرتا ہوں اور تیری قدرت کے وسیلے سے تجھ سے طاقت مانگتا ہوں اور تیرے بڑے فضل کا سوال کرتا ہوں، کیونکہ تو قادر ہے اور میں قادر نہیں، اور تو جانتا ہے اور میں نہیں جانتا، اور تو تمام پوشیدہ باتوں کا جاننے والا ہے۔ اے اللہ! اگر تو جانتا ہے کہ یہ کام (یہاں اپنے کام کا نام سوچے یا کہے) میرے لیے میرے دین میں، میری زندگی میں اور میرے انجامِ کار میں بہتر ہے، تو اسے میرے مقدر میں کر دے اور اسے میرے لیے آسان بنا دے اور پھر اس میں مجھے برکت عطا فرما۔ اور اگر تو جانتا ہے کہ یہ کام میرے لیے میرے دین میں، میری زندگی میں اور میرے انجامِ کار میں برا ہے، تو اسے مجھ سے پھیر دے اور مجھے اس سے پھیر دے، اور میرے لیے جہاں بھی بھلائی ہو وہ مقدر فرما دے اور پھر مجھے اس پر راضی کر دے۔',
            translationEnglish: 'O Allah, I seek Your counsel by Your knowledge, and by Your power I seek strength, and I ask You from Your immense favor. For You have power and I have none, and You know and I know not, and You are the Knower of the unseen. O Allah, if You know that this matter is good for me in my religion, my livelihood and the outcome of my affair, then decree it for me, facilitate it for me, and then bless me in it. But if You know that this matter is bad for me in my religion, my livelihood and the outcome of my affair, then turn it away from me and turn me away from it, and decree for me what is good wherever it may be, and make me pleased with it.',
            reference: 'صحیح البخاری: 1162',
            benefits: 'نکاح، کاروبار، سفر یا کسی بھی اہم کام سے پہلے دو رکعت نفل پڑھ کر یہ دعا پڑھنا سنت ہے۔ استخارہ کرنے والا کبھی نامراد نہیں ہوتا۔',
            repeatCount: 1,
            tags: ['istikhara', 'decision', 'استخارہ']
          },
          {
            id: 'sp-salat-hajat',
            title: 'صلاۃ الحاجۃ اور دعا (Salat-ul-Hajat for Any Need)',
            arabicTitle: 'صَلَاةُ الحَاجَةِ وَدُعَاؤُهَا',
            arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْحَلِيمُ الْكَرِيمُ، سُبْحَانَ اللَّهِ رَبِّ الْعَرْشِ الْعَظِيمِ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ، وَعَزَائِمَ مَغْفِرَتِكَ، وَالْغَنِيمَةَ مِنْ كُلِّ بِرٍّ، وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ، لَا تَدَعْ لِي ذَنْبًا إِلَّا غَفَرْتَهُ، وَلَا هَمًّا إِلَّا فَرَّجْتَهُ، وَلَا حَاجَةً هِيَ لَكَ رِضًا إِلَّا قَضَيْتَهَا يَا أَرْحَمَ الرَّاحِمِينَ.',
            transliteration: 'La ilaha illallahul-Haleemul-Kareem, Subhanallahi Rabbil-\'Arshil-\'Azeem, Al-hamdu lillahi Rabbil-\'alameen, As\'aluka moojibati rahmatik, wa \'aza\'ima maghfiratik, wal-ghaneemata min kulli birr, was-salamata min kulli ithm, la tada\' lee dhamban illa ghafartah, wa la hamman illa farrajtah, wa la hajatan hiya laka ridan illa qadaytaha ya Arhamar-Rahimeen.',
            translationUrdu: 'اللہ کے سوا کوئی معبود نہیں جو بردبار اور کرم فرمانے والا ہے، پاک ہے اللہ جو عرشِ عظیم کا مالک ہے، تمام تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا رب ہے۔ اے اللہ! میں تجھ سے تیری رحمت کے اسباب، تیری بخشش کے پختہ ذرائع، ہر نیکی سے حصہ اور ہر گناہ سے سلامتی مانگتا ہوں۔ میرا کوئی گناہ ایسا نہ چھوڑ جسے تو بخش نہ دے، کوئی غم ایسا نہ رکھ جسے تو دور نہ فرما دے، اور میری کوئی ایسی ضرورت جو تیری رضا کے مطابق ہو اسے پورا کیے بغیر نہ چھوڑ، اے سب سے بڑھ کر رحم فرمانے والے!۔',
            translationEnglish: 'There is none worthy of worship except Allah, the Forbearing, the Generous. Glory be to Allah, Lord of the Magnificent Throne. Praise be to Allah, Lord of the worlds. I ask You for the means of Your mercy, the resolves of Your forgiveness, the benefit of every virtue, and safety from every sin. Leave no sin of mine unforgiven, no sorrow unrelieved, and no need that meets Your pleasure unfulfilled, O Most Merciful of those who show mercy.',
            reference: 'سنن الترمذی: 479 • سنن ابن ماجہ: 1384',
            benefits: 'جب بھی اللہ سے یا کسی بندے سے کوئی جائز ضرورت درپیش ہو تو اچھی طرح وضو کر کے دو رکعت نماز پڑھ کر یہ دعا مانگیں۔',
            repeatCount: 1,
            tags: ['hajat', 'need', 'صلاۃ الحاجۃ']
          },
          {
            id: 'sp-salat-tasbeeh',
            title: 'صلاۃ التسبیح کا تفصیلی طریقہ (Salat-ut-Tasbeeh Guide)',
            arabicTitle: 'كَيْفِيَّةُ صَلَاةِ التَّسْبِيحِ',
            arabicText: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَٰهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ',
            transliteration: 'Subhanallahi, wal-hamdu lillahi, wa la ilaha illallahu, wallahu akbar (Recited 75 times per Rakah, Total 300 times in 4 Rakahs)',
            translationUrdu: 'یہ تسبیح چار رکعت میں کل ۳۰۰ مرتبہ پڑھی جاتی ہے (ہر رکعت میں ۷۵ بار): ثناء کے بعد ۱۵ بار، قرأت کے بعد ۱۰ بار، رکوع میں ۱۰ بار، رکوع سے کھڑے ہو کر (قومہ میں) ۱۰ بار، پہلے سجدے میں ۱۰ بار، دونوں سجدوں کے درمیان ۱۰ بار، اور دوسرے سجدے میں ۱۰ بار = ۷۵ بار فی رکعت۔',
            translationEnglish: 'Recited 75 times in each of the 4 Rakahs (Total 300 times): 15 times after Thana, 10 times after recitation, 10 in Ruku, 10 in Qawmah, 10 in first Sajdah, 10 in Jalsa, 10 in second Sajdah.',
            reference: 'سنن ابی داود: 1297 • سنن الترمذی: 481',
            benefits: 'رسول اللہ ﷺ نے حضرت عباس رضی اللہ عنہ سے فرمایا: اس نماز سے انسان کے اگلے پچھلے، پرانے نئے، جان بوجھ کر یا بھول کر کیے گئے چھوٹے بڑے تمام گناہ معاف ہو جاتے ہیں۔ روزانہ، ورنہ جمعہ کو، ورنہ مہینے میں، ورنہ سال میں یا زندگی میں ایک بار ضرور پڑھیں۔',
            repeatCount: 75,
            tags: ['salat-tasbeeh', 'tasbeeh', 'صلاۃ التسبیح']
          },
          {
            id: 'sp-shifa-sick',
            title: 'بیمار کی عیادت اور شفائے امراض کی دعا (Dua for the Sick)',
            arabicTitle: 'دُعَاءُ شِفَاءِ المَرِيضِ',
            arabicText: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا.',
            transliteration: 'Allahumma Rabban-naas, adh-hibil-ba\'s, ishfi Antash-Shaafee, la shifa\'a illa shifa\'uk, shifa\'al-la yughadiru saqama.',
            translationUrdu: 'اے اللہ! تمام انسانوں کے پروردگار! تکلیف کو دور فرما دے، شفا عطا فرما، تو ہی حقیقی شفا دینے والا ہے، تیری شفا کے سوا کوئی شفا نہیں، ایسی کامل شفا عطا فرما جو کسی بیماری کو باقی نہ چھوڑے۔',
            translationEnglish: 'O Allah, Lord of mankind, remove the affliction and heal; You are the Healer, there is no healing except Your healing—a healing that leaves behind no ailment.',
            reference: 'صحیح البخاری: 5743 • صحیح مسلم: 2191',
            benefits: 'نبی کریم ﷺ بیمار کی عیادت کے وقت دائیں ہاتھ سے مسح فرماتے ہوئے یہ دعا پڑھا کرتے تھے۔',
            repeatCount: 7,
            tags: ['shifa', 'healing', 'sick', 'شفاء']
          },
          {
            id: 'sp-ayat-kareema',
            title: 'آیتِ کریمہ / دعائے یونس (Relief from Calamities)',
            arabicTitle: 'دَعْوَةُ ذِي النُّونِ (آيَةُ كَرِيمَة)',
            arabicText: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
            transliteration: 'La ilaha illa Anta subhanaka innee kuntu minaz-zalimeen',
            translationUrdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بیشک میں ہی قصورواروں میں سے تھا۔',
            translationEnglish: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
            reference: 'سورۃ الانبیاء: 87 • سنن الترمذی: 3505',
            benefits: 'رسول اللہ ﷺ نے فرمایا: مچھلی والے (حضرت یونس علیہ السلام) نے مچھلی کے پیٹ میں یہ دعا مانگی تھی، کوئی بھی مسلمان کسی بھی مشکل میں یہ دعا مانگے گا اللہ اس کی دعا ضرور قبول فرمائے گا۔',
            repeatCount: 100,
            tags: ['ayat-kareema', 'yunus', 'آیت کریمہ']
          }
        ]
      }
    ]
  },

  // ─── BOOK 6: RUQYAH SHARIAH & MANZIL (PROTECTION & HEALING) ────────────────
  {
    id: 'ruqyah-manzil',
    title: 'منزل و آیاتِ شفا (شرعی دم و حفاظت)',
    arabicTitle: 'المَنْزِلُ وَآيَاتُ الشِّفَاءِ وَالرُّقْيَةُ الشَّرْعِيَّةُ',
    author: 'القرآن الکریم • مشائخِ حدیث',
    category: 'ruqyah',
    categoryLabel: 'شفا و حفاظت • Ruqyah & Healing',
    description: 'نظرِ بد، جادو، حسد، بیماریوں اور شیطانی اثرات سے حفاظت کے لیے قرآنی آیاتِ شفا، آیت الکرسی، معوذتین اور مسنون کلماتِ حفاظت۔',
    coverGradient: 'linear-gradient(135deg, #4c0519 0%, #9f1239 50%, #881337 100%)',
    accentColor: '#f43f5e',
    totalItems: 5,
    readTime: '12 mins',
    tags: [
      'ruqyah', 'manzil', 'shifa', 'protection', 'evil-eye', 'ayatul-kursi', 'منزل',
      'آیات شفا', 'حفاظت', 'دم'
    ],
    chapters: [
      {
        id: 'ruqyah-verses',
        title: 'قرآنی حفاظت اور شفاء کے کلمات',
        arabicTitle: 'آيَاتُ الحِفْظِ وَالشِّفَاءِ',
        description: 'صبح و شام پڑھ کر اپنے اور بچوں کے اوپر دم کرنے کے لیے مستند آیات و دعائیں۔',
        items: [
          {
            id: 'rq-ayatul-kursi',
            title: 'آیت الکرسی (Ayat-ul-Kursi - The Greatest Verse)',
            arabicTitle: 'آيَةُ الكُرْسِيِّ',
            arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
            transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyoom, la ta\'khudhuhu sinatuw-wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhee yashfa\'u \'indahu illa bi\'idnih, ya\'lamu ma bayna aydeehim wa ma khalfahum, wa la yuheetoona bishay\'im-min \'ilmihee illa bima sha\'a, wasi\'a kursiyyuhus-samawati wal-ard, wa la ya\'ooduhu hifzuhuma, wa Huwal-\'Aliyyul-\'Azeem.',
            translationUrdu: 'اللہ، جس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ رہنے والا اور سب کو سنبھالنے والا ہے۔ نہ اسے اونگھ آتی ہے اور نہ نیند۔ اسی کا ہے جو کچھ آسمانوں میں ہے اور جو کچھ زمین میں ہے۔ کون ہے جو اس کے حضور اس کی اجازت کے بغیر سفارش کر سکے؟ وہ جانتا ہے جو کچھ بندوں کے سامنے ہے اور جو کچھ ان کے پیچھے ہے، اور وہ اس کے علم میں سے کسی چیز کا احاطہ نہیں کر سکتے سوائے اس کے جتنا وہ چاہے۔ اس کی کرسی (علم و اقتدار) آسمانوں اور زمین پر چھائی ہوئی ہے، اور ان دونوں کی حفاظت اس پر ذرا بھی بوجھ نہیں، اور وہ بہت بلند، بڑی عظمت والا ہے۔',
            translationEnglish: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
            reference: 'سورۃ البقرۃ: 255 • صحیح البخاری: 2311',
            benefits: 'قرآن کریم کی سب سے عظیم ترین آیت۔ ہر فرض نماز کے بعد پڑھنے والے کے لیے جنت میں داخلے میں صرف موت حائل ہے، اور رات کو پڑھنے والے کے لیے اللہ کی طرف سے محافظ مقرر ہو جاتا ہے۔',
            repeatCount: 1,
            tags: ['ayatul-kursi', 'greatest-verse', 'آیت الکرسی']
          },
          {
            id: 'rq-ayat-shifa',
            title: 'قرآن مجید کی چھ آیاتِ شفا (The 6 Verses of Healing)',
            arabicTitle: 'آيَاتُ الشِّفَاءِ السِّتَّةُ فِي القُرْآنِ',
            arabicText: '1. وَيَشْفِ صُدُورَ قَوْمٍ مُّؤْمِنِينَ (التوبة: 14)\n2. وَشِفَاءٌ لِّمَا فِي الصُّدُورِ (يونس: 57)\n3. يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ (النحل: 69)\n4. وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ (الإسراء: 82)\n5. وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ (الشعراء: 80)\n6. قُلْ هُوَ لِلَّذِينَ آمَنُوا هُدًى وَشِفَاءٌ (فصلت: 44)',
            transliteration: '1. Wa yashfi sudoora qawmim-mu\'mineen. 2. Wa shifa\'ul-lima fis-sudoor. 3. Feehi shifa\'ul-lin-naas. 4. Wa nunazzilu minal-Qur\'ani ma huwa shifa\'uw-wa rahmatul-lil-mu\'mineen. 5. Wa idha maridtu fa-Huwa yashfeen. 6. Qul huwa lilladheena aamanoo hudaw-wa shifaa\'.',
            translationUrdu: '1. اور وہ مومنوں کے سینوں کو شفا عطا فرماتا ہے۔ 2. اور دلوں کی بیماریوں کے لیے شفا ہے۔ 3. اس میں لوگوں کے لیے شفا ہے۔ 4. اور ہم قرآن میں سے وہ چیز نازل فرماتے ہیں جو ایمان والوں کے لیے شفا اور رحمت ہے۔ 5. اور جب میں بیمار ہوتا ہوں تو وہی مجھے شفا دیتا ہے۔ 6. آپ فرما دیجیے کہ یہ (قرآن) ایمان والوں کے لیے ہدایت اور شفا ہے۔',
            translationEnglish: 'The six verses in the Quran explicitly containing the word "Shifa" (Healing) for spiritual, mental and physical health and relief.',
            reference: 'کتبِ طب نبوی • مشائخ تفسیر',
            benefits: 'پانی پر دم کر کے پینا یا مریض پر دم کرنا جسمانی و روحانی امراض کے علاج کے لیے مجرب ہے۔',
            repeatCount: 3,
            tags: ['shifa', 'ayat-shifa', 'آیات شفا']
          },
          {
            id: 'rq-three-quls',
            title: 'معوذتین اور اخلاص (The 3 Quls for Protection)',
            arabicTitle: 'المُعَوِّذَاتُ الثَّلَاثُ',
            arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ (سورۃ الإخلاص) • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (سورۃ الفلق) • قُلْ أَعُوذُ بِرَبِّ النَّاسِ (سورۃ الناس)',
            transliteration: 'Surah Al-Ikhlas, Surah Al-Falaq, Surah An-Nas',
            translationUrdu: 'سورۃ الاخلاص، سورۃ الفلق اور سورۃ الناس۔ صبح و شام اور سوتے وقت تین تین مرتبہ پڑھ کر دونوں ہاتھوں پر پھونک کر پورے جسم پر پھیریں۔',
            translationEnglish: 'Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas. Recited 3 times morning and evening, and before sleep, blowing on hands and wiping over the body.',
            reference: 'صحیح البخاری: 5017 • سنن ابی داود: 5082',
            benefits: 'رسول اللہ ﷺ نے فرمایا: جو صبح و شام تین بار یہ سورتیں پڑھے، وہ ہر برائی اور جادو و نظرِ بد سے حفاظت کے لیے کافی ہو جاتی ہیں۔',
            repeatCount: 3,
            tags: ['quls', 'ikhlas', 'falaq', 'nas', 'معوذتین']
          },
          {
            id: 'rq-evil-eye-dua',
            title: 'نظرِ بد اور ہر برائی سے پناہ کی مسنون دعا (Protection from Evil Eye)',
            arabicTitle: 'دُعَاءُ التَّعْوِيذِ مِنَ العَيْنِ وَالشَّرِّ',
            arabicText: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
            transliteration: 'A\'oodhu bi-kalimatil-lahit-tammati min kulli shaytaniw-wa hammah, wa min kulli \'aynil-lammah.',
            translationUrdu: 'میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں ہر شیطان سے اور ہر زہریلے جانور سے اور ہر لگ جانے والی نظرِ بد سے۔',
            translationEnglish: 'I seek refuge in the perfect words of Allah from every devil and poisonous reptile, and from every evil, envious eye.',
            reference: 'صحیح البخاری: 3371',
            benefits: 'حضرت ابراہیم علیہ السلام اپنے بیٹوں اسماعیل و اسحاق علیہما السلام پر یہی دعا دم کرتے تھے، اور نبی کریم ﷺ حسن و حسین رضی اللہ عنہما پر دم فرماتے تھے۔',
            repeatCount: 3,
            tags: ['evil-eye', 'children', 'نظر بد']
          },
          {
            id: 'rq-harm-dua',
            title: 'ہر قسم کے نقصان سے حفاظت کی دعا (Protection from All Harm)',
            arabicTitle: 'دُعَاءُ الحِمَايَةِ مِنْ كُلِّ أَذًى',
            arabicText: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ',
            transliteration: 'Bismillahil-ladhee la yadurru ma\'as-mihee shay\'un fil-ardi wa la fis-samaa\', wa Huwas-Samee\'ul-\'Aleem.',
            translationUrdu: 'اللہ کے نام کے ساتھ، جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا، خوب جاننے والا ہے۔',
            translationEnglish: 'In the name of Allah, with Whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
            reference: 'سنن ابی داود: 5088 • سنن الترمذی: 3388',
            benefits: 'رسول اللہ ﷺ نے فرمایا: جو شخص صبح کے وقت تین بار اور شام کے وقت تین بار یہ دعا پڑھے، اسے کوئی اچانک مصیبت یا نقصان نہیں پہنچ سکتا۔',
            repeatCount: 3,
            tags: ['harm', 'protection', 'حفاظت']
          }
        ]
      }
    ]
  }
];
