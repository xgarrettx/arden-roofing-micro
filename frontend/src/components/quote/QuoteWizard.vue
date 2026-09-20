<script setup>
import { ref } from 'vue'
import { useQuoteForm } from '@/composables/useQuoteForm'
import { useAddressAutocomplete } from '@/composables/useAddressAutocomplete'
import {
  QUOTE_STEPS,
  PROJECT_TYPE_OPTIONS,
  ROOF_MATERIAL_OPTIONS,
  TIME_FRAME_OPTIONS,
  HOME_OWNER_OPTIONS,
  QUOTE_LEGAL_LINKS,
} from '@/global/consts/quote.consts'

const {
  form,
  currentStep,
  isFirstStep,
  progressPercent,
  stepError,
  submitting,
  contactFormRef,
  goNext,
  goBack,
  selectAndAdvance,
  onSubmit,
} = useQuoteForm()

const addressInput = ref(null)
useAddressAutocomplete(addressInput, ({ address, city, state, zip }) => {
  form.address = address || form.address
  form.city = city || form.city
  form.state = state || form.state
  if (zip) form.zipCode = zip
})

const BUTTON_STEP_CONFIG = {
  [QUOTE_STEPS.PROJECT_TYPE]: {
    title: 'What Type Of Project Is This?',
    field: 'projectType',
    options: PROJECT_TYPE_OPTIONS,
  },
  [QUOTE_STEPS.ROOF_MATERIAL]: {
    title: 'What Type Of Roof Do You Need or Want?',
    field: 'roofMaterial',
    options: ROOF_MATERIAL_OPTIONS,
  },
  [QUOTE_STEPS.TIME_FRAME]: {
    title: 'How Soon Are You Looking To Start This Project?',
    field: 'timeFrame',
    options: TIME_FRAME_OPTIONS,
  },
  [QUOTE_STEPS.HOME_OWNER]: {
    title: 'Do You Own The Home?',
    field: 'homeOwner',
    options: HOME_OWNER_OPTIONS,
  },
}
</script>

