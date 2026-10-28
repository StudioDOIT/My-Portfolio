"""Validate CMS schema and one-file-per-work collection separately from the build."""
import json
from pathlib import Path
import yaml
root = Path(__file__).resolve().parents[1]
config = yaml.safe_load((root / '.pages.yml').read_text())
collection, = config['content']
assert collection['name'] == 'works' and collection['type'] == 'collection'
assert collection['format'] == 'json'
assert collection['path'] == '_data/works'
assert config['media']['input'] == 'images'
assert config['media']['output'] == '/My-Portfolio/images'
fields = {field['name'] for field in collection['fields']}
for key in ['fields', 'sort', 'search']:
    assert set(collection['view'][key]) <= fields
assert collection['view']['primary'] in fields
works = list((root / collection['path']).glob('*.json'))
for path in works:
    item = json.loads(path.read_text())
    assert isinstance(item, dict), path
    assert set(item) <= fields, (path, set(item) - fields)
    assert all(key in item for key in collection['view']['fields']), path
    assert all(key in item for key in collection['view']['search']), path
    assert all(field['name'] in item for field in collection['fields'] if field.get('required')), path
    assert path.stem == item['id'], path
print(f'Works collection path/schema/list fields: OK ({len(works)} individual JSON files)')
