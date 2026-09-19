<script setup>
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { useLeadForm } from '@/composables/useLeadForm'

const props = defineProps({
  source: { type: String, required: true }, // 'contact' | 'estimate'
  submitLabel: { type: String, default: 'Send' },
})

const { form, v$, submitting, onSubmit } = useLeadForm(props.source)

const serviceOptions = ['Roofing Repair', 'Roofing Install', 'Roofing Replacement', 'Not sure / other']
</script>

<template>
  <div class="form-card">
    <form @submit.prevent="onSubmit">
      <div class="form-row">
        <div class="field">
          <label for="first-name">First Name</label>
          <InputText id="first-name" v-model="form.firstName" @blur="v$.firstName.$touch" />
          <p v-if="v$.firstName.$error" class="field-error">First name is required.</p>
        </div>
        <div class="field">
          <label for="last-name">Last Name</label>
          <InputText id="last-name" v-model="form.lastName" />
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model="form.email" type="email" @blur="v$.email.$touch" />
          <p v-if="v$.email.$error" class="field-error">Enter a valid email address.</p>
        </div>
        <div class="field">
          <label for="phone">Phone</label>
          <InputText id="phone" v-model="form.phone" type="tel" @blur="v$.phone.$touch" />
          <p v-if="v$.phone.$error" class="field-error">Enter a valid phone number.</p>
        </div>
      </div>

      <div class="field">
        <label for="service">Which service?</label>
        <Dropdown
          id="service"
          v-model="form.service"
          :options="serviceOptions"
          placeholder="Select a service"
        />
      </div>

      <div class="field">
        <label for="message">Message</label>
        <Textarea id="message" v-model="form.message" rows="5" auto-resize />
      </div>

      <Button
        type="submit"
        :label="submitting ? 'Sending…' : submitLabel"
        :loading="submitting"
        class="btn btn--lg"
        style="width: 100%"
      />
    </form>
  </div>
</template>
