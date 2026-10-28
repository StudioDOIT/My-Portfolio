import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { root, readWorks, publicWorks } from './build-works.mjs';
import { buildCloudflare, cloudflarePath, cloudflareWorks } from './build-cloudflare.mjs';

test('CMS upload paths work at the Cloudflare site root without changing source', () => {
    const source={...readWorks()[0],image:'/My-Portfolio/images/fold-thumb.png',detailImages:['/My-Portfolio/images/fold.png'],projectUrl:'/My-Portfolio/details/fold.html',videoSrc:'/My-Portfolio/videos/example.mp4'};
    const result=cloudflareWorks([source])[0];
    assert.equal(result.image,'./images/fold-thumb.png');
    assert.deepEqual(result.detailImages,['./images/fold.png']);
    assert.equal(result.projectUrl,'./details/fold.html');
    assert.equal(result.videoSrc,'./videos/example.mp4');
    assert.equal(source.image,'/My-Portfolio/images/fold-thumb.png');
    assert.equal(cloudflarePath('https://example.com/My-Portfolio/image.png'),'https://example.com/My-Portfolio/image.png');
    assert.equal(cloudflareWorks([{...source,published:false}]).length,0);
    assert.equal(cloudflareWorks([{...source,featured:false}]).length,0);
});
test('static deployment includes original HTML, CSS, JS and all visible works and images', () => {
    const template=readFileSync(join(root,'data/works.json'),'utf8');
    const {output,works}=buildCloudflare();
    assert.deepEqual(JSON.parse(readFileSync(join(output,'data/works.json'),'utf8')),cloudflareWorks(readWorks()));
    assert.equal(works.length,publicWorks(readWorks()).length);
    for (const file of ['index.html','css/style.css','js/app.js']) assert.deepEqual(readFileSync(join(output,file)),readFileSync(join(root,file)));
    for (const work of works) for (const image of [work.image,...(work.detailImages||[])]) {
        if (!/^https?:\/\//i.test(image)) {
            assert.ok(existsSync(resolve(output,image)),image);
            assert.equal(new URL(image,'https://portfolio.pages.dev/').pathname.includes('/My-Portfolio/'),false);
        }
    }
    assert.equal(existsSync(join(output,'_data')),false);
    assert.equal(existsSync(join(output,'.pages.yml')),false);
    assert.equal(existsSync(join(output,'scripts')),false);
    assert.equal(readFileSync(join(root,'data/works.json'),'utf8'),template);
    assert.ok(!readFileSync(join(output,'data/works.json'),'utf8').includes('{%-'));
});
