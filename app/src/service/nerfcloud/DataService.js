export const DataService = {
    getAvailableData() {
        return [
            {
                id: '1001',
                name: 'Object 1',
                image: 'bamboo-watch.jpg',
                description: 'Data Description',
                date: '2024-11-21',
                status: 'RAW',
                url: 'www.google.com'
            },
            {
                id: '1002',
                name: 'Object 2',
                image: 'black-watch.jpg',
                description: 'Data Description',
                date: '2024-11-22',
                status: 'READY',
                url: 'www.google.com'
            },
            {
                id: '1003',
                name: 'Object 3',
                image: 'blue-band.jpg',
                description: 'Data Description',
                date: '2024-11-23',
                status: 'PROCESSING',
                url: 'www.google.com'
            },
        ];
    },
    getScenes() {
        return Promise.resolve(this.getAvailableData());
    },
};
