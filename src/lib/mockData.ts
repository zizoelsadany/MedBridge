import { Book, Article, MedicalVideo, MedicalTerm, Category } from './types';

export const initialCategories: Category[] = [
  { _id: 'cat-1', nameEn: 'Anatomy', nameAr: 'علم التشريح', slug: 'anatomy', iconName: 'Activity', descriptionEn: 'Gross anatomy, neuroanatomy, and anatomical dissection guides.', descriptionAr: 'تشريح الجسم الإنساني، التشريح العصبي، وأدلة التشريح السريري.', bookCount: 42, articleCount: 18 },
  { _id: 'cat-2', nameEn: 'Physiology', nameAr: 'علم وظائف الأعضاء', slug: 'physiology', iconName: 'HeartPulse', descriptionEn: 'Cellular physiology, organ system mechanics, and body regulation.', descriptionAr: 'وظائف الأجهزة الحيوية، فسيولوجيا الخلايا، والتوازن البدني.', bookCount: 35, articleCount: 24 },
  { _id: 'cat-3', nameEn: 'Histology', nameAr: 'علم الأنسجة', slug: 'histology', iconName: 'Microscope', descriptionEn: 'Microscopic structure of tissues, stains, and cellular architecture.', descriptionAr: 'تركيب الأنسجة تحت المجهر والصبغات الحيوية وتنظيم الخلايا.', bookCount: 22, articleCount: 14 },
  { _id: 'cat-4', nameEn: 'Embryology', nameAr: 'علم الأجنة', slug: 'embryology', iconName: 'Dna', descriptionEn: 'Human development from fertilization through organogenesis.', descriptionAr: 'مراحل التطور البشري من الإخصاب وتكون الأعضاء.', bookCount: 19, articleCount: 10 },
  { _id: 'cat-5', nameEn: 'Biochemistry', nameAr: 'الكيمياء الحيوية', slug: 'biochemistry', iconName: 'FlaskConical', descriptionEn: 'Metabolic pathways, molecular biology, and clinical enzymology.', descriptionAr: 'المسارات الأيضية، البيولوجيا الجزيئية، والإنزيمات السريرية.', bookCount: 30, articleCount: 16 },
  { _id: 'cat-6', nameEn: 'Pharmacology', nameAr: 'علم الأدوية', slug: 'pharmacology', iconName: 'Pill', descriptionEn: 'Drug mechanisms, pharmacokinetics, dosage, and therapeutics.', descriptionAr: 'آليات عمل الأدوية، الديناميكية الدوائية، والجرعات والآثار الجانبية.', bookCount: 48, articleCount: 32 },
  { _id: 'cat-7', nameEn: 'Pathology', nameAr: 'علم الأمراض', slug: 'pathology', iconName: 'Stethoscope', descriptionEn: 'General disease mechanisms, cellular injury, and systemic pathology.', descriptionAr: 'آليات الأمراض، الإصابات الخلوية، وعلم الأمراض النظامي.', bookCount: 50, articleCount: 38 },
  { _id: 'cat-8', nameEn: 'Microbiology', nameAr: 'علم الأحياء الدقيقة', slug: 'microbiology', iconName: 'Bug', descriptionEn: 'Bacteriology, virology, mycology, and infectious diseases.', descriptionAr: 'البكتيريا، الفيروسات، الطفيليات، والفطريات والأمراض المعدية.', bookCount: 28, articleCount: 21 },
  { _id: 'cat-9', nameEn: 'Internal Medicine', nameAr: 'الطب الباطني', slug: 'internal-medicine', iconName: 'ClipboardList', descriptionEn: 'Comprehensive diagnosis and non-surgical treatment of adult diseases.', descriptionAr: 'تشخيص وعلاج أمراض البالغين والأنظمة الباطنية المتعددة.', bookCount: 64, articleCount: 45 },
  { _id: 'cat-10', nameEn: 'Surgery', nameAr: 'الجراحة العامة', slug: 'surgery', iconName: 'Scissors', descriptionEn: 'Operative techniques, trauma management, and perioperative care.', descriptionAr: 'التقنيات الجراحية، إصابات الصدمات، والرعاية الجراحية الشاملة.', bookCount: 55, articleCount: 29 },
  { _id: 'cat-11', nameEn: 'Pediatrics', nameAr: 'طب الأطفال', slug: 'pediatrics', iconName: 'Baby', descriptionEn: 'Neonatal care, pediatric development, and childhood illnesses.', descriptionAr: 'رعاية حديثي الولادة، نمو الأطفال، وأمراض الطفولة.', bookCount: 38, articleCount: 26 },
  { _id: 'cat-12', nameEn: 'Cardiology', nameAr: 'أمراض القلب', slug: 'cardiology', iconName: 'Heart', descriptionEn: 'Electrocardiography, cardiovascular disorders, and interventional procedures.', descriptionAr: 'تخطيط القلب، أمراض الدورة الدموية، والقسطرة العلاجية.', bookCount: 41, articleCount: 33 },
  { _id: 'cat-13', nameEn: 'Neurology', nameAr: 'طب الأعصاب', slug: 'neurology', iconName: 'Brain', descriptionEn: 'Central and peripheral nervous system pathology and neuro-diagnostics.', descriptionAr: 'أمراض الجهاز العصبي المركزي والطرفي والتشخيص العصبي.', bookCount: 36, articleCount: 20 },
  { _id: 'cat-14', nameEn: 'Dermatology', nameAr: 'طب الجلدية', slug: 'dermatology', iconName: 'Sparkles', descriptionEn: 'Cutaneous lesions, dermatopathology, and aesthetic dermatology.', descriptionAr: 'الآفات الجلدية، أمراض الجلد، والعلاجات الجلدية التجميلية.', bookCount: 25, articleCount: 15 },
  { _id: 'cat-15', nameEn: 'Radiology', nameAr: 'الأشعة والتصوير الطبي', slug: 'radiology', iconName: 'FileText', descriptionEn: 'X-ray, CT scan, MRI interpretation, and interventional radiology.', descriptionAr: 'تفسير الأشعة السينية، الأشعة المقطعية، والرنين المغناطيسي.', bookCount: 32, articleCount: 19 },
  { _id: 'cat-16', nameEn: 'Orthopedics', nameAr: 'جراحة العظام', slug: 'orthopedics', iconName: 'Bone', descriptionEn: 'Musculoskeletal injuries, joint replacement, and sports medicine.', descriptionAr: 'إصابات الهيكل العظمي، تبديل المفاصل، والطب الرياضي.', bookCount: 30, articleCount: 17 },
  { _id: 'cat-17', nameEn: 'ENT', nameAr: 'أنف وأذن وحنجرة', slug: 'ent', iconName: 'Ear', descriptionEn: 'Otolaryngology, head & neck surgery, and audiometry.', descriptionAr: 'أمراض وجراحة الأنف والأذن والحنجرة والرأس والعنق.', bookCount: 24, articleCount: 12 },
  { _id: 'cat-18', nameEn: 'Ophthalmology', nameAr: 'طب وجراحة العيون', slug: 'ophthalmology', iconName: 'Eye', descriptionEn: 'Ocular anatomy, optical physics, retinal surgery, and cataracts.', descriptionAr: 'تشريح العين، أمراض الشبكية، وإعتام عدسة العين والجراحات.', bookCount: 27, articleCount: 15 },
  { _id: 'cat-19', nameEn: 'Obstetrics & Gynecology', nameAr: 'أمراض النساء والتوليد', slug: 'obstetrics-gynecology', iconName: 'UserPlus', descriptionEn: 'Maternal-fetal medicine, gynecologic oncology, and reproductive health.', descriptionAr: 'طب الأم والجنين، أمراض النساء والجراحة، والصحة الإنجابية.', bookCount: 40, articleCount: 28 },
  { _id: 'cat-20', nameEn: 'Nursing', nameAr: 'التمريض والرعاية', slug: 'nursing', iconName: 'ShieldCheck', descriptionEn: 'Clinical nursing skills, intensive care, patient triage, and pharmacology.', descriptionAr: 'المهارات التمريضية السريرية، العناية المركزة، والفرز الطبي.', bookCount: 45, articleCount: 31 },
];

