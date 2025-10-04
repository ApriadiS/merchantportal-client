export type CloseButtonProps = {
   onClose: () => void;
   size?: "sm" | "md" | "lg";
};

export default function CloseButton({
   onClose,
   size = "md",
}: CloseButtonProps) {
   return (
      <button
         className={`flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white ${
            size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
         }`}
         onClick={onClose}
         aria-label="Close"
         type="button"
      >
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
               d="M4 4L12 12M12 4L4 12"
               stroke="white"
               strokeWidth="2"
               strokeLinecap="round"
            />
         </svg>
      </button>
   );
}
