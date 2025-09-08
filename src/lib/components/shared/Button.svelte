<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let customClass: string = '';
  export let ariaLabel: string | undefined;
  export let onClick: ((event: MouseEvent) => void) | undefined;

  const baseClasses = 'w-full font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out';
  const variantClasses: Record<string, string> = {
    primary: 'bg-[#ff4745] text-white hover:bg-red-600 focus:ring-[#ff4745]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };
</script>

<button
  type={type}
  disabled={disabled}
  aria-label={ariaLabel}
  class={`${baseClasses} ${variantClasses[variant]} ${customClass}`}
  on:click={onClick}
>
  <slot />
</button>