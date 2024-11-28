export const ModelsService = {
    getAvailableModels() {
        return [
            {
                id:'1001',
                data: 'Object 1',
                method:'Nerfacto',
                start_date: '2024-11-25',
                end_date: '2024-11-26',
                status: 'TRAINED'
            },
            {
                id:'1002',
                data: 'Object 2',
                method:'Instant-NGP',
                start_date: '2024-11-25',
                end_date: '2024-11-26',
                status: 'ERROR'
            },
            {
                id:'1003',
                data: 'Object 3',
                method:'Nerfacto',
                start_date: '2024-11-25',
                end_date: '-',
                status: 'TRAINING'
            },
        ];
    },
    getModels() {
        return Promise.resolve(this.getAvailableModels());
    },
};
