<template>
  <div :class="['minput', { error: errorMessage }]">
    <input
      :type="computedType"
      :id="inputId"
      class="minput__input"
      :placeholder="placeholder"
      v-model="modelValue"
      :disabled="disabled"
      :readonly="readOnly"
      @input="onInput"
    />
    <label class="minput__label" :for="inputId">{{ label }}</label>
    <div v-if="icon" class="minput__icon" @click="togglePasswordVisibility">
      <component :is="icon" />
    </div>
    <p v-if="errorMessage" class="minput__error">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, withDefaults } from 'vue';
import { genRandom } from '@/utils/RandomUtils';

interface Props {
  modelValue: string | number;
  inputId?: string;
  placeholder?: string;
  label: string;
  type?: string;
  icon?: any;
  errorMessage?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inputId: () => genRandom(32),
  placeholder: '',
  type: 'text',
  icon: null,
  errorMessage: '',
  disabled: false,
  readOnly: false,
});

const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);

const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type || 'text';
});

const togglePasswordVisibility = () => {
  if (props.type === 'password') {
    showPassword.value = !showPassword.value;
  }
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
