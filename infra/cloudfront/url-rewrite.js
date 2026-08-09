function serializeQueryString(querystring) {
    var pairs = [];

    if (!querystring) {
        return '';
    }

    for (var key in querystring) {
        if (!Object.prototype.hasOwnProperty.call(querystring, key)) {
            continue;
        }

        var entry = querystring[key];
        var entries = entry && entry.multiValue ? entry.multiValue : [entry];

        for (var index = 0; index < entries.length; index += 1) {
            var value = entries[index] && entries[index].value;
            if (typeof value === 'undefined') {
                value = '';
            }
            pairs.push(key + '=' + value);
        }
    }

    return pairs.length ? '?' + pairs.join('&') : '';
}

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host && request.headers.host.value;

    if (host && host.toLowerCase() === 'aws-cert-roadmap-lab.com') {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: {
                    value: 'https://www.aws-cert-roadmap-lab.com' + uri + serializeQueryString(request.querystring)
                }
            }
        };
    }

    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
    } else if (uri.lastIndexOf('.') <= uri.lastIndexOf('/')) {
        request.uri = uri + '.html';
    }

    return request;
}