<template>
  <div class="quote-wizard">
    <!-- TrustedForm's noscript fallback pixel. The loader script itself is
         injected programmatically (see useTrustedForm.js) once the contact
         step's <form> is in the DOM, since this SPA doesn't have a single
         static </body> to drop the snippet next to. -->
    <noscript>
      <img
        src="https://api.trustedform.com/ns.gif"
        alt=""
        style="display: none; width: 1px; height: 1px; border: 0"
      />
    </noscript>

    <!-- Step 1: ZIP — plain, no banner/ring, matches the "entry point" design -->
    <div v-if="currentStep === QUOTE_STEPS.ZIP" class="quote-wizard__intro">
      <div class="quote-wizard__card quote-wizard__card--wide">
        <h1 class="quote-wizard__h1">Where would this project take place?</h1>
        <p class="quote-wizard__subtext">Enter your zip code &amp; we will help you compare free quotes!</p>

        <form class="quote-wizard__zip-form" @submit.prevent="goNext">
          <input
            v-model="form.zipCode"
            class="quote-wizard__input quote-wizard__input--zip"
            type="text"
            inputmode="numeric"
            maxlength="5"
            placeholder="Enter Your ZIP Code"
            aria-label="ZIP code"
          />
          <button type="submit" class="quote-wizard__btn quote-wizard__btn--primary">Next &rsaquo;</button>
        </form>
        <p v-if="stepError" class="quote-wizard__error">{{ stepError }}</p>

        <p class="quote-wizard__security">
          <span class="quote-wizard__lock" aria-hidden="true">&#128274;</span>
          Your information is 100% secure &amp; confidential.
        </p>

        <div class="quote-wizard__how-it-works">
          <h2 class="quote-wizard__how-title">How This Works</h2>
          <div class="quote-wizard__how-grid">
            <div class="quote-wizard__how-card">
              <div class="quote-wizard__how-icon" aria-hidden="true">&#127968;</div>
              <p>Share some details about your home project.</p>
            </div>
            <div class="quote-wizard__how-card">
              <div class="quote-wizard__how-icon" aria-hidden="true">&#128101;</div>
              <p>Within moments, get matched with a trusted local roofing pro.</p>
            </div>
            <div class="quote-wizard__how-card">
              <div class="quote-wizard__how-icon" aria-hidden="true">&#128203;</div>
              <p>Compare quotes and choose the best fit for the job.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps 2+: banner + progress ring layout -->
    <div v-else class="quote-wizard__banner-layout">
      <div class="quote-wizard__banner">
        <button type="button" class="quote-wizard__back" @click="goBack">&lsaquo; Back</button>
        <h1 class="quote-wizard__banner-h1">Let's Find The Right Roofing Solution For Your Home</h1>
        <div class="quote-wizard__ring" :style="{ '--progress': progressPercent }">
          <span class="quote-wizard__ring-value">{{ progressPercent }}%</span>
          <span class="quote-wizard__ring-label">COMPLETED</span>
        </div>
      </div>

      <div class="quote-wizard__card">
        <!-- Button-select steps: project type, roof material, time frame, home owner -->
        <template v-if="BUTTON_STEP_CONFIG[currentStep]">
          <h2 class="quote-wizard__question">{{ BUTTON_STEP_CONFIG[currentStep].title }}</h2>
          <div class="quote-wizard__options">
            <button
              v-for="option in BUTTON_STEP_CONFIG[currentStep].options"
              :key="option.lpValue"
              type="button"
              class="quote-wizard__option"
              :class="{ 'quote-wizard__option--selected': form[BUTTON_STEP_CONFIG[currentStep].field] === option.lpValue }"
              @click="selectAndAdvance(BUTTON_STEP_CONFIG[currentStep].field, option.lpValue)"
            >
              {{ option.label }}
              <span class="quote-wizard__option-check" aria-hidden="true">&#10003;</span>
            </button>
          </div>
        </template>

        <!-- Address step -->
        <template v-else-if="currentStep === QUOTE_STEPS.ADDRESS">
          <h2 class="quote-wizard__question">What Is Your Home Address?</h2>
          <form class="quote-wizard__form" @submit.prevent="goNext">
            <input
              ref="addressInput"
              v-model="form.address"
              class="quote-wizard__input"
              type="text"
              autocomplete="off"
              placeholder="Start typing your street address&hellip;"
              aria-label="Street address"
            />
            <div class="quote-wizard__row">
              <input v-model="form.city" class="quote-wizard__input" type="text" placeholder="City" aria-label="City" />
              <input v-model="form.state" class="quote-wizard__input" type="text" placeholder="State" aria-label="State" />
            </div>
            <button type="submit" class="quote-wizard__btn quote-wizard__btn--primary">Next &rsaquo;</button>
          </form>
        </template>

        <!-- Contact info step -->
        <template v-else-if="currentStep === QUOTE_STEPS.CONTACT">
          <h2 class="quote-wizard__question">Enter your info so we can personalize your results.</h2>
          <form ref="contactFormRef" class="quote-wizard__form" @submit.prevent="onSubmit">
            <input v-model="form.firstName" class="quote-wizard__input" type="text" placeholder="First Name" autocomplete="given-name" />
            <input v-model="form.lastName" class="quote-wizard__input" type="text" placeholder="Last Name" autocomplete="family-name" />
            <input v-model="form.email" class="quote-wizard__input" type="email" placeholder="Email Address" autocomplete="email" />
            <input v-model="form.phone" class="quote-wizard__input" type="tel" placeholder="(828) 569-1234" autocomplete="tel" />

            <!-- Honeypot — visually hidden, real users never see/fill it -->
            <input v-model="form.website" class="quote-wizard__honeypot" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" />

            <button type="submit" class="quote-wizard__btn quote-wizard__btn--primary" :disabled="submitting">
              {{ submitting ? 'Submitting&hellip;' : 'Get Estimates' }}
            </button>

            <p class="quote-wizard__tcpa">
              By clicking &ldquo;Get Estimates,&rdquo; I provide my electronic signature and consent to receive
              marketing and informational communications from Arden Roofing and
              <a :href="QUOTE_LEGAL_LINKS.referralDisclosure" target="_blank" rel="noopener noreferrer">Home Improvement Partners identified here</a>
              at the telephone number and email address I provided, including calls and text messages made using
              automated technology, an automatic telephone dialing system, prerecorded or artificial voice,
              including AI-generated or synthetic voice, and messages generated or assisted by artificial
              intelligence, even if my number is listed on a federal, state, or corporate Do Not Call list. I
              understand that my consent is not a condition of purchasing any goods or services. Message and data
              rates may apply, and message frequency may vary. I may opt out of text messages at any time by
              replying STOP or request help by replying HELP. By clicking &ldquo;Get Estimates,&rdquo; I also
              acknowledge that I have read and agree to the
              <a :href="QUOTE_LEGAL_LINKS.privacyPolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              and
              <a :href="QUOTE_LEGAL_LINKS.termsOfUse" target="_blank" rel="noopener noreferrer">Terms of Use</a>,
              including any applicable arbitration provisions.
            </p>
          </form>
        </template>

        <p v-if="stepError" class="quote-wizard__error">{{ stepError }}</p>

        <p class="quote-wizard__security">
          <span class="quote-wizard__lock" aria-hidden="true">&#128274;</span>
          Your information is 100% secure &amp; confidential.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-wizard {
  --qw-primary: #1c5ea3;
  --qw-primary-dark: #123c6b;
  --qw-accent: #2f9e44;
  --qw-accent-dark: #237a34;
  --qw-text: #1a1a1a;
  --qw-muted: #5b6472;
  --qw-border: #d8dee5;
  --qw-bg-card: #ffffff;
  max-width: 720px;
  margin: 0 auto;
  padding: 40px 16px 64px;
}

