/**
 * Criado por Adriel Mendes 28/10/2017
 */

const thenfunc = require('q');
const btdb = require('btdb-search');
const idope = require('idope-search');
const torrentz = require('torrentz2');


exports.search = function (searchStr) {
    const defr = thenfunc.defer();
    var result = [];

    function findname(name) {
        return result.filter(
                function (data) {
                    return data.name == name;
                }
        );
    }
    btdb.search(searchStr).then(function (data) {
        var count = data.length;
        $.each(data, function (i, item) {
            var found = findname(item.name);
            if (found.length === 0) {
                result.push(item);
            }
            if (i === data.length - 1) {
                torrentz.searchTorrentz2(searchStr).then(function (data) {
                    var count = data.length;
                    $.each(data, function (i, item) {
                        var found = findname(item.name);
                        if (found.length === 0 && i < 12) {
                            result.push(item);
                        }
                        if (i === data.length - 1) {
                            idope.search(searchStr).then(function (data) {
                                var count = data.length;
                                $.each(data, function (i, item) {
                                    var found = findname(item.name);
                                    if (found.length === 0) {
                                        result.push(item);
                                    }
                                    if (i === data.length - 1)
                                        defr.resolve(result);
                                });
                            });
                        }
                    });
                });
            }
        });
    });
    return defr.promise;
};