export const initialBooks: Book[] = [
  {
    _id: 'book-1',
    title: 'Gray\'s Anatomy for Students - 5th Edition',
    author: 'Richard Drake, A. Wayne Vogl, Adam W. M. Mitchell',
    category: 'Anatomy',
    description: 'Easy to read, superbly illustrated, and clinically relevant, Gray\'s Anatomy for Students is your go-to text for essential information in human anatomy. Designed for medical students, this edition offers updated clinical correlations, vibrant surface anatomy illustrations, and comprehensive neuroanatomy coverage.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 1184,
    language: 'English',
    year: 2024,
    fileSize: '45.2 MB',
    downloads: 142,
    views: 320,
    rating: 4.9,
    ratingCount: 32,
    isFeatured: true,
    isbn: '978-0323393041',
    publisher: 'Elsevier',
    tableOfContents: [
      'Chapter 1: The Body & Imaging Principles',
      'Chapter 2: Back & Vertebral Column',
      'Chapter 3: Thorax & Cardiac Anatomy',
      'Chapter 4: Abdomen & Viscera',
      'Chapter 5: Pelvis and Perineum',
      'Chapter 6: Upper Limb & Brachial Plexus',
      'Chapter 7: Lower Limb & Locomotion',
      'Chapter 8: Head & Neck'
    ]
  },
  {
    _id: 'book-2',
    title: 'Guyton and Hall Textbook of Medical Physiology',
    author: 'John E. Hall, Michael E. Hall',
    category: 'Physiology',
    description: 'The 14th edition of Guyton and Hall Textbook of Medical Physiology continues a long tradition as the world\'s foremost medical physiology textbook. Unlike other texts on this topic, this clear and comprehensive guide has a consistent, single-author voice that focuses on the content most relevant to clinical and pre-clinical students.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 1152,
    language: 'English',
    year: 2023,
    fileSize: '52.8 MB',
    downloads: 189,
    views: 412,
    rating: 4.8,
    ratingCount: 41,
    isFeatured: true,
    isbn: '978-0323597128',
    publisher: 'Elsevier',
    tableOfContents: [
      'Unit I: Introduction to Physiology: The Cell and General Physiology',
      'Unit II: Membrane Physiology, Nerve, and Muscle',
      'Unit III: The Heart & Circulation',
      'Unit IV: The Kidneys and Body Fluids',
      'Unit V: Blood Cells, Immunity, and Blood Clotting',
      'Unit VI: Respiration & Gas Exchange',
      'Unit VII: Aviation, Space, and Deep-Sea Diving Physiology'
    ]
  },
  {
    _id: 'book-3',
    title: 'Robbins & Cotran Pathologic Basis of Disease',
    author: 'Vinay Kumar, Abul K. Abbas, Jon C. Aster',
    category: 'Pathology',
    description: 'Dependable, current, and complete, Robbins and Cotran Pathologic Basis of Disease 10th Edition provides up-to-date, accurate coverage of the core pathology concepts you need to master for board exams and medical practice.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 1392,
    language: 'English',
    year: 2022,
    fileSize: '68.1 MB',
    downloads: 213,
    views: 490,
    rating: 5.0,
    ratingCount: 52,
    isFeatured: true,
    isbn: '978-0323531139',
    publisher: 'Elsevier',
    tableOfContents: [
      'Chapter 1: The Cell as a Unit of Health and Disease',
      'Chapter 2: Cellular Responses to Stress and Toxic Insults',
      'Chapter 3: Inflammation and Repair',
      'Chapter 4: Hemodynamic Disorders, Thromboembolism, and Shock',
      'Chapter 5: Genetic Disorders',
      'Chapter 6: Diseases of the Immune System'
    ]
  },
  {
    _id: 'book-4',
    title: 'Katzung Basic & Clinical Pharmacology 15th Ed',
    author: 'Bertram G. Katzung, Todd W. Vanderah',
    category: 'Pharmacology',
    description: 'The most up-to-date, comprehensive, and authoritative pharmacology text for medical and healthcare disciplines. Master key concepts with full-color diagrams, clinical vignettes, and drug summaries.',
    coverImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 1264,
    language: 'English',
    year: 2023,
    fileSize: '39.4 MB',
    downloads: 124,
    views: 289,
    rating: 4.7,
    ratingCount: 29,
    isFeatured: false,
    isbn: '978-1260452310',
    publisher: 'McGraw-Hill Education'
  },
  {
    _id: 'book-5',
    title: 'Harrison\'s Principles of Internal Medicine 21st Edition',
    author: 'Joseph Loscalzo, Anthony Fauci, Dennis Kasper',
    category: 'Internal Medicine',
    description: 'The landmark guide to internal medicine—updated with the latest clinical trials, treatment protocols, and global health breakthroughs.',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 4016,
    language: 'English',
    year: 2022,
    fileSize: '112.5 MB',
    downloads: 310,
    views: 680,
    rating: 4.9,
    ratingCount: 64,
    isFeatured: true,
    isbn: '978-1264268504',
    publisher: 'McGraw-Hill Education'
  },
  {
    _id: 'book-6',
    title: 'Sabiston Textbook of Surgery 21st Ed',
    author: 'Courtney M. Townsend Jr., R. Daniel Beauchamp',
    category: 'Surgery',
    description: 'Since its first publication in 1936, Sabiston Textbook of Surgery has been regarded as the trusted definitive source for operative surgery guidance and patient management.',
    coverImage: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 2176,
    language: 'English',
    year: 2022,
    fileSize: '76.0 MB',
    downloads: 112,
    views: 240,
    rating: 4.8,
    ratingCount: 18,
    isFeatured: false,
    isbn: '978-0323640626',
    publisher: 'Elsevier'
  },
  {
    _id: 'book-7',
    title: 'Nelson Textbook of Pediatrics 21st Edition',
    author: 'Robert M. Kliegman, Joseph St. Geme',
    category: 'Pediatrics',
    description: 'The standard of care for pediatric diagnosis and management. Covers neonatology, adolescent medicine, and developmental behavioral pediatrics.',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 3824,
    language: 'English',
    year: 2023,
    fileSize: '95.0 MB',
    downloads: 142,
    views: 310,
    rating: 4.9,
    ratingCount: 23,
    isFeatured: false,
    isbn: '978-0323529501',
    publisher: 'Elsevier'
  },
  {
    _id: 'book-8',
    title: 'أطلس التشريح البشري - نتر (النسخة العربية)',
    author: 'فرانك هـ. نتر (ترجمة د. أحمد عبد الرؤوف)',
    category: 'Anatomy',
    description: 'المرجع المصور الأعمق والأجمل عالمياً لتشريح الجسم البشري. يحتوى على أكثر من 500 لوحة تشريحية فائقة الدقة مع التسميات العربية والمصطلحات اللاتينية المعتمدة.',
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pages: 640,
    language: 'Arabic',
    year: 2023,
    fileSize: '82.3 MB',
    downloads: 254,
    views: 540,
    rating: 5.0,
    ratingCount: 48,
    isFeatured: true,
    isbn: '978-9953860125',
    publisher: 'دار العلوم الطبية'
  }
];

