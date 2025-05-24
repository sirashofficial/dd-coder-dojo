# DD Coder Dojo - Content Editing Guide

## Quick Start for Ashley & Content Managers

This guide shows you exactly how to update website content without touching any code!

## 📋 Team Members (Most Common Update)

**File:** `data/team.json`

### To Add a New Team Member:
1. Open `data/team.json`
2. Copy this template and add to the list:

```json
{
  "id": 8,
  "name": "New Member Name",
  "role": "Peer Mentor",
  "bio": "Description of what they do and their expertise...",
  "image": "images/mentors/new-member.jpg",
  "email": "optional@email.com",
  "social": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "twitter": "https://twitter.com/username"
  },
  "featured": true,
  "active": true,
  "joinDate": "2025-01-25"
}
```

### To Remove a Team Member:
Change `"active": true` to `"active": false`

### To Update Team Member Info:
Just edit their section in the JSON file:
- `name`: Their display name
- `role`: "Lead Peer Mentor" or "Peer Mentor"
- `bio`: Description paragraph
- `image`: Photo filename (upload photo to `images/mentors/` first)
- `social`: Social media links (use "#" if none)

## 📅 Website Text Content

### Home Page Content
**File:** `index.html`

Look for comments like this:
```html
<!-- EDITABLE CONTENT START -->
<h1>Your Title Here</h1>
<p>Your description here</p>
<!-- EDITABLE CONTENT END -->
```

Only edit text between these markers!

### About Page Content
**File:** `about.html`

**Mission & Vision:**
- Lines 67-89: Edit mission and approach text
- Keep the `<h3>` and `<p>` tags intact

**Timeline:**
- Lines 156-200: Edit years, titles, and descriptions
- To add new year: Copy entire `timeline-item` section

**Contact Details:**
- Lines 145-155: Update phone, email, address, schedule

### Programs Page Content
**File:** `programs.html`

**Program Information:**
- Each program has a section with title, description, and details
- Look for `<!-- EDITABLE CONTENT -->` markers
- Edit text but keep HTML tags

## 🖼️ Images

### Team Photos
1. **Save photo as:** `firstname-lastname.jpg` (lowercase, no spaces)
2. **Upload to:** `images/mentors/`
3. **Recommended size:** 400x400 pixels, under 200KB
4. **Update JSON:** Change `"image": "images/mentors/firstname-lastname.jpg"`

### Other Images
- **Home page images:** `images/home/`
- **Program images:** `images/programs/`
- **Project images:** `images/projects/`
- **Event photos:** `images/events/`

## 📊 Statistics & Numbers

### Home Page Stats
**File:** `index.html`

Look for sections with numbers:
```html
<span class="stat-number" data-target="150">0</span>
<span class="stat-label">Students Enrolled</span>
```

Change the `data-target="150"` number to update statistics.

### About Page Stats
Similar pattern in `about.html` - find the stats section and update numbers.

## 📢 Announcements & Updates

### Quick Updates
For urgent announcements, edit the "live status" section in `index.html`:
```html
<span id="currentActivity">47 students actively coding this week</span>
```

### Major Updates
For bigger changes, update the hero text on each page.

## 🎨 Colors & Branding

**File:** `css/main.css` (Lines 1-15)

Current brand colors:
- **Primary (Purple):** `#7c3aed`
- **Secondary (Cyan):** `#06b6d4` 
- **Accent (Orange):** `#f59e0b`

To change colors, update these values in the `:root` section.

## 📱 Contact Information

Update contact details in multiple places:

1. **Footer** (all HTML files): Lines at bottom of each page
2. **Contact page** (`contact.html`): Main contact section
3. **About page** (`about.html`): Contact details box

## ✅ Testing Your Changes

After making changes:

1. **Save all files**
2. **Refresh website** in browser
3. **Check on mobile** - resize browser window
4. **Test links** - make sure they work
5. **Check images** - ensure they load properly

## 🆘 Common Issues & Fixes

### Images Not Showing
- Check filename spelling in JSON exactly matches uploaded file
- Ensure image is in correct folder (`images/mentors/` for team)
- Try refreshing browser (Ctrl+F5)

### Text Not Updating
- Make sure you saved the file
- Check you edited between `<!-- EDITABLE CONTENT -->` markers
- Clear browser cache (Ctrl+Shift+R)

### Team Members Not Appearing
- Check `data/team.json` has valid syntax (no missing commas)
- Ensure `"active": true` is set
- Check browser console (F12) for error messages

### JSON Syntax Errors
- Every `{` needs a matching `}`
- Every `[` needs a matching `]`
- All text needs quotes: `"like this"`
- Commas between items but not after the last one

## 🔧 Emergency Contacts

If something breaks:
1. **Don't panic!** Most issues are easy to fix
2. **Check browser console** (F12 key) for error messages
3. **Contact tech support:** [Your contact info]
4. **Backup plan:** Revert to previous version on GitHub

## 📅 Content Update Schedule

**Weekly:**
- Update statistics if needed
- Check team member information
- Add any new announcements

**Monthly:**
- Review and update program descriptions
- Add new project showcases
- Update upcoming events

**Quarterly:**
- Review all contact information
- Update mission/vision if needed
- Refresh team photos if necessary

## 🎯 Content Best Practices

**Writing Style:**
- Keep it friendly and encouraging
- Use active voice: "We teach coding" not "Coding is taught"
- Include ages and specifics: "7-17 year olds" not "young people"
- Mention outcomes: "Students build real games and websites"

**Image Guidelines:**
- Always include alt text for accessibility
- Use consistent naming: `firstname-lastname.jpg`
- Keep file sizes under 500KB for faster loading
- Ensure photos show diverse, happy students/mentors

**Links:**
- Always test external links work
- Use descriptive text: "View project on Scratch" not "Click here"
- Include social media links for team members when available

---

## Quick Reference Card

| Task | File | What to Edit |
|------|------|-------------|
| Add team member | `data/team.json` | Add new member object |
| Update mission | `about.html` | Lines 67-89 |
| Change contact info | All HTML files | Footer + contact sections |
| Update statistics | `index.html` | `data-target` numbers |
| Add timeline event | `about.html` | Copy timeline-item section |
| Upload team photo | `images/mentors/` | Save as firstname-lastname.jpg |

**Remember:** Always test changes by refreshing the website after saving!