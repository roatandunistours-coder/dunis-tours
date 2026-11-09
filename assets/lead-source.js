/* First-touch channel for WhatsApp booking links (+504 9775-4724).
   Codes: G Google Ads, F Facebook, T TripAdvisor, B Business Profile, W website.
   See README.md. Spanish line +504 9688-0728 is left unchanged.
   With this script blocked, the original prefill text stays as written in HTML. */
(function () {
  var BOOKING_PHONE = '50497754724';
  var STORAGE_KEY = 'dunis_lead_ref';
  var REF_RE = /\s*\(ref [GFTBW]\)\s*$/;

  var ADS_SOURCES = { google: 1, googleads: 1, google_ads: 1, adwords: 1 };
  var ADS_MEDIUMS = { cpc: 1, ppc: 1, paid: 1, paidsearch: 1, paid_search: 1 };
  var FB_SOURCES = { facebook: 1, fb: 1, meta: 1, instagram: 1, ig: 1 };
  var TA_SOURCES = { tripadvisor: 1, trip_advisor: 1, 'trip-advisor': 1 };
  var PROFILE_SOURCES = {
    gbp: 1,
    gmb: 1,
    google_business: 1,
    'google-business': 1,
    googlebusiness: 1,
    business_profile: 1,
    'business-profile': 1,
    google_business_profile: 1
  };

  function norm(value) {
    return String(value || '').replace(/^\s+|\s+$/g, '').toLowerCase();
  }

  function hostEnds(host, root) {
    return host === root || host.slice(-(root.length + 1)) === '.' + root;
  }

  function referrerHost(referrer) {
    if (!referrer) return '';
    try {
      return new URL(referrer).hostname.toLowerCase();
    } catch (err) {
      return '';
    }
  }

  function isFacebookHost(host) {
    return hostEnds(host, 'facebook.com') || hostEnds(host, 'fb.com') ||
      hostEnds(host, 'instagram.com') || hostEnds(host, 'fb.me');
  }

  function isTripAdvisorHost(host) {
    return /(^|\.)tripadvisor\./.test(host);
  }

  function isGoogleAdsHost(host) {
    return hostEnds(host, 'googleadservices.com') ||
      hostEnds(host, 'doubleclick.net') ||
      hostEnds(host, 'googlesyndication.com');
  }

  function isProfileCampaign(campaign) {
    return /(gbp|gmb|google[-_ ]?business|business[-_ ]?profile)/.test(campaign);
  }

  function isBusinessProfile(source, medium, campaign) {
    if (PROFILE_SOURCES[source] || PROFILE_SOURCES[medium]) return true;
    if (!isProfileCampaign(campaign)) return false;
    return source === 'google' || source === 'gbp' || source === 'gmb' || PROFILE_SOURCES[source] || medium === 'organic' || medium === 'local';
  }

  function classify(search, referrer) {
    var params = new URLSearchParams(search || '');
    if (params.has('gclid') || params.has('gbraid') || params.has('wbraid') || params.has('gad_source') || params.has('gad_campaignid')) {
      return 'G';
    }

    var source = norm(params.get('utm_source'));
    var medium = norm(params.get('utm_medium'));
    var campaign = norm(params.get('utm_campaign'));

    if (ADS_SOURCES[source] && ADS_MEDIUMS[medium]) return 'G';
    if (isBusinessProfile(source, medium, campaign)) return 'B';
    if (FB_SOURCES[source]) return 'F';
    if (TA_SOURCES[source]) return 'T';
    if (params.has('fbclid')) return 'F';

    var host = referrerHost(referrer);
    if (isTripAdvisorHost(host)) return 'T';
    if (isFacebookHost(host)) return 'F';
    if (isGoogleAdsHost(host)) return 'G';
    /* google.com (and other Google search hosts) without ad params, plus direct and unknown referrers. */
    return 'W';
  }

  function readStored() {
    try {
      var value = sessionStorage.getItem(STORAGE_KEY);
      if (value === 'G' || value === 'F' || value === 'T' || value === 'B' || value === 'W') return value;
    } catch (err) {}
    return '';
  }

  function writeStored(code) {
    try {
      sessionStorage.setItem(STORAGE_KEY, code);
    } catch (err) {}
  }

  /* First named channel in this tab wins. A plain website visit (W) is kept
     across in-page loads, and is replaced only if a named channel appears later. */
  function remember(found) {
    var stored = readStored();
    if (stored && stored !== 'W') return stored;
    writeStored(found);
    return found;
  }

  var code = 'W';
  try {
    code = remember(classify(window.location.search, document.referrer));
  } catch (err) {
    code = readStored() || 'W';
  }
  window.DUNIS_LEAD_SOURCE = code;

  function digits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function isBookingLink(url) {
    var host = url.hostname.toLowerCase().replace(/^www\./, '');
    var phone = '';
    if (url.protocol === 'whatsapp:') {
      phone = digits(url.searchParams.get('phone') || url.pathname);
    } else if (host === 'wa.me') {
      phone = digits(url.pathname);
    } else if (host === 'api.whatsapp.com') {
      phone = digits(url.searchParams.get('phone'));
    }
    return phone === BOOKING_PHONE;
  }

  function withRef(text, leadCode) {
    var base = String(text || '').replace(REF_RE, '').replace(/\s+$/g, '');
    var suffix = '(ref ' + leadCode + ')';
    return base ? base + ' ' + suffix : suffix;
  }

  function tagLinks() {
    var leadCode = window.DUNIS_LEAD_SOURCE || 'W';
    var anchors = document.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      var url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch (err) {
        continue;
      }
      if (!isBookingLink(url)) continue;
      url.searchParams.set('text', withRef(url.searchParams.get('text'), leadCode));
      anchor.href = url.href;
    }
  }

  function run() {
    try {
      tagLinks();
    } catch (err) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
