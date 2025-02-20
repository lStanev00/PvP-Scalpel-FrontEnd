import fs from 'fs';
export function loadBody(body) {

    let template = fs.readFileSync(`./pages/temp/template.html`, `utf8`);

    let a = fs.readFileSync(`./pages/temp/${body}.html`, `utf8`);

    a = template.replace(`%%%container%%%`, a);

    return a;
}