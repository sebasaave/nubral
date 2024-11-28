export const ObjectsService = {
    getAvailableObjects() {
        return [
            {
                id:'1001',
                data: 'Object 1',
                method:'Nerfacto',
                export: 'TSDF',
                date: '2024-11-25',
                size: '25,7 MB',
                status: 'EXPORTED'
            },
            {
                id:'1002',
                data: 'Object 2',
                method:'Instant-NGP',
                export: 'Poisson',
                date: '2024-11-25',
                size: '26,3 MB',
                status: 'ERROR'
            },
            {
                id:'1003',
                data: 'Object 3',
                method:'Nerfacto',
                export: 'Pointcloud',
                date: '2024-11-25',
                size: '31,0 MB',
                status: 'EXPORTING'
            },
            {
                id:'1004',
                data: 'Object 1',
                method:'Nerfacto',
                export: 'TSDF',
                date: '2024-11-25',
                size: '30,5 MB',
                status: 'IN QUEUE'
            },
        ];
    },
    getObjects() {
        return Promise.resolve(this.getAvailableObjects());
    },
};
