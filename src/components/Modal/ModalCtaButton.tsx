interface IProps {
  onClick: () => void;
  label?: string;
}

/**
 * Shared modal CTA button. Extracted from the duplicated "Got it" button that
 * lived inline in IooIModal / IooISelectModal (and the now-removed qrModal).
 */
const ModalCtaButton = ({ onClick, label = 'Got it' }: IProps) => {
  return (
    <button
      onClick={onClick}
      className="w-[658px] h-[88px] py-4 bg-white-200 rounded-full hover:bg-white-400 transition-colors duration-200 mt-auto border border-white-400 shadow-[inset_0_0_1.69px_1.69px_#999999,_inset_0_0_1.69px_1.69px_#FFFFFF26,_inset_-1.69px_-1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_1.69px_1.69px_1.69px_-0.85px_#FFFFFFBF,_inset_-5.07px_-5.07px_0.85px_-5.07px_#FFFFFFCC,_inset_5.07px_5.07px_0.85px_-5.92px_#FFFFFFBF,_0_1.69px_13.52px_0_#0000001F,_0_0_3.38px_0_#0000001A] backdrop-blur-[20px]"
    >
      <p className="label-xl text-white-1000">{label}</p>
    </button>
  );
};

export default ModalCtaButton;
