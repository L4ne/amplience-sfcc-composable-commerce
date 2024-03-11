module.exports = {
    default: {
        hub: 'sfccdemo06'
    },
    envs: [
        /*
        {
            name: 'Environment 1',
            hub: 'environment01',
            vse: '{{Your VSE URL for Environment 1}}'
        },
         {
            name: 'Environment 1',
            hub: 'environment01',
            vse: '{{Your VSE URL for Environment 2}}'
        }
        */
    ],
    visualisations: [
        {
            name: 'Localhost',
            default: false,
            url: 'http://localhost:3000'
        },
        {
            name: 'Production',
            default: true,
            url: 'https://amplience-06-production.mobify-storefront.com'
        }
        /*,
        {
            name: 'UAT',
            default: false,
            url: 'https://ascc-uat.mobify-storefront.com'
        }
        */
    ]
}
