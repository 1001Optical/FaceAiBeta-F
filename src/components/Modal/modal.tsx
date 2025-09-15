"use client"

interface IProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({onClose, children}: IProps) => {

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={() => onClose()}
    >
      <div
        className="w-[738px] h-[868px] relative flex flex-col items-center bg-[rgba(0,0,0,0.3)] border-[2px] border-white/40 shadow-[0_4px_30px_0_rgba(0,0,0,0.4)] backdrop-blur-[12.5px] rounded-[48px] px-4 py-8"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal