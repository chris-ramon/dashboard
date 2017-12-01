const fs = require('fs');

const files = ['./package.json', './bower.json'];

for (var i=0; i<files.length; i++) {
    const f = files[i];
    fs.readFile(f, {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        const packageJSON = JSON.parse(data);
        packageJSON.version = process.env.BUILD_VERSION;
        packageJSONstring = JSON.stringify(packageJSON, null, 2);
        fs.writeFile(f, packageJSONstring, (err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    });

}
