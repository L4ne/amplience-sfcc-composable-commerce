# Security Updates

In order to load content from Amplience, your application needs to allow the domains to load both content and media from Amplience.

In Composable Commerce Front end, this is in:

`app/ssr.js`

## What is needed?

Because Composable storefront will be loading both content and media from Amplience directly, we need to allow the application to load from these domains. This is content (JSON) and media (images / videos). Both of which can be published or unpublished and loaded from different domains

|Type|Published|Unpublished|
|:----|:----|:----|
|Content (JSON)|`*.cdn.content.amplience.net`|`*.staging.bigcontent.io`|
|Media (images & video)|`cdn.media.amplience.net`|`*.staging.bigcontent.io`|

Because Amplience visualisations are loaded via iFrame, we also need to tell you application to allow from the Amplience back office.

|Type|Value|
|:----|:----|
|iFrame (frame ancestors)|`*.amplience.net`|

In this demo we also have a sample integration with [Stylitics](https://stylitics.com). In order for this to work we also need to add configurations for stylitics domains:

|Type|Value|
|:----|:----|
|img-src|`*.stylitics.com`|
|script-src|`*.stylitics.com`|
|connect-src|`*.stylitics.com`|
|default-src|`*.stylitics.com`|




## What should my security policy look like?

If you have already changed your security policy, please be careful and add to rather than simply replacing.


```json
contentSecurityPolicy: {
    useDefaults: true,
    directives: {
        'img-src': [
            "'self'",
            '*.commercecloud.salesforce.com',
            'data:',
            '*.cdn.content.amplience.net',
            'cdn.media.amplience.net',
            '*.staging.bigcontent.io',
            'i8.amplience.net',
            '*.stylitics.com'
        ],
        'script-src': [
            "'self'",
            "'unsafe-eval'",
            'storage.googleapis.com',
            '*.cdn.content.amplience.net',
            'cdn.media.amplience.net',
            '*.staging.bigcontent.io',
            '*.stylitics.com',
            "'unsafe-inline'"
        ],
        'connect-src': [
            "'self'",
            "'unsafe-eval'",
            'api.cquotient.com',
            '*.cdn.content.amplience.net',
            'cdn.media.amplience.net',
            'cdn.static.amplience.net',
            '*.staging.bigcontent.io',
            '*.stylitics.com'
        ],
        'default-src': [
            "'self'",
            "'unsafe-eval'",
            '*.cdn.content.amplience.net',
            'cdn.media.amplience.net',
            'cdn.static.amplience.net',
            '*.staging.bigcontent.io',
            '*.stylitics.com',
            'data:'
        ],
        'frame-ancestors': ["'self'", '*.amplience.net'],
        // Do not upgrade insecure requests for local development
        'upgrade-insecure-requests': isRemote() ? [] : null
    }
}
```