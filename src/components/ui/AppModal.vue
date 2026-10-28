
<script setup>
import { computed, watch, onUnmounted, nextTick, ref } from 'vue'

// ==========================================
// MODUL 5 - REUSABLE APP MODAL
// ==========================================

// ==========================================
// PROPS
// ==========================================

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },

  title: {
    type: String,
    default: 'Confirmation'
  },

  message: {
    type: String,
    default: ''
  },

  confirmText: {
    type: String,
    default: 'Confirm'
  },

  cancelText: {
    type: String,
    default: 'Cancel'
  },

  variant: {
    type: String,
    default: 'danger',
    validator: value =>
      ['danger', 'primary', 'success'].includes(value)
  },

  showFooter: {
    type: Boolean,
    default: true
  },

  closeOnBackdrop: {
    type: Boolean,
    default: true
  },

  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

// ==========================================
// EVENTS
// ==========================================

const emit = defineEmits([
  'confirm',
  'close'
])

// ==========================================
// REFERENCES
// ==========================================

const modalRef = ref(null)

// ==========================================
// COMPUTED
// ==========================================

const confirmButtonClass = computed(() => {
  return `btn-confirm btn-${props.variant}`
})

// ==========================================
// MODAL HANDLERS
// ==========================================

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}


const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    if (props.closeOnEscape) {
      event.preventDefault()
      handleClose()
    }
  }
}


// ==========================================
// LIFECYCLE & ACCESSIBILITY
// ==========================================


watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)

      await nextTick()
      modalRef.value?.focus()
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})


onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">

    <Transition name="modal-transition">

      <!-- ===================================
           MODAL OVERLAY
      ==================================== -->

      <div
        v-if="isOpen"
        class="app-modal-overlay"
        @click.self="handleBackdropClick"
      >

        <!-- =================================
             MODAL CONTAINER
        ================================== -->

        <div
          ref="modalRef"
          class="app-modal-card"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >

          <!-- ===============================
               MODAL HEADER
          ================================ -->

          <div class="modal-header">

            <div class="modal-heading">
              <span class="modal-heading-icon">
                {{
                  variant === 'success'
                    ? '✅'
                    : variant === 'danger'
                      ? '⚠️'
                      : 'ℹ️'
                }}
              </span>

              <h2 class="modal-title">
                {{ title }}
              </h2>
            </div>

            <button
              type="button"
              class="modal-close-btn"
              aria-label="Close modal"
              @click="handleClose"
            >
              ✕
            </button>

          </div>

          <!-- ===============================
               MODAL BODY
          ================================ -->

          <div class="modal-body">

            <!-- CUSTOM CONTENT SLOT -->
            <slot>

              <!-- DEFAULT MESSAGE -->
              <p
                v-if="message"
                class="modal-message"
              >
                {{ message }}
              </p>

            </slot>

          </div>

          <!-- ===============================
               MODAL FOOTER
          ================================ -->

          <div
            v-if="showFooter"
            class="modal-footer"
          >

            <!-- CUSTOM FOOTER SLOT -->
            <slot
              name="footer"
              :confirm="handleConfirm"
              :close="handleClose"
            >

              <!-- DEFAULT FOOTER -->

              <button
                type="button"
                class="btn-cancel"
                @click="handleClose"
              >
                {{ cancelText }}
              </button>

              <button
                type="button"
                :class="confirmButtonClass"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>

            </slot>

          </div>

        </div>

      </div>

    </Transition>

  </Teleport>
</template>

<style scoped>

/* ==========================================
   APP MODAL OVERLAY
========================================== */

.app-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(15, 23, 42, 0.55);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  font-family: Inter, Arial, sans-serif;
}

/* ==========================================
   MODAL CARD
========================================== */

.app-modal-card {
  width: 100%;
  max-width: 490px;

  max-height: calc(100vh - 40px);
  overflow-y: auto;

  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.2);

  outline: none;
}

/* ==========================================
   MODAL HEADER
========================================== */

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 15px;

  padding: 24px 26px 19px;

  border-bottom: 1px solid #eeeeF3;
}

.modal-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.modal-heading-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  flex-shrink: 0;

  background: #f5f3ff;
  border-radius: 11px;

  font-size: 20px;
}

.modal-title {
  color: #1c1948;

  font-size: 19px;
  font-weight: 800;
  line-height: 1.4;

  margin: 0;
}

/* ==========================================
   CLOSE BUTTON
========================================== */

.modal-close-btn {
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  border-radius: 7px;

  color: #9292a0;
  font-size: 17px;

  cursor: pointer;
  transition: 0.2s ease;
}

.modal-close-btn:hover {
  background: #f4f4f5;
  color: #1c1948;
}

/* ==========================================
   MODAL BODY
========================================== */

.modal-body {
  padding: 24px 26px;
}

.modal-message {
  margin: 0;

  color: #777789;
  font-size: 13px;
  line-height: 1.8;

  overflow-wrap: anywhere;
}

/* ==========================================
   MODAL FOOTER
========================================== */

.modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 12px;
  flex-wrap: wrap;

  padding: 19px 26px 24px;

  border-top: 1px solid #eeeeF3;
  background: #fafaff;
}

/* ==========================================
   BUTTONS
========================================== */

.btn-cancel,
.btn-confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 11px 18px;

  border-radius: 8px;

  font-family: inherit;
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
  transition: 0.2s ease;
}

/* CANCEL BUTTON */

.btn-cancel {
  background: #ffffff;

  border: 1px solid #e4e4e7;

  color: #555566;
}

.btn-cancel:hover {
  background: #f4f4f5;
}

/* CONFIRM BUTTON BASE */

.btn-confirm {
  color: #ffffff;

  border: 1px solid transparent;
}

/* DANGER VARIANT */

.btn-danger {
  background: #e11d48;
  border-color: #e11d48;
}

.btn-danger:hover {
  background: #be123c;
}

/* PRIMARY VARIANT */

.btn-primary {
  background: #6644ff;
  border-color: #6644ff;
}

.btn-primary:hover {
  background: #5533ee;
}

/* SUCCESS VARIANT */

.btn-success {
  background: #16a34a;
  border-color: #16a34a;
}

.btn-success:hover {
  background: #15803d;
}

/* ==========================================
   MODAL TRANSITIONS
========================================== */

.modal-transition-enter-active,
.modal-transition-leave-active {
  transition: opacity 0.25s ease;
}

.modal-transition-enter-active .app-modal-card,
.modal-transition-leave-active .app-modal-card {
  transition: transform 0.25s ease;
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

.modal-transition-enter-from .app-modal-card,
.modal-transition-leave-to .app-modal-card {
  transform: translateY(15px) scale(0.97);
}

/* ==========================================
   RESPONSIVE
========================================== */

@media (max-width: 550px) {

  .app-modal-overlay {
    padding: 15px;
  }

  .modal-header {
    padding: 20px 18px;
  }

  .modal-body {
    padding: 20px 18px;
  }

  .modal-footer {
    flex-direction: column;
    padding: 18px;
  }

  .modal-footer button {
    width: 100%;
  }

  .modal-title {
    font-size: 17px;
  }

}
</style>