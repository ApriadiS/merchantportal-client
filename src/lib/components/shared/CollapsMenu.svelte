<script lang="ts">
  export let title: string;
  export let data: any[];
  export let type: 'store' | 'promo';
  // Collaps default terbuka jika ada data
  let open = data.length > 0;
  function toggle() { open = !open; }
</script>


<div class="mb-6 border rounded-lg overflow-hidden shadow-sm">
  <button class="w-full text-left px-4 py-2 bg-gray-100 font-semibold flex justify-between items-center hover:bg-gray-200 transition" on:click={toggle}>
    <span>{title} <span class="text-xs text-gray-500">({data.length})</span></span>
    <span class="ml-2">{open ? '▲' : '▼'}</span>
  </button>
  {#if open}
    <div class="p-2 bg-white animate-fadein">
      {#if data.length === 0}
        <div class="text-xs text-gray-400">Tidak ada data</div>
      {:else}
        <div class="overflow-auto max-h-48">
          <table class="min-w-full text-xs border">
            <thead>
              <tr>
                {#if type === 'store'}
                  <th class="border px-2 py-1 bg-gray-100">Nama Toko</th>
                  <th class="border px-2 py-1 bg-gray-100">Route</th>
                  <th class="border px-2 py-1 bg-gray-100">Company</th>
                  <th class="border px-2 py-1 bg-gray-100">Address</th>
                {:else}
                  <th class="border px-2 py-1 bg-gray-100">Judul Promo</th>
                  <th class="border px-2 py-1 bg-gray-100">Tenor</th>
                  <th class="border px-2 py-1 bg-gray-100">Voucher</th>
                  <th class="border px-2 py-1 bg-gray-100">Tanggal Selesai</th>
                {/if}
              </tr>
            </thead>
            <tbody>
              {#each data as row}
                <tr>
                  {#if type === 'store'}
                    <td class="border px-2 py-1">{row['Nama Toko']}</td>
                    <td class="border px-2 py-1">{row['Route']}</td>
                    <td class="border px-2 py-1">{row['Company']}</td>
                    <td class="border px-2 py-1">{row['Address']}</td>
                  {:else}
                    <td class="border px-2 py-1">{row['Judul Promo']}</td>
                    <td class="border px-2 py-1">{row['Tenor']}</td>
                    <td class="border px-2 py-1">{row['Voucher']}</td>
                    <td class="border px-2 py-1">{row['Tanggal Selesai']}</td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  @keyframes fadein {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadein {
    animation: fadein 0.3s ease;
  }
</style>
