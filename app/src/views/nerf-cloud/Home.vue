<script setup>
import { HomeService } from '@/service/nerfcloud/HomeService';
import { PhotoService } from '@/service/PhotoService';
import { ProductService } from '@/service/ProductService';
import { onMounted, ref } from 'vue';

onMounted(() => {
    HomeService.getStatus().then((data) => (gpu_status.value = data["gpu_status"]));
});

const gpu_status = ref();
const products = ref([]);
const images = ref([]);
const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);


onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
    PhotoService.getImages().then((data) => (images.value = data));
});


</script>

<template>
    <div class="card">
        
        <div class="flex flex-col md:flex-row gap-4">
            <div class="md:w-1/3">
                <RouterLink to="/data">
                    <Button label="Upload new data now!" icon="pi pi-upload" raised />
                </RouterLink>
            </div>
            <div class="md:w-1/3 text-right">
                <div class="font-semibold text-xl mb-4">GPU Status:</div>
            </div>
            <div class="md:w-1/3">
                <!-- Condicional basado en el estado de la GPU -->
                <Message v-if="gpu_status === 'available'" severity="success">Available</Message>
                <Message v-else-if="gpu_status === 'in_use'" severity="info">In use</Message>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Galleria</div>
        <Galleria :value="images" :responsiveOptions="galleriaResponsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
            </template>
        </Galleria>
    </div>
</template>
