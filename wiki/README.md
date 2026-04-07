# TestPOS 2.0 — GitHub Wiki Sub-Repository

This folder serves as the source for the GitHub Wiki of this project.

## Quick Start
To initialize the wiki as a git submodule:

```bash
# Step 1: Navigate to the project root
cd TestPOS-2.0

# Step 2: Enable the GitHub Wiki on the repository (do this on GitHub.com first)
# Go to Settings → Features → Wikis → check "Wikis"

# Step 3: Clone the wiki repository
git clone https://github.com/FriendzoneGuardian/TestPOS-2.0.wiki.git wiki-remote

# Step 4: Copy wiki content
cp wiki/*.md wiki-remote/

# Step 5: Push to wiki
cd wiki-remote
git add .
git commit -m "Initialize wiki from wiki/ folder"
git push

# Step 6: Alternatively, add as submodule (optional)
cd ..
git submodule add https://github.com/FriendzoneGuardian/TestPOS-2.0.wiki.git wiki-remote
```
