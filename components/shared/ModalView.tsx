import CloseButton from "./CloseButton";

interface ModalButton {
   label: string;
   onclick?: () => void | null;
   bgColor?: string;
   textColor?: string;
   bgColorHover?: string;
   textColorHover?: string;
}

interface ModalViewProps {
   title: string;
   buttons?: ModalButton[];
   onClose: () => void;
   data?: React.ReactNode;
}

export default function ModalView({
   title,
   buttons,
   data,
   onClose,
}: ModalViewProps) {
   const renderData = () => {
      if (!data) return null;
      if (Array.isArray(data)) {
         return (
            <div className="mt-4 w-full">
               {data.map((item, index) => (
                  <div key={index} className="mb-2">
                     {item}
                  </div>
               ))}
            </div>
         );
      }
      return <div className="mt-4 w-full">{data}</div>;
   };

   return (
      <div className="relative flex flex-col bg-white rounded-lg p-6 shadow-lg max-h-4/5 overflow-y-auto md:w-3/5 w-11/12 lg:w-2/5">
         <div className="flex items-center justify-between mb-4 w-full gap-5">
            <h2 className="text-xl font-semibold">{title}</h2>
            <CloseButton onClose={onClose} />
         </div>

         {renderData()}

         {buttons && buttons.length > 0 && (
            <div className="flex gap-2 mt-4 w-full justify-end">
               {buttons.map(
                  ({
                     label,
                     onclick = null,
                     bgColor = "bg-blue-500",
                     textColor = "text-white",
                     bgColorHover = "bg-blue-600",
                     textColorHover = "text-white",
                  }) => {
                     const btnClass = `px-4 py-2 rounded-md ${bgColor} ${textColor} ${
                        bgColorHover ? `hover:${bgColorHover}` : ""
                     } ${textColorHover ? `hover:${textColorHover}` : ""}`;
                     return (
                        <button
                           key={label}
                           className={btnClass}
                           onClick={onclick ?? undefined}
                        >
                           {label}
                        </button>
                     );
                  }
               )}
            </div>
         )}
      </div>
   );
}
