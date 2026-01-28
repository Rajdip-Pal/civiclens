# Git Version Control Guide

## 📋 Repository Status

✅ **Git initialized and configured**
✅ **25 organized commits created**
✅ **Clean, professional commit history**

## 🗂️ Commit Structure

The repository has been organized into 25 logical commits:

### 1️⃣ Project Foundation (Commits 1-3)
- Initial commit with LICENSE, README, .gitignore
- Root package.json for monorepo
- Firebase configuration files

### 2️⃣ Backend Infrastructure (Commits 4-8)
- Backend project initialization
- Firebase and BigQuery configuration
- Authentication middleware
- Error handling and rate limiting

### 3️⃣ Backend Services (Commits 9-12)
- AI service (Gemini integration)
- Computer Vision service
- Google Maps geocoding
- Geographic clustering algorithm

### 4️⃣ Backend API (Commits 13-16)
- Reports CRUD endpoints
- Analytics endpoints
- Authentication routes
- Express server and Docker setup

### 5️⃣ Frontend Foundation (Commits 17-20)
- React project initialization
- Firebase client and API configuration
- State management (Zustand)
- Core UI components and routing

### 6️⃣ Frontend Pages (Commits 21-24)
- Authentication pages (Login, Register)
- Enhanced home page
- Report management pages
- Analytics dashboard

### 7️⃣ Deployment & Docs (Commit 25)
- Deployment automation scripts
- Comprehensive documentation
- API reference and guides

## 📊 View Commit History

```bash
# View all commits
git log

# View compact history
git log --oneline

# View with graph
git log --graph --oneline --all

# View detailed changes
git log -p

# View specific commit
git show <commit-hash>
```

## 🌿 Branch Management

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# List all branches
git branch -a

# Switch branches
git checkout master

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

## 🔄 Common Git Operations

### Check Status
```bash
git status
```

### View Changes
```bash
# See unstaged changes
git diff

# See staged changes
git diff --cached
```

### Stage Changes
```bash
# Stage specific files
git add <file>

# Stage all changes
git add .

# Stage with interactive mode
git add -i
```

### Commit Changes
```bash
# Commit with message
git commit -m "Your commit message"

# Commit with detailed message
git commit -m "Short summary" -m "Detailed description"

# Amend last commit
git commit --amend
```

### View History
```bash
# Show commit history
git log --oneline --graph --all

# Show file changes
git log --stat

# Show changes for specific file
git log -p <file>
```

## 🌐 Remote Repository Setup

### Connect to GitHub

1. **Create GitHub repository** (don't initialize with README)

2. **Add remote origin**
```bash
git remote add origin https://github.com/yourusername/civiclens.git
```

3. **Verify remote**
```bash
git remote -v
```

4. **Push to GitHub**
```bash
# Push master branch
git push -u origin master

# Push all branches
git push --all origin
```

### Alternative: SSH Setup

```bash
# Add SSH remote
git remote add origin git@github.com:yourusername/civiclens.git

# Push via SSH
git push -u origin master
```

## 🏷️ Tags and Releases

```bash
# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# List tags
git tag -l

# Push tags to remote
git push origin --tags

# Create tag for specific commit
git tag -a v1.0.0 <commit-hash> -m "Message"
```

## 🔧 Useful Git Commands

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- <file>

# Unstage file
git reset HEAD <file>

# Reset to previous commit (keep changes)
git reset --soft HEAD~1

# Reset to previous commit (discard changes)
git reset --hard HEAD~1
```

### Stash Work

```bash
# Stash current changes
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Pop stash (apply and remove)
git stash pop
```

### Clean Repository

```bash
# Show what will be deleted
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd
```

## 📝 Commit Message Best Practices

### Format
```
<type>: <short summary>

<detailed description>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or tooling changes

### Examples
```bash
# Feature
git commit -m "feat: Add image upload to report submission"

# Bug fix
git commit -m "fix: Resolve authentication redirect issue"

# Documentation
git commit -m "docs: Update API documentation for analytics endpoint"
```

## 🚀 Deployment Workflow

### Development Branch

```bash
# Create development branch
git checkout -b develop

# Work on features
git checkout -b feature/new-feature

# Merge to develop
git checkout develop
git merge feature/new-feature

# Push to remote
git push origin develop
```

### Release Process

```bash
# Create release branch
git checkout -b release/v1.0.0

# Make final changes
git commit -m "chore: Bump version to 1.0.0"

# Merge to master
git checkout master
git merge release/v1.0.0

# Tag release
git tag -a v1.0.0 -m "Version 1.0.0"

# Push everything
git push origin master --tags
```

## 🔍 Troubleshooting

### Merge Conflicts

```bash
# View conflicts
git status

# After resolving conflicts
git add <resolved-files>
git commit -m "Merge: Resolve conflicts"
```

### Diverged Branches

```bash
# Pull and merge
git pull origin master

# Or pull and rebase
git pull --rebase origin master
```

### Accidental Commit

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1
```

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## 🎯 Pushing to GitHub

1. **Create GitHub repository**
   - Go to https://github.com/new
   - Name: `civiclens` or `techsprint-jgec`
   - Don't initialize with README (we already have one)

2. **Connect local repo to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/civiclens.git
   git branch -M main
   git push -u origin main
   ```

3. **Verify on GitHub**
   - Check commits are visible
   - Verify file structure
   - Review commit messages

4. **Optional: Create development branch**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

5. **Setup GitHub Actions** (Optional)
   - Create `.github/workflows/deploy.yml`
   - Automate deployments

---

**Ready for GitHub!** 🚀
