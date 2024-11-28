<script setup>
import { DataService } from '@/service/nerfcloud/DataService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    DataService.getScenes().then((data) => (scenes.value = data));
});

const toast = useToast();
const fileupload = ref();


// SCENES
const dt_scenes = ref();
const scenes = ref();
const editSceneDialog = ref(false);
const submitSceneDialog = ref(false);
const deleteSceneDialog = ref(false);
const downloadSceneDialog = ref(false);
const scene = ref({});
const scene_filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const scene_submitted = ref(false);
const scene_statuses = ref([
    { label: 'READY', value: 'READY' },
    { label: 'PROCESSING', value: 'PROCESSING' },
    { label: 'RAW', value: 'RAW' }
]);



function upload() {
    fileupload.value.upload();
}

function onUpload() {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

function openSubmitScene() {
    scene.value = {};
    scene_submitted.value = false;
    submitSceneDialog.value = true;
}


function hideDialog() {
    submitSceneDialog.value = false;
    editSceneDialog.value = false;
    scene_submitted.value = false;
}


function saveScene() {
    scene_submitted.value = true;

    if (scene?.value.name?.trim()) {
        if (scene.value.id) {
            scenes.value[findIndexBySceneId(scene.value.id)] = scene.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Scene Updated', life: 3000 });
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
            const dd = String(today.getDate()).padStart(2, '0');

            const formattedDate = `${yyyy}-${mm}-${dd}`;
            console.log(formattedDate);
            scene.value.id = createId();
            scene.value.image = 'product-placeholder.svg';
            scene.value.status = scene.value.status ? scene.value.status.value : 'RAW';
            scene.value.date = formattedDate;
            scenes.value.push(scene.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Scene Submitted', life: 3000 });
        }

        submitSceneDialog.value = false;
        editSceneDialog.value = false;
        scene.value = {};
    }
}


function findIndexBySceneId(id) {
    let index = -1;
    for (let i = 0; i < scenes.value.length; i++) {
        if (scenes.value[i].id === id) {
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


function getSceneStatusLabel(status) {
    switch (status) {
        case 'READY':
            return 'success';

        case 'PROCESSING':
            return 'warn';

        case 'RAW':
            return 'danger';

        default:
            return null;
    }
}


function editScene(data) {
    scene.value = { ...data };
    editSceneDialog.value = true;
}


function confirmDownloadSceneVideo(data) {
    scene.value = data;
    downloadSceneDialog.value = true;
}

function downloadSceneVideo(url) {
    console.log("DOWNLOAD:" + url);
    scene.value = {};
}

function confirmDeleteScene(data) {
    scene.value = data;
    deleteSceneDialog.value = true;
    console.log("DELETING:" + data)
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #center>
                    <Button label="Submit new data" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openSubmitScene" />
                </template>

            </Toolbar>

            <DataTable
                ref="dt_scenes"
                :value="scenes"
                dataKey="id"
                :paginator="true"
                :rows="5"
                :filters="scene_filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} scenes"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Available Data</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="scene_filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 12rem"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 128px" />
                    </template>
                </Column>
                <Column field="date" header="Date" sortable style="min-width: 10rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getSceneStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 10rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-info" outlined rounded class="mr-2 non-clickable" v-tooltip="'Description:\n' + slotProps.data.description" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editScene(slotProps.data)" />
                        <Button icon="pi pi-download" outlined rounded class="mr-2" @click="confirmDownloadSceneVideo(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteScene(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="submitSceneDialog" :style="{ width: '450px' }" header="Submit a new scene" :modal="true">
            <div class="flex flex-col gap-6">         
                <div class="card flex flex-col gap-6 items-center justify-center">
                    <Toast />
                    <FileUpload ref="fileupload" mode="basic" name="demo[]" accept="video/*" :maxFileSize="1000000" @uploader="onUpload" customUpload />
                    <Button label="Upload" @click="upload" severity="secondary" />
                </div>
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="scene.name" required="true" autofocus :invalid="scene_submitted && !scene.name" fluid />
                    <small v-if="scene_submitted && !scene.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="scene.description" required="true" rows="3" cols="20" fluid />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveScene" />
            </template>
        </Dialog>

        <Dialog v-model:visible="editSceneDialog" :style="{ width: '450px' }" header="Scene Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="scene.image" :src="`https://primefaces.org/cdn/primevue/images/product/${scene.image}`" :alt="scene.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="scene.name" required="true" autofocus :invalid="scene_submitted && !scene.name" fluid />
                    <small v-if="scene_submitted && !scene.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="scene.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="date" class="block font-bold mb-3">Date</label>
                    <InputText id="date" v-model.trim="scene.date" required="true" autofocus :invalid="scene_submitted && !scene.date" fluid disabled=""/>
                    <small v-if="scene_submitted && !scene.name" class="text-red-500">Date is required.</small>
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Status</label>
                    <Select id="status" v-model="scene.status" :options="scene_statuses" optionLabel="label" optionValue="value" fluid disabled></Select>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveScene" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteSceneDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="scene"
                    >Are you sure you want to delete <b>{{ scene.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteSceneDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteSceneDialog = false" />
            </template>
        </Dialog>

        <Dialog v-model:visible="downloadSceneDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-cloud-download !text-3xl" />
                <span v-if="scene"
                    >Are you sure you want to download the <b>{{ scene.name }}</b
                    > video?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="downloadSceneDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="downloadSceneDialog = false" />
            </template>
        </Dialog>
    </div>


</template>