export const initialArticles: Article[] = [
  {
    _id: 'art-1',
    title: 'Modern Advances in Percutaneous Coronary Intervention (PCI)',
    author: 'Dr. Sarah Al-Mansoor, MD, FACC',
    authorTitle: 'Consultant Interventional Cardiologist',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    category: 'Cardiology',
    summary: 'A detailed clinical review of third-generation drug-eluting stents, intravascular imaging (OCT & IVUS), and physiological lesion assessment with FFR.',
    content: `Percutaneous Coronary Intervention (PCI) has evolved rapidly over the last two decades. The introduction of bioresorbable polymers and ultrathin-strut drug-eluting stents (DES) has dramatically reduced target lesion revascularization rates to under 5% per year.

### The Role of Intravascular Imaging
Optical Coherence Tomography (OCT) and Intravascular Ultrasound (IVUS) allow precise lesion preparation, vessel sizing, and post-stent expansion optimization. Clinical trials demonstrate up to a 30% reduction in major adverse cardiac events (MACE) when imaging guides complex bifurcations or left main interventions.

Key Takeaways for Clinical Practice:
1. Always assess lesion physiology (FFR/iFR) before stenting intermediate stenoses (40-70%).
2. Use OCT in calcified lesions to evaluate the need for intravascular lithotripsy (IVL) or rotational atherectomy.
3. Dual Antiplatelet Therapy (DAPT) duration can be safely tailored to 1-3 months in high-bleeding-risk patients receiving modern DES.`,
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 7,
    views: 5420,
    rating: 4.9,
    ratingCount: 88,
    createdAt: '2026-06-15',
    isFeatured: true,
    tags: ['Cardiology', 'PCI', 'Stents', 'Cath Lab']
  },
  {
    _id: 'art-2',
    title: 'النهج الحديث في تشخيص وعلاج السكتة الدماغية الإقفارية الحادة',
    author: 'د. خالد العمري',
    authorTitle: 'استشاري أمراض المخ والأعصاب',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    category: 'Neurology',
    summary: 'استعراض سريري شامل حول التقييم السريع، واستخدام مذيبات الخثرة الوريدية (tPA / Tenecteplase)، واستئصال الخثرة الميكانيكي في النافذة الزمنية الممتدة.',
    content: `الوقت هو المخ (Time is Brain). كل دقيقة تأخير في بدء علاج السكتة الدماغية الإقفارية تؤدي لتموت حوالي 1.9 مليون خلية عصبية.

### الخطوات الأساسية في الطوارئ:
- إجراء أشعة مقطعية سريعة (Non-contrast CT) لاستبعاد النزيف الدماغي خلال 15 دقيقة من الوصول.
- تقييم مقياس NIHSS لمعرفة شدة الأعراض العصبية.
- إعطاء مذيب الخثرة في حال عدم وجود موانع مطلقًا خلال نافذة 4.5 ساعة.

التقنيات الحديثة مثل الأشعة المقطعية بالتروية (CT Perfusion) وسعت نافذة استئصال الخثرة الميكانيكي (Endovascular Thrombectomy) حتى 24 ساعة في مرخصين محددين.`,
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 9,
    views: 4180,
    rating: 4.8,
    ratingCount: 64,
    createdAt: '2026-07-02',
    isFeatured: true,
    tags: ['Neurology', 'Stroke', 'Thrombectomy', 'Brain']
  },
  {
    _id: 'art-3',
    title: 'Updates in Sepsis & Septic Shock Management (Surviving Sepsis 2024)',
    author: 'Dr. Robert Harrison, MD',
    authorTitle: 'Professor of Intensive Care Medicine',
    authorAvatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&q=80',
    category: 'Internal Medicine',
    summary: 'Key recommendations regarding hour-1 bundle, fluid resuscitation choices, vasopressor escalation, and early antibiotic administration.',
    content: `Sepsis remains a primary cause of mortality in ICUs worldwide. Immediate initiation of evidence-based bundles dramatically lowers mortality rates.

### The 1-Hour Bundle Essentials:
1. Measure serum lactate level immediately. Re-measure if initial lactate > 2 mmol/L.
2. Obtain blood cultures prior to administration of broad-spectrum antimicrobials.
3. Administer empiric broad-spectrum intravenous antibiotics.
4. Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate ≥ 4 mmol/L.
5. Apply vasopressors (Norepinephrine as first-line) during or after fluid resuscitation to maintain MAP ≥ 65 mm Hg.`,
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 6,
    views: 6890,
    rating: 4.95,
    ratingCount: 112,
    createdAt: '2026-07-10',
    isFeatured: false,
    tags: ['Sepsis', 'ICU', 'Emergency', 'Antibiotics']
  }
];

