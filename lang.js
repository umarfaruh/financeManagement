const I18N = {
  ru: {
    nav_home:"Главная", nav_tools:"Калькуляторы", nav_contact:"Контакты",
    feature_budget:"Бюджетирование", feature_budget_text:"Планируй доходы и расходы.",
    feature_invest:"Инвестиции", feature_invest_text:"Простые стратегии инвестирования.",
    feature_calc:"Калькуляторы", feature_calc_text:"Ипотека, накопления — быстро рассчитать.",
    subscribe_title:"Подпишись на рассылку", subscribe_sub:"Получай материалы и скидки.",
    field_name:"Имя", field_email:"Email", field_phone:"Телефон (опц.)",
    tip_title:"Совет дня", tip_text:"Откладывай 10% дохода.",
    tools_title:"Калькуляторы", mortgage:"Ипотечный калькулятор", label_amount:"Сумма, тг", label_years:"Срок (лет)", label_rate:"Ставка (%)",
    savings:"Калькулятор накоплений", label_month:"Ежемесячный взнос, тг", label_syears:"Период (лет)", label_srate:"Доходность (%)",
    contact_title:"Контакты", contact_text:"Есть вопросы? Напиши нам.", field_message:"Сообщение", office:"Офис"
  },
  kz: {
    nav_home:"Басты бет", nav_tools:"Есептегіштер", nav_contact:"Байланыс",
    feature_budget:"Бюджеттеу", feature_budget_text:"Табыс пен шығынды жоспарлаңыз.",
    feature_invest:"Инвестициялар", feature_invest_text:"Қарапайым стратегиялар.",
    feature_calc:"Есептегіштер", feature_calc_text:"Ипотека, жинақ — тез есептеу.",
    subscribe_title:"Жазылымға қосылу", subscribe_sub:"Мақалалар мен жеңілдіктерді ал.",
    field_name:"Аты", field_email:"Email", field_phone:"Телефон (міндетті емес)",
    tip_title:"Кеңес", tip_text:"Табыстан 10% үнемдеңіз.",
    tools_title:"Есептегіштер", mortgage:"Ипотека калькуляторы", label_amount:"Сома, тг", label_years:"Мерзім (жыл)", label_rate:"Пайыз (%)",
    savings:"Жинақ калькуляторы", label_month:"Ай сайынғы салым", label_syears:"Жылдар", label_srate:"Күтілетін кіріс (%)",
    contact_title:"Байланыс", contact_text:"Сұрақтарыңыз бар ма? Хабарласыңыз.", field_message:"Хабарлама", office:"Офис"
  },
  en: {
    nav_home:"Home", nav_tools:"Tools", nav_contact:"Contact",
    feature_budget:"Budgeting", feature_budget_text:"Plan income and expenses.",
    feature_invest:"Investing", feature_invest_text:"Simple investing strategies.",
    feature_calc:"Calculators", feature_calc_text:"Mortgage, savings — quick calculations.",
    subscribe_title:"Subscribe", subscribe_sub:"Get articles and discounts.",
    field_name:"Name", field_email:"Email", field_phone:"Phone (optional)",
    tip_title:"Tip", tip_text:"Save 10% of income.",
    tools_title:"Tools", mortgage:"Mortgage calculator", label_amount:"Amount", label_years:"Term (years)", label_rate:"Interest (%)",
    savings:"Savings calculator", label_month:"Monthly deposit", label_syears:"Years", label_srate:"Expected return (%)",
    contact_title:"Contact", contact_text:"Have questions? Write to us.", field_message:"Message", office:"Office"
  },
  ug: {
    nav_home:"باش بەت", nav_tools:"قوراللار", nav_contact:"ئالاقە",
    feature_budget:"بۇجېت", feature_budget_text:"كىرىم-چىقىمنى پىلانلاڭ.",
    feature_invest:"سېرىم", feature_invest_text:"سادە سېرىم ستراتېگىيىسى.",
    feature_calc:"ھېسابلاڭ", feature_calc_text:"ئۆي، يىغىندا — تېز ھېسابلاڭ.",
    subscribe_title:"ئەۋەتكىلى ئەزا بولۇش", subscribe_sub:"ماقالە ۋە ئېتىبارلىق تەكلىپلەر.",
    field_name:"ئىسمى", field_email:"ئىمېيل", field_phone:"تىلفون (تاللىي)",
    tip_title:"مەسلىھەت", tip_text:"كىرىمدىن 10%نى ساقلاڭ.",
    tools_title:"قوراللار", mortgage:"ئۆي نىقابى ھېسابلىغۇچى", label_amount:"مىقدار", label_years:"مەزگىل (يىل)", label_rate:"پايىز (%)",
    savings:"يىغىندا ھېسابلىغۇچى", label_month:"ئايلىق سېلىم", label_syears:"يىل", label_srate:"كۈتۈلمەيدىغان پايىز (%)",
    contact_title:"ئالاقە", contact_text:"سوالىڭىز بولسا يىزىڭ.", field_message:"حابار", office:"نوپۇزلۇق ئورۇن"
  }
};

// apply language
document.addEventListener('DOMContentLoaded', ()=>{
  const select = document.getElementById('lang');
  Object.keys(I18N).forEach(k=>{
    const o = document.createElement('option'); o.value=k; o.textContent=k.toUpperCase(); select.appendChild(o);
  });
  let lang = localStorage.getItem('fm_lang') || 'ru';
  select.value = lang;
  function apply(l){
    localStorage.setItem('fm_lang', l);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if (I18N[l] && I18N[l][key]) el.textContent = I18N[l][key];
    });
    document.getElementById('payNow').textContent = (l==='en'?'Pay now — 2000 KZT':'Оплатить — 2 000 ₸');
  }
  apply(lang);
  select.addEventListener('change', ()=> apply(select.value));
});
