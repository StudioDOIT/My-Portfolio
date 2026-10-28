import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, readWorks, validateWorks, publicWorks } from './build-works.mjs';

// Cloudflare serves the project at /; GitHub Pages continues to use /My-Portfolio/.
// Only generated data changes. CMS source paths and GitHub Pages templates stay intact.
export function cloudflarePath(value) {
    return typeof value === 'string' && value.startsWith('/My-Portfolio/')
        ? './' + value.slice('/My-Portfolio/'.length)
        : value;
}
export function cloudflareWorks(entries) {
    return publicWorks(entries).map(work => ({
        ...work,
        image: cloudflarePath(work.image),
        ...(work.detailImages ? {detailImages: work.detailImages.map(cloudflarePath)} : {}),
        ...(work.projectUrl != null ? {projectUrl: cloudflarePath(work.projectUrl)} : {}),
        ...(work.videoSrc != null ? {videoSrc: cloudflarePath(work.videoSrc)} : {})
    }));
}

export function buildCloudflare() {
    const entries = readWorks();
    for (const warning of validateWorks(entries)) console.warn('WARNING: ' + warning);
    const output = resolve(root, 'dist');
    rmSync(output, {recursive:true, force:true});
    mkdirSync(output, {recursive:true});

    // Preserve root-level HTML pages and existing public assets, including future details.
    for (const entry of readdirSync(root, {withFileTypes:true})) {
        if (entry.isFile() && (/\.html$/i.test(entry.name) || /^(favicon\.[^/]+|robots\.txt|sitemap\.xml|CNAME)$/i.test(entry.name))) {
            cpSync(join(root,entry.name),join(output,entry.name));
        }
    }
    for (const folder of ['css','js','images','videos','details','assets','fonts','data']) {
        const source = join(root,folder);
        if (existsSync(source)) cpSync(source,join(output,folder),{recursive:true,dereference:false});
    }
    mkdirSync(join(output,'data'),{recursive:true});
    const works = cloudflareWorks(entries);
    writeFileSync(join(output,'data/works.json'),JSON.stringify(works,null,2)+'\n');
    // Cloudflare reads these headers from the build output. CMS edits should revalidate.
    writeFileSync(join(output,'_headers'),'/data/works.json\n  Cache-Control: no-cache\n');
    function inspect(folder) {
        for (const entry of readdirSync(folder,{withFileTypes:true})) {
            const file=join(folder,entry.name);
            if (entry.isSymbolicLink()) throw new Error('Public symlinks are not supported: '+relative(output,file));
            if (entry.isDirectory()) inspect(file);
            else if (statSync(file).size > 25 * 1024 * 1024) throw new Error('Cloudflare Pages asset exceeds 25 MiB: '+relative(output,file));
        }
    }
    inspect(output);
    console.log('Cloudflare Pages build: dist/ ('+works.length+' published works)');
    return {output,works};
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildCloudflare();
