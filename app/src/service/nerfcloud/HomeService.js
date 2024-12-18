export const HomeService = {
    getGPUStatus() {
        return {
            "gpu_status": "available"  // "available" o "in_use"
        };
    },
    getStatus() {
        return Promise.resolve(this.getGPUStatus());
    },
};
