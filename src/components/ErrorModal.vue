<template>
    <CModal alignment="center" :visible="visibility" @close="() => { sendCloseModal() }">
        <CModalBody>
            <h4 style="color:red;">ERROR</h4>
            {{ message }}
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" variant="outline" @click="sendCloseModal" class="my-button">Cerrar</CButton>
        </CModalFooter>
    </CModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { CModal, CModalBody, CModalFooter, CButton } from '@coreui/vue'

export default defineComponent({
    name: 'ErrorModalComponent',
    components: {
        CModal,
        CModalBody,
        CModalFooter,
        CButton
    },
    props: {
        message: String,
        visibility: Boolean
    },
    methods: {
        sendCloseModal() {
            this.$emit('closeModal');
        }
    }
})
</script>

<style scoped>
</style>
