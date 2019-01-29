'use strict';

const os = require('os');

function ipConfigData() {
    const ifaces = os.networkInterfaces();
    const addresses = [
        { name: localStorage, alias: '', address: 'localhost'},
        { name: 'DNS', alias: '', address: os.hostname() }
    ];
    Object.keys(ifaces).forEach(function (ifname) {
    let alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
            }

            if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
                addresses.push({ name: ifname, alias: alias, address: iface.address });
            } else {
            // this interface has only one ipv4 adress
                addresses.push({ name: ifname, alias: "", address: iface.address });
            }
            ++alias;
        });
    });

    return addresses;
}

module.exports = ipConfigData;