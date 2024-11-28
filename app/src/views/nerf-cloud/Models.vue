<script setup>
import { ModelsService } from '@/service/nerfcloud/ModelsService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

onMounted(() => {
    ModelsService.getModels().then((data) => (models.value = data));
});

const toast = useToast();

// MODELS
const dt_models = ref();
const models = ref();
const editModelDialog = ref(false);
const trainNewModelDialog = ref(false);
const deleteModelDialog = ref(false);
const model = ref({});
const model_filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const model_submitted = ref(false);
const model_statuses = ref([
    { label: 'TRAINED', value: 'TRAINED' },
    { label: 'TRAINING', value: 'TRAINING' },
    { label: 'ERROR', value: 'ERROR' }
]);
const method_options = ref([
    { label: 'Nerfacto', value: 'nerfacto' },
    { label: 'Instant-NGP', value: 'instant-ngp' },
    { label: 'Gaussian Splatting', value: 'gaussian-splatting' }
]);



function openSubmitModel() {
    model.value = {};
    model_submitted.value = false;
    trainNewModelDialog.value = true;
}


function hideDialog() {
    trainNewModelDialog.value = false;
    editModelDialog.value = false;
    model_submitted.value = false;
}


function trainModel() {
    model_submitted.value = true;

    if (model?.value.name?.trim()) {
        if (model.value.id) {
            models.value[findIndexByModelId(model.value.id)] = model.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Model Updated', life: 3000 });
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
            const dd = String(today.getDate()).padStart(2, '0');

            const formattedDate = `${yyyy}-${mm}-${dd}`;
            console.log(formattedDate);
            model.value.id = createId();
            model.value.image = 'product-placeholder.svg';
            model.value.status = model.value.status ? model.value.status.value : 'TRAINING';
            model.value.date = formattedDate;
            models.value.push(model.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Model Submitted', life: 3000 });
        }

        trainNewModelDialog.value = false;
        editModelDialog.value = false;
        model.value = {};
    }
    trainNewModelDialog.value = false;
}


function findIndexByModelId(id) {
    let index = -1;
    for (let i = 0; i < models.value.length; i++) {
        if (models.value[i].id === id) {
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


function getModelStatusLabel(status) {
    switch (status) {
        case 'TRAINED':
            return 'success';

        case 'TRAINING':
            return 'warn';

        case 'ERROR':
            return 'danger';

        default:
            return null;
    }
}


function confirmDeleteModel(data) {
    model.value = data;
    deleteModelDialog.value = true;
    console.log("DELETING:" + data)
}

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #center>
                    <Button label="Train new model" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openSubmitModel" />
                </template>

            </Toolbar>

            <DataTable
                ref="dt_models"
                :value="models"
                dataKey="id"
                :paginator="true"
                :rows="5"
                :filters="model_filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} models"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Created models</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="model_filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column field="id" header="ID" sortable style="min-width: 6rem"></Column>
                <Column field="data" header="Train data" sortable style="min-width: 10rem"></Column>
                <Column field="method" header="NeRF Method" sortable style="min-width: 10rem"></Column>
                <Column field="start_date" header="Start Date" sortable style="min-width: 10rem"></Column>
                <Column field="end_date" header="End Date" sortable style="min-width: 10rem"></Column>
                <Column field="status" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" :severity="getModelStatusLabel(slotProps.data.status)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 10rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-info" outlined rounded class="mr-2" v-tooltip="'Free button'" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteModel(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="trainNewModelDialog" :style="{ width: '450px' }" header="Train a new model" :modal="true">
            <div class="flex flex-col gap-6">         
                <div>
                    <label for="data" class="block font-bold mb-3">Train data</label>
                    <Select id="data" v-model="model.data" :options="method_options" optionLabel="label" optionValue="value" fluid></Select>
                </div>
                <div>
                    <label for="method" class="block font-bold mb-3">NeRF Method</label>
                    <Select id="method" v-model="model.method_options" :options="method_options" optionLabel="label" optionValue="value" fluid></Select>
                </div>
                <div>
                    <label for="number" class="block font-bold mb-3">Nº iterations</label>
                    <InputNumber id="number" required="false" fluid />
                </div>
                
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Train" icon="pi pi-check" @click="trainModel" />
            </template>
        </Dialog>



        <Dialog v-model:visible="deleteModelDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="model"
                    >Are you sure you want to delete <b>{{ model.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteModelDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteModelDialog = false" />
            </template>
        </Dialog>


    </div>


</template>
