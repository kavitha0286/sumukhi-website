# Publishing the Sumukhi website

This guide puts the site online for free on **Netlify**, with the content stored on **GitHub**. It also turns on the **admin panel** at `/admin`.
Allow about 25 minutes. You don't need to install anything; everything happens in a web browser.

You will end with:
- the live website at an address like `https://sumukhi-gifts.netlify.app`;
- the admin panel at `https://sumukhi-gifts.netlify.app/admin`;
- automatic updates: every time the admin presses **Publish**, the site updates in about a minute.

> Netlify and GitHub sometimes rename menu items. If a label below doesn't match exactly, look for the closest one.

---

## Part A — Put the files on GitHub (about 10 minutes)

1. Go to **https://github.com** and sign up for a free account, or sign in.
2. Click **+** (top right) → **New repository**.
   - **Repository name:** `sumukhi-website`
   - **Visibility:** *Private* is fine. Netlify and the admin panel both work with private repositories.
   - Leave *Add a README* **unticked**, because this folder already has one.
   - Click **Create repository**.
3. On the new, empty repository page, click the link **uploading an existing file**.
4. In Windows File Explorer, open the website folder (the one containing `index.html`).
   Press **Ctrl + A** to select **everything inside it**, then drag the selection into the browser window.
   - Drag the folder's *contents*, not the folder itself, so that `index.html` ends up at the top level.
   - Wait until all files are listed (about 45). The catalogue PDF is 15 MB, so it can take a minute.
5. Scroll down, type a message such as `First version of the website`, and click **Commit changes**.
6. Check that the repository's main page lists `index.html`, `netlify.toml`, `admin`, `assets` and the other files directly. They should not be inside an extra folder.

## Part B — Publish on Netlify (about 5 minutes)

1. Go to **https://app.netlify.com** and choose **Sign up with GitHub**. Approve the request.
2. Click **Add new site** (or **Add new project**) → **Import an existing project** → **GitHub**.
3. Approve Netlify's access to GitHub when asked, then pick **sumukhi-website**.
4. On the settings screen, leave **Build command** empty and leave **Publish directory** empty or `.`. The included `netlify.toml` sets this for you. Click **Deploy**.
5. When the deploy finishes, open **Site configuration** (or **Project configuration**) → **Change site name** and choose a name, for example `sumukhi-gifts`.
   Your address becomes `https://sumukhi-gifts.netlify.app`. **Write it down; you need it in Part C.**
6. Open the address and click through the pages to check that everything looks right.

## Part C — Turn on the admin login (about 10 minutes)

The admin signs in with a GitHub account. These steps let Netlify handle that login.

**1. Create a GitHub "OAuth app"**

1. On GitHub, click your profile photo → **Settings** → **Developer settings** (at the bottom of the left menu) → **OAuth Apps** → **New OAuth App**.
2. Fill in the form:

   | Field | Value |
   |---|---|
   | Application name | `Sumukhi website admin` |
   | Homepage URL | your site address, e.g. `https://sumukhi-gifts.netlify.app` |
   | Authorization callback URL | `https://api.netlify.com/auth/done` |

3. Click **Register application**.
4. Copy the **Client ID**.
5. Click **Generate a new client secret** and copy the secret. It is shown only once.

**2. Give the keys to Netlify**

1. In Netlify, open your site → **Site configuration** → **Access & security** (older screens: **Access control**) → **OAuth**.
2. Under **Authentication providers**, click **Install provider** → **GitHub**.
3. Paste the Client ID and the secret, then click **Install**.

**3. Point the admin panel at your repository**

1. On GitHub, open your repository → folder **admin** → file **config.yml** → click the **pencil** icon to edit it.
2. Change these three lines:
   ```yaml
   repo: YOUR-GITHUB-USERNAME/sumukhi-website     →  repo: your-username/sumukhi-website
   site_url: https://sumukhi.netlify.app           →  site_url: https://sumukhi-gifts.netlify.app
   display_url: https://sumukhi.netlify.app        →  display_url: https://sumukhi-gifts.netlify.app
   ```
   Keep the two spaces at the start of the `repo:` line. Spacing matters in this file.
3. Click **Commit changes**. Netlify republishes the site automatically within about a minute.

**4. Log in**

1. Open `https://sumukhi-gifts.netlify.app/admin`.
2. Click **Login with GitHub** and approve.
3. You will see **Gifting pages** → Corporate Collection, Occasions & Festive, and Institutional.

---

## Part D — After launch

- **Activate the enquiry form:**
  1. Send one test enquiry from the live Contact page.
  2. Open the email that FormSubmit sends to giftsatsumukhi@gmail.com and click **Activate Form**.
  3. All later enquiries are delivered automatically.
- **Add another admin:** on GitHub, open the repository → **Settings** → **Collaborators** → **Add people**, and enter their GitHub username. They then log in at `/admin` the same way.
- **Use your own domain (optional):**
  1. In Netlify, open **Domain management** → **Add a domain** and follow the DNS instructions from your domain registrar.
  2. Afterwards, update the **Homepage URL** in the GitHub OAuth app.
  3. Also update `site_url` and `display_url` in `admin/config.yml`.

## Everyday editing (for the admin)

1. Go to `/admin` and open a page under **Gifting pages**.
2. Open a section to edit it, use **Add sections +** to add one, drag the handle to reorder, or use **×** to delete.
3. For seasonal collections, set **Show from** and **Show until**. The section appears and disappears on those dates by itself.
4. Click **Publish** (top right) → **Publish now**. The live site updates in about a minute.

## If something goes wrong

| What you see | What to check |
|---|---|
| `/admin` says *Error loading the CMS configuration* | `admin/config.yml` was edited with wrong spacing. Compare it with the original lines. |
| The login window says *No auth provider* or *Not found* | Part C step 2 isn't done, or the callback URL isn't exactly `https://api.netlify.com/auth/done`. |
| Login works but saving fails | The `repo:` line in `config.yml` has the wrong username or repository name, or the person isn't a collaborator. |
| A change doesn't show on the site | Wait 1–2 minutes. In Netlify, open the **Deploys** tab and check that the latest deploy is *Published*. Then refresh the page. |
| A scheduled section isn't showing | Check its *Show from* and *Show until* dates and that *Hide this section* is off. |
