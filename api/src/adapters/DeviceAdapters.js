const HueLampAdapter = require('./HueLampAdapter');
const CameraAdapter = require('./CameraAdapter');

class DeviceAdapters {
    static getAdapter(href) {
        if (href.includes('lights')) {
            return new HueLampAdapter();
        } else if (href.includes('ISAPI')) {
            return new CameraAdapter();
        }
        return null;
    }
}

module.exports = DeviceAdapters;
