const electron = require('electron');
const path = require('path');
const fs = require('fs');


class FileStore {
    constructor(filename) {
        this.path = path.join(
            (electron.app || electron.remote.app).getPath('userData'),
            filename
        );
    }

    getData() {
        try {
            return fs.readFileSync(this.path, 'utf8');
        } catch (error) {
            return '';
        }
    }

    setData(data) {
        fs.writeFileSync(this.path, data);
    }
}

module.exports = FileStore;
