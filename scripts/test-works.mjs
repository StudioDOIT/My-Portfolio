import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readWorks, validateWorks, groupedWorks, publicWorks, localPath } from './build-works.mjs';
const original = readWorks();
test('collection validates, with all original assets present except the documented video', () => {
    const warnings = validateWorks(original);
    assert.ok(warnings.every(warning => warning.includes('original video file is missing')));
});
test('add, edit, delete, visibility and ordering propagate to website data', () => {
    const first = original[0];
    const added = {...first, id:'test-added', title:'새 작품', order:0, image:original[1].image, projectUrl:'./index.html'};
    let updated = [...original, added];
    validateWorks(updated);
    assert.equal(publicWorks(updated).length, publicWorks(original).length + 1);
    assert.deepEqual(groupedWorks(updated)[added.workGroup][0], added);
    updated = updated.map(work => work.id === added.id ? {...work, title:'수정한 작품', description:'설명 수정', image:first.image, projectUrl:'https://example.com/detail', order:999} : work);
    validateWorks(updated);
    const result = groupedWorks(updated)[added.workGroup].at(-1);
    assert.equal(result.title, '수정한 작품'); assert.equal(result.image, first.image); assert.equal(result.projectUrl, 'https://example.com/detail');
    for (const flag of ['published', 'featured']) {
        const hidden = updated.map(work => work.id === added.id ? {...work,[flag]:false} : work);
        assert.ok(!publicWorks(hidden).some(work => work.id === added.id));
    }
    assert.deepEqual(publicWorks(updated.filter(work => work.id !== added.id)), publicWorks(original));
});
test('duplicate IDs, malformed fields, broken images and unsafe URLs are rejected', () => {
    assert.throws(() => validateWorks([...original,original[0]]), /duplicate ID/);
    assert.throws(() => validateWorks([{...original[0],order:'1'}]), /order/);
    assert.throws(() => validateWorks([{...original[0],image:'images/does-not-exist.png'}]), /not found/);
    assert.throws(() => localPath('javascript:alert(1)'), /Unsupported URL/);
    assert.throws(() => localPath('../outside.png'), /leaves repository/);
    assert.throws(() => localPath('/images/broken-base.png'), /relative/);
    assert.ok(localPath('/My-Portfolio/images/fold.png').endsWith('/images/fold.png'));
});