.quote-wizard__card {
  background: var(--qw-bg-card);
  border-radius: 14px;
  padding: 32px 28px;
  box-shadow: 0 4px 24px rgba(20, 30, 50, 0.08);
}

.quote-wizard__card--wide {
  text-align: center;
}

.quote-wizard__h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--qw-text);
  margin: 0 0 8px;
}

.quote-wizard__subtext {
  color: var(--qw-muted);
  margin: 0 0 24px;
  font-size: 1.05rem;
}

.quote-wizard__zip-form,
.quote-wizard__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 auto;
  max-width: 480px;
}

.quote-wizard__row {
  display: flex;
  gap: 14px;
}

.quote-wizard__row .quote-wizard__input {
  flex: 1;
}

.quote-wizard__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--qw-border);
  border-radius: 10px;
  padding: 16px 18px;
  font-size: 1rem;
  color: var(--qw-text);
}

.quote-wizard__input:focus {
  outline: none;
  border-color: var(--qw-primary);
  box-shadow: 0 0 0 3px rgba(28, 94, 163, 0.15);
}

.quote-wizard__input--zip {
  text-align: center;
  letter-spacing: 0.04em;
}

.quote-wizard__btn {
  border: none;
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
}

.quote-wizard__btn--primary {
  background: var(--qw-accent);
  color: #fff;
}

.quote-wizard__btn--primary:hover {
  background: var(--qw-accent-dark);
}

.quote-wizard__btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.quote-wizard__error {
  color: #b42318;
  font-size: 0.9rem;
  margin: 10px 0 0;
  text-align: center;
}

.quote-wizard__security {
  margin: 18px 0 0;
  color: var(--qw-muted);
  font-size: 0.9rem;
  text-align: center;
}

.quote-wizard__lock {
  margin-right: 4px;
}

.quote-wizard__how-it-works {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--qw-border);
}

.quote-wizard__how-title {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 20px;
}

.quote-wizard__how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
}

.quote-wizard__how-card {
  border: 1px solid var(--qw-border);
  border-radius: 12px;
  padding: 18px 14px;
  font-size: 0.92rem;
  color: var(--qw-text);
}

.quote-wizard__how-icon {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.quote-wizard__banner-layout {
  position: relative;
}

.quote-wizard__banner {
  position: relative;
  background: linear-gradient(135deg, var(--qw-primary), var(--qw-primary-dark));
  color: #fff;
  border-radius: 14px 14px 0 0;
  padding: 40px 24px 60px;
  text-align: center;
}

.quote-wizard__back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 0.9rem;
  cursor: pointer;
}

.quote-wizard__banner-h1 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 8px 0 24px;
}

.quote-wizard__ring {
  --size: 110px;
  width: var(--size);
  height: var(--size);
  margin: 0 auto;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.25);
}

.quote-wizard__ring::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(var(--qw-accent) calc(var(--progress) * 1%), rgba(255, 255, 255, 0.3) 0);
  z-index: -1;
}

.quote-wizard__ring-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--qw-primary);
}

.quote-wizard__ring-label {
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--qw-muted);
}

.quote-wizard__banner-layout .quote-wizard__card {
  margin-top: -30px;
  border-radius: 14px;
}

.quote-wizard__question {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--qw-text);
  margin: 0 0 20px;
  text-align: center;
}

.quote-wizard__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
  margin: 0 auto;
}

.quote-wizard__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--qw-border);
  border-radius: 10px;
  padding: 16px 18px;
  background: #fff;
  font-size: 1rem;
  color: var(--qw-text);
  cursor: pointer;
  text-align: left;
}

.quote-wizard__option:hover {
  border-color: var(--qw-primary);
}

.quote-wizard__option--selected {
  border-color: var(--qw-accent);
  background: rgba(47, 158, 68, 0.06);
}

.quote-wizard__option-check {
  color: var(--qw-border);
}

.quote-wizard__option--selected .quote-wizard__option-check {
  color: var(--qw-accent);
}

.quote-wizard__honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.quote-wizard__tcpa {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--qw-muted);
  margin-top: 8px;
}

.quote-wizard__tcpa a {
  color: var(--qw-primary);
  font-weight: 600;
}

@media (max-width: 640px) {
  .quote-wizard__how-grid {
    grid-template-columns: 1fr;
  }
  .quote-wizard__row {
    flex-direction: column;
  }
}
</style>
