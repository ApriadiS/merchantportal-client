
<script lang="ts">
import { log } from '../lib/logger';
log('ForgotPasswordPage loaded');
import { supabase } from '../lib/admin/supabaseClient';

let email = '';
let message: string | null = null;
let errorMsg: string | null = null;
let isLoading = false;
let step: 'email' | 'otp' | 'password' = 'email';
let otp = '';
let newPassword = '';
let confirmPassword = '';
let userId: string | null = null;

async function handleEmailSubmit(e: Event) {
  e.preventDefault();
  isLoading = true;
  message = null;
  errorMsg = null;
  log('Lupa password: submit email (OTP)', { email });
  // Kirim OTP ke email via Supabase Auth
  const { error } = await supabase.auth.signInWithOtp({ email });
  isLoading = false;
  if (error) {
    log('Lupa password: gagal kirim OTP', { email, error });
    message = 'Jika akun dengan email tersebut ada, kode OTP akan dikirimkan.';
    return;
  }
  log('Lupa password: OTP dikirim (jika email ada)', { email });
  message = 'Jika akun dengan email tersebut ada, kode OTP telah dikirimkan.';
  step = 'otp';
}

function handleOtpChange(e: Event) {
  otp = (e.target as HTMLInputElement).value;
  errorMsg = null;
  log('Lupa password: input OTP', { otp });
  // Verifikasi OTP jika sudah 6 digit
  if (otp.length === 6) {
    verifyOtpManual();
  }
}

// Fungsi manual untuk verifikasi OTP dari tombol
function verifyOtpManual() {
  if (otp.length === 6) {
    isLoading = true;
    supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    }).then(async ({ error }) => {
      isLoading = false;
      if (error) {
        log('Lupa password: OTP tidak valid', { otp, error });
        errorMsg = 'Kode OTP tidak valid atau sudah kadaluarsa.';
        return;
      }
      // Setelah OTP valid, cek roles di profiles
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('roles')
          .eq('email', email)
          .maybeSingle();
        if (!profileError && data && Array.isArray(data.roles)) {
          const rolesValid = data.roles.includes('mdo') && data.roles.includes('admin');
          if (!rolesValid) {
            log('Lupa password: roles tidak valid setelah OTP', { email, roles: data.roles });
            window.location.href = '/admin';
            return;
          }
        } else {
          log('Lupa password: akun tidak ditemukan setelah OTP', { email });
          window.location.href = '/admin';
          return;
        }
      } catch (err) {
        log('Lupa password: error query profiles setelah OTP', { email, err });
        window.location.href = '/admin';
        return;
      }
      log('Lupa password: OTP valid & roles valid, lanjut ke input password baru', { otp });
      step = 'password';
      message = null;
    });
  }
}

function handlePasswordChange(e: Event) {
  newPassword = (e.target as HTMLInputElement).value;
}
function handleConfirmPasswordChange(e: Event) {
  confirmPassword = (e.target as HTMLInputElement).value;
}

async function handlePasswordSubmit(e: Event) {
  e.preventDefault();
  errorMsg = null;
  log('Lupa password: submit password baru', { newPassword, confirmPassword });
  if (newPassword !== confirmPassword) {
    log('Lupa password: password tidak sama', { newPassword, confirmPassword });
    errorMsg = 'Password baru dan konfirmasi password tidak sama.';
    return;
  }
  isLoading = true;
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    log('Lupa password: gagal update password', { error });
    if (error.code === 'same_password' || error.message?.toLowerCase().includes('new password should be different')) {
      errorMsg = 'Password baru tidak boleh sama dengan password lama.';
    } else {
      errorMsg = 'Gagal mengubah password. Silakan coba lagi.';
    }
    isLoading = false;
    return;
  }
  log('Lupa password: password berhasil diubah');
  message = 'Password berhasil diubah. Silakan login dengan password baru.';
  step = 'email';
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
}
</script>


<main class="min-h-screen flex items-center justify-center bg-gray-50">
  <form class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm space-y-6" autocomplete="off" on:submit={step === 'email' ? handleEmailSubmit : step === 'password' ? handlePasswordSubmit : undefined}>
    <h1 class="text-2xl font-bold text-[#ff4745] mb-2 text-center">Lupa Password Admin</h1>
    {#if step === 'email'}
      <p class="text-gray-600 text-sm text-center mb-4">Masukkan email admin Anda untuk reset password.</p>
      <input
        type="email"
        bind:value={email}
        placeholder="Email admin"
        required
        class="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition mb-2"
      />
      <button type="submit" class="w-full py-3 rounded-md bg-[#ff4745] text-white font-bold hover:bg-red-600 transition" disabled={isLoading}>
        {#if isLoading}
          <svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Mengirim...
        {:else}
          Dapatkan OTP Reset Password
        {/if}
      </button>
    {/if}

  {#if step === 'otp'}
    <div class="space-y-2">
      <p class="text-gray-600 text-sm text-center mb-4">Masukkan 6 digit OTP yang dikirim ke email Anda.</p>
      <input
        type="text"
        bind:value={otp}
        maxlength="6"
        pattern="[0-9]*"
        inputmode="numeric"
        placeholder="Masukkan OTP"
        class="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition mb-2 tracking-widest text-center text-lg font-mono"
        on:input={handleOtpChange}
      />
      <button type="button" class="w-full py-3 rounded-md bg-[#ff4745] text-white font-bold hover:bg-red-600 transition" disabled={isLoading || otp.length !== 6} on:click={verifyOtpManual}>
        {#if isLoading}
          <svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Memverifikasi...
        {:else}
          Verifikasi OTP
        {/if}
      </button>
    </div>
  {/if}

    {#if step === 'password'}
      <p class="text-gray-600 text-sm text-center mb-4">Masukkan password baru Anda.</p>
      <input
        type="password"
        bind:value={newPassword}
        placeholder="New Password"
        class="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition mb-2"
        on:input={handlePasswordChange}
      />
      <input
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm New Password"
        class="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition mb-2"
        on:input={handleConfirmPasswordChange}
      />
      <button type="submit" class="w-full py-3 rounded-md bg-[#ff4745] text-white font-bold hover:bg-red-600 transition" disabled={isLoading}>
        {#if isLoading}
          <svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          Menyimpan...
        {:else}
          Simpan
        {/if}
      </button>
    {/if}

    {#if errorMsg}
      <div class="text-red-600 text-sm font-semibold text-center mt-2">{errorMsg}</div>
    {/if}
    {#if message}
      <div class="text-green-600 text-sm font-semibold text-center mt-2">{message}</div>
    {/if}
    <div class="mt-4 text-center">
      <a href="/admin" class="text-sm text-[#ff4745] hover:underline font-semibold">Kembali ke login</a>
    </div>
  </form>
</main>
