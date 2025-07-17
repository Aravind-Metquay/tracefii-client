<script lang="ts">
  export let progress: number = 40;
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let label: string = '';
  export let showLabel: boolean = true;
  export let shape: 'circle' | 'semicircle' = 'circle';

  const radius = 45;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let sizeClass = '';
  if (size === 'xs') sizeClass = 'w-12 h-12';
  else if (size === 'sm') sizeClass = 'w-20 h-20';
  else if (size === 'md') sizeClass = 'w-28 h-28';
  else sizeClass = 'w-36 h-36';
</script>

<div class="flex flex-col items-center justify-center gap-1">
  <svg
    class={`transform rotate-[-90deg] ${sizeClass}`}
    viewBox="0 0 100 100"
  >
    <circle
      cx="50"
      cy="50"
      r={normalizedRadius}
      fill="transparent"
      stroke="#f1f1f1"
      stroke-width={stroke}
    />
    <circle
      cx="50"
      cy="50"
      r={normalizedRadius}
      fill="transparent"
      stroke="url(#gradient)"
      stroke-width={stroke}
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
      stroke-linecap="round"
    />
    <defs>
      <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a78bfa" />
        <stop offset="100%" stop-color="#7c3aed" />
      </linearGradient>
    </defs>
  </svg>
  {#if showLabel}
    <div class="absolute text-center text-sm">
      {#if label}
        <div class="text-xs text-gray-400">{label}</div>
      {/if}
      <div class="text-base font-semibold text-gray-800">{progress}%</div>
    </div>
  {/if}
</div>

<style>
  div.absolute {
    transform: translateY(-50%);
  }
</style>
