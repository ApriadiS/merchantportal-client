<script lang="ts">
  export let label: string;
  export let customClass: string = '';
  export let icon: Element | null = null;
  export let type: string = 'text';
  export let value: string = '';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let onInput: ((event: Event) => void) | undefined;
  export let id: string = 'input-' + Math.random().toString(36).slice(2, 10);
</script>

<div>
  <label for={id} class="block text-sm font-medium text-gray-700 mb-2">{label}</label>
  <div class="relative">
    {#if icon}
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <slot name="icon">{icon}</slot>
      </div>
    {/if}
    <input
      id={id}
      type={type}
      bind:value
      placeholder={placeholder}
      disabled={disabled}
      maxlength={type === 'text' && label === 'OTP' ? 6 : undefined}
      class={`w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition duration-200 {icon ? 'pl-10' : ''} ${customClass}`}
      on:input={onInput}
    />
  </div>
</div>