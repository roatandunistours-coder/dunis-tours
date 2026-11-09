# Roatan Dunis Tours

Static site for [roatandunistours.com](https://roatandunistours.com/).

## WhatsApp lead codes

Every chat to the booking number **+504 9775-4724** that starts from this website gets a short code at the end of the prefilled message, for example `Hi Dunis Tours — Horseback $65 (ref G)`. The Spanish line **+504 9688-0728** is not tagged.

The code is the first channel in that browser tab. It is stored in `sessionStorage`, so it stays put while someone moves around the site. A plain visit stays `(ref W)` unless a named channel shows up later in the same tab. A named channel is not replaced by a later one. With JavaScript off, the message stays exactly as it is written in the HTML.

Meta click-to-WhatsApp ads never open the site, so those chats keep Meta's own greeting and have no ref code.

| Code | Channel | How the site decides |
| --- | --- | --- |
| `(ref G)` | Google Ads | `gclid`, `gbraid`, `wbraid`, `gad_source`, or `gad_campaignid` on the landing URL. Also `utm_source=google` with `utm_medium=cpc`. |
| `(ref F)` | Facebook | `fbclid`, `utm_source=facebook`, or a facebook.com / instagram.com referrer. |
| `(ref T)` | TripAdvisor | `utm_source=tripadvisor`, or a tripadvisor referrer. |
| `(ref B)` | Google Business Profile | A profile UTM (below). A Google search or Maps referrer alone is not enough to tell this apart from organic search. |
| `(ref W)` | Website | Organic Google, direct, and any other visit. |

The same letter is sent on the existing WhatsApp-click Google Ads conversion as the event parameter `lead_source` (`G`, `F`, `T`, `B`, or `W`). `send_to` is unchanged.

## UTM links to paste

Use these as the website URL on each profile. Google Ads does not need a new URL while auto-tagging is on: `gclid` / `gbraid` / `wbraid` already become `(ref G)`.

Facebook Page, website button:

`https://roatandunistours.com/?utm_source=facebook&utm_medium=social&utm_campaign=page`

Google Business Profile, website button:

`https://roatandunistours.com/?utm_source=gbp&utm_medium=organic&utm_campaign=profile`

TripAdvisor listing, website link:

`https://roatandunistours.com/?utm_source=tripadvisor&utm_medium=referral&utm_campaign=listing`

If Google Ads auto-tagging is ever turned off, add this to the final URL or tracking template:

`https://roatandunistours.com/?utm_source=google&utm_medium=cpc`
