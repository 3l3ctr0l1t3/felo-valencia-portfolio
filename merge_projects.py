import json

# Load existing projects
with open('C:/ML/felo-valencia-portfolio/src/data/projects.json', 'r', encoding='utf-8') as f:
    existing_data = json.load(f)

existing_projects = existing_data['projects']

# Load new projects
with open('C:/ML/new_projects.json', 'r', encoding='utf-8') as f:
    new_projects = json.load(f)

# Create a map of existing projects by IMDB ID
existing_by_imdb = {}
for p in existing_projects:
    imdb_url = p.get('imdb', '')
    # Extract IMDB ID from URL
    if 'imdb.com/title/' in imdb_url:
        imdb_id = imdb_url.split('/title/')[1].rstrip('/')
        existing_by_imdb[imdb_id] = p

print(f"Existing projects: {len(existing_projects)}")
print(f"New projects to add: {len(new_projects)}")

# Merge: keep existing (with descriptions/awards), add new
all_projects = []

# Add existing projects first (they have descriptions and awards)
for p in existing_projects:
    # Remove imdb_id if present, clean up
    project = {k: v for k, v in p.items() if k != 'imdb_id'}
    all_projects.append(project)

# Add new projects (skip any that already exist)
for p in new_projects:
    imdb_id = p.get('imdb_id', '')
    if imdb_id not in existing_by_imdb:
        # Clean up the project object
        project = {
            'title': p['title'],
            'year': p['year'],
            'category': p['category'],
            'image': p['image'],
            'imdb': p['imdb'],
            'role': p['role'],
            'description': p['description'],
            'awards': p['awards']
        }
        all_projects.append(project)

# Sort by year (newest first), then by title
all_projects.sort(key=lambda x: (-x['year'], x['title']))

# Assign IDs
for i, p in enumerate(all_projects, 1):
    p['id'] = i

print(f"Total projects after merge: {len(all_projects)}")

# Save merged projects
output = {'projects': all_projects}
with open('C:/ML/felo-valencia-portfolio/src/data/projects.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("Saved to projects.json")

# Print summary by category
categories = {}
for p in all_projects:
    cat = p['category']
    categories[cat] = categories.get(cat, 0) + 1

print("\nProjects by category:")
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

# Print year range
years = [p['year'] for p in all_projects]
print(f"\nYear range: {min(years)} - {max(years)}")
