/* Gestion des cookies (tarteaucitron.js) et Google Analytics */
const GA_ID = 'G-2FR1WCRT6G'; // remplacez par votre identifiant de mesure Google Analytics 4

tarteaucitron.init({
  "privacyUrl": "mentions-legales.html",
  "hashtag": "#tarteaucitron",
  "cookieName": "tarteaucitron",
  "orientation": "bottom",
  "groupServices": false,
  "showAlertSmall": false,
  "cookieslist": true,
  "showIcon": true,
  "iconPosition": "BottomLeft",
  "adblocker": false,
  "AcceptAllCta": true,
  "DenyAllCta": true,
  "highPrivacy": true,
  "handleBrowserDNTRequest": false,
  "removeCredit": false,
  "moreInfoLink": true,
  "useExternalCss": false,
  "useExternalJs": false,
  "readmoreLink": "mentions-legales.html"
});

tarteaucitron.user.gtagUa = GA_ID;
tarteaucitron.user.gtagMore = function () { /* options Google Analytics supplémentaires */ };
(tarteaucitron.job = tarteaucitron.job || []).push('gtag');
