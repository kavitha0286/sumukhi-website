# Sumukhi — Curated Gifts website

Static multi-page site. Every page shares `css/styles.css` and `js/main.js`. Product images are in `assets/img/`, cropped from the Sumukhi catalogue.

| Page | File | Edited in /admin? |
|---|---|---|
| Home | `index.html` | No |
| Corporate Collection | `corporate.html` | **Yes**: `content/corporate.json` |
| Occasions & Festive | `occasions.html` | **Yes**: `content/occasions.json` |
| Institutional | `institutional.html` | **Yes**: `content/institutional.json` |
| Collections | `collections.html` | No |
| Plant gifts | `plant-gifting.html` | No |
| About (incl. how it works) | `about.html` | No |
| Pricing & FAQ | `pricing.html` | No |
| Contact & enquiry form | `contact.html` | No |

The header and footer are repeated on every page. If you change a menu link, phone number or email, update all nine files.
Enquire buttons link to `contact.html?category=…#enquire`, and the form fills itself in from that link.

## Admin: editing the gifting pages

The Corporate, Occasions & Festive and Institutional pages are built from the JSON files in `content/`. `js/sections.js` reads those files and draws the page. The admin edits them through **Decap CMS** at `yoursite.com/admin`, and never touches code.

### What the admin can do
- Edit each page's top banner: title, intro text and photo.
- Add, delete, reorder and edit **sections**, each with a choice of:
  - **Layout:** Product grid, Feature (photo, text and bullet points), or Banner (full-width photo).
  - **Background:** Light, Cream, Dark teal or Sage green.
  - **Content:** Products (photo, name, description, badge such as "New").
  - **Enquire button:** its text, and which collection it fills in on the enquiry form.
- Upload photos. They are saved to `assets/uploads/`.
- **Schedule seasonal sections** with *Show from* and *Show until*:
  - A section appears automatically on its start date and disappears after its end date. For example, Diwali hampers can run from 1 Sep to 15 Nov.
  - While an end date is set, visitors see "Available until 15 Nov".
  - *Hide this section* takes a section offline without deleting it.
  - Dates follow the visitor's own calendar day. Hidden and scheduled sections are still present in the public `content/*.json` file, so never put anything confidential in them.

After **Publish**, Netlify rebuilds the live site in about a minute.

### Publishing and one-time setup
Follow **[PUBLISHING.md](PUBLISHING.md)**. It is a click-by-click guide for GitHub, Netlify and the admin login, and takes about 25 minutes with nothing to install.

Hosting files in this folder:
- `netlify.toml`: tells Netlify there is no build step, and keeps admin edits from being cached.
- `robots.txt`: keeps `/admin` out of search engines.
- `404.html`: the branded "page not found" page.

> Netlify has deprecated its older "Identity / Git Gateway" email login, so this site uses the supported GitHub login instead. If admins must sign in by email without a GitHub account, Decap's paid *Decap Turbo* service is an option.

## Preview locally
Open `index.html` in a browser, or serve the folder:

    py -m http.server 5500

The admin panel only works once the site is on Netlify, because it needs the GitHub login.

## Enquiry form → email
The form posts to FormSubmit (https://formsubmit.co), which emails each enquiry to **giftsatsumukhi@gmail.com**. No account is needed.

1. Upload the site to your host.
2. Submit one test enquiry from the live site.
3. FormSubmit sends an activation email to giftsatsumukhi@gmail.com. Click **Activate Form**.
4. All later enquiries are delivered automatically. The customer's email is set as the reply-to address.

To change the receiving address, edit `ENQUIRY_EMAIL` at the top of `js/main.js`.
If delivery fails, the form offers the visitor buttons to send the same details by email or WhatsApp.

## Photo credits
The "Who we gift for", plant gifting and some gifting-page photos come from Unsplash under the Unsplash License (https://unsplash.com/license). They are free for commercial use and need no permission. They load from Unsplash's image CDN.
- Corporate gift box: In Trống Đồng, https://unsplash.com/photos/daZPDnz9lQY
- Diwali diyas: Udayaditya Barua, https://unsplash.com/photos/xisPXJqwQkA
- Graduation: RUT MIIT, https://unsplash.com/photos/hpRGrfOIybc
- Succulents in gift boxes: Sajidur Rahman, https://unsplash.com/photos/6r-79U9CXw8
- Succulent with message sign: BanhKem 236, https://unsplash.com/photos/CUJ8cZ-wPfg
- Jade bonsai: Toa Heftiba, https://unsplash.com/photos/W1yjvf5idqA
- Desk plant: Loveleen Cherub, https://unsplash.com/photos/R3dhGTkQ5Yc

## Editing CSS or JavaScript
Pages load `css/styles.css?v=10`, `js/main.js?v=9` and, on the gifting pages, `js/sections.js?v=9`. After you edit any of these, raise the number (for example from `?v=10` to `?v=11`) in every page that loads the file. This makes visitors' browsers load the new version instead of an old cached copy. The admin's content edits don't need this.

## Before going live
- Replace the sample testimonials in `index.html` and `about.html` (marked with a comment) with real client quotes.
- Check the "from ₹" prices on the Collections and Pricing pages. They come from rates printed in the catalogue.
- Review the starter content on the three gifting pages in `/admin`. It was written from the catalogue as a starting point.
