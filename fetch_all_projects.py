import json
import requests
import os
import re
import time
from pathlib import Path

# Load the extracted credits
with open('C:/ML/felipe_valencia_credits.json', 'r', encoding='utf-8') as f:
    credits = json.load(f)

# Existing projects in portfolio (by IMDB ID)
existing_ids = {
    'tt9892936',  # One Hundred Years of Solitude
    'tt2707408',  # Narcos
    'tt20158934', # La Suprema
    'tt15399372', # The Kings of the World
    'tt15399588', # La Roya
    'tt8105958',  # Wild District
    'tt5929594',  # Los Nadie
    'tt4335804',  # La Mujer del Animal
    'tt19867050', # Cavewoman
    'tt22303580', # Nuit Obscure
    'tt11772522', # Suspensión
    'tt18974572', # The Marked Heart
    'tt32245807', # Positivo Negativo
    'tt13988208', # Topos
    'tt17663876', # Muzzle
    'tt7425520',  # Buy Me a Gun
    'tt10214496', # The Donut King
    'tt3338230',  # La Semilla del Silencio
    'tt27418974', # El Rojo Más Puro
}

# Create images directory
images_dir = Path('C:/ML/felo-valencia-portfolio/public/images/projects')
images_dir.mkdir(parents=True, exist_ok=True)

def sanitize_filename(title):
    """Convert title to a safe filename"""
    # Replace special characters with hyphens
    safe = re.sub(r'[^\w\s-]', '', title.lower())
    safe = re.sub(r'[-\s]+', '-', safe).strip('-')
    return safe[:50]  # Limit length

def download_poster(imdb_id, title):
    """Download poster image from IMDB"""
    filename = sanitize_filename(title) + '.jpg'
    filepath = images_dir / filename

    if filepath.exists():
        print(f"  Poster already exists: {filename}")
        return f"/images/projects/{filename}"

    # Try to get poster from IMDB
    try:
        # Use IMDB's media endpoint
        url = f"https://www.imdb.com/title/{imdb_id}/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)

        # Find poster URL in the page
        match = re.search(r'"image":"(https://m\.media-amazon\.com/images/[^"]+)"', response.text)
        if match:
            poster_url = match.group(1)
            # Get higher resolution
            poster_url = re.sub(r'_V1_.*\.jpg', '_V1_FMjpg_UX1000_.jpg', poster_url)

            img_response = requests.get(poster_url, headers=headers, timeout=10)
            if img_response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(img_response.content)
                print(f"  Downloaded: {filename}")
                return f"/images/projects/{filename}"

        print(f"  No poster found for: {title}")
        return None
    except Exception as e:
        print(f"  Error downloading {title}: {e}")
        return None

def get_category(type_str, title):
    """Determine category from type"""
    type_lower = type_str.lower()
    if 'documentary' in title.lower() or 'donut king' in title.lower():
        return 'documentary'
    elif 'series' in type_lower:
        return 'series'
    elif 'short' in type_lower:
        return 'short'
    else:
        return 'film'

def format_role(role):
    """Format role for display"""
    role = role.lower().strip()

    # Clean up role text
    role = re.sub(r'\s*\(.*?\)\s*', '', role)  # Remove parenthetical notes
    role = re.sub(r'\s*\.\.\..*', '', role)  # Remove ellipsis and following
    role = re.sub(r'\s+', ' ', role).strip()  # Normalize whitespace

    role_mappings = {
        'dialogue editor': ('Dialogue Editor', 'Editor de Diálogos'),
        'sound editor': ('Sound Editor', 'Editor de Sonido'),
        'adr recordist': ('ADR Recordist', 'Grabador de ADR'),
        'a.d.r. recordist': ('ADR Recordist', 'Grabador de ADR'),
        'adr editor': ('ADR Editor', 'Editor de ADR'),
        'sound designer': ('Sound Designer', 'Diseñador de Sonido'),
        'sound mixer': ('Sound Mixer', 'Mezclador de Sonido'),
        'foley editor': ('Foley Editor', 'Editor de Foley'),
        'foley artist': ('Foley Artist', 'Artista de Foley'),
        'sound restoration': ('Sound Restoration', 'Restauración de Sonido'),
        'supervising sound editor': ('Supervising Sound Editor', 'Supervisor de Edición de Sonido'),
        'assistant sound': ('Assistant Sound', 'Asistente de Sonido'),
        'sound effects editor': ('Sound Effects Editor', 'Editor de Efectos de Sonido'),
    }

    # Handle combined roles
    if 'dialogue editor' in role and 'sound editor' in role:
        return ('Dialogue Editor & Sound Editor', 'Editor de Diálogos y Sonido')
    if 'adr editor' in role and 'dialogue editor' in role:
        return ('ADR Editor & Dialogue Editor', 'Editor de ADR y Editor de Diálogos')
    if 'dialogue editor' in role and 'supervising' in role:
        return ('Dialogue Editor & Supervising Sound Editor', 'Editor de Diálogos y Supervisor de Sonido')
    if 'adr recordist' in role and 'dialogue editor' in role:
        return ('ADR Recordist & Dialogue Editor', 'Grabador de ADR y Editor de Diálogos')
    if 'foley artist' in role and 'sound editor' in role:
        return ('Sound Editor & Foley Artist', 'Editor de Sonido y Artista de Foley')
    if 'dialogue editor' in role and 'foley artist' in role:
        return ('Dialogue Editor & Foley Artist', 'Editor de Diálogos y Artista de Foley')

    # Try direct mapping
    for key, (en, es) in role_mappings.items():
        if key in role:
            return (en, es)

    # Default - capitalize first letter of each word
    en_role = role.title()
    return (en_role, en_role)

# Process all credits
print("Processing all IMDB credits...")
print("="*60)

new_projects = []
for i, credit in enumerate(credits):
    print(f"\n[{i+1}/{len(credits)}] {credit['title']} ({credit['year']})")

    imdb_id = credit['imdb_id']

    # Skip existing projects
    if imdb_id in existing_ids:
        print(f"  Already in portfolio, skipping...")
        continue

    # Download poster
    image_path = download_poster(imdb_id, credit['title'])

    # Format role
    role_en, role_es = format_role(credit['role'])

    # Determine category
    category = get_category(credit['type'], credit['title'])

    project = {
        'title': credit['title'],
        'year': int(credit['year'].split('–')[0]) if '–' in credit['year'] else int(credit['year']),
        'category': category,
        'image': image_path or '/images/projects/placeholder.jpg',
        'imdb': f"https://www.imdb.com/title/{imdb_id}/",
        'imdb_id': imdb_id,
        'role': {
            'en': role_en,
            'es': role_es
        },
        'description': {
            'en': '',
            'es': ''
        },
        'awards': [],
        'type': credit['type']
    }

    new_projects.append(project)

    # Rate limit
    time.sleep(0.5)

# Save new projects
output_file = 'C:/ML/new_projects.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(new_projects, f, indent=2, ensure_ascii=False)

print(f"\n{'='*60}")
print(f"Processed {len(new_projects)} new projects")
print(f"Saved to: {output_file}")
