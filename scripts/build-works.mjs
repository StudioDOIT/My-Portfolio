import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const groups = ['visual', 'web', 'branding', 'motion'];
export const categories = ['Poster', 'Card news', 'leaflet', 'Business card', 'Banner', 'Web Design', 'Branding', 'Video', 'Motion'];
const optionalStrings = ['year', 'projectUrl', 'description', 'detailDescription', 'layout', 'format', 'role', 'tools', 'scope', 'duration', 'slug', 'youtubeId', 'videoSrc', 'designIntent', 'designApproach', 'brandConcept', 'identityNotes', 'productionNotes'];

function check(condition, message) {
    if (!condition) throw new Error(message);
}

export function localPath(value, repositoryRoot = root) {
    check(typeof value === 'string', 'URL must be a string');
    if (/^https?:\/\//i.test(value)) return null;
    check(!/^[a-z][a-z0-9+.-]*:/i.test(value) && !value.startsWith('//') && !value.includes('\\'), 'Unsupported URL: ' + value);
    let path = decodeURIComponent(value.split(/[?#]/)[0]);
    if (path.startsWith('/My-Portfolio/')) path = path.slice('/My-Portfolio/'.length);
    else check(!path.startsWith('/'), 'Local URLs must be repository relative or start with /My-Portfolio/: ' + value);
    const full = resolve(repositoryRoot, path);
    check(!relative(repositoryRoot, full).split(sep).includes('..'), 'URL leaves repository: ' + value);
    return full;
}

export function validateWorks(entries, repositoryRoot = root) {
    const ids = new Set();
    const warnings = [];
    for (const work of entries) {
        const label = work.id || '(missing ID)';
        check(work && typeof work === 'object' && !Array.isArray(work), 'Each file must contain one object');
        check(/^[a-z0-9][a-z0-9-]*$/.test(work.id || ''), label + ': invalid ID');
        check(!ids.has(work.id), label + ': duplicate ID'); ids.add(work.id);
        for (const key of ['title', 'category', 'image']) check(typeof work[key] === 'string' && work[key].trim(), label + ': missing ' + key);
        check(groups.includes(work.workGroup), label + ': invalid WORKS tab');
        check(categories.includes(work.category), label + ': invalid category');
        check(Number.isFinite(work.order) && work.order >= 0, label + ': order must be a non-negative number');
        for (const key of ['published', 'featured']) check(typeof work[key] === 'boolean', label + ': ' + key + ' must be boolean');
        for (const key of optionalStrings) check(work[key] == null || typeof work[key] === 'string', label + ': ' + key + ' must be text');
        check(['portrait', 'wide'].includes(work.layout || 'wide'), label + ': invalid layout');
        check(work.tags == null || (Array.isArray(work.tags) && work.tags.every(x => typeof x === 'string')), label + ': invalid tags');
        check(work.detailImages == null || (Array.isArray(work.detailImages) && work.detailImages.every(x => typeof x === 'string')), label + ': invalid detail images');
        for (const image of [work.image, ...(work.detailImages || [])]) {
            const full = localPath(image, repositoryRoot);
            check(!full || existsSync(full), label + ': image not found: ' + image);
        }
        if (work.projectUrl) {
            const full = localPath(work.projectUrl, repositoryRoot);
            check(!full || existsSync(full), label + ': detail page not found: ' + work.projectUrl);
        }
        if (work.videoSrc) {
            const full = localPath(work.videoSrc, repositoryRoot);
            if (full && !existsSync(full)) warnings.push(label + ': original video file is missing: ' + work.videoSrc);
        }
        if (work.youtubeId) check(/^[A-Za-z0-9_-]{11}$/.test(work.youtubeId), label + ': invalid YouTube ID');
    }
    return warnings;
}

export function readWorks(repositoryRoot = root) {
    const folder = resolve(repositoryRoot, '_data/works');
    return readdirSync(folder).filter(name => name.endsWith('.json')).sort().map(name => {
        const work = JSON.parse(readFileSync(resolve(folder, name), 'utf8'));
        check(name === work.id + '.json', name + ': filename must match ID');
        return work;
    });
}

// Same inclusion rule as data/works.json, with stable filename order.
export function publicWorks(entries) {
    return entries.filter(work => work.published === true && work.featured === true);
}
export function groupedWorks(entries) {
    const result = Object.fromEntries(groups.map(group => [group, []]));
    publicWorks(entries).slice().sort((a, b) => a.order - b.order || a.id.localeCompare(b.id)).forEach(work => result[work.workGroup].push(work));
    return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const entries = readWorks();
    for (const warning of validateWorks(entries)) console.warn('WARNING: ' + warning);
    const visible = publicWorks(entries);
    const outputFlag = process.argv.indexOf('--out');
    if (outputFlag !== -1) {
        const output = resolve(process.argv[outputFlag + 1]);
        check(output !== resolve(root, 'data/works.json'), 'Do not overwrite the Jekyll template. Use a temporary output path.');
        mkdirSync(dirname(output), { recursive: true });
        writeFileSync(output, JSON.stringify(visible, null, 2) + '\n');
    }
    const compareFlag = process.argv.indexOf('--compare');
    if (compareFlag !== -1) {
        const deployed = JSON.parse(readFileSync(resolve(process.argv[compareFlag + 1]), 'utf8'));
        check(JSON.stringify(deployed) === JSON.stringify(visible), 'Generated Jekyll JSON differs from the collection');
    }
    console.log(JSON.stringify({collectionCount: entries.length, websiteCount: visible.length, tabs: Object.fromEntries(Object.entries(groupedWorks(entries)).map(([key, items]) => [key, items.length]))}, null, 2));
}
