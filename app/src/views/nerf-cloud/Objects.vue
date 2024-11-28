<script setup>
import { ObjectsService } from '@/service/nerfcloud/ObjectsService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    ObjectsService.getObjects().then((data) => (objects.value = data));
});

const toast = useToast();

// SCENES
const dt_objects = ref();
const objects = ref();
const exportObjectDialog = ref(false);
const deleteObjectDialog = ref(false);
const downloadObjectDialog = ref(false);
const object = ref({});
const object_filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const object_submitted = ref(false);
const object_statuses = ref([
    { label: 'EXPORTED', value: 'EXPORTED' },
    { label: 'EXPORTING', value: 'EXPORTING' },
    { label: 'IN QUEUE', value: 'IN QUEUE' },
    { label: 'ERROR', value: 'ERROR' }
]);
const method_options = ref([
    { label: 'TSDF', value: 'tsdf' },
    { label: 'Poisson', value: 'poisson' },
    { label: 'Pointcloud', value: 'pointcloud' }
]);


function openExportObject() {
    object.value = {};
    object_submitted.value = false;
    exportObjectDialog.value = true;
}


function hideDialog() {
    exportObjectDialog.value = false;
    object_submitted.value = false;
}


function exportObject() {
    object_submitted.value = true;
    exportObjectDialog.value = false;
    if (object?.value.name?.trim()) {
        if (object.value.id) {
            objects.value[findIndexByObjectId(object.value.id)] = object.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Scene Updated', life: 3000 });
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
            const dd = String(today.getDate()).padStart(2, '0');

            const formattedDate = `${yyyy}-${mm}-${dd}`;
            console.log(formattedDate);
            object.value.id = createId();
            object.value.image = 'product-placeholder.svg';
            object.value.status = object.value.status ? object.value.status.value : 'RAW';
            object.value.date = formattedDate;
            objects.value.push(object.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Scene Submitted', life: 3000 });
        }

        exportObjectDialog.value = false;
        object.value = {};
    }
}


function findIndexByObjectId(id) {
    let index = -1;
    for (let i = 0; i < objects.value.length; i++) {
        if (objects.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
}

function createId() {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}


function getObjectStatusLabel(status) {
    switch (status) {
        case 'EXPORTED':
            return 'success';

        case 'EXPORTING':
            return 'warn';

        case 'IN QUEUE':
            return 'info';

        case 'ERROR':
            return 'danger';

        default:
            return null;
    }
}



function confirmDownloadObject(data) {
    object.value = data;
    downloadObjectDialog.value = true;
}

function downloadObject(url) {
    console.log("DOWNLOAD:" + url);
    object.value = {};
}

function confirmDeleteObject(data) {
    object.value = data;
    deleteObjectDialog.value = true;
    console.log("DELETING:" + data)
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #center>
                    <Button label="Export new object" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openExportObject" />
                </template>

            </Toolbar>

            <DataTable
                ref="dt_objects"
                :value="objects"
                dataKey="id"
                :paginator="true"
                :rows="5"
                :filters="object_filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} scenes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Exported Objects</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="object_filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
                <Column field="data" header="Train data" sortable style="min-width: 12rem"></Column>
                <Column field="method" header="NeRF Method" sortable style="min-width: 10rem"></Column>
                <Column field="export" header="Export Method" sortable style="min-width: 10rem"></Column>
                <Column field="date" header="Date" sortable style="min-width: 10rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getObjectStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 10rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-download" outlined rounded class="mr-2" @click="confirmDownloadObject(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteObject(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="exportObjectDialog" :style="{ width: '450px' }" header="Export a new object" :modal="true">
            <div class="flex flex-col gap-6">         
                <div>
                    <label for="data" class="block font-bold mb-3">Select model</label>
                    <Select id="data" v-model="object.data" :options="method_options" optionLabel="label" optionValue="value" fluid></Select>
                </div>
                <div>
                    <label for="method" class="block font-bold mb-3">Export Method</label>
                    <Select id="method" v-model="object.method_options" :options="method_options" optionLabel="label" optionValue="value" fluid></Select>
                </div>
                <div>
                    <label for="number" class="block font-bold mb-3">Nº of points</label>
                    <InputNumber id="number" required="false" fluid />
                </div>
                
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Export" icon="pi pi-check" @click="exportObject" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteObjectDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="object"
                    >Are you sure you want to delete object with ID <b>{{ object.id }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteObjectDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteObjectDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="downloadObjectDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-cloud-download !text-3xl" />
                <span v-if="object"
                    >Are you sure you want to download the object file with size <b>{{ object.size }}</b
                    > ?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="downloadObjectDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="downloadObjectDialog = false" />
            </template>
        </Dialog>
    </div>


</template>
