# 🐛 Bug Hunter Checklist

> **Purpose**: Track bugs yang ditemukan dan status fix-nya  
> **Format**: Checklist dengan timestamp

---

## 🔴 Critical Bugs

### [x] Bug 1: Race Condition on Fast Clicks → Issue #9

**Found**: 2025-01-19 23:45
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/9  
**Severity**: Critical  
**Impact**: Duplicate API calls, potential data corruption
**Status**: ✅ FIXED

**Location**:

-  `components/Promo/PromoViewModal.tsx` - Delete button
-  `components/Store/StoreViewModal.tsx` - Delete button
-  All modal action buttons

**Issue**:

```typescript
// Current: No protection
<Button onClick={handleDelete}>Delete</Button>
```

**Fix**:

```typescript
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
   if (isDeleting) return;
   setIsDeleting(true);
   try {
      await deletePromo(id);
   } finally {
      setIsDeleting(false);
   }
};

<Button disabled={isDeleting} onClick={handleDelete}>
   {isDeleting ? "Deleting..." : "Delete"}
</Button>;
```

**Files to Update**:

-  [ ] `components/Promo/PromoViewModal.tsx`
-  [ ] `components/Store/StoreViewModal.tsx`
-  [ ] `components/Promo/PromoFormModal.tsx`
-  [ ] `components/Store/StoreFormModal.tsx`
-  [ ] `components/Promo/StoreLinkingModal.tsx`
-  [ ] `components/Store/PromoLinkingModal.tsx`

---

### [x] Bug 2: JWT Expiration Not Handled Gracefully → Issue #10

**Found**: 2025-01-19 23:50
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/10  
**Severity**: Critical  
**Impact**: User logout tanpa notifikasi
**Status**: ✅ FIXED

**Location**:

-  `services/api/client.ts` - Line ~30

**Issue**:

```typescript
// Current: Silent redirect
if (response.status === 401) {
   await supabase.auth.signOut();
   window.location.href = "/admin";
}
```

**Fix**:

```typescript
if (response.status === 401) {
   toast({
      type: "error",
      message: "Session expired. Please login again.",
   });
   await supabase.auth.signOut();
   window.location.href = "/admin";
}
```

**Files to Update**:

-  [ ] `services/api/client.ts`

---

### [x] Bug 3: Multiple Fetches for Same Data → Issue #11

**Found**: 2025-01-19 23:55
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/11  
**Severity**: Critical  
**Impact**: Wasted bandwidth, slower page load
**Status**: ✅ FIXED

**Location**:

-  All pages with multiple components fetching same data

**Issue**:
Multiple components call same API independently

**Fix Options**:

1. Implement React Query (recommended)
2. Lift state to parent component
3. Use global state (Zustand)

**Files to Update**:

-  [ ] Install React Query: `npm install @tanstack/react-query`
-  [ ] Setup QueryClient in `app/layout.tsx`
-  [ ] Migrate hooks to use useQuery
-  [ ] Remove manual fetch logic

---

## 🟡 Medium Priority Bugs

### [x] Bug 4: Stale Data After Mutation → Issue #12

**Found**: 2025-01-20 00:00
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/12  
**Severity**: Medium  
**Impact**: UI shows outdated data
**Status**: ✅ FIXED (v2.2.6 - commit 4a90aea)

**Location**:

-  All CRUD operations

**Issue**:
List doesn't auto-update after create/update/delete

**Fix Applied**:
Replaced window.location.reload() with optimistic updates using addPromo/updatePromo/addStore/updateStore

**Files Updated**:

-  [x] `app/admin-dashboard/promo/PromoClient.tsx`
-  [x] `app/admin-dashboard/store/StoreClient.tsx`

---

### [x] Bug 5: No Loading State Coordination → Issue #13

**Found**: 2025-01-20 00:05
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/13  
**Severity**: Medium  
**Impact**: Confusing UI with overlapping loaders
**Status**: ✅ FIXED (v2.2.6 - commit 4a90aea)

**Location**:

-  All pages with multiple loading states

**Fix Applied**:
Implicitly fixed by removing full page reloads. Local state updates are instant, no overlapping loaders.

**Files Updated**:

-  [x] `app/admin-dashboard/promo/PromoClient.tsx`
-  [x] `app/admin-dashboard/store/StoreClient.tsx`

---

### [x] Bug 6: Tenor Selection Modal Auto-Close Issue → Issue #14

**Found**: 2025-01-20 00:10
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/14  
**Severity**: Medium  
**Impact**: Extra click needed for single tenor
**Status**: ✅ FIXED (v2.2.6 - commit 4a90aea)

**Location**:

-  `components/Store/TenorSelectionModal.tsx`

**Issue**:
Modal auto-selects single tenor but doesn't auto-close

**Fix Applied**:
Added useEffect to auto-select and auto-close when only 1 tenor available with 300ms delay.

**Files Updated**:

-  [x] `components/Store/TenorSelectionModal.tsx`

---

## 🟢 Low Priority Issues

### [ ] Bug 7: Deprecated Database Service → Issue #15

**Found**: 2025-01-20 00:15
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/15  
**Severity**: Low  
**Impact**: Code clutter

**Location**:

-  `services/database/` folder

**Fix**:
Delete folder

**Files to Delete**:

-  [ ] `services/database/promos.ts`
-  [ ] `services/database/stores.ts`
-  [ ] `services/database/promo_store.ts`
-  [ ] Entire `services/database/` folder

---

### [ ] Bug 8: Inconsistent Error Messages → Issue #16

**Found**: 2025-01-20 00:20
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/16  
**Severity**: Low  
**Impact**: Poor UX

**Location**:

-  All error handling

**Fix**:
Create error message mapping

**Files to Update**:

-  [ ] Create `utils/errorMessages.ts`
-  [ ] Standardize all error messages
-  [ ] Update all catch blocks

---

### [ ] Bug 9: No Empty State for Some Lists → Issue #17

**Found**: 2025-01-20 00:25
**GitHub**: https://github.com/ApriadiS/merchantportal-client/issues/17  
**Severity**: Low  
**Impact**: Blank screen when no data

**Location**:

-  Some list components

**Fix**:
Add EmptyState component

**Files to Update**:

-  [ ] Audit all list components
-  [ ] Add EmptyState where missing

---

## 📊 Progress Summary

**Total Bugs**: 9  
**Fixed**: 6 ✅  
**In Progress**: 0 🔄  
**Remaining**: 3 ⏳

**By Severity**:

-  Critical: 3/3 ✅ (100%)
-  Medium: 3/3 ✅ (100%)
-  Low: 0/3 ☐ (0%)

---

**Last Updated**: 2025-01-19  
**Next Review**: 2025-01-26