export const initialVideos: MedicalVideo[] = [
  {
    _id: 'vid-1',
    title: 'Laparoscopic Cholecystectomy: Step-by-Step Surgical Technique',
    description: 'Comprehensive surgical demonstration of Critical View of Safety (CVS) identification, cystic duct clipping, and gallbladder extraction.',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:45',
    category: 'Surgery',
    views: 12400,
    createdAt: '2026-05-12'
  },
  {
    _id: 'vid-2',
    title: '12-Lead Electrocardiogram (ECG) Masterclass & STEMI Identification',
    description: 'Learn systematic ECG reading: Rate, Rhythm, Axis, Intervals, ST Elevation patterns, Reciprocal changes, and Mimics.',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '32:10',
    category: 'Cardiology',
    views: 28900,
    createdAt: '2026-06-01'
  },
  {
    _id: 'vid-3',
    title: 'Neurological Examination: Cranial Nerves I to XII Demonstration',
    description: 'A practical clinical guide for medical students performing a complete cranial nerve bedside examination.',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '22:15',
    category: 'Neurology',
    views: 19800,
    createdAt: '2026-06-20'
  }
];

export const initialDictionary: MedicalTerm[] = [
  {
    _id: 'term-1',
    term: 'Aneurysm',
    phonetic: '/ˈænjʊˌrɪzəm/',
    meaning: 'تمدد أو انتفاخ شرياني',
    description: 'A localized, abnormal dilatation of a blood vessel (usually an artery) caused by congenital defect or weakness of the vessel wall.',
    category: 'Cardiology',
    relatedTerms: ['Aortic Dissection', 'Thrombosis', 'Atherosclerosis']
  },
  {
    _id: 'term-2',
    term: 'Bradycardia',
    phonetic: '/ˌbræd.ɪˈkɑː.di.ə/',
    meaning: 'بطء ضربات القلب (أقل من 60 نبضة/دقيقة)',
    description: 'A condition where the heart rate rests below 60 beats per minute in adults. Can be physiological in athletes or pathological due to AV block.',
    category: 'Cardiology',
    relatedTerms: ['Tachycardia', 'Arrhythmia', 'Pacemaker']
  },
  {
    _id: 'term-3',
    term: 'Cyanosis',
    phonetic: '/ˌsaɪ.əˈnəʊ.sɪs/',
    meaning: 'زرقان الجلد والأغشية المخاطية',
    description: 'A bluish discoloration of the skin and mucous membranes resulting from inadequate oxygenation of the hemoglobin in blood.',
    category: 'Pathology',
    relatedTerms: ['Hypoxia', 'Ischemia', 'Dyspnea']
  },
  {
    _id: 'term-4',
    term: 'Dyspnea',
    phonetic: '/dɪspˈniː.ə/',
    meaning: 'عسر أو صعوبة التنفس',
    description: 'Subjective feeling of difficult or uncomfortable breathing, commonly associated with cardiac, pulmonary, or neuromuscular disease.',
    category: 'Internal Medicine',
    relatedTerms: ['Orthopnea', 'Cyanosis', 'Tachypnea']
  },
  {
    _id: 'term-5',
    term: 'Erythrocyte',
    phonetic: '/ɪˈrɪθ.rə.saɪt/',
    meaning: 'كرية دم حمراء',
    description: 'A red blood cell that contains hemoglobin and transports oxygen from lungs to peripheral tissues.',
    category: 'Biochemistry',
    relatedTerms: ['Hemoglobin', 'Anemia', 'Reticulocyte']
  },
  {
    _id: 'term-6',
    term: 'Fibrosis',
    phonetic: '/faɪˈbrəʊ.sɪs/',
    meaning: 'تليف الأنسجة',
    description: 'The thickening and scarring of connective tissue, usually as a result of chronic inflammation, tissue injury, or repair.',
    category: 'Pathology',
    relatedTerms: ['Cirrhosis', 'Collagen', 'Scar']
  }
];
